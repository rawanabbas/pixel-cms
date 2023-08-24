import { expect, request } from "chai";
import UserModel, { UserCreationAttributes } from "@models/user";
import { faker } from "@faker-js/faker";
import { type Application } from "express";
import express from "@src/app";

function generateUser(): UserCreationAttributes {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
}

describe("Users API", () => {
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
        const mockUser = generateUser();
        await request(app).post("/auth/register").send(mockUser);
        await request(app).post("/auth/login").send(mockUser);
        const response = await request(app).get("/auth/logout");
        expect(response.status).to.equal(204);
    });
});
