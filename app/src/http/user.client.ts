import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { UserEntity } from "../store/entities";
import { GRPC_PORT, HTTP_PORT } from '../constraint';
import { cwd } from "process";
import { Controller, Get, Post, Put } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { UserModule } from "./user.module";
import { userRepository } from "src/store/repositories";
@Controller()
export class UserController {
    private grpcClient;
    constructor(private readonly userService: userRepository) {
        const PROTO_PATH = [
            require.resolve(`${cwd()}/proto/user.proto`),
        ];
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
            grpc.credentials.createInsecure()
        );
    }
    @Get("/user")
    async GetUser(userId: string): Promise<UserEntity> {
        return new Promise<UserEntity>((resolve, reject) => {
            this.grpcClient.GetUser({ userId }, (err: any, res: any) => {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
    @Post("/user")
    async CreateUser(data: { userId: string; userName: string }) {
        return new Promise<any>((resolve, reject) => {
            this.grpcClient.CreateUser(data, (err: any, res: any) => {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
    @Put("/user")
    async Update(data: { userId: string; userName: string }) {
        return new Promise<any>((resolve, reject) => {
            this.grpcClient.Update(data, (err: any, res: any) => {
                if (err) return reject(err);
                return resolve(res);
            });
        });
    }
}