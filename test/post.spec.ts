import { expect, request } from "chai";
import PostModel, { PostCreationAttributes } from "@models/post";
import UserModel, { UserCreationAttributes } from "@models/user";
import { faker } from "@faker-js/faker";
import { type Application } from "express";
import express from "@src/app";

function generatePost(): PostCreationAttributes {
    return {
        title: faker.lorem.words(3),
        body: faker.lorem.paragraphs(3),
        image: faker.image.url(),
    };
}

function generateUser(): UserCreationAttributes {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
}

describe("Posts API", () => {
    let app: Application;
    beforeEach(async () => {
        app = await express;
    });
    afterEach(() => {
        PostModel.destroy({
            where: {},
        });
        UserModel.destroy({
            where: {},
        });
    });

    it("should create a post", async () => {
        const agent = request.agent(app);
        const mockUser = generateUser();
        await agent.post("/auth/register").send(mockUser);
        const mockPost = generatePost();
        const response = await agent.post("/posts").send(mockPost);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id");
        expect(response.body).to.be.like(mockPost);
        expect(response.body.createdAt).to.exist;
        expect(response.body.updatedAt).to.exist;
    });

    it("should get all posts", async () => {
        const mockPosts = faker.helpers.multiple(generatePost, {
            count: 5,
        });
        await PostModel.bulkCreate(mockPosts);
        const response = await request(app).get("/posts");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.lengthOf(mockPosts.length);
    });

    it("should get a post by id", async () => {
        const mockPost = generatePost();
        const post = await PostModel.create(mockPost);
        const response = await request(app).get(`/posts/${post.id}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.like(mockPost);
    });

    it("should update a post", async () => {
        const agent = request.agent(app);
        const mockUser = generateUser();
        await agent.post("/auth/register").send(mockUser);
        const mockPost = generatePost();
        const updatedMockPost = generatePost();
        const post = await PostModel.create(mockPost);
        const response = await agent
            .put(`/posts/${post.id}`)
            .send(updatedMockPost);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.like(updatedMockPost);
    });

    it("should delete a post by id", async () => {
        const agent = request.agent(app);
        const mockUser = generateUser();
        await agent.post("/auth/register").send(mockUser);
        const mockPost = generatePost();
        const post = await PostModel.create(mockPost);
        const response = await agent.delete(`/posts/${post.id}`);
        expect(response.status).to.equal(204);
        expect(await PostModel.findByPk(post.id)).to.be.null;
    });
});
