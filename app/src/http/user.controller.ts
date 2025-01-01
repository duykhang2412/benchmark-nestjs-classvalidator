import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { UserDto } from '../dto';
import { UserEntity } from '../store/entities';
import { GRPC_PORT } from '../constraint';
import { resolve } from 'path';

@Controller()
export class AppController {
  private readonly grpcClient;

  constructor() {
    const PROTO_PATH = resolve(__dirname, "../../proto/user.proto");
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;
    this.grpcClient = new userProto.UserServiceInternal(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.credentials.createInsecure(),
    );
  }

  private grpcCall<T>(method: string, data: any): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.grpcClient[method](data, (err: any, res: T) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  @Get('/user')
  async getUser(@Query('userId') userId: string): Promise<any> {
    try {
      if (!userId) {
        return { message: 'User ID is required', ok: false };
      }
      const data = await this.grpcCall<UserEntity>('GetUser', { userId });
      console.log('user:', data);
      // const user: UserEntity = data.data;
      // if (!user || !user.userId) {
      //   return { message: 'User not found', ok: false };
      // }
      return { data: data, ok: true };
    } catch (err) {
      console.error('Error fetching user:', err);
      return { error: 'Internal Server Error', ok: false };
    }
  }

  @Post('/user')
  async createUser(@Body() userInfo: UserDto): Promise<any> {
    try {
      if (!userInfo.userId || !userInfo.userName) {
        return { message: 'Invalid user data', ok: false };
      }

      const existingUser = await this.grpcCall<UserEntity>('GetUser', { userId: userInfo.userId });
      if (existingUser) {
        return { message: 'User already exists', ok: false };
      }

      const result = await this.grpcCall<any>('CreateUser', { data: userInfo });
      return { data: result, ok: true };
    } catch (err) {
      console.error('Error creating user:', err);
      return { error: 'Internal Server Error', ok: false };
    }
  }

  @Put('/user')
  async updateUser(@Body() updateInfo: UserDto): Promise<any> {
    try {
      if (!updateInfo.userId) {
        return { message: 'User ID is required', ok: false };
      }

      const result = await this.grpcCall<any>('UpdateUser', { data: updateInfo });
      if (!result.ok) {
        return { message: 'Update failed', ok: false };
      }
      return { data: updateInfo, ok: true };
    } catch (err) {
      console.error('Error updating user:', err);
      return { error: 'Internal Server Error', ok: false };
    }
  }
}
