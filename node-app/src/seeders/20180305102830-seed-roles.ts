import {
  QueryInterface
} from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface, Sequelize: any) => {
	return queryInterface.bulkInsert('roles', [{
		id: 1,
		name: 'super-admin',
		description: 'Super Admin Role',
		permissionLevel: 1,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 2,
		name: 'admin',
		description: 'Admin Role',
		permissionLevel: 2,
		createdAt: new Date(),
		updatedAt: new Date()
	},
	{
		id: 3,
		name: 'user',
		description: 'User Role',
		permissionLevel: 10,
		createdAt: new Date(),
		updatedAt: new Date()
	}], {});
  },

  down: (queryInterface: QueryInterface, Sequelize: any) => {
	return queryInterface.bulkDelete('roles', {});
  }
};
