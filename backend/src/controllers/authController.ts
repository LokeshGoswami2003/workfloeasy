import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '6h' });
};

// Signup Controller
export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const accessToken = generateToken(newUser._id.toString());
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true })
        res.json({ message: 'Signup successful and cookie stored' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateToken(user._id.toString());
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true })
        return res.json({ message: 'Login successful and cookie stored' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
