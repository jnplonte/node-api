import {
	Sequelize
} from 'sequelize';

export interface LanguagesAttributes {
	id ?: string;
	createdAt ?: Date;
	updatedAt ?: Date;

	code ?: string;
	name ?: string;
	description ?: string;
	default ?: boolean;
	active ?: boolean;
}

export default function(sequelize: Sequelize, dataTypes: any) {
	const language = sequelize.define('languages', {
		id: {
			type: dataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		code: dataTypes.STRING,
		name: dataTypes.STRING,
		description: dataTypes.STRING,
		default: dataTypes.BOOLEAN,
		active: dataTypes.BOOLEAN
	});

	return language;
}
