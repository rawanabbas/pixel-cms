import { Route, Tags, Post, Get, Body, Request } from "tsoa";
import UserModel, { UserAttributes } from "@models/user";
import { compare, hash } from "bcrypt";
import type { Request as ExpressRequest } from "express";

const SALT_ROUNDS = 10;

@Route("auth")
@Tags("Authentication")
export class AuthController {
    private async hashPassword_(password: string): Promise<string> {
        return hash(password, SALT_ROUNDS);
    }

    private async comparePasswords_(
        password: string,
        hash: string
    ): Promise<boolean> {
        return compare(password, hash);
    }

    @Post("/login")
    public async login(
        @Body()
        requestBody: Omit<UserAttributes, "id" | "createdAt" | "updatedAt">,
        @Request() request: ExpressRequest
    ): Promise<UserAttributes> {
        const session = request.session;
        const user = await UserModel.findOne({
            where: { username: requestBody.username },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordMatching = await this.comparePasswords_(
            requestBody.password,
            user.password
        );
        if (!isPasswordMatching) {
            throw new Error("Invalid password");
        }
        user.password = undefined as unknown as string;
        session.user = user;
        return user;
    }

    @Post("/register")
    public async register(
        @Body()
        requestBody: Omit<UserAttributes, "id" | "createdAt" | "updatedAt">,
        @Request() request: ExpressRequest
    ): Promise<UserAttributes> {
        const session = request.session;
        requestBody.password = await this.hashPassword_(requestBody.password);
        const user = await UserModel.create(requestBody);
        user.password = undefined as unknown as string;
        session.user = user;
        return user;
    }

    @Get("/logout")
    public async logout(@Request() request: ExpressRequest): Promise<void> {
        const session = request.session;
        session.user = undefined;
    }
}
