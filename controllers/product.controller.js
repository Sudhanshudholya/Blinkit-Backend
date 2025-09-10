import ProductModel from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      discription,
      more_details,
    } = req?.body;

    console.log("BODY:", req?.body);

    if (
      !name ||
      !Array.isArray(image) ||
      !image.length ||
      !Array.isArray(category) ||
      !category.length ||
      !Array.isArray(subCategory) ||
      !subCategory.length ||
      !unit ||
      !stock ||
      !price ||
      !discount ||
      !discription
    ) {
      return res.status(400).send({
        status: false,
        message: "Enter Required Field",
        error: true,
        success: false,
      });
    }

    const createProduct = await ProductModel.create({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      discription,
      more_details,
    });

    return res.status(200).send({
      status: true,
      message: "Product Created Successfully",
      data: createProduct,
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

export const getProductController = async (req, res) => {
  try {

    let { page, limit, search } = req?.body;

    if(!page){
      page = 1
    }

    if(!limit){
      limit = 10
    }

    const query = search ? {
      $text : {
        $search : search
      }
    } : {}

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query)
    ]);

    return res.status(200).send({
      status: true,
      message: "Product Data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data
    })
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const {id} = req?.body

    if(!id){
      return res.status(400).send({
        status: false,
        message: "Provide category id",
        error: true,
        success: false
      })
    }

    const product = await ProductModel.find({
      category: { $in: id }
    }).limit(15)

    return res.status(200).send({
      status: true,
      message: "Category product data",
      data: product,
      error: false,
      success: true
    })

  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message || error,
      error: true,
      success: false
    })
  }
}
