export interface MenuItem {
  id: string;
  name: string;
  price: string;
  portion?: string;
  description: string;
  image?: string;
  category: 'smoked-meats' | 'bbq-slabs' | 'wings' | 'specialties' | 'sides';
  spicy?: boolean;
  skull?: boolean; // For Devil's Dessert
  popular?: boolean;
  badge?: string;
}

export interface MenuCategory {
  id: 'smoked-meats' | 'bbq-slabs' | 'wings' | 'specialties' | 'sides';
  name: string;
  subtitle: string;
  icon: string;
}

export interface WeeklyChalkboard {
  headline: string;
  season: string;
  badge: string;
  note: string;
  items: {
    name: string;
    tagline: string;
    price: string;
    badge?: string;
    image?: string;
  }[];
}

export const WEEKLY_CHALKBOARD: WeeklyChalkboard = {
  headline: "PITMASTER WEEKLY CHALKBOARD",
  season: "Chicagoland Fall & Game-Day Smoker Specials",
  badge: "Rolling Smoke This Week",
  note: "Small-batch hardwood cuts smoked fresh on Marion's trailer rig. Limited pan quantities available for weekend pickup & heated drop-off.",
  items: [
    {
      name: "Smoked Brisket Burnt Ends",
      tagline: "Double-smoked prime brisket point tossed in caramelized dark pit glaze",
      price: "$32 / lb • Half Pan $110",
      badge: "Fan Favorite",
      image: "/images/menu/smoked-burnt-ends.jpg",
    },
    {
      name: "Cedar-Plank Smoked Salmon",
      tagline: "Slow-smoked over fruitwood with brown sugar & cracked black pepper",
      price: "$28 / portion • Half Pan $140",
      badge: "Chicago Classic",
      image: "/images/menu/smoked-salmon-cedar.jpg",
    },
    {
      name: "Smoked Brisket Chili",
      tagline: "14-hour smoked brisket burnt ends simmered with dark stout, beans & peppers",
      price: "Half Pan $65 • Full Pan $120",
      badge: "Game Day Hit",
      image: "/images/menu/smoked-brisket-chili.jpg",
    },
    {
      name: "Habanero Cheddar Skillet Cornbread",
      tagline: "Fresh cast-iron cornbread with sharp cheddar & mild flame-roasted habanero",
      price: "Half Pan $35 • Full Pan $65",
      badge: "Scratch Baked",
      image: "/images/menu/habanero-cheddar-cornbread.jpg",
    },
  ],
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'smoked-meats',
    name: 'Smoked Meats & Mains',
    subtitle: 'Hardwood smoked low and slow over seasoned hickory & oak',
    icon: '🍖',
  },
  {
    id: 'bbq-slabs',
    name: 'BBQ Slabs & Protein Pans',
    subtitle: 'Full slabs, tender rib tips, and 35-piece crowd pleaser pans',
    icon: '🔥',
  },
  {
    id: 'wings',
    name: 'Game-Day Party Wings',
    subtitle: 'Smoked crisp & tossed in your choice of 6 house signature glazes',
    icon: '🍗',
  },
  {
    id: 'specialties',
    name: 'Pitmaster Specialties',
    subtitle: 'Whole birds, burnt ends, cedar salmon, and chef signatures',
    icon: '★',
  },
  {
    id: 'sides',
    name: 'Scratch Sides & Casseroles',
    subtitle: 'Homestyle smokehouse half & full pans baked fresh daily',
    icon: '🧀',
  },
];

export const PITMASTER_MENU_ITEMS: MenuItem[] = [
  // 1. SMOKED MEATS & MAINS (from Marion's printed summer menu)
  {
    id: 'whole-brisket',
    name: 'Whole Smoked Texas Prime Brisket',
    price: '$279',
    portion: 'Feeds 6–8 guests (approx. 10–12 lbs trimmed)',
    description: '14-hour hickory and oak smoked prime brisket with seasoned salt-and-black-pepper bark, sliced thick with rich pit jus.',
    image: '/images/hero/hero-platter-brisket-feast.jpg',
    category: 'smoked-meats',
    popular: true,
    badge: 'Pitmaster Signature',
  },
  {
    id: 'half-chicken-dinner',
    name: 'Half Smoked Chicken Plate',
    price: '$18',
    portion: 'Includes 2 Scratch Sides',
    description: 'Crispy skin, golden hardwood-smoked half chicken basted with apple cider pit butter and served with two hot sides.',
    category: 'smoked-meats',
  },
  {
    id: 'whole-chicken-dinner',
    name: 'Whole Smoked Chicken Plate',
    price: '$30',
    portion: 'Includes 2 Scratch Sides',
    description: 'Plump whole chicken slow-smoked to juicy perfection, quartered or carved with house mild pit sauce and two sides.',
    category: 'smoked-meats',
  },
  {
    id: 'turkey-chops',
    name: 'Smoked Turkey Chops',
    price: '$100',
    portion: '5 lbs bulk pan (approx. 10–12 chops)',
    description: 'Tender center-cut turkey chops marinated in savory herbs and smoked until succulent and slice-tender.',
    category: 'smoked-meats',
  },
  {
    id: 'turkey-legs-wings',
    name: 'Smoked Turkey Legs & Wings',
    price: '$120',
    portion: '10 lbs bulk pan',
    description: 'Jumbo smoked turkey drums and whole wings seasoned with Marion’s poultry rub and slow-smoked for hours.',
    category: 'smoked-meats',
    popular: true,
  },
  {
    id: 'smoked-oxtails',
    name: 'Smoked Beef Oxtails',
    price: '$100',
    portion: '5 lbs braised pan',
    description: 'Rich beef oxtails kissed with hardwood smoke then slow-simmered in rich aromatics and brown gravy until fall-apart tender.',
    category: 'smoked-meats',
    badge: 'Chef Specialty',
  },
  {
    id: 'beef-short-ribs',
    name: 'Smoked Beef Short Ribs (Dino Bones)',
    price: '$130',
    portion: '4 Massive Center Bones',
    description: 'Colossal prime beef plate short ribs with deep mahogany smoke ring, unctuous marbling, and intense beef flavor.',
    category: 'smoked-meats',
    badge: 'Limited Run',
  },
  {
    id: 'smoked-beef-sausage',
    name: 'Smoked Beef Sausage Links',
    price: '$110',
    portion: '5 lbs sliced or link pan',
    description: 'Coarse ground beef sausage in natural casing, smoked with hickory wood until snappy, smoky, and juicy.',
    category: 'smoked-meats',
  },

  // 2. BBQ SLABS, TIPS & PROTEIN PANS
  {
    id: 'beef-ribs-slab',
    name: 'Beef Ribs (Full Slab)',
    price: '$60',
    portion: 'Full Heavy Slab',
    description: 'Thick-cut meaty beef ribs rubbed with cracked black pepper and smoked low and slow until richly tender.',
    category: 'bbq-slabs',
    popular: true,
  },
  {
    id: 'st-louis-ribs',
    name: 'St. Louis Style Ribs (Full Slab)',
    price: '$32',
    portion: 'Full Trimmed Slab',
    description: 'Square-cut spare ribs with brown sugar dry rub, smoked for 5 hours over hickory, finished with caramelized pit glaze.',
    image: '/images/hero/hero-platter-ribs-wings.jpg',
    category: 'bbq-slabs',
    popular: true,
    badge: 'Top Seller',
  },
  {
    id: 'baby-back-ribs',
    name: 'Baby Back Ribs (Full Slab)',
    price: '$35',
    portion: 'Full Tender Slab',
    description: 'Extra-lean loin back ribs smoked tender with sweet applewood smoke and Marion’s signature rub.',
    category: 'bbq-slabs',
  },
  {
    id: 'spare-ribs',
    name: 'Traditional Spare Ribs (Full Slab)',
    price: '$30',
    portion: 'Full Slab',
    description: 'Classic full-cut pork ribs with rich fat marbling, deep hardwood smoke, and tender chew.',
    category: 'bbq-slabs',
  },
  {
    id: 'rib-tips',
    name: 'Southside Chicago Rib Tips',
    price: 'Half $75 • Full $150',
    portion: 'Half Pan (12–15) • Full Pan (25–30)',
    description: 'Chicago pit tradition: tender bite-sized pork rib tips slow-smoked, chopped to order, and drenched in signature sauce.',
    category: 'bbq-slabs',
    badge: 'Chicago Legend',
    popular: true,
  },
  {
    id: 'protein-party-pans',
    name: '35-Piece Smokehouse Protein Pan',
    price: 'Inquire for Custom Mix',
    portion: '35 Hearty Pieces',
    description: 'Mix & match 35 pieces of smoked chicken, ribs, grilled Polish links, burgers, brats, or fried/smoked catfish fillets.',
    category: 'bbq-slabs',
    badge: 'Tailgate Ready',
  },

  // 3. GAME-DAY PARTY WINGS (6 Flavors requested by Marion)
  {
    id: 'wings-peach-habanero',
    name: 'Peach Habanero Glazed Wings',
    price: 'Half (50) $75 • Full (100) $140',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'Smoked crisp over pecan wood then glazed in sweet Georgia peach nectar spiked with fiery orange habaneros.',
    image: '/images/menu/wings-peach-habanero.jpg',
    category: 'wings',
    popular: true,
    badge: 'Marion’s Favorite',
  },
  {
    id: 'wings-buffalo',
    name: 'Classic Smokehouse Buffalo Wings',
    price: 'Half (50) $70 • Full (100) $130',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'Crisp smoked wings tossed in tangy cayenne pepper sauce and creamy pit butter. Served with buttermilk ranch.',
    category: 'wings',
  },
  {
    id: 'wings-honey-garlic',
    name: 'Honey Garlic Crunch Wings',
    price: 'Half (50) $75 • Full (100) $140',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'Wildflower honey, roasted garlic cloves, and toasted sesame seeds tossed over hot smoked wings.',
    category: 'wings',
  },
  {
    id: 'wings-devils-dessert',
    name: "Devil's Dessert Extreme Heat Wings ☠️",
    price: 'Half (50) $80 • Full (100) $150',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'WARNING: EXTREME HEAT. Smoked wings drenched in ghost pepper, Carolina reaper dust, molasses, and smoked habanero.',
    category: 'wings',
    skull: true,
    spicy: true,
    badge: '☠️ Very Hot',
  },
  {
    id: 'wings-sweet-spicy',
    name: 'Sweet ’n Spicy Pit Glazed Wings',
    price: 'Half (50) $70 • Full (100) $130',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'The crowd-pleasing balance of brown sugar molasses, crushed red pepper flakes, and smoky tomato reduction.',
    category: 'wings',
    popular: true,
  },
  {
    id: 'wings-lemon-parm',
    name: 'Lemon Parmesan Cracked Pepper Wings',
    price: 'Half (50) $75 • Full (100) $140',
    portion: '50 or 100 Jumbo Smoked Wings',
    description: 'Zesty lemon butter glaze finished with freshly shaved aged parmesan cheese and cracked Tellicherry black pepper.',
    category: 'wings',
  },

  // 4. PITMASTER SPECIALTIES (Marion's specific requests)
  {
    id: 'burnt-ends-specialty',
    name: 'Double-Smoked Brisket Burnt Ends',
    price: '$32 / lb • Half Pan $110',
    portion: 'Feeds 10–14 as catering appetizer',
    description: 'Prime brisket point cubed, re-rubbed, and returned to the hickory pit for an extra 3 hours until candied with sweet bark.',
    image: '/images/menu/smoked-burnt-ends.jpg',
    category: 'specialties',
    popular: true,
    badge: 'Crown Jewel',
  },
  {
    id: 'cedar-plank-salmon',
    name: 'Cedar-Plank Smoked Salmon Fillet',
    price: '$28 / portion • Half Pan $140',
    portion: 'Fresh Pacific Fillets',
    description: 'Whole salmon fillets smoked on aromatic western red cedar planks with brown sugar mustard glaze and fresh dill.',
    image: '/images/menu/smoked-salmon-cedar.jpg',
    category: 'specialties',
    popular: true,
    badge: 'Chicago Favorite',
  },
  {
    id: 'whole-smoked-turkey',
    name: 'Whole Hickory Smoked Turkey',
    price: '$135',
    portion: 'Whole 14–16 lb Bird (Feeds 12–15)',
    description: 'Whole turkey brined for 48 hours in aromatics, slow-smoked over seasoned hickory wood until mahogany brown and juicy.',
    category: 'specialties',
    badge: 'Holiday & Event Order',
  },
  {
    id: 'whole-smoked-duck',
    name: 'Whole Fruitwood Smoked Duck',
    price: '$95',
    portion: 'Whole 5–6 lb Duck (Feeds 4–6)',
    description: 'Whole duck slow-rendered over cherry and apple wood, finished with spiced plum and pomegranate pit glaze.',
    category: 'specialties',
    badge: 'Artisan Smoke',
  },
  {
    id: 'smoked-brisket-chili',
    name: 'Slow-Simmered Brisket Burnt-End Chili',
    price: 'Half $65 • Full $120',
    portion: 'Half Pan (12–15) • Full Pan (25–30)',
    description: 'Thick, rich smokehouse chili loaded with 14-hour smoked brisket burnt ends, dark stout, roasted chiles, and kidney beans.',
    image: '/images/menu/smoked-brisket-chili.jpg',
    category: 'specialties',
    popular: true,
  },
  {
    id: 'habanero-cornbread',
    name: 'Habanero Cheddar Skillet Cornbread',
    price: 'Half $35 • Full $65',
    portion: 'Half Pan (15 squares) • Full Pan (30 squares)',
    description: 'Sweet golden Southern cornbread baked with sharp Wisconsin cheddar and flame-roasted mild habanero for gentle warmth.',
    image: '/images/menu/habanero-cheddar-cornbread.jpg',
    category: 'specialties',
  },

  // 5. SCRATCH SIDES & CASSEROLES (from Marion's printed menu)
  {
    id: 'mac-cheese',
    name: 'Pitmaster Baked Mac & Cheese',
    price: 'Half $75 • Full $135',
    portion: 'Half Pan (12–15) • Full Pan (25–30)',
    description: 'Elbow macaroni folded in a velvety four-cheese custard with sharp cheddar, smoked gouda, and toasted panko topping.',
    category: 'sides',
    popular: true,
    badge: 'Crowd Favorite',
  },
  {
    id: 'baked-beans',
    name: 'Smokehouse Baked Beans w/ Burnt Ends',
    price: 'Half $55 • Full $95',
    portion: 'Half Pan (15–20) • Full Pan (30–40)',
    description: 'Slow-simmered navy and pinto beans in dark molasses, brown sugar, and smoked brisket burnt end trimmings.',
    category: 'sides',
    popular: true,
  },
  {
    id: 'potato-salad',
    name: 'Southern Mustard Potato Salad',
    price: 'Half $45 • Full $75',
    portion: 'Half Pan (15–20) • Full Pan (30–40)',
    description: 'Tender red potatoes with hard-boiled eggs, sweet pickle relish, celery crunch, and creamy mustard dressing.',
    category: 'sides',
  },
  {
    id: 'broccoli-casserole',
    name: 'Southern Broccoli Cheese Casserole',
    price: 'Half $75 • Full $125',
    portion: 'Half Pan (12–15) • Full Pan (25–30)',
    description: 'Tender broccoli florets baked in rich creamy cheese sauce topped with buttery crushed Ritz cracker crumble.',
    category: 'sides',
    popular: true,
  },
  {
    id: 'coleslaw',
    name: 'Creamy Smokehouse Coleslaw',
    price: 'Half $40 • Full $65',
    portion: 'Half Pan (20–25) • Full Pan (40–50)',
    description: 'Crisp green and purple cabbage with shredded carrots in a chilled sweet-and-tangy cream dressing.',
    category: 'sides',
  },
  {
    id: 'smokehouse-spaghetti',
    name: 'Pit-Style Smokehouse Spaghetti',
    price: 'Half $55 • Full $95',
    portion: 'Half Pan (12–15) • Full Pan (25–30)',
    description: 'Chicago-style baked spaghetti simmered with savory smoked ground beef, rich tomato sauce, and melted mozzarella.',
    category: 'sides',
  },
];
