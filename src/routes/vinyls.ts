import { Hono } from 'hono';
import { Vinyl } from "../models/vinyls.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import type { Ivinyl } from '../models/vinyls.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { vinylService } from '../services/vinyls-services.js';

const api = new Hono();

// Gérant + Disquaire peuvent lister
api.get('/', requireAuth, async (c) => {
    const { genre, status, group_id, minPrice, maxPrice } = c.req.query();
    
    const filter: any = {};
    if (genre) filter.genre = genre;
    if (status) filter.status = status;
    if (group_id) filter.group_id = group_id;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    const vinyls = await Vinyl.find(filter);
    return c.json(vinyls, OK);
});

// Gérant + Disquaire peuvent voir un vinyl
api.get('/:id', requireAuth, async (c) => {
    const vinyl = await vinylService.fetchById(c.req);  
    if (!vinyl) {
        return c.text('Vinyl not found', BAD_REQUEST);
    }
    return c.json(vinyl, OK);
});

// Seulement le gérant peut créer
api.post('/', requireAuth, requireRole(['gerant']), async (c) => {
    try {
        const body = await c.req.json<Ivinyl>();
        const newVinyl = new Vinyl(body);
        const savedVinyl = await newVinyl.save();
        return c.json(savedVinyl, CREATED);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return c.json({ error: 'Validation failed', details: messages }, BAD_REQUEST);
        }
        if (error instanceof SyntaxError) {
            return c.json({ error: 'Invalid JSON' }, BAD_REQUEST);
        }
        return c.json({ error: 'Error creating vinyl' }, INTERNAL_SERVER_ERROR);
    }
});

// Gérant + Disquaire peuvent éditer
api.patch('/:id', requireAuth, async (c) => {
    const { id } = c.req.param();
    try {
        const updateData = await c.req.json<Ivinyl>();
        const tryToUpdate = await Vinyl.findByIdAndUpdate(id, updateData, { 
            returnDocument: 'after',
            runValidators: true
        });
        if (!tryToUpdate) {
            return c.text('Vinyl not found', BAD_REQUEST);
        }
        return c.json(tryToUpdate, OK);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return c.json({ error: 'Validation failed', details: messages }, BAD_REQUEST);
        }
        if (error instanceof SyntaxError) {
            return c.json({ error: 'Invalid JSON' }, BAD_REQUEST);
        }
        return c.json({ error: 'Error updating vinyl' }, BAD_REQUEST);
    }
});

// Seulement le gérant peut supprimer
api.delete('/:id', requireAuth, requireRole(['gerant']), async (c) => {
    const { id } = c.req.param();
    const tryToDelete = await Vinyl.findByIdAndDelete(id);
    if (!tryToDelete) {
        return c.text('Vinyl not found', BAD_REQUEST);
    }
    return c.json(tryToDelete, OK);
});

export default api;