import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, AllowNull, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreationAttributes extends Partial<Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>> {
    username: string;
    password: string;
    email: string;
}

@Table
export default class User extends Model<UserAttributes, UserCreationAttributes> {
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

    @AllowNull(false)
    @Column(DataType.STRING)
    email!: string;

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date;
}