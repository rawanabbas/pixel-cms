import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, AllowNull, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
export interface PostAttributes {
    id: number;
    title: string;
    body: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PostCreationAttributes extends Partial<Omit<PostAttributes, 'id' | 'createdAt' | 'updatedAt'>> {
    title: string;
    body: string;
}

@Table
export default class Post extends Model<PostAttributes, PostCreationAttributes> {
 
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

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}