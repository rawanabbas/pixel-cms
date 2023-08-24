import { Route, Tags, Post, Get, Put, Delete, Body, Path, SuccessResponse } from 'tsoa';
import PostModel, { PostAttributes } from "@models/post"

@Route('posts')
@Tags('Post')
export class PostController {
    
    @Get('/')
    public async getAll(): Promise<PostAttributes[]> {
        return await PostModel.findAll();
    }

    @Get('/:id')
    public async getById(@Path() id: number): Promise<PostAttributes | null> {
        return await PostModel.findByPk(id);
    }

    @Post('/')
    public async create(@Body() requestBody: Omit<PostAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostAttributes> {
        return await PostModel.create(requestBody);
    }

    @Put('/:id')
    @SuccessResponse('200', 'Updated')
    public async update(@Path() id: number, @Body() requestBody: Omit<PostAttributes, 'id' | 'createdAt' | 'updatedAt'>): Promise<PostAttributes> {
        const post = await PostModel.findByPk(id);
        if (post) {
            await post.update(requestBody);
            return post;
        }
        throw new Error('Post not found');
    }

    @Delete('/:id')
    @SuccessResponse('204', 'Deleted')
    public async delete(@Path() id: number): Promise<void> {
        const post = await PostModel.findByPk(id);
        if (post) {
            await post.destroy();
        } else {
            throw new Error('Post not found');
        }
    }
}
