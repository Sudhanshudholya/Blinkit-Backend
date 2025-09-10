import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req?.body;

    if (!name && !image && !category[0]) {
      return res.status(400).send({
        status: false,
        message: "Please provide name image and category",
        error: true,
        success: false,
      });
    }

    const create = await SubCategoryModel.create({ name, image, category });

    return res.status(200).send({
      status: true,
      message: "Sub Category Added Successfully",
      data: create,
      error: false,
      success: true,
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

export const getSubCategoryController = async (req, res) => {
  try {
    const data = await SubCategoryModel.find()
      .populate("category")
      .sort({ createdAt: -1 });


    return res.status(200).send({
      status: true,
      message: "All sub category get successfully",
      data: data,
      error: false,
      success: true,
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

export const updateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, category } = req?.body;

    const checkSub = await SubCategoryModel.findById(_id);

    if (!checkSub) {
      return res.status(400).send({
        status: false,
        message: "Check your _Id",
        error: true,
        success: false,
      });
    }

    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(
      _id,
      { name, image, category },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Update Category successfully",
      data: updateSubCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      succe: false,
      error: true,
    });
  }
};

export const deleteSubCategoryController = async (req, res) => {
  try {
    const { _id } = req?.body;

    const checkSub = await SubCategoryModel.findById(_id);

    if (!checkSub) {
      return res.status(400).send({
        status: false,
        message: "Check your _Id",
        error: true,
        success: false,
      });
    }

    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id);

    return res.status(200).send({
      status: true,
      message: "Sub Category Deleted Successfully",
      data: deleteSub,
      error: false,
      success: true,
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
