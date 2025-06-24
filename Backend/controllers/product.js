import Product from "../models/product.js";
// Function to fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

// Function to fetch a product by ID
export const getProductById = (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = Product.find((p) => p._id === productId);
  if (product) {
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};
