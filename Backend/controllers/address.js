import Address from "../models/address.js";

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const addresses = await Address.find({ user: userId });
    res
      .status(200)
      .json({ message: "Address fetched successfully", addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addAddress = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const { fullName, line1, city, pin, phone } = req.body;

    const newAddress = new Address({
      user: userId,
      fullName,
      line1,
      city,
      pin,
      phone,
    });

    await newAddress.save();
    console.log("done");
    res
      .status(201)
      .json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, line1, city, pin, phone } = req.body;

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { fullName, line1, city, pin, phone },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res
      .status(200)
      .json({
        message: "Address updated successfully",
        address: updatedAddress,
      });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getAddresses, addAddress, updateAddress, deleteAddress };
