import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Function to generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_EMAIL, // Your email
            pass: process.env.MY_PASSWORD // Your password
        }
    });

    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    };

    return transporter.sendMail(mailOptions);
};

// **1️⃣ Forgot Password API (Send OTP)**
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
        await user.save();

        await sendEmail(email, otp);

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending OTP" });
    }
};

// **2️⃣ Verify OTP & Reset Password API**
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null; // Clear OTP after use
        user.otpExpires = null;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error resetting password" });
    }
};


// Route for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }


}

// Route for user registeration 
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })
    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })

    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Get user Profile information
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId; // Extracted from the token by authUser middleware
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Transform `cartData` into an array format
        const formattedCartData = [];
        for (const itemId in user.cartData) {
            const itemColors = user.cartData[itemId];
            for (const color in itemColors) {
                formattedCartData.push({
                    itemId,
                    color,
                    quantity: itemColors[color],
                });
            }
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                cartData: formattedCartData,
            },
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { loginUser, registerUser, adminLogin, getUserProfile }