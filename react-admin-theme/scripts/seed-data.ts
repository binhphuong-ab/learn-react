import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vacuum-pumps';

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

async function seedData() {
  console.log('🔄 Connecting to MongoDB...');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Product = mongoose.model('Product', ProductSchema);
    const Category = mongoose.model('Category', CategorySchema);

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Seed categories
    const categories = await Category.insertMany([
      { name: 'Rotary Vane Pumps', slug: 'rotary-vane', description: 'Oil-sealed rotary vane vacuum pumps' },
      { name: 'Scroll Pumps', slug: 'scroll', description: 'Oil-free scroll vacuum pumps' },
      { name: 'Diaphragm Pumps', slug: 'diaphragm', description: 'Chemical-resistant diaphragm pumps' },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Seed products
    const products = await Product.insertMany([
      {
        name: 'RV-100 Rotary Vane Pump',
        slug: 'rv-100-rotary-vane-pump',
        summary: 'High-performance oil-sealed rotary vane vacuum pump for industrial applications.',
        description: 'The RV-100 is a robust and reliable rotary vane vacuum pump designed for demanding industrial environments. Features include:\n\n- Direct drive motor for quiet operation\n- Gas ballast valve for handling condensable vapors\n- Anti-suckback valve included\n- Easy maintenance with accessible oil fill and drain',
        images: ['/images/rv-100.jpg'],
        specs: new Map([
          ['Flow Rate', '100 m³/h'],
          ['Ultimate Pressure', '0.5 mbar'],
          ['Motor Power', '2.2 kW'],
          ['Weight', '45 kg'],
        ]),
        price: 25000000,
        category: 'Rotary Vane Pumps',
      },
      {
        name: 'RV-250 Rotary Vane Pump',
        slug: 'rv-250-rotary-vane-pump',
        summary: 'Large capacity rotary vane pump for high-volume vacuum applications.',
        description: 'The RV-250 delivers exceptional pumping performance for large-scale vacuum systems. Ideal for packaging, food processing, and industrial manufacturing.\n\n- Heavy-duty construction for 24/7 operation\n- Integrated oil mist filter\n- Low noise design\n- Compatible with vacuum boosters',
        images: ['/images/rv-250.jpg'],
        specs: new Map([
          ['Flow Rate', '250 m³/h'],
          ['Ultimate Pressure', '0.1 mbar'],
          ['Motor Power', '5.5 kW'],
          ['Weight', '120 kg'],
        ]),
        price: 55000000,
        category: 'Rotary Vane Pumps',
      },
      {
        name: 'SC-50 Scroll Pump',
        slug: 'sc-50-scroll-pump',
        summary: 'Oil-free scroll vacuum pump for clean process applications.',
        description: 'The SC-50 provides clean, dry vacuum without oil contamination. Perfect for laboratories, semiconductor manufacturing, and pharmaceutical applications.\n\n- 100% oil-free operation\n- Low vibration design\n- Compact footprint\n- Maintenance-free scroll mechanism',
        images: ['/images/sc-50.jpg'],
        specs: new Map([
          ['Flow Rate', '50 m³/h'],
          ['Ultimate Pressure', '0.01 mbar'],
          ['Motor Power', '1.5 kW'],
          ['Weight', '35 kg'],
        ]),
        price: 45000000,
        category: 'Scroll Pumps',
      },
      {
        name: 'DP-20 Diaphragm Pump',
        slug: 'dp-20-diaphragm-pump',
        summary: 'Chemical-resistant diaphragm pump for corrosive gas handling.',
        description: 'The DP-20 is specifically designed for pumping corrosive and aggressive gases. PTFE-coated diaphragm and wetted parts provide excellent chemical resistance.\n\n- PTFE diaphragm and valves\n- Suitable for corrosive vapors\n- Self-priming design\n- Explosion-proof options available',
        images: ['/images/dp-20.jpg'],
        specs: new Map([
          ['Flow Rate', '20 m³/h'],
          ['Ultimate Pressure', '2 mbar'],
          ['Motor Power', '0.25 kW'],
          ['Weight', '8 kg'],
        ]),
        price: 15000000,
        category: 'Diaphragm Pumps',
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    console.log('\n🎉 Seed complete!');
    console.log('Run "pnpm export" to export data for static site build.');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedData();
