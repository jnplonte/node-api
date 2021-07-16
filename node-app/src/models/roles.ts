import {
	Sequelize
} from 'sequelize';

export interface RolesAttributes {
	id ?: number;
	createdAt ?: Date;
	updatedAt ?: Date;

	name ?: string;
	description ?: string;
	permissionLevel ?: number;
}

export default function(sequelize: Sequelize, dataTypes: any) {
	const roles = sequelize.define('roles', {
		id: {
			type: dataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: dataTypes.STRING,
		description: dataTypes.STRING,
		permissionLevel: dataTypes.TINYINT
	});

	return roles;
}
