import { expect, request } from "chai";
import UserModel from "@models/user";
import PostModel from "@models/post";
import { type Application } from "express";
import express from "@src/app";
import { generatePost, generateUser } from "@test/utility";

describe("Authentication API", () => {
    let app: Application;
    beforeEach(async () => {
        app = await express;
    });
    afterEach(() => {
        UserModel.destroy({
            where: {},
        });
    });

    it("should register a user", async () => {
        const mockUser = generateUser();
        const response = await request(app)
            .post("/auth/register")
            .send(mockUser);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id");
        expect(response.body.createdAt).to.exist;
        expect(response.body.updatedAt).to.exist;
    });

    it("should login a user", async () => {
        const mockUser = generateUser();
        await request(app).post("/auth/register").send(mockUser);
        const response = await request(app).post("/auth/login").send(mockUser);
        expect(response.status).to.equal(200);
        expect(response.header).to.have.property("set-cookie");
        expect(response.body).to.have.property("id");
        expect(response.body.createdAt).to.exist;
        expect(response.body.updatedAt).to.exist;
    });

    it("should logout a user", async () => {
        const agent = request.agent(app);
        const mockUser = generateUser();
        await agent.post("/auth/register").send(mockUser);
        await agent.post("/auth/login").send(mockUser);
        const response = await agent.get("/auth/logout");
        expect(response.status).to.equal(204);

        const mockPost = generatePost();
        const postResponse = await agent.post("/posts").field({
            title: mockPost.title,
            body: mockPost.body,
        });
        expect(postResponse.status).to.equal(401);
    });
});
