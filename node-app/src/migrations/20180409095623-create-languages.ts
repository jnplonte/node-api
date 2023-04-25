import {
	QueryInterface
} from 'sequelize';

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.createTable('languages', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		code: {
			type: Sequelize.STRING(25)
		},
		name: {
			type: Sequelize.STRING(100)
		},
		description: {
			type: Sequelize.STRING
		},
		default: {
			allowNull: false,
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		active: {
			allowNull: false,
			type: Sequelize.BOOLEAN,
			defaultValue: true
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
		.then(() => queryInterface.addIndex('languages', ['name']))
		.then(() => queryInterface.addIndex('languages', ['code'])),

	down: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.dropTable('languages')
};
