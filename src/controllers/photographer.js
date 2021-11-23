const slugify = require("slugify");
const { Photographer } = require("../../models");
const photographerSchema = require("../schemas/photographerSchema");
const cloudinary = require("../utils/cloudinary");
const {
  errorResponse,
  successResponse,
} = require("../utils/responseFormatter");

exports.addPhotographer = async (req, res) => {
  try {
    const { error } = photographerSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return errorResponse(
        res,
        400,
        { errors: error.details.map((detail) => detail.message) },
        "Failed to add Photographer"
      );
    }

    const { full_name, instagram } = req.body;
    const slug = slugify(full_name, { lower: true });
    let avatar_url;
    let avatar_public_id;

    if (req.file) {
      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path);
      avatar_url = cloudinaryRes.secure_url;
      avatar_public_id = cloudinaryRes.public_id;
    }

    const photographer = await Photographer.create({
      full_name,
      instagram,
      slug,
      avatar_url,
      avatar_public_id,
    });

    const newPhotographer = await Photographer.findOne({
      where: { id: photographer.id },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    return successResponse(
      res,
      201,
      newPhotographer,
      "Add a photographer success"
    );
  } catch (error) {
    errorResponse(res, 500, {}, error.message);
  }
};

exports.getPhotographers = async (req, res) => {
  try {
    const { status = "" } = req.query;

    let photographers = [];

    const queryOption = {
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    };

    if (status !== "") {
      photographers = await Photographer.findAll({
        ...queryOption,
        where: { status: status === "true" },
      });
    } else {
      photographers = await Photographer.findAll({
        ...queryOption,
      });
    }

    return successResponse(
      res,
      200,
      photographers,
      "Get photographers success"
    );
  } catch (error) {
    return errorResponse(res, 500, {}, error.message);
  }
};

exports.getPhotographer = async (req, res) => {
  try {
    const { slug } = req.params;

    const photographer = await Photographer.findOne({
      where: { slug },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    if (!photographer) {
      return errorResponse(
        res,
        404,
        {},
        "Get a photographer failed, not found."
      );
    }

    return successResponse(res, 200, photographer, "Get photographer success");
  } catch (error) {
    errorResponse(res, 500, {}, error.message);
  }
};

exports.editPhotographer = async (req, res) => {
  try {
    const { slug } = req.params;
    const { full_name, instagram } = req.body;

    let newSlug;
    if (full_name) {
      newSlug = slugify(full_name, { lower: true });
    }

    const photographer = await Photographer.findOne({
      where: { slug },
      attributes: ["id", "avatar_public_id"],
    });

    if (!photographer) {
      return errorResponse(res, 404, {}, "Update product failed, not found.");
    }

    let avatar_url;
    let avatar_public_id;
    if (req.file) {
      if (photographer.avatar_public_id) {
        await cloudinary.uploader.destroy(photographer.avatar_public_id);
      }

      const cloudinaryRes = await cloudinary.uploader.upload(req.file.path);
      avatar_url = cloudinaryRes.secure_url;
      avatar_public_id = cloudinaryRes.public_id;
    }

    await Photographer.update(
      {
        full_name,
        instagram,
        avatar_url,
        avatar_public_id,
        slug: newSlug,
      },
      {
        where: { slug },
      }
    );

    const updatedPhotographer = await Photographer.findOne({
      where: { id: photographer.id },
      attributes: {
        exclude: ["updatedAt", "createdAt"],
      },
    });

    return successResponse(
      res,
      200,
      updatedPhotographer,
      "Edit photographer success"
    );
  } catch (error) {
    errorResponse(res, 500, {}, error.message);
  }
};

exports.deletePhotographer = async (req, res) => {
  try {
    const { slug } = req.params;

    const photographer = await Photographer.findOne({
      where: { slug },
      attributes: ["avatar_public_id"],
    });

    if (!photographer) {
      errorResponse(res, 404, {}, "Delete photographer failed, not found.");
      return;
    }

    if (photographer.avatar_public_id) {
      await cloudinary.uploader.destroy(photographer.avatar_public_id);
    }

    await Photographer.destroy({
      where: { slug },
    });

    return successResponse(res, 200, {}, "Delete photographer success");
  } catch (error) {
    errorResponse(res, 500, {}, error.message);
  }
};
