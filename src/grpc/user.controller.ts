import {
    BadRequestException,
    Controller,
    InternalServerErrorException,
    Inject,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { userRepository } from 'src/store/repositories'; // Ensure the correct import

@Controller()
export class UserController {
    constructor(
        @Inject(userRepository)
        private readonly userRepository: userRepository,
    ) { }

    @GrpcMethod('UserServiceInternal', 'CreateUser')
    async CreateUser({ data }: { data: { userId: string; userName: string } }) {
        const { userId, userName } = data;

        if (!userId || !userName) {
            throw new BadRequestException(
                'Invalid user data: userId and userName are required',
            );
        }
        const result = await this.userRepository.CreateUser(userId, userName);
        if (result instanceof Error) {
            throw new InternalServerErrorException(result.message);
        }
        return {
            ok: true,
            data: result,
        };
    }

    @GrpcMethod('UserServiceInternal', 'Update')
    async Update({ data }: { data: { userId: string; userName: string } }) {
        const { userId, userName } = data;

        if (!userId || !userName) {
            throw new BadRequestException(
                'Invalid user data: userId and userName are required',
            );
        }
        const result = await this.userRepository.Update(userId, userName);
        if (result instanceof Error) {
            throw new InternalServerErrorException(result.message);
        }
        return {
            ok: true,
            data: result,
        };
    }
    @GrpcMethod('UserServiceInternal', 'GetUser')
    async GetUser({ data }: { data: { userId: string } }) {
        const { userId } = data;

        if (!userId) {
            throw new BadRequestException('Invalid user data: userId is required');
        }

        const result = await this.userRepository.GetUser(userId);
        if (result instanceof Error) {
            throw new InternalServerErrorException(result.message);
        }

        return {
            ok: true,
            data: result,
        };
    }
}
