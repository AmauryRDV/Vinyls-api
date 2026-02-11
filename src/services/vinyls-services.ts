import { Vinyl } from "../models/vinyls.js";
import type { IVinyl } from '../models/vinyls.js';

export const vinylService = {

    fetchAll : async (req) : Promise <IVinyl[]> => {
        return await Vinyl.find();
    },
    fetchById : async (req) : Promise <IVinyl> => {
        const { id } = req.param();
        return await Vinyl.findById(id);
    },

    updateOne : async (req) : Promise <IVinyl> => {
        return await Vinyl.find({});
    },

    createOne : async (req) : Promise <IVinyl> => {
        return await Vinyl.find({});
    },

    deleteOne : async (req) : Promise <IVinyl> => {
        return await Vinyl.find({});
    },
}