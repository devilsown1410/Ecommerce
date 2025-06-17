import * as Yup from 'yup';

const orderSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      product: Yup.string().required("Product ID is required"),
      quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
    })
  ).required("Items are required"),
  address: Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    line1: Yup.string().required("Address line 1 is required"),
    city: Yup.string().required("City is required"),
    pin: Yup.string().required("PIN code is required"),
    phone: Yup.string().required("Phone number is required"),
  }).required("Address is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
  total: Yup.number().min(0, "Total must be non-negative").required("Total is required"),
  date: Yup.date().required("Date is required"),
});

const validateOrder = async (req, res, next) => {
  try {
    await orderSchema.validate(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export default validateOrder;