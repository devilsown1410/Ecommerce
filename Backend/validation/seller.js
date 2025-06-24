import * as yup from "yup";

const productValidationSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .positive("Price must be a positive number")
    .required("Price is required"),
  description: yup.string().required("Product description is required"),
  stock: yup
    .number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
});

const validateProduct = async (req, res, next) => {
  try {
    await productValidationSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

export default validateProduct;
