import User from '../models/user.js';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
const handleRegister=async (req, res) => {
    const { username, email, password, contactNumber, address } = req.body;
    const existingUser = await User.find({ email: email });
    console.log(existingUser);
    if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({
        username,
        email,
        password,
        contactNumber,
        address
    });
    await user.save();
    const token = jwt.sign({ user:user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.setHeader('Set-Cookie', cookie.serialize('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }));
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,                // true only if using HTTPS
        sameSite: 'Lax',              // 'None' only if cross-site & HTTPS
        maxAge: 2 * 60 * 60 * 1000,   // 2 hours
      });
    res.status(201).json({ message: 'User registered successfully',user: user });
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const user= await User.findOne({ email:email });
    if (!user || user.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ user:user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // res.setHeader('Set-Cookie', cookie.serialize('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }));
    res.cookie('token', token, {
        httpOnly: true,
        secure: false,                // true only if using HTTPS
        sameSite: 'Lax',              // 'None' only if cross-site & HTTPS
        maxAge: 2 * 60 * 60 * 1000,   // 2 hours
      });
    res.status(200).json({ message: 'Login successful' , user:user});
}

const handleLogout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,                // true only if using HTTPS
        sameSite: 'Lax',              // 'None' only if cross-site & HTTPS
    });
    return res.json({ message: 'Logged out successfully' });
}

export { handleRegister, handleLogin ,handleLogout };