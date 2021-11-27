import { Request, Response } from 'express';
import ImageModel from '../../models/image';
import PhotographerModel from '../../models/photographer';
import photographerSchema from '../../schemas/photographerSchema';
import { Photographer } from '../../types/photographer';
import cloudinary from '../../utils/cloudinary';
import { errorResponse, successResponse } from '../../utils/responseFormatter';

const selectOptions = '-created_at -updated_at -__v';

export const addPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = photographerSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      return errorResponse(
        res,
        422,
        { errors: error.details.map((detail) => detail.message) },
        'Failed to add Photographer'
      );
    }

    const { full_name, instagram, user_name }: Photographer = req.body;

    const isExisting = await PhotographerModel.findOne({ user_name });
    if (isExisting) {
      return errorResponse(
        res,
        422,
        { full_name, instagram, user_name },
        `Failed to add Photographer, user_name: ${user_name} is already taken. Please use another user_name.`
      );
    }

    let avatar_url;
    let avatar_public_id;

    if (req.file) {
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bulkypixel'
      });
      avatar_url = cloudinaryRes.secure_url;
      avatar_public_id = cloudinaryRes.public_id;
    }

    const newPhotographerModel = new PhotographerModel({
      full_name,
      instagram,
      user_name,
      avatar_url,
      avatar_public_id
    });
    const newPhotographer = await newPhotographerModel.save();

    return successResponse(
      res,
      201,
      newPhotographer,
      'Add a photographer success'
    );
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};

export const getPhotographers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status = '' } = req.query;

    let photographers: Photographer[] = [];

    if (status !== '') {
      photographers = await PhotographerModel.find({
        status: status === 'true'
      }).select(selectOptions);
    } else {
      photographers = await PhotographerModel.find();
    }

    return successResponse(
      res,
      200,
      photographers,
      'Get photographers success'
    );
  } catch (error: any) {
    return errorResponse(res, 500, {}, error.message);
  }
};

export const getPhotographersWithProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const photographers = await PhotographerModel.find()
      .populate({ path: 'images', select: selectOptions })
      .select(selectOptions);

    return successResponse(
      res,
      200,
      photographers,
      'Get photographers with images success'
    );
  } catch (error: any) {
    return errorResponse(res, 500, {}, error.message);
  }
};

export const getPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name } = req.params;

    const photographer = await PhotographerModel.findOne({ user_name });

    if (!photographer) {
      return errorResponse(
        res,
        404,
        {},
        'Get a photographer failed, not found.'
      );
    }

    return successResponse(res, 200, photographer, 'Get photographer success');
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};

export const getPhotographerWithImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name } = req.params;

    const photographer = await PhotographerModel.findOne({ user_name })
      .select(selectOptions)
      .lean();

    if (!photographer) {
      return errorResponse(
        res,
        404,
        {},
        'Get a photographer with images failed, not found.'
      );
    }

    const images = await ImageModel.find({
      photographer: photographer._id
    }).select(selectOptions);
    photographer.images = images;

    return successResponse(res, 200, photographer, 'Get photographer success');
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};

export const editPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name } = req.params;
    const { full_name, instagram, user_name: req_user_name } = req.body;

    const photographer = await PhotographerModel.findOne({ user_name });

    if (!photographer) {
      return errorResponse(
        res,
        404,
        {},
        'Update photographer failed, not found.'
      );
    }

    let avatar_url;
    let avatar_public_id;
    if (req.file) {
      if (photographer.avatar_public_id) {
        await cloudinary.uploader.destroy(photographer.avatar_public_id);
      }

      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
        folder: 'bulkypixel'
      });
      avatar_url = cloudinaryRes.secure_url;
      avatar_public_id = cloudinaryRes.public_id;
    }

    const updatedPhotographer = await PhotographerModel.findOneAndUpdate(
      { user_name },
      {
        full_name,
        instagram,
        avatar_url,
        avatar_public_id,
        user_name: req_user_name
      },
      { new: true }
    );

    return successResponse(
      res,
      200,
      updatedPhotographer,
      'Edit photographer success'
    );
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};

export const deletePhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name } = req.params;

    const photographer = await PhotographerModel.findOne({
      user_name
    });

    if (!photographer) {
      errorResponse(res, 404, {}, 'Delete photographer failed, not found.');
      return;
    }

    if (photographer.avatar_public_id) {
      await cloudinary.uploader.destroy(photographer.avatar_public_id);
    }

    await PhotographerModel.findOneAndRemove({
      user_name
    });

    return successResponse(res, 200, {}, 'Delete photographer success');
  } catch (error: any) {
    errorResponse(res, 500, {}, error.message);
  }
};
