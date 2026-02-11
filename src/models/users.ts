import { model, Schema } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    role: 'gerant' | 'disquaire';
}

const userSchema = new Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: {
            values: ['gerant', 'disquaire'],
            message: 'Le rôle doit être: gerant ou disquaire'
        }
    },
}, {
    timestamps: true
});

const User = model<IUser>('Users', userSchema);

export { User };
