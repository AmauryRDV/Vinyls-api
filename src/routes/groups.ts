import { Hono } from 'hono';
import { Group } from "../models/groups.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
import type { IGroup } from '../models/groups.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { groupService } from '../services/groups-services.js';

const api = new Hono();

// Gérant + Disquaire peuvent lister
api.get('/', requireAuth, async (c) => {
    const groups = await groupService.fetchAll(c.req);  
    return c.json(groups, OK);
});

// Gérant + Disquaire peuvent voir un groupe
api.get('/:id', requireAuth, async (c) => {
    const group = await groupService.fetchById(c.req);  
    if (!group) {
        return c.text('Group not found', BAD_REQUEST);
    }
    return c.json(group, OK);
});

// Seulement le gérant peut créer
api.post('/', requireAuth, requireRole(['gerant']), async (c) => {
    try {
        const body = await c.req.json<IGroup>();
        const newGroup = new Group(body);
        const savedGroup = await newGroup.save();
        return c.json(savedGroup, CREATED);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return c.json({ error: 'Validation failed', details: messages }, BAD_REQUEST);
        }
        if (error instanceof SyntaxError) {
            return c.json({ error: 'Invalid JSON' }, BAD_REQUEST);
        }
        return c.json({ error: 'Error creating group' }, INTERNAL_SERVER_ERROR);
    }
});

// Gérant + Disquaire peuvent éditer
api.put('/:id', requireAuth, async (c) => {
    const { id } = c.req.param();
    try {
        const updateData = await c.req.json<IGroup>();
        const tryToUpdate = await Group.findByIdAndUpdate(id, updateData, { 
            returnDocument: 'after',
            runValidators: true
        });
        if (!tryToUpdate) {
            return c.text('Group not found', BAD_REQUEST);
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
        return c.json({ error: 'Error updating group' }, BAD_REQUEST);
    }
});

// Seulement le gérant peut supprimer
api.delete('/:id', requireAuth, requireRole(['gerant']), async (c) => {
    const { id } = c.req.param();
    const tryToDelete = await Group.findByIdAndDelete(id);
    if (!tryToDelete) {
        return c.text('Group not found', BAD_REQUEST);
    }
    return c.json(tryToDelete, OK);
});

export default api;