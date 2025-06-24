import * as Yup from "yup";

export const getAddressValidationConfig = (onSubmitCallback) => ({
  initialValues: {
    fullName: "",
    line1: "",
    city: "",
    pin: "",
    phone: "",
  },
  validationSchema: Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    line1: Yup.string()
      .required("Address Line 1 is required")
      .max(50, "Address Line 1 should not exceed 50 characters"),
    city: Yup.string().required("City is required"),
    pin: Yup.string()
      .matches(/^\d+$/, "PIN Code must be a number")
      .length(6, "PIN Code must be exactly 6 digits")
      .required("PIN Code is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone Number must be a number")
      .length(10, "Phone Number must be exactly 10 digits")
      .required("Phone Number is required"),
  }),
  onSubmit: onSubmitCallback,
});
