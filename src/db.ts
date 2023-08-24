import config from '@src/config';
import { Sequelize } from 'sequelize-typescript';

export default new Sequelize({
    dialect: 'postgres',
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    username: config.db.username,
    password: config.db.password,
    models: [__dirname + '/models'],
    logging: false
});