import Order from "../models/order.js";

const createOrder = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { items, address, paymentMethod, total } = req.body;
    const order = new Order({
      user: userId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        status: "pending",
      })),
      shippingAddress: {
        fullName: address.fullName,
        line1: address.line1,
        city: address.city,
        pin: address.pin,
        phone: address.phone,
      },
      paymentMethod,
      totalAmount: total,
      taxAmount: total * 0.1,
      shippingFee: 50,
      status: "pending",
      paymentStatus: "completed",
      createdAt: new Date(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .populate("user");
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to cancel order", error: error.message });
  }
};

const editOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.user._id;
    const updateResult = await Order.updateOne(
      { _id: orderId, user: userId },
      { $set: req.body },
      { new: true }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to edit order", error: error.message });
  }
};

export { createOrder, getOrdersByUser, cancelOrder, editOrder };
