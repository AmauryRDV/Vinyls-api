import { Group } from "../models/groups.js";
import type { IGroup } from '../models/groups.js';

export const groupService = {

    fetchAll : async (req) : Promise <IGroup[]> => {
        return await Group.find();
    },
    fetchById : async (req) : Promise <IGroup> => {
        const { id } = req.param();
        return await Group.findById(id);
    },

    updateOne : async (req) : Promise <IGroup> => {
        return await Group.find({});
    },

    createOne : async (req) : Promise <IGroup> => {
        return await Group.find({});
    },

    deleteOne : async (req) : Promise <IGroup> => {
        return await Group.find({});
    },
}