import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../controllers/generalController.js';
import { readData } from '../utils/dataStore.js';
import City from '../models/City.js';

const router = Router();

router.use(authenticate);
router.get('/me', getProfile);
router.put('/me', updateProfile);

router.get('/cities', async (_req, res) => {
  try {
    const dbCities = await City.find({ available: { $ne: false } }).sort({ name: 1 }).lean();
    if (dbCities && dbCities.length > 0) {
      return res.json(dbCities);
    }
    const fileCities = await readData('cities');
    return res.json(fileCities);
  } catch (err) {
    console.error('Error fetching cities:', err);
    try {
      const fileCities = await readData('cities');
      return res.json(fileCities);
    } catch {
      return res.status(500).json({ message: 'Could not fetch cities.' });
    }
  }
});

export default router;

