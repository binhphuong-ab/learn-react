import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vacuum-pumps';
const DATA_DIR = path.join(__dirname, '../data');

async function exportData() {
  console.log('🔄 Connecting to MongoDB...');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Export products
    const productsCollection = mongoose.connection.collection('products');
    const products = await productsCollection.find({}).toArray();

    // Transform MongoDB documents
    const transformedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : (p.specs || {}),
    }));

    const productsPath = path.join(DATA_DIR, 'products.json');
    fs.writeFileSync(productsPath, JSON.stringify(transformedProducts, null, 2));
    console.log(`✅ Exported ${products.length} products to ${productsPath}`);

    // Export categories
    const categoriesCollection = mongoose.connection.collection('categories');
    const categories = await categoriesCollection.find({}).toArray();

    const transformedCategories = categories.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    const categoriesPath = path.join(DATA_DIR, 'categories.json');
    fs.writeFileSync(categoriesPath, JSON.stringify(transformedCategories, null, 2));
    console.log(`✅ Exported ${categories.length} categories to ${categoriesPath}`);

    console.log('\n📦 Export complete! Now run: pnpm build:web');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

exportData();
