// Local storage persistence helper for Sourav Graphic Leads & Inquiries CRM

export const DEFAULT_ADMIN_AUTH = {
  email: "sanjay00002023@gmail.com",
  password: "Sanjay2rana@123",
  name: "Super Admin",
  lastUpdated: new Date().toISOString()
};

export const INITIAL_LEADS = [
  {
    id: "INQ-9421",
    client: "Rahul Sharma",
    phone: "9823456789",
    email: "rahul.sharma@gmail.com",
    city: "New Delhi",
    date: "2026-10-29",
    source: "Online 3D Studio",
    material: "Brushed Aluminium",
    size: "12\" × 6\" (3mm)",
    lighting: "Warm White (3000K)",
    mounting: "4× M6 Stainless Standoffs",
    textLayers: [
      { line: "SHARMA'S RESIDENCE", font: "Cinzel Decorative" },
      { line: "B-42, Gulmohar Enclave", font: "Montserrat" }
    ],
    quantity: 1,
    status: "New Inquiry",
    notes: "Client wants official rate and turnaround timeline for home entrance plate."
  },
  {
    id: "INQ-9422",
    client: "Amit Patel (TechCorp)",
    phone: "9987654321",
    email: "amit.patel@techcorp.in",
    city: "Mumbai",
    date: "2026-10-28",
    source: "Online 3D Studio",
    material: "Anodized Matte Aluminium",
    size: "8\" × 4\" (1.5mm)",
    lighting: "None",
    mounting: "3M High-Bond Industrial Adhesive",
    textLayers: [
      { line: "CHIEF EXECUTIVE OFFICER", font: "Cinzel" },
      { line: "AMIT PATEL", font: "Playfair Display" }
    ],
    quantity: 15,
    status: "Quote Sent",
    notes: "Requested quotation for serialized corporate cabin plates."
  },
  {
    id: "INQ-9423",
    client: "Vikram Malhotra",
    phone: "9711234567",
    email: "vikram@malhotragroup.com",
    city: "Bengaluru",
    date: "2026-10-27",
    source: "Online 3D Studio",
    material: "Titanium PVD Gold",
    size: "16\" × 8\" (4mm)",
    lighting: "Halo Golden Glow",
    mounting: "Concealed Stud Mount",
    textLayers: [
      { line: "MALHOTRA MANOR", font: "Cinzel Decorative" },
      { line: "Villa 108, Palm Meadows", font: "Montserrat" }
    ],
    quantity: 1,
    status: "In Discussion",
    notes: "Client interested in viewing sample physical metal finish video on WhatsApp."
  },
  {
    id: "INQ-9424",
    client: "Sun Pharma Labs (Dr. Alok Verma)",
    phone: "9812345678",
    email: "alok.verma@sunpharma.example",
    city: "Ahmedabad",
    date: "2026-10-26",
    source: "Commercial RFP",
    material: "Anodized Sealed Aluminium",
    size: "4\" × 2\" (1.5mm)",
    lighting: "None",
    mounting: "3M Adhesive + Rivet Holes",
    textLayers: [
      { line: "BIO-HAZARD ASSET TAG", font: "Montserrat" },
      { line: "SERIAL NO: 2026-SP-001", font: "Roboto Mono" }
    ],
    quantity: 500,
    status: "Sample Dispatched",
    notes: "Test batch of 5 laser etched samples dispatched via courier."
  },
  {
    id: "INQ-9425",
    client: "Apex Heights RWA (Sanjay Roy)",
    phone: "9723456789",
    email: "sanjay@apexheights.example",
    city: "Gurugram",
    date: "2026-10-25",
    source: "Website Quick Inquiry",
    material: "Brushed Aluminium",
    size: "10\" × 4\" (3mm)",
    lighting: "None",
    mounting: "Standoffs",
    textLayers: [
      { line: "TOWER A - APARTMENT 402", font: "Cinzel" }
    ],
    quantity: 75,
    status: "Converted / Won",
    notes: "Confirmed order for 75 flat doors. Production scheduled."
  }
];

export const LEAD_STATUSES = [
  { key: "New Inquiry", label: "New Inquiry", color: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30" },
  { key: "In Discussion", label: "In Discussion", color: "bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-600/35" },
  { key: "Quote Sent", label: "Quote Sent", color: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30" },
  { key: "Sample Dispatched", label: "Sample Dispatched", color: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30" },
  { key: "Converted / Won", label: "Converted / Won", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30" },
  { key: "Closed", label: "Closed / Lost", color: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border-zinc-500/30" }
];

export const INITIAL_MATERIALS = [
  { id: "mat-1", name: "Brushed Aluminium (6061-T6)", thickness: "3.0 mm", status: "Available", popular: true },
  { id: "mat-2", name: "Anodized Matte Aluminium", thickness: "1.5 - 3.0 mm", status: "Available", popular: true },
  { id: "mat-3", name: "Titanium PVD Gold", thickness: "4.0 mm", status: "Available", popular: true },
  { id: "mat-4", name: "Heritage Architectural Brass", thickness: "4.0 mm", status: "Available", popular: false },
  { id: "mat-5", name: "Cast Acrylic Matte Black", thickness: "5.0 mm", status: "Available", popular: false },
  { id: "mat-6", name: "Stainless Steel 304 Mirror", thickness: "2.0 mm", status: "Available", popular: false }
];
