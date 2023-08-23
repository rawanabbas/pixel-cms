import { Route, Post, Get, Body, SuccessResponse } from 'tsoa';
import { Content } from '@models/content';

@Route('contents')
export class ContentController {
  @Get()
  public async getAllContents(): Promise<Content[]> {
    // Fetch all contents from your database or other data sources.
    return [];
  }

  @Post()
  @SuccessResponse('201', 'Created')
  public async createContent(
    @Body() requestBody: Content
  ): Promise<Content> {
    // Save the content to your database or other data sources.
    return {} as Content;
  }
}
