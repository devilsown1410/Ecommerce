import * as yup from 'yup';
const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

const registerSchema = yup.object().shape({
    username: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
    contactNumber: yup.string().matches(/^\d{10}$/, 'Contact number must be 10 digits').required('Contact number is required'),
    address: yup.string().required('Address is required'),
});


const validateLogin = async (req, res, next) => {
    try {
        await loginSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const validateRegister = async (req, res, next) => {
    console.log(req.body);
    
    try {
        await registerSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export { validateLogin, validateRegister };