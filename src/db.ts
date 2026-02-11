import { connect } from "mongoose";
import env from "./env.js";


const CONNECTION_STRING = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PWD}@${env.MONGO_CLUSTER}/${env.MONGO_DB}`;

export async function DbConnect() {
  try {
    const _db = await connect(CONNECTION_STRING);
    console.log(`🟢 connected to Atlas Cluster: ${env.MONGO_CLUSTER}`);
    return _db;
  }
  catch (e) {
    console.warn(e);
    return e;
  }
}
