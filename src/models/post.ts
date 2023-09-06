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
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import User from "@models/user";
export interface PostAttributes {
    id: number;
    title: string;
    body: string;
    image?: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostCreationAttributes
    extends Partial<Omit<PostAttributes, "id" | "createdAt" | "updatedAt">> {
    title: string;
    body: string;
    userId: number;
}

@Table
export default class Post extends Model<
    PostAttributes,
    PostCreationAttributes
> {
    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    title!: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    body!: string;

    @AllowNull(true)
    @Column(DataType.STRING)
    image?: string;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId!: number;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;

    @BelongsTo(() => User)
    user!: User;
}
