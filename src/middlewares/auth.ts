import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status-codes';
import env from '../env.js';

interface JwtPayload {
    sub: string;
    email: string;
    role: 'gerant' | 'disquaire';
}


export const requireAuth = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Token manquant' }, UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    try {
        const decoded = await verify(token, env.JWT_SECRET, 'HS256') as unknown as JwtPayload;
        c.set('user', decoded);
        await next();
    } catch (error) {
        return c.json({ error: 'Token invalide ou expiré' }, UNAUTHORIZED);
    }
};


export const requireRole = (allowedRoles: Array<'gerant' | 'disquaire'>) => {
    return async (c: Context, next: Next) => {
        const user = c.get('user') as JwtPayload | undefined;
        
        if (!user) {
            return c.json({ error: 'Authentification requise' }, UNAUTHORIZED);
        }

        if (!allowedRoles.includes(user.role)) {
            return c.json({ 
                error: 'Accès refusé', 
                message: `Cette action nécessite le rôle: ${allowedRoles.join(' ou ')}` 
            }, FORBIDDEN);
        }

        await next();
    };
};
