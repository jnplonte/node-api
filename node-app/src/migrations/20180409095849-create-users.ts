import {
	QueryInterface
} from 'sequelize';

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable('users', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				unique: true
			},
			firstName: {
				allowNull: false,
				type: Sequelize.STRING(100)
			},
			lastName: {
				allowNull: false,
				type: Sequelize.STRING(100)
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING(100)
			},
			phone: {
				type: Sequelize.STRING(100)
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING(100)
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			salt: {
				allowNull: false,
				type: Sequelize.STRING(25)
			},
			forgotPasswordKey: {
				type: Sequelize.STRING
			},
			passwordExpiry: {
				type: Sequelize.DATE
			},
			loginAttempt: {
				allowNull: false,
				type: Sequelize.TINYINT,
				defaultValue: 0
			},
			loginCount: {
				allowNull: false,
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			lastLogin: {
				type: Sequelize.DATE
			},
			roleId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'roles',
					key: 'id'
				}
			},
			languageId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'languages',
					key: 'id'
				}
			},
			countryId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'countries',
					key: 'id'
				}
			},
			socialMedia: {
				allowNull: false,
				type: Sequelize.ENUM('NONE', 'FACEBOOK'),
				defaultValue: 'NONE'
			},
			socialMediaKey: {
				type: Sequelize.STRING
			},
			active: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			verified: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: true
			},
			verificationKey: {
				type: Sequelize.STRING
			},
			createdUserId: {
				type: Sequelize.UUID
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedUserId: {
				type: Sequelize.UUID
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			}
		})
		.then(() => queryInterface.addIndex('users', ['username'], {'unique': true}))
		.then(() => queryInterface.addIndex('users', ['email'], {'unique': true}))
		.then(() => queryInterface.addIndex('users', ['forgotPasswordKey']))
		.then(() => queryInterface.addIndex('users', ['languageId']))
		.then(() => queryInterface.addIndex('users', ['countryId']))
		.then(() => queryInterface.addIndex('users', ['roleId']));
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable('users');
	}
};
