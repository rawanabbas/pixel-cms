import { PostCreationAttributes } from "@models/post";
import { UserCreationAttributes } from "@models/user";
import { faker } from "@faker-js/faker";

export function generatePost(userId?: number): PostCreationAttributes {
    return {
        title: faker.lorem.words(3),
        body: faker.lorem.paragraphs(3),
        userId: userId || 1,
    };
}

export function generateUser(): UserCreationAttributes {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password(),
    };
}
