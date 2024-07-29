import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';// Ensure this is the correct path to your user model

const JWT_SECRET = process.env.JWT_SECRET; // Load from .env file

// Define a custom property for the Request type
interface CustomRequest extends Request {
    _id: string;
}

// Middleware to check for JWT in the request headers
const requireUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req._id = decoded._id;// Add user information to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default requireUser;
