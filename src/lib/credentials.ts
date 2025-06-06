export const MONGO_URI = process.env.MONGO_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
export const AWS_SECRET_ACCESS_KEY = process.env
  .AWS_SECRET_ACCESS_KEY as string;
export const AWS_REGION = process.env.AWS_REGION as string;
export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET as string;

export const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
export const GOOGLE_MAPS_MAP_ID = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID as string;

export const MAIL_SMTP_HOST = process.env.MAIL_SMTP_HOST as string;
export const MAIL_SMTP_PORT = process.env.MAIL_SMTP_PORT as string;

export const MAIL_SMTP_USERNAME = process.env.MAIL_SMTP_USERNAME as string;
export const MAIL_SMTP_PASSWORD = process.env.MAIL_SMTP_PASSWORD as string;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const WESTEND_RPC = "wss://westend-rpc.polkadot.io";

// Use your own Westend testnet address here
export const RECEIVER_ADDRESS =
  "5GpGw1v4RL2hCC9She6zxPUze8t3EfSfNaudEtuxnj4CUa7N";
