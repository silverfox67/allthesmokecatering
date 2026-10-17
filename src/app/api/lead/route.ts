import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message, symptom, honey, formLoadedAt } = body;

    // Zero-JS Spam Protection (Honeypot + 3-second speed gate)
    if (honey) return NextResponse.json({ success: true }, { status: 200 });
    if (formLoadedAt && Date.now() - Number(formLoadedAt) < 3000) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Direct write to Supabase
    const { error: dbError } = await supabase.from('leads').insert([
      {
        name,
        email,
        phone: phone || null,
        problem_summary: symptom || message,
        status: 'new',
      },
    ]);

    if (dbError) throw new Error(dbError.message);

    // Direct Brevo REST API dispatch
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Trident Lead Dispatch',
          email: process.env.BREVO_SENDER_EMAIL || 'notifications@yourdomain.com',
        },
        to: [{ email: process.env.CLIENT_ALERT_EMAIL || 'client@yourdomain.com' }],
        subject: `New Lead: ${name} - ${symptom || 'Service Inquiry'}`,
        htmlContent: `
          <h3>New Lead Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Issue / Scope:</strong> ${symptom || message}</p>
        `,
      }),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
