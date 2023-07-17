import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({
    tableName: "contact",
})
export default class Contact extends Model<Contact> {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
    })
    phoneNumber!: string;

    @Column({
        type: DataType.STRING,
    })
    email!: string;

    @Column({
        type: DataType.INTEGER,
    })
    linkedId!: number;

    @Column({
        type: DataType.ENUM('primary', 'secondary'),
        defaultValue: 'primary',
    })
    linkPrecedence!: string;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;

    @DeletedAt
    deletedAt!: Date;
}