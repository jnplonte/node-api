import {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.bulkInsert('languages', [{
		id: 1,
		code: 'EN',
		name: 'english',
		default: 1,
		active: true,
		createdAt: new Date(),
		updatedAt: new Date()
	}], {}),

	down: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.bulkDelete('languages', {})
};
