import type { ObjectId } from "mongoose";
import { model, Schema } from 'mongoose';

export interface Ivinyl {
    title: string;
    group_id: ObjectId;
    release_year: number;
    status: string;
    price: number;
    stock: number;
    genre: string;
}

const vinylSchema = new Schema<Ivinyl>({
    title: { type: String, required: true },
    group_id: { type: Schema.Types.ObjectId, ref: 'Groups', required: true },
    release_year: { 
        type: Number, 
        required: true,
        min: [1900, 'L\'année de sortie doit être supérieure à 1900'],
        max: [new Date().getFullYear() + 1, 'L\'année de sortie ne peut pas être dans le futur']
    },
    status: { 
        type: String, 
        required: true,
        enum: {
            values: ['neuf', 'occasion', 'collector', 'très usé', 'abimé'],
            message: 'Le statut doit être: neuf, occasion, collector, très usé ou abimé'
        }
    },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'Le prix ne peut pas être négatif']
    },
    stock: { 
        type: Number, 
        required: true,
        min: [0, 'Le stock ne peut pas être négatif']
    },
    genre: { type: String, required: true },
});

const Vinyl = model<Ivinyl>('Vinyls', vinylSchema);

export { Vinyl };