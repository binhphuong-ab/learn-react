import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { productsRouter, categoriesRouter } from './routes';
import { ProductModel, CategoryModel } from './models';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vacuum-pumps';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  exposedHeaders: ['X-Total-Count', 'Content-Range'],
}));
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export endpoint for admin UI
app.post('/api/export', async (_req, res) => {
  try {
    const dataDir = path.join(process.cwd(), '../../data');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Export products
    const products = await ProductModel.find({}).lean();
    const transformedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : (p.specs || {}),
    }));
    fs.writeFileSync(
      path.join(dataDir, 'products.json'),
      JSON.stringify(transformedProducts, null, 2)
    );

    // Export categories
    const categories = await CategoryModel.find({}).lean();
    const transformedCategories = categories.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));
    fs.writeFileSync(
      path.join(dataDir, 'categories.json'),
      JSON.stringify(transformedCategories, null, 2)
    );

    console.log(`✅ Exported ${products.length} products and ${categories.length} categories`);
    res.json({
      success: true,
      products: products.length,
      categories: categories.length,
    });
  } catch (error) {
    console.error('❌ Export failed:', error);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
});

// Connect to MongoDB and start server
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 API server running on http://localhost:${PORT}`);
      console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
      console.log(`📁 Categories API: http://localhost:${PORT}/api/categories`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    console.log('\n💡 Make sure MongoDB is running:');
    console.log('   brew services start mongodb-community@7.0');
    process.exit(1);
  }
}

start();
