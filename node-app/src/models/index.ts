'use strict';

import * as fs from 'fs';
import * as path from 'path';
import { Sequelize, DataTypes } from 'sequelize';

import { baseConfig } from './../config';

const databaseInstance: Array<any> = [];

export function setup() {
	if (databaseInstance['core']) {
		return databaseInstance['core'];
	}

	const basename = path.basename(__filename);
	const env = process.env.NODE_ENV || 'local';
	const db = {};

	const config = baseConfig.database[env];

	if (env !== 'local') {
		config.logging = false;
	}
	config.pool = {
		max: 10,
		min: 0,
		idle: 10000,
		evict: 10000,
	};
	// config.timezone = '+08:00';
	config.dialectOptions = {
		dateStrings: true,
		typeCast: true,
	};

	const sequelize: any = new Sequelize(config.database, config.username, config.password, config);
	sequelize
		.authenticate()
		.then(function (err) {
			if (err) {
				console.error('database connection error:', err);
			} else {
				console.log('database connection success');
			}
		})
		.catch(console.error.bind(console, 'database connection error:'));

	fs.readdirSync(__dirname)
		.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
		.forEach((file) => {
			// const model = sequelize['import'](path.join(__dirname, file));
			const model = require(path.join(__dirname, file)).default(sequelize, DataTypes);

			db[model.name] = model;
		});

	Object.keys(db).forEach((modelName) => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});

	db['sequelize'] = sequelize;
	db['Sequelize'] = Sequelize;

	databaseInstance['core'] = db;
	return db;
}
