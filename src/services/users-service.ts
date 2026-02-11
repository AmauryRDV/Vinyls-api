import { User } from '../models/users.js';
import type { IUser } from '../models/users.js';
import bcrypt from 'bcrypt';

export const userService = {
    login: async (req): Promise<{ ok: boolean; data?: any; message?: string }> => {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return { ok: false, message: 'Email et mot de passe requis' };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { ok: false, message: 'Email ou mot de passe incorrect' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { ok: false, message: 'Email ou mot de passe incorrect' };
        }

        return {
            ok: true,
            data: {
                _id: user._id,
                email: user.email,
                role: user.role,
                password: user.password
            }
        };
    }
};
