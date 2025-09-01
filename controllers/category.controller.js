import CategoryModel from "../models/category.model.js";

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
