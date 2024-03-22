import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Post } from 'src/Schemas/Post.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name)
    private postModel: mongoose.Model<Post>,
  ) {}

  async getAll(): Promise<Post[]> {
    const posts = await this.postModel.find();
    return posts;
  }

  async post(post: Post): Promise<Post> {
    const posts = await this.postModel.create(post);
    return posts;
  }

  async getSinglePost(id: string): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async deleteSinglePost(id: string): Promise<Post> {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async updatePost(id: string, post: Post): Promise<Post> {
    const updated = await this.postModel.findByIdAndUpdate(id, post, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      throw new NotFoundException('Post not found');
    }
    return updated;
  }
}
