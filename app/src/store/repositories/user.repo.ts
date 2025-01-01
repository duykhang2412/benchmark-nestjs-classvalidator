import { logger } from "@packages/common";
import { UserEntity } from "../entities/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { DATA_USER_DATABASE } from "src/constraint";
import {
    Collection,
    IndexSpecification,
} from 'mongodb';
import { MongoDb } from "../mongo-db";

@Injectable()
export class userRepository {
    private readonly logger = new Logger(userRepository.name);
    private readonly collection!: Collection<UserEntity>;
    constructor(private readonly mongoDb: MongoDb) {
        this.collection = this.mongoDb.getCollection(
            DATA_USER_DATABASE.dbName,
            DATA_USER_DATABASE.collectionName,
        );

        this.ensureIndex();
    }
    private async ensureIndex(): Promise<void> {
        try {
            const indexSpec: IndexSpecification = { userId: 1 };

            const indexes = await this.collection.listIndexes().toArray();
            const indexExists = indexes.some((index) => index.key === indexSpec);

            if (!indexExists) {
                await this.collection.createIndex(indexSpec);
            }
        } catch (e) {
            this.logger.warn((e as Error).message);
        }
    }
    async CreateUser(
        userId: string,
        userName: string,
    ): Promise<UserEntity | Error> {
        try {
            const now = new Date().toISOString();
            const entity: UserEntity = {
                userId,
                userName,
                createdTime: now,
                updatedTime: now,
            };

            await this.collection.insertOne(entity);
            return entity;
        } catch (error) {
            logger.error(error);
            return error as Error;
        }
    }

    async Update(
        userId: string,
        userName: string,
    ): Promise<UserEntity | Error> {
        try {

            const updateRequest = {
                userId,
                userName,
            };

            const updateResult = await this.collection.updateOne(
                { userId },
                { $set: updateRequest },
            );

            if (updateResult.matchedCount === 0) {
                logger.warn(".update", { userId, userName });
            }

            return this.GetUser(userId);
        } catch (error) {
            logger.error(error);
            return error as Error;
        }
    }

    async GetUser(
        userId: string,
    ): Promise<UserEntity | Error> {
        try {
            const result = await this.collection.findOne({ userId });
            if (result === null) {
                logger.warn(".getUser", { userId });

                return new Error("User not found");
            }
            return result;
        } catch (error) {
            logger.error(error);

            return error as Error;
        }
    }
}