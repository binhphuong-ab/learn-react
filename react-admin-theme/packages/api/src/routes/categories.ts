import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models';

const router = Router();

// GET /api/categories - List all categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    const total = categories.length;

    const transformed = categories.map(c => ({
      ...c,
      id: c._id,
    }));

    res.set('X-Total-Count', total.toString());
    res.set('Content-Range', `categories 0-${total - 1}/${total}`);
    res.set('Access-Control-Expose-Headers', 'X-Total-Count, Content-Range');
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ ...category, id: category._id });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
});

// POST /api/categories - Create category
router.post('/', async (req: Request, res: Response) => {
  try {
    const category = new CategoryModel(req.body);
    await category.save();

    const result = category.toObject();
    res.status(201).json({ ...result, id: result._id });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ ...category, id: category._id });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

export default router;
