import { Router } from 'express';
import { addImage } from '../controllers/image';
import { uploadFile } from '../middlewares/uploadFile';

const router = Router();

router.post('/', uploadFile('image'), addImage);

export default router;
