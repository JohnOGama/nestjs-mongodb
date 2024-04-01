import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as Book } from 'src/Schemas/Post.schema';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPost(): Promise<Book[]> {
    return this.postService.getAll();
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<Book> {
    return this.postService.getSinglePost(id);
  }

  @Delete(':id')
  async deletePost(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.postService.deleteSinglePost(id);
  }

  @Post()
  async createPost(
    @Body()
    post: CreatePostDto,
  ): Promise<Book> {
    return this.postService.post(post);
  }

  @Put(':id')
  async updatePost(
    @Param('id')
    id: string,

    @Body()
    post: any,
  ): Promise<Book> {
    return this.postService.updatePost(id, post);
  }
}
