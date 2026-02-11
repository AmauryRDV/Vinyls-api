interface Env {
  MONGO_USER: string;
  MONGO_PWD: string;
  MONGO_CLUSTER: string;
  MONGO_DB: string;
  SERVER_PORT: string;
  JWT_SECRET: string;
}

const env: Env = {
  MONGO_USER: process.env.MONGO_USER || '',
  MONGO_PWD: process.env.MONGO_PWD || '',
  MONGO_CLUSTER: process.env.MONGO_CLUSTER || '',
  MONGO_DB: process.env.MONGO_DB || '',
  SERVER_PORT: process.env.SERVER_PORT || '3000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
};

export default env;
