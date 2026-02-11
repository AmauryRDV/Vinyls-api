import { group } from 'console';
import { model, Schema } from 'mongoose';

export interface IGroup {
    name: string;
    genre: string;
    bio: string;
}

const groupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    genre: { type: String, required: true },
    bio: { type: String, required: true },
});

const Group = model<IGroup>('Groups', groupSchema);

export { Group };
