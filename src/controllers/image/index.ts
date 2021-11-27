import { Request, Response } from 'express';
import slugify from 'slugify';
import ImageModel from '../../models/image';
import PhotographerModel from '../../models/photographer';
import imageSchema from '../../schemas/imageSchema';
import { Image } from '../../types/image';
import cloudinary from '../../utils/cloudinary';
import { errorResponse, successResponse } from '../../utils/responseFormatter';

export const addImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = imageSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return errorResponse(
        res,
        422,
        { errors: error.details.map((detail) => detail.message) },
        'Failed to add Image'
      );
    }

    const { title, description, photographer }: Image = req.body;

    const isExistPhotographer = await PhotographerModel.findById(photographer);
    if (!isExistPhotographer) {
      return errorResponse(
        res,
        422,
        { title, description, photographer },
        `Failed to add Image, photographer: ${photographer} is not found. Please insert a right photographer.`
      );
    }

    const slug = slugify(`${title} by ${isExistPhotographer.user_name}`, {
      lower: true
    });
    const isExistSlug = await ImageModel.findOne({ slug });
    if (isExistSlug) {
      return errorResponse(
        res,
        422,
        { title, description, photographer },
        `Failed to add Image, slug: ${slug} is already taken. Please insert another image title.`
      );
    }

    let url;
    let public_id;
    if (req.file) {
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bulkypixel'
      });
      url = cloudinaryRes.secure_url;
      public_id = cloudinaryRes.public_id;
    }

    const newImageModel = new ImageModel({
      title,
      description,
      url,
      public_id,
      slug
    });

    const newImage = await newImageModel.save();
    await PhotographerModel.findOneAndUpdate(
      { _id: photographer },
      { $push: { images: newImage._id } }
    );

    successResponse(res, 201, newImage, 'Add image success');
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};
