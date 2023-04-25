import {
	QueryInterface
} from 'sequelize';

module.exports = {
	up: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.bulkInsert('users', [
		{
			id: 'da744a7e-c058-4082-ba3e-d52f36293698',
			firstName: 'Super',
			lastName: 'Admin',
			email: 'Z2VudGxlbWVuc2xvdW5nZXBoQGdtYWlsLmNvbQ==',
			phone: 'KzYzOTMzMTI1MDc1OA==',
			username: 'superAdmin',
			password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
			salt: 'testsalt',
			lastLogIn: new Date(),
			roleId: 1,
			languageId: 1,
			countryId: 169,
			socialMedia: 'NONE',
			active: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: '895c49ce-ffd6-4cd6-9fb2-32e40fa65991',
			firstName: 'Bruce Admin',
			lastName: 'Wayne',
			email: 'Y29tcGFueS1hZG1pbkBnZW50bGVtZW5sb3VuZ2VwaC5jb20=',
			phone: 'KzYzOTMzMTI1MDc1OA==',
			username: 'batman',
			password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
			salt: 'testsalt',
			lastLogIn: new Date(),
			roleId: 2,
			languageId: 1,
			countryId: 169,
			socialMedia: 'NONE',
			active: true,
			createdAt: new Date(),
			updatedAt: new Date()
		},
		{
			id: '01438928-ba4c-11e8-96f8-529269fb1451',
			firstName: 'Peter User',
			lastName: 'Parker',
			email: 'c3BpZGVybWFuQGdtYWlsLmNvbQ==',
			phone: 'KzYzOTMzMTI1MDc1OA==',
			username: 'spiderman',
			password: '409b79d8bbb3c92aa66198d81af8e4bf5e7338767e8b9904438d68088a265d9b',
			salt: 'testsalt',
			lastLogIn: new Date(),
			roleId: 3,
			languageId: 1,
			countryId: 169,
			socialMedia: 'FACEBOOK',
			socialMediaKey: '111111111111',
			active: true,
			createdAt: new Date(),
			updatedAt: new Date()
		}], {}),

	down: (queryInterface: QueryInterface, Sequelize: any) => queryInterface.bulkDelete('users', {})
};
