// Initial mock data for Paragros B2B Parapharmacy Platform

export const INITIAL_VENDORS = [
  {
    id: 'v1',
    name: 'Pharmaplus Gros Alger',
    ownerName: 'Karim Benali',
    email: 'karim@pharmaplus-gros.dz',
    phone: '0550 12 34 56',
    whatsapp: '213550123456',
    wilaya: '16 - Alger',
    address: 'Zone Industrielle Oued Smar, Alger',
    logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80',
    bio: 'Grossiste spécialisé en compléments alimentaires, dermo-cosmétique et matériel médical pour parapharmacies.',
    status: 'active', // 'active' | 'deactivated'
    isDeleted: false, // Soft deletion flag
    deletedAt: null,
    isEmailVerified: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'v2',
    name: 'BioSante Wholesale Oran',
    ownerName: 'Amine Zerrouki',
    email: 'amine@biosante-oran.dz',
    phone: '0770 98 76 54',
    whatsapp: '213770987654',
    wilaya: '31 - Oran',
    address: 'Es-Senia, Oran',
    logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80',
    bio: 'Importateur et distributeur exclusif de marques européennes de soins et bébé.',
    status: 'active',
    isDeleted: false,
    deletedAt: null,
    isEmailVerified: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'v3',
    name: 'Atlas Para Distribution Setif',
    ownerName: 'Yacine Mansouri',
    email: 'yacine@atlaspara.dz',
    phone: '0661 45 67 89',
    whatsapp: '213661456789',
    wilaya: '19 - Sétif',
    address: 'Zone d\'Activité, Sétif',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Vente en gros d\'équipements de mesure, bandelettes, thermomètres et produits d\'hygiène.',
    status: 'active',
    isDeleted: false,
    deletedAt: null,
    isEmailVerified: true,
    createdAt: '2026-03-10'
  },
  {
    id: 'v4',
    name: 'MedicaGros Blida',
    ownerName: 'Fouad Khelifi',
    email: 'fouad@medicagros.dz',
    phone: '0555 33 22 11',
    whatsapp: '213555332211',
    wilaya: '09 - Blida',
    address: 'Boufarik, Blida',
    logo: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80',
    bio: 'Grossiste en dermo-cosmétique bio, huiles essentielles et soins dermatologiques.',
    status: 'deactivated', // Currently deactivated by admin
    isDeleted: false,
    deletedAt: null,
    isEmailVerified: true,
    createdAt: '2026-04-05'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    vendorId: 'v1',
    title: 'Sérum Vitamine C Pure 30ml - Eclat Anti-Âge',
    category: 'Dermo-Cosmétique',
    wholesalePrice: 1450, // DZD
    suggestedRetailPrice: 2200, // DZD
    minOrderQuantity: 12, // Pack of 12
    stock: 250,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    description: 'Sérum concentré à 15% Vitamine C pure pour redonner de l\'éclat aux peaux ternes et réduire les taches. Carton de 12 unités.',
    brand: 'DermaGlow',
    active: true,
    createdAt: '2026-05-01'
  },
  {
    id: 'p2',
    vendorId: 'v1',
    title: 'Magnesium B6 Marine 60 Gélules - Anti-Fatigue',
    category: 'Compléments Alimentaires',
    wholesalePrice: 850,
    suggestedRetailPrice: 1400,
    minOrderQuantity: 20,
    stock: 500,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    description: 'Complément alimentaire recommandé pour le stress, la fatigue nerveuse et musculaire. Lot de 20 boîtes.',
    brand: 'NutriPlus',
    active: true,
    createdAt: '2026-05-03'
  },
  {
    id: 'p3',
    vendorId: 'v2',
    title: 'Écran Solaire SPF 50+ Invisible Touch 50ml',
    category: 'Protection Solaire',
    wholesalePrice: 1200,
    suggestedRetailPrice: 1900,
    minOrderQuantity: 15,
    stock: 180,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80',
    description: 'Haute protection UVA/UVB fini mat invisible, résistant à l\'eau. Idéal peaux mixtes à grasses.',
    brand: 'SunProtect',
    active: true,
    createdAt: '2026-05-10'
  },
  {
    id: 'p4',
    vendorId: 'v2',
    title: 'Eau Micellaire Apaisante 500ml Peaux Sensibles',
    category: 'Hygiène & Soins',
    wholesalePrice: 950,
    suggestedRetailPrice: 1550,
    minOrderQuantity: 10,
    stock: 300,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    description: 'Démaquille et apaise en douceur sans rincage. Format économique 500ml.',
    brand: 'PureDerm',
    active: true,
    createdAt: '2026-05-12'
  },
  {
    id: 'p5',
    vendorId: 'v3',
    title: 'Tensiomètre Électronique de Bras Digital',
    category: 'Matériel Médical',
    wholesalePrice: 4200,
    suggestedRetailPrice: 6500,
    minOrderQuantity: 5,
    stock: 65,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80',
    description: 'Tensiomètre automatique précision médicale avec détection d\'arythmie et mémoire 2x90 mesures. Garantie 2 ans.',
    brand: 'MedTech Pro',
    active: true,
    createdAt: '2026-05-15'
  },
  {
    id: 'p6',
    vendorId: 'v3',
    title: 'Thermomètre Infrarouge Sans Contact Frontal',
    category: 'Matériel Médical',
    wholesalePrice: 2800,
    suggestedRetailPrice: 4500,
    minOrderQuantity: 8,
    stock: 90,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500&auto=format&fit=crop&q=80',
    description: 'Prise de température ultra rapide en 1 seconde. Écran rétro-éclairé 3 couleurs.',
    brand: 'MedTech Pro',
    active: true,
    createdAt: '2026-05-18'
  },
  {
    id: 'p7',
    vendorId: 'v1',
    title: 'Huile d\'Argan Pure Bio 100ml - Visage & Cheveux',
    category: 'Huiles & Soins Naturels',
    wholesalePrice: 1100,
    suggestedRetailPrice: 1800,
    minOrderQuantity: 12,
    stock: 140,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1608248597261-05187796d1eb?w=500&auto=format&fit=crop&q=80',
    description: '100% pure extraite à froid. Nourrit en profondeur la peau et restaure la brillance des cheveux.',
    brand: 'BioNatural',
    active: true,
    createdAt: '2026-05-20'
  },
  {
    id: 'p8',
    vendorId: 'v4',
    title: 'Biberon Anti-Colique 260ml Sensation Naturelle',
    category: 'Bébé & Maternité',
    wholesalePrice: 980,
    suggestedRetailPrice: 1600,
    minOrderQuantity: 12,
    stock: 110,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80',
    description: 'Tétine en silicone souple imitant la forme du sein, valve anti-colique avancée. Sans BPA.',
    brand: 'BabyCare',
    active: true,
    createdAt: '2026-05-22'
  }
];

export const CATEGORIES = [
  'Tous les produits',
  'Dermo-Cosmétique',
  'Compléments Alimentaires',
  'Protection Solaire',
  'Hygiène & Soins',
  'Matériel Médical',
  'Huiles & Soins Naturels',
  'Bébé & Maternité'
];

export const WILAYAS = [
  '16 - Alger',
  '31 - Oran',
  '19 - Sétif',
  '09 - Blida',
  '25 - Constantine',
  '15 - Tizi Ouzou',
  '06 - Béjaïa',
  '23 - Annaba',
  '13 - Tlemcen',
  '35 - Boumerdès',
  '42 - Tipaza',
  'Autre Wilaya'
];
