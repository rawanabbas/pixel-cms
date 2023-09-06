import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    AllowNull,
    PrimaryKey,
    AutoIncrement,
    HasMany,
} from "sequelize-typescript";
import Post from "@models/post";
export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreationAttributes
    extends Omit<UserAttributes, "id" | "createdAt" | "updatedAt"> {
    username: string;
    password: string;
}

@Table
export default class User extends Model<
    UserAttributes,
    UserCreationAttributes
> {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    username!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;

    @HasMany(() => Post)
    posts!: Post[];
}
