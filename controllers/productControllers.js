import { checkIfEmpty } from "../utils/checkValidate.js";
import { ErrorHandler } from "../helper/error.js";
import productModel from "../models/productModel.js";
export const createProduct = async (req, res, next) => {
  try {
    const {
      tokenData: { userid },
    } = req;
    const filePath = req.file.path.substring(7);
    const { payload } = req.body || {};
    const payloadData = JSON.parse(payload);
    const { name, price, description, quantity } = payloadData || {};
    const checkValidateObj = {
      name,
      price,
      description,
    };
    const { isValid } = checkIfEmpty(checkValidateObj);
    if (!isValid) {
      return next(new ErrorHandler(422, "Invalid request !!"));
    }
    const addProduct = await productModel.create({
      name,
      price,
      description,
      createdBy: userid,
      image: filePath,
    });
    res.send({
      code: 200,
      msg: "Product Added Successfully",
      productData: addProduct,
    });
  } catch (error) {
    next(error);
    console.log("error===>", error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { skip } = req.body;
    const totalProductsCount = await productModel.find({}).countDocuments();
    const list = await productModel
      .find({})
      .skip(skip)
      .limit(10)
      .sort({ _id: -1 })
      .lean();
    res.send({
      code: 200,
      msg: "Success",
      product: list,
      totalProductsCount: totalProductsCount,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ErrorHandler(500, "Failed to get product id."));
    }
    await productModel.deleteOne({ _id: id });
    res.send({ code: 200, msg: "success" });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    let code = 500;
    const {
      params: { id },
    } = req;
    let productId = id;
    if (!productId) {
      return next(new ErrorHandler(500, "Failed to get product id."));
    }
    const getProductDetail = await productModel.findOne({
      _id: productId,
    });
    code = 200;
    res.status(200).send({ code, getProduct: getProductDetail });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, price, id } = req.body || {};
    if (!id) {
      return next(new ErrorHandler(500, "Failed to get Product Id"));
    }
    const productUpdate = await productModel.updateOne(
      {
        _id: id,
      },
      {
        name,
        price,
      }
    );
    res.send({
      code: 200,
      msg: "Product Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};
