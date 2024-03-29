import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "@build/routes"; // This will be generated by tsoa
import db from "@src/db";
import config from "@src/config";
import swaggerUi from "swagger-ui-express";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import session from "express-session";

const createApp = async () => {
    const app = express();

    // Database Setup
    await db.authenticate();
    await db.sync();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Redis Setup
    const redisClient = createClient({
        socket: {
            host: config.redis.host,
            port: config.redis.port,
        },
    });

    redisClient.connect().catch(console.error);
    const redisStore = new RedisStore({
        client: redisClient,
    });

    redisClient.on("connect", () => {
        console.log("Redis client connected");
    });

    redisClient.on("error", (err) => {
        console.log("Something went wrong with Redis " + err);
    });

    // Session Setup
    app.use(
        session({
            secret: config.redis.secret,
            resave: false,
            saveUninitialized: false,
            store: redisStore,
        })
    );

    // Swagger
    app.use("/docs", swaggerUi.serve, async (_: Request, res: Response) => {
        const spec = await import("../build/swagger.json", {
            assert: { type: "json" },
        });

        return res.send(swaggerUi.generateHTML(spec.default));
    });

    // Register our generated routes
    RegisterRoutes(app);

    app.listen(config.port, () => {
        console.log("Server is running on port 3000.");
    });

    return app;
};

export default createApp();
