import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { config } from 'dotenv';
import * as dbConfig from '../config/config';
import utility from '../../helpers/utility';

config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

const dbUrl = dbConfig[env];

const sequelize = new Sequelize(process.env[dbUrl.use_env_variable], dbUrl);

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  db[modelName].paginate = utility.paginate(db[modelName]);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
