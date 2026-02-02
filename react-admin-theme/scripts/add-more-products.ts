import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/vacuum-pumps';

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  summary: String,
  description: String,
  images: [String],
  specs: { type: Map, of: String },
  price: Number,
  category: String,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
}, { timestamps: true });

async function addMoreProducts() {
  await mongoose.connect(MONGODB_URI);
  const Product = mongoose.model('Product', ProductSchema);
  const Category = mongoose.model('Category', CategorySchema);

  // Add new categories
  const newCategories = [
    { name: 'Turbomolecular Pumps', slug: 'turbomolecular', description: 'Ultra-high vacuum turbomolecular pumps' },
    { name: 'Roots Pumps', slug: 'roots', description: 'Vacuum boosting roots blowers' },
    { name: 'Liquid Ring Pumps', slug: 'liquid-ring', description: 'Wet gas handling liquid ring pumps' },
  ];

  for (const cat of newCategories) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Added/updated categories');

  const newProducts = [
    {
      name: 'RV-500 Industrial Rotary Vane Pump',
      slug: 'rv-500-industrial-rotary-vane-pump',
      summary: 'Heavy-duty industrial vacuum pump for continuous operation.',
      description: 'The RV-500 is engineered for demanding 24/7 industrial applications. Built with premium materials for maximum durability.\n\n- Forced oil lubrication system\n- Built-in cooling fan\n- Vibration-dampening mounts\n- Extended service intervals',
      images: ['/images/rv-500.jpg'],
      specs: new Map([
        ['Flow Rate', '500 m³/h'],
        ['Ultimate Pressure', '0.05 mbar'],
        ['Motor Power', '11 kW'],
        ['Weight', '280 kg'],
      ]),
      price: 120000000,
      category: 'Rotary Vane Pumps',
    },
    {
      name: 'SC-100 Scroll Pump',
      slug: 'sc-100-scroll-pump',
      summary: 'High-capacity oil-free scroll pump for demanding clean applications.',
      description: 'The SC-100 delivers superior oil-free vacuum performance for critical processes requiring zero contamination.\n\n- Hermetically sealed scroll mechanism\n- Ultra-quiet operation (<55 dB)\n- Integrated controller\n- Remote monitoring capability',
      images: ['/images/sc-100.jpg'],
      specs: new Map([
        ['Flow Rate', '100 m³/h'],
        ['Ultimate Pressure', '0.008 mbar'],
        ['Motor Power', '3 kW'],
        ['Weight', '65 kg'],
      ]),
      price: 85000000,
      category: 'Scroll Pumps',
    },
    {
      name: 'DP-50 Chemical Diaphragm Pump',
      slug: 'dp-50-chemical-diaphragm-pump',
      summary: 'High-flow chemical-resistant pump for aggressive gas applications.',
      description: 'The DP-50 handles the most corrosive gases with its fully PTFE-coated flow path and robust diaphragm design.\n\n- Full PTFE wetted parts\n- Dual-stage design for deeper vacuum\n- ATEX certified options\n- Solvent recovery compatible',
      images: ['/images/dp-50.jpg'],
      specs: new Map([
        ['Flow Rate', '50 m³/h'],
        ['Ultimate Pressure', '1 mbar'],
        ['Motor Power', '0.55 kW'],
        ['Weight', '18 kg'],
      ]),
      price: 28000000,
      category: 'Diaphragm Pumps',
    },
    {
      name: 'TB-1000 Turbomolecular Pump',
      slug: 'tb-1000-turbomolecular-pump',
      summary: 'Ultra-high vacuum turbomolecular pump for research and semiconductor applications.',
      description: 'The TB-1000 achieves ultra-high vacuum levels required for advanced research and semiconductor manufacturing.\n\n- Magnetic bearing technology\n- No oil backstreaming\n- Integrated controller\n- USB and RS-485 interfaces',
      images: ['/images/tb-1000.jpg'],
      specs: new Map([
        ['Pumping Speed', '1000 L/s (N2)'],
        ['Ultimate Pressure', '10⁻¹⁰ mbar'],
        ['Rotation Speed', '36,000 rpm'],
        ['Weight', '25 kg'],
      ]),
      price: 350000000,
      category: 'Turbomolecular Pumps',
    },
    {
      name: 'RP-300 Roots Pump',
      slug: 'rp-300-roots-pump',
      summary: 'High-performance roots blower for vacuum boosting applications.',
      description: 'The RP-300 roots pump dramatically increases pumping speed when combined with backing pumps.\n\n- Oil-free compression chamber\n- Timing gear synchronized rotors\n- Air or water cooling options\n- Variable speed drive ready',
      images: ['/images/rp-300.jpg'],
      specs: new Map([
        ['Pumping Speed', '300 m³/h'],
        ['Max Differential Pressure', '50 mbar'],
        ['Motor Power', '2.2 kW'],
        ['Weight', '85 kg'],
      ]),
      price: 75000000,
      category: 'Roots Pumps',
    },
    {
      name: 'LP-200 Liquid Ring Pump',
      slug: 'lp-200-liquid-ring-pump',
      summary: 'Robust liquid ring vacuum pump for wet and dusty environments.',
      description: 'The LP-200 excels in applications involving moisture, dust, and condensable vapors where other pumps would fail.\n\n- Handles wet gases directly\n- No metal-to-metal contact\n- Self-cleaning action\n- Stainless steel construction available',
      images: ['/images/lp-200.jpg'],
      specs: new Map([
        ['Flow Rate', '200 m³/h'],
        ['Ultimate Pressure', '33 mbar'],
        ['Motor Power', '4 kW'],
        ['Weight', '150 kg'],
      ]),
      price: 65000000,
      category: 'Liquid Ring Pumps',
    },
  ];

  for (const product of newProducts) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      product,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Added 6 new products');

  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  console.log(`📦 Total products: ${totalProducts}`);
  console.log(`📁 Total categories: ${totalCategories}`);

  await mongoose.disconnect();
}

addMoreProducts();
