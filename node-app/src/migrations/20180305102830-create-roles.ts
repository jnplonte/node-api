import {
	QueryInterface
} from 'sequelize';

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.createTable('roles', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		name: {
			type: Sequelize.STRING(100)
		},
		description: {
			type: Sequelize.STRING
		},
		permissionLevel: {
			type: Sequelize.TINYINT
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE,
			defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
		}
	})
		.then(() => queryInterface.addIndex('roles', ['id']))
		.then(() => queryInterface.addIndex('roles', ['name']))
		.then(() => queryInterface.addIndex('roles', ['permissionLevel'])),

	down: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.dropTable('roles')
};
