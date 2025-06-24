import Product from "../models/product.js";
import order from "../models/order.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const getProducts = async(req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user.user._id });
        if (!products || products.length === 0) {   
            return res.status(200).json({ message: 'No products found for this seller' });
        }
        res.status(200).json({ message: 'Products retrieved successfully', products });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving products', error: error.message });
    }
};

const addProduct = async(req, res) => {
    try{
        if(req.user.user.role !== 'seller') {
            return res.status(403).json({ message: 'You are not authorized to add products' }); 
        }
        const productData = req.body;
        const sellerId = req.user.user._id;
        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({ message: 'Invalid seller ID' });
        }
        const product = new Product({
            ...productData,
            sellerId: sellerId
        });
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product: productData });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

const removeProduct = async(req, res) => {
    try{
        if(req.user.user.role !== 'seller') {
            return res.status(403).json({ message: 'You are not authorized to remove products' });
        }
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await Product.findOne({_id:productId});
        if (!product){
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.sellerId.toString() !== req.user.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to remove this product' });
        }
        await product.deleteOne({ _id: productId });
        res.status(200).json({ message: 'Product removed successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error removing product', error: error.message });
    }
};

const updateProduct = async(req, res) => {
    try{
        if(req.user.user.role !== 'seller') {
            return res.status(403).json({ message: 'You are not authorized to update products' });
        }
        const productId = req.params.id;
        let updatedData = req.body;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await Product.findOne({_id :productId});
        console.log(product);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.sellerId.toString() !== req.user.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }
        updatedData= await Product.findByIdAndUpdate(productId, updatedData, { new: true });
        res.status(200).json({ message: `Product with ID ${productId} updated successfully`, updatedData });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

const getSellerOrders = async(req, res) => {
    try {
        if (req.user.user.role !== 'seller') {
            return res.status(403).json({ message: 'You are not authorized to view orders' });
        }
        const orders = await order.find({});
        console.log(orders);
        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this seller' });
        }
        const filteredOrders = await Promise.all(
            orders.map(async (order) => {
                if (!order.items || order.items.length === 0) {
                    return null;
                }
                const filteredProducts = await Promise.all(
                    order.items.map(async (item) => {
                        const productDetails = await Product.findById(item.product);
                        if (productDetails && productDetails.sellerId.toString() === req.user.user._id.toString()) {
                            return item;
                        }
                        return null;
                    })
                );
                const validProducts = filteredProducts.filter(product => product !== null);
                if (validProducts.length === 0) {
                    return null;
                }
                return {
                    ...order._doc,
                    products: validProducts,
                };
            })
        );
        const sellerOrders = filteredOrders.filter(order => order !== null);
        if (!sellerOrders || sellerOrders.length === 0) {
            return res.status(200).json({ message: 'No orders found for this seller' });
        }
        const populatedOrders = await order.populate(sellerOrders, { path: 'user', select: 'username email' });
        res.status(200).json({ message: 'Orders retrieved successfully', orders: {...populatedOrders,shippingAddress:orders.shippingAddress} });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

const changeOrderStatus = async (req, res) => {
    try {
        const user = req.user.user;
        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'You are not authorized to update the status of orders' });
        }

        const { orderId } = req.params;
        const { itemIds, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const orderData = await order.findById(orderId);
        if (!orderData) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const updatedItems = orderData.items.map(item => {
            if (itemIds.includes(item._id.toString())) {
                item.status=status;
            }
            return item;
        });
        orderData.items = updatedItems;
        await orderData.save();

        res.status(200).json({ message: 'Order status updated successfully', order: orderData });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

export { addProduct, removeProduct, updateProduct, getProducts, getSellerOrders, changeOrderStatus };
