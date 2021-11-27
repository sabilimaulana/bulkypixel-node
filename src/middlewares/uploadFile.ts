import { Request, NextFunction, Response } from 'express';
import multer from 'multer';

export const uploadFile = (fieldName: string) => {
  const storage = multer.diskStorage({});

  const fileFilter = function (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG)$/)) {
      req.body.fileValidationError = {
        message: 'Only image files are allowed!'
      };
      return cb(new Error('Only image files are allowed!'));
    }

    cb(null, true);
  };

  const maxSize = 10 * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize
    }
  }).single(fieldName);

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, function (err) {
      if (req.body.fileValidationError) {
        return res.status(400).send(req.body.fileValidationError);
      }

      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            message: `Max file sized exceeded (${maxSize} MB)`
          });
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).send({
            message: `Only single file allowed`
          });
        }

        return res.status(400).send(err);
      }
      return next();
    });
  };
};
