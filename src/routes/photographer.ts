import { Router } from 'express';
import {
  addPhotographer,
  deletePhotographer,
  editPhotographer,
  getPhotographer,
  getPhotographers,
  getPhotographersWithProducts,
  getPhotographerWithImages
} from '../controllers/photographer';
import { uploadFile } from '../middlewares/uploadFile';

const router = Router();

router.post('/', uploadFile('image'), addPhotographer);
router.get('/', getPhotographers);
router.get('/images', getPhotographersWithProducts);
router.get('/:user_name', getPhotographer);
router.get('/:user_name/images', getPhotographerWithImages);
router.patch('/:user_name', uploadFile('image'), editPhotographer);
router.delete('/:user_name', deletePhotographer);

export default router;
