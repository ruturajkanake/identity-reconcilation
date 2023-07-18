import { Sequelize } from "sequelize-typescript";
import Contact from "../models/contact.model";
import { config } from "dotenv";

config();

const DB_NAME = process.env.DB_NAME || 'bitespeed';
const DB_USER = process.env.DB_USER || 'root';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PASS = process.env.DB_PASS || '';

/**
 * Connect to MySQL via Sequelize
 */
const connection = new Sequelize({
    port: 3306,
    database: DB_NAME,
    dialect: 'mysql',
    username: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    models: [Contact]
});

export default connection;
