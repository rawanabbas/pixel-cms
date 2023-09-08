import { expect, request } from "chai";
import PostModel from "@models/post";
import UserModel from "@models/user";
import { type Application } from "express";
import express from "@src/app";
import fs from "fs";
import { join } from "path";
import { generateUser, generatePost } from "@test/utility";
import { faker } from "@faker-js/faker";

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
        fs.readdir(join(process.cwd(), "tmp"), (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(join(process.cwd(), "tmp", file), (e) => {
                    if (e) throw e;
                });
            }
        });
    });

    it("should create a post", async () => {
        const agent = request.agent(app);

        const mockUser = generateUser();
        const userResponse = await agent.post("/auth/register").send(mockUser);

        const mockPost = generatePost(userResponse.body.id);

        const response = await agent.post("/posts").field({
            title: mockPost.title,
            body: mockPost.body,
            image: "",
        });
        // This line is for testing file upload and is commented out to prevent exhausting resources
        // .attach(
        //     "image",
        //     fs.readFileSync(`${__dirname}/test.jpeg`),
        //     "test.jpeg"
        // );
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id");
        expect(response.body).to.be.like(mockPost);
        expect(response.body.createdAt).to.exist;
        expect(response.body.updatedAt).to.exist;
    });

    it("should get all posts", async () => {
        const mockUser = generateUser();
        const userResponse = await request(app)
            .post("/auth/register")
            .send(mockUser);
        const mockPosts = faker.helpers.multiple(
            () => {
                return generatePost(userResponse.body.id);
            },
            {
                count: 5,
            }
        );
        await PostModel.bulkCreate(mockPosts);
        const response = await request(app).get("/posts");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.lengthOf(mockPosts.length);
    });

    it("should get a post by id", async () => {
        const mockUser = generateUser();
        const userResponse = await request(app)
            .post("/auth/register")
            .send(mockUser);
        const mockPost = generatePost(userResponse.body.id);
        const post = await PostModel.create(mockPost);
        const response = await request(app).get(`/posts/${post.id}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.like(mockPost);
    });

    it("should update a post", async () => {
        const agent = request.agent(app);
        const mockUser = generateUser();
        const userResponse = await agent.post("/auth/register").send(mockUser);

        const mockPost = generatePost(userResponse.body.id);
        const updatedMockPost = generatePost(userResponse.body.id);
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
        const userResponse = await agent.post("/auth/register").send(mockUser);

        const mockPost = generatePost(userResponse.body.id);
        const post = await PostModel.create(mockPost);
        const response = await agent.delete(`/posts/${post.id}`);
        expect(response.status).to.equal(204);
        expect(await PostModel.findByPk(post.id)).to.be.null;
    });
});
