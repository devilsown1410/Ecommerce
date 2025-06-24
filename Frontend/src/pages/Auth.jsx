/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [backendError, setBackendError] = useState("");

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setBackendError("");
  };

  const handleAuthSuccess = (userData) => {
    const { password, ...userWithoutPassword } = userData;
    dispatch(setUserData(userWithoutPassword));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const url = `${backendUrl}${isLogin ? "/auth/login" : "/auth/register"}`;
    const payload = isLogin
      ? { email: values.email, password: values.password }
      : values;

    try {
      const response = await axios.post(url, payload, {
        withCredentials: true,
      });
      handleAuthSuccess(response.data.user);
      navigate(response.data.user.role === "seller" ? "/seller" : "/products");
    } catch (e) {
      console.log(e);
      setBackendError("Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = () => {
    setBackendError("");
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 characters").required("Required"),
    ...(isLogin
      ? {}
      : {
          username: Yup.string().required("Required"),
          address: Yup.string().required("Required"),
          contactNumber: Yup.string()
            .required("Required")
            .matches(/^\d{10}$/, "Must be 10 digits"),
          role: Yup.string().required("Required"),
        }),
  });

  return (
    <motion.div
      className="relative bg-cover bg-center h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1674027392887-751d6396b710?q=80&w=1332&auto=format&fit=crop')",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/30 border border-white/20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              address: "",
              contactNumber: "",
              role: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {backendError && (
                  <div className="text-sm text-red-500 text-center">
                    {backendError}
                  </div>
                )}

                <FieldInput
                  label="Email"
                  name="email"
                  type="email"
                  onFocus={handleFieldChange}
                />
                <FieldInput
                  label="Password"
                  name="password"
                  type="password"
                  onFocus={handleFieldChange}
                />

                {!isLogin && (
                  <>
                    <FieldSelect
                      label="Role"
                      name="role"
                      options={[
                        { label: "Select Role", value: "" },
                        { label: "Buyer", value: "customer" },
                        { label: "Seller", value: "seller" },
                      ]}
                      onFocus={handleFieldChange}
                    />
                    <FieldInput
                      label="Username"
                      name="username"
                      onFocus={handleFieldChange}
                    />
                    <FieldInput
                      label="Address"
                      name="address"
                      onFocus={handleFieldChange}
                    />
                    <FieldInput
                      label="Contact Number"
                      name="contactNumber"
                      onFocus={handleFieldChange}
                    />
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition"
                >
                  {isLogin ? "Login" : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-center text-white">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleAuthMode}
              className="text-indigo-300 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const FieldInput = ({ label, name, type = "text", onFocus }) => (
  <div>
    <label htmlFor={name} className="block text-sm text-white mb-1">
      {label}
    </label>
    <Field
      id={name}
      name={name}
      type={type}
      onFocus={onFocus}
      placeholder={`Enter your ${label.toLowerCase()}`}
      className="w-full px-3 py-2 rounded-md bg-white/60 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-600 text-sm font-medium"
    />
  </div>
);

const FieldSelect = ({ label, name, options, onFocus }) => (
  <div>
    <label htmlFor={name} className="block text-sm text-white mb-1">
      {label}
    </label>
    <Field
      as="select"
      name={name}
      id={name}
      onFocus={onFocus}
      className="w-full px-3 py-2 rounded-md bg-white/60 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Field>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-600 text-sm font-medium"
    />
  </div>
);

export default Auth;
