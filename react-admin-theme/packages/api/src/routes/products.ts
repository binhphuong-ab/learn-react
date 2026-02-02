import { Router, Request, Response } from 'express';
import { ProductModel } from '../models';

const router = Router();

// GET /api/products - List products with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._start as string) || 0;
    const limit = parseInt(req.query._end as string) || 10;
    const sort = (req.query._sort as string) || 'createdAt';
    const order = (req.query._order as string) === 'ASC' ? 1 : -1;
    const search = req.query.q as string;
    const category = req.query.category as string;

    const query: Record<string, unknown> = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const total = await ProductModel.countDocuments(query);
    const products = await ProductModel.find(query)
      .sort({ [sort]: order })
      .skip(page)
      .limit(limit - page)
      .lean();

    // Transform specs Map to plain object
    const transformedProducts = products.map(p => ({
      ...p,
      id: p._id,
      specs: p.specs instanceof Map ? Object.fromEntries(p.specs) : p.specs,
    }));

    res.set('X-Total-Count', total.toString());
    res.set('Content-Range', `products ${page}-${Math.min(limit, total) - 1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      ...product,
      id: product._id,
      specs: product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST /api/products - Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();

    const result = product.toObject();
    res.status(201).json({
      ...result,
      id: result._id,
      specs: result.specs instanceof Map ? Object.fromEntries(result.specs) : result.specs,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      ...product,
      id: product._id,
      specs: product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
