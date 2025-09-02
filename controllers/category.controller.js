import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

//ADD CATEGORY CONTROLLER

export const addCategoryController = async (req, res) => {
  try {
    const { name, image } = req?.body;

    if (!name || !image) {
      return res.status(400).send({
        status: false,
        message: "Enter required field",
        error: true,
        success: false,
      });
    }

    const create = await CategoryModel.create({ name, image });

    if (!create) {
      return res.status(400).send({
        status: false,
        message: "No Created",
        error: true,
        success: false,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Added Category",
      data: create,
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

//GET CATEGORY CONTROLLER

export const getCategoryController = async (req, res) => {
  try {
    const data = await CategoryModel.find().sort({ createdAt: -1 });

    return res.status(200).send({
      status: true,
      message: "Category fetched successfully",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.satus(500).send({
      status: false,
      message: error.message || message,
      error: true,
      success: false,
    });
  }
};

//UPDATE CATEGORY CONTROLLER

export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = req?.body;

    const update = await CategoryModel.updateOne(
      {
        _id,
      },
      {
        name,
        image,
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Category Updated Successfully",
      data: update,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//DELETE CATEGORY CONTROLLER

export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const checkSubCategory = await SubCategoryModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    const checkProduct = await ProductModel.find({
      category: {
        $in: [_id],
      },
    }).countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).send({
        status: false,
        message: " Category is already used can not be deleted",
        error: true,
        success: false,
      });
    }

    const deleteCategory = await CategoryModel.deleteOne({ _id: _id });

    return res.status(200).send({
      status: true,
      message: "Category deleted successfully",
      data: deleteCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
