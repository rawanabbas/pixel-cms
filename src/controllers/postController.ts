import {
    Route,
    Tags,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Path,
    SuccessResponse,
    Security,
    Request,
    FormField,
    UploadedFile,
} from "tsoa";
import PostModel, { PostAttributes } from "@models/post";
import type { Request as ExpressRequest } from "express";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { s3 } from "@src/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import config from "@src/config";

@Route("posts")
@Tags("Post")
export class PostController {
    @Get("/")
    public async getAll(): Promise<PostAttributes[]> {
        return await PostModel.findAll();
    }

    @Get("/:id")
    public async getById(@Path() id: number): Promise<PostAttributes | null> {
        return await PostModel.findByPk(id);
    }

    @Post("/")
    @Security("sessionAuth")
    public async create(
        @Request() req: ExpressRequest,
        @FormField("title") title: string,
        @FormField("body") body: string,
        @UploadedFile("image") image?: Express.Multer.File
    ): Promise<PostAttributes> {
        if (image) {
            const imgExtention = extname(image.originalname);
            const imgFilename = `${Date.now()}_${uuidv4()}${imgExtention}`;
            const params = new PutObjectCommand({
                Bucket: config.aws.s3.bucket_name,
                Key: imgFilename,
                Body: image.buffer,
            });
            try {
                const response = await s3.send(params);
                console.log(response);
                return await PostModel.create({
                    title,
                    body,
                    image: imgFilename,
                    userId: req.session.user!.id,
                });
            } catch (e) {
                console.error(e);
                return Promise.reject(e);
            }
        }

        return await PostModel.create({
            title,
            body,
            userId: req.session.user!.id,
        });
    }

    @Put("/:id")
    @Security("sessionAuth")
    @SuccessResponse("200", "Updated")
    public async update(
        @Path() id: number,
        @Body()
        requestBody: Omit<PostAttributes, "id" | "createdAt" | "updatedAt">
    ): Promise<PostAttributes> {
        const post = await PostModel.findByPk(id);
        if (post) {
            await post.update(requestBody);
            return post;
        }
        throw new Error("Post not found");
    }

    @Delete("/:id")
    @Security("sessionAuth")
    @SuccessResponse("204", "Deleted")
    public async delete(@Path() id: number): Promise<void> {
        const post = await PostModel.findByPk(id);
        if (post) {
            await post.destroy();
        } else {
            throw new Error("Post not found");
        }
    }
}
