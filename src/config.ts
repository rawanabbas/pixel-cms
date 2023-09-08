import { configDotenv } from "dotenv";

configDotenv();
configDotenv({
    path: `.env.${process.env.NODE_ENV}`,
    override: true,
});

export default {
    port: Number(process.env.PORT),
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        name: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        secret: process.env.REDIS_SECRET || "",
    },
    aws: {
        s3: {
            bucket_name: process.env.AWS_S3_BUCKET_NAME,
        },
    },
};
