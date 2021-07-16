import {
	QueryInterface
} from 'sequelize';

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable('countries', {
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
		.then(() => queryInterface.addIndex('countries', ['name']))
		.then(() => queryInterface.addIndex('countries', ['code']));
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable('countries');
	}
};
