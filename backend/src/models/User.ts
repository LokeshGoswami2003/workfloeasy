import mongoose, { Document, Schema } from 'mongoose';

// Define an interface that extends Mongoose's Document interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    // Add any other fields you need
}

// Create a Mongoose schema for the user model
const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Add any other fields here
}, {
    timestamps: true // Optional: adds createdAt and updatedAt fields
});

// Create a Mongoose model for the user schema
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
