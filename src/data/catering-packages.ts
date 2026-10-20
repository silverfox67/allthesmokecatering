export interface PerPersonPackage {
  id: string;
  name: string;
  pricePerPerson: number;
  minimumGuests: number;
  tagline: string;
  description: string;
  meatsAllowed: number;
  meatOptions: string[];
  sidesAllowed: number;
  sideOptions: string[];
  includes: string[];
  popular?: boolean;
}

export interface TurnkeyPartyBundle {
  id: string;
  name: string;
  price: number;
  serves: string;
  guestCountMin: number;
  guestCountMax: number;
  items: string[];
  description: string;
  popular?: boolean;
}

export interface MealPrepTier {
  id: string;
  name: string;
  price: number;
  mealCount: number;
  pricePerMeal: number;
  description: string;
  proteinHighlights: string[];
}

export const PER_PERSON_PACKAGES: PerPersonPackage[] = [
  {
    id: 'southside-smoke',
    name: 'The Southside Smoke',
    pricePerPerson: 24.95,
    minimumGuests: 20,
    tagline: 'Casual reunions, office lunches, and cookouts with authentic hardwood smoke.',
    description: 'An accessible, high-volume feast featuring classic Chicago smokehouse proteins slow-smoked over seasoned hickory and fruitwood.',
    meatsAllowed: 2,
    meatOptions: [
      'Smoked Pulled Chicken',
      'Smoked Beef Polish Sausage',
      'Slow-Smoked Rib Tips',
      'Smoked BBQ Chicken Quarters'
    ],
    sidesAllowed: 2,
    sideOptions: [
      'Southern Baked Beans (w/ Smoked Turkey)',
      'Creamy Southern Coleslaw',
      'Traditional Mustard Potato Salad',
      'Cheesy Broccoli Casserole'
    ],
    includes: [
      'Fresh Slider Buns (2 per guest)',
      'House Mild BBQ Sauce',
      'Pickles & Sweet Peppers Tray',
      'Heavy-Duty Disposable Cutlery & Plates'
    ]
  },
  {
    id: 'pitmaster-feast',
    name: 'The Pitmaster Feast',
    pricePerPerson: 34.95,
    minimumGuests: 25,
    tagline: 'Our flagship corporate and private party spread with tender ribs and chops.',
    description: 'The definitive All The Smoke experience: signature pork ribs, turkey chops, and gourmet baked mac and cheese crafted for high-stakes celebrations.',
    meatsAllowed: 2,
    meatOptions: [
      'St. Louis Cut Spare Rib Slabs',
      'Tender Smoked Turkey Chops',
      'Slow-Smoked Whole Chicken (Carved)',
      'Slow-Smoked Rib Tips'
    ],
    sidesAllowed: 3,
    sideOptions: [
      '4-Cheese Baked Mac & Cheese',
      'Southern Baked Beans',
      'Traditional Mustard Potato Salad',
      'Scratch Southern Spaghetti',
      'Cheesy Broccoli Casserole'
    ],
    includes: [
      'Honey Butter Cornbread Squares',
      'Dual Pit Sauces (House Mild & Hot Heat)',
      'Pickled Red Onions & Jalapenos',
      'Full Buffet Serviceware Kit & Tongs'
    ],
    popular: true
  },
  {
    id: 'live-fire-prime',
    name: 'The Live-Fire Prime',
    pricePerPerson: 48.95,
    minimumGuests: 30,
    tagline: 'The ultimate wedding and gala showcase featuring premium beef cuts.',
    description: 'Exclusive, center-of-the-plate Texas prime brisket, huge beef ribs, or tender braised oxtails presented with white-glove presentation.',
    meatsAllowed: 2,
    meatOptions: [
      'Prime Texas-Style Sliced Whole Brisket (14-Hour Smoke)',
      'Smoked Beef Short Ribs (Dino Bones)',
      'Slow-Smoked Savory Oxtails',
      'Smoked Turkey Chops'
    ],
    sidesAllowed: 3,
    sideOptions: [
      '4-Cheese Baked Mac & Cheese',
      'Cheesy Broccoli Casserole',
      'Southern Baked Beans',
      'Scratch Southern Spaghetti',
      'Traditional Potato Salad'
    ],
    includes: [
      'Warm Brioche Dinner Rolls',
      'Signature Bourbon Brown Sugar Glaze',
      'House Sweet & Spicy Pickles',
      'Full Chafer Buffet Setup with Sternos & Serving Spoons'
    ]
  }
];

export const TURNKEY_BUNDLES: TurnkeyPartyBundle[] = [
  {
    id: 'gameday-tailgate',
    name: 'The Gameday Tailgate',
    price: 285.00,
    serves: '12 – 15 Guests',
    guestCountMin: 12,
    guestCountMax: 15,
    description: 'Game day perfection: tender rib tips, crispy smoked wings, and scratch sides ready to drop onto your tailgate table.',
    items: [
      '1 Full Pan Slow-Smoked Rib Tips',
      '1 Full Pan Smoked Wings or Pulled Chicken',
      '1 Half Pan 4-Cheese Mac & Cheese',
      '1 Half Pan Southern Baked Beans',
      '18 Slider Buns + 1 Pint Signature Sauce'
    ]
  },
  {
    id: 'backyard-celebration',
    name: 'The Backyard Celebration',
    price: 495.00,
    serves: '20 – 25 Guests',
    guestCountMin: 20,
    guestCountMax: 25,
    description: 'The neighborhood classic with 3 full slabs of St. Louis ribs, 20 pieces of smoked chicken, and full pans of scratch sides.',
    items: [
      '3 Full Slabs St. Louis Cut Spare Ribs',
      '20 pcs Smoked Chicken (Legs & Thighs)',
      '1 Full Pan 4-Cheese Mac & Cheese',
      '1 Full Pan Traditional Potato Salad',
      '1 Full Pan Southern Baked Beans',
      '25 Honey Butter Cornbread Squares + 1 Quart Sauce'
    ],
    popular: true
  },
  {
    id: 'executive-smokehouse',
    name: 'The Executive Smokehouse Board',
    price: 845.00,
    serves: '30 – 35 Guests',
    guestCountMin: 30,
    guestCountMax: 35,
    description: 'High-roller smokehouse board featuring whole Texas brisket, beef ribs, turkey chops, and premium sides.',
    items: [
      '1 Whole Texas-Style Smoked Brisket (Sliced, 6-8 lbs net yield)',
      '3 Full Slabs Beef Ribs',
      '1 Full Pan Smoked Turkey Chops or Smoked Oxtails',
      '1 Full Pan 4-Cheese Mac & Cheese',
      '1 Full Pan Cheesy Broccoli Casserole',
      '1 Full Pan Creamy Southern Coleslaw',
      '35 Brioche Buns + Dual Pints Hot & Mild Sauces'
    ]
  }
];

export const MEAL_PREP_TIERS: MealPrepTier[] = [
  {
    id: 'mp-5',
    name: 'The 5-Pack Lean Starter',
    price: 85.00,
    mealCount: 5,
    pricePerMeal: 17.00,
    description: '5 high-protein meals with 6oz smoked turkey chops or pulled chicken, steamed broccoli, and seasoned brown or white rice.',
    proteinHighlights: ['6oz Smoked Turkey Chops', 'Hardwood Pulled Chicken Breast']
  },
  {
    id: 'mp-10',
    name: 'The 10-Pack Athlete Fuel',
    price: 160.00,
    mealCount: 10,
    pricePerMeal: 16.00,
    description: '10 heavy-duty performance meals split between smoked brisket, lean beef sausage, and pulled chicken with roasted veggies and sweet potato wedges.',
    proteinHighlights: ['Prime Texas Brisket', 'Smoked Beef Sausage', 'Smoked Turkey Chops']
  },
  {
    id: 'mp-bulk',
    name: 'The Pitmaster Bulk Pack',
    price: 125.00,
    mealCount: 8,
    pricePerMeal: 15.62,
    description: '4 lbs vacuum-sealed sliced smoked meats and 2 quarts of scratch sides ready for quick, clean weekly home dining.',
    proteinHighlights: ['Vacuum-Sealed Whole Brisket Cuts', 'Smoked Rib Tips', 'Full Slab Ribs']
  }
];
