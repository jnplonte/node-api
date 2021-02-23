import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class Register extends CoreMiddleware {
	constructor(app, private response, private helper, private notification) {
		super(app);
	}

	get services() {
		return {
			'POST /register': 'register',
			'POST /keyregister': 'keyRegister',
		};
	}

	/**
	 * @api {post} /auth/register register user
	 * @apiVersion 1.0.0
	 * @apiName register
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription register user
	 *
	 * @apiParam (body) {String} firstName first name
	 * @apiParam (body) {String} lastName last name
	 * @apiParam (body) {String} email unique email address
	 * @apiParam (body) {String} username unique user name
	 * @apiParam (body) {String} password MD5 hash password
	 * @apiParam (body) {String} [phone] contact number
	 * @apiParam (body) {Number} [languageId] language id
	 * @apiParam (body) {Number} [currencyId] currency id
	 * @apiParam (body) {Number} [roleId] role id
	 * @apiParam (body) {Boolean} [verified] is verified
	 * @apiParam (body) {String} [return] url callback <br /> Expected Value: `https://wwww.jnpl.me/verify?p={{key}}`
	 * @apiParam (body) {String} [subject] email subject
	 * @apiParam (body) {String} [template] template
	 * @apiParam (body) {String} [logo] email logo
	 */
	register(req: Request, res: Response): void {
		const reqParameters: string[] = ['firstName', 'lastName', 'email', 'username', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data: any = this.autoFillPostInformation(req.body);

		data['salt'] = this.helper.generateRandomString();
		data['password'] = this.helper.getPassword(data['password'], data['salt']);
		data['passwordExpiry'] = this.helper.passwordExpiry;
		data['verificationKey'] = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

		data['languageId'] = data['languageId'] ? Number(data['languageId']) : this.helper.defaultLanguage;
		data['currencyId'] = data['currencyId'] ? Number(data['currencyId']) : this.helper.defaultCurrency;
		data['roleId'] = data['roleId'] ? Number(data['roleId']) : this.helper.defaultUserRole;

		// HACK: bad implementation
		switch (data['roleId']) {
			case 4:
				data['employee'] = data['employee'] ? data['employee'] : {};
				break;
			case 5:
				data['customer'] = data['customer'] ? data['customer'] : {};
				break;
		}

		if (data['verified']) {
			return req.models.users
				.create(this.helper.cleanData(data))
				.then((user: UsersAttributes) => {
					return this.response.success(res, 'register', user.id || '');
				})
				.catch((error) => this.response.failed(res, 'register', error));
		} else {
			return req.models.users
				.create(this.helper.cleanData(data))
				.then((user: UsersAttributes) => {
					if (!user) {
						return Promise.reject('register failed');
					}

					const userInfo = this.helper.cleanSequelizeData(user);
					userInfo.email = Buffer.from(userInfo.email, 'base64').toString('ascii');

					return this.notification.sendVerificationEmail(userInfo.email, { ...userInfo, ...req.body }, req.query.test);
				})
				.then((verificationUrl: string) => {
					if (!verificationUrl) {
						return Promise.reject('email verificaion failed');
					}

					return this.response.success(res, 'register', verificationUrl);
				})
				.catch((error) => this.response.failed(res, 'register', error));
		}
	}

	/**
	 * @api {post} /auth/keyregister key register user
	 * @apiVersion 1.0.0
	 * @apiName keyRegister
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription key register user
	 *
	 * @apiParam (body) {String} firstName first name
	 * @apiParam (body) {String} lastName last name
	 * @apiParam (body) {String} email unique email address
	 * @apiParam (body) {String} username unique user name
	 * @apiParam (body) {String} password MD5 hash password
	 * @apiParam (body) {String} socialMedia social media <br /> Expected Value: `FACEBOOK|INSTAGRAM|TWITTER`
	 * @apiParam (body) {String} socialMediaKey social media key
	 * @apiParam (body) {String} [phone] contact number
	 * @apiParam (body) {Number} [languageId] language id
	 * @apiParam (body) {Number} [currencyId] currency id
	 * @apiParam (body) {Number} [roleId] role id
	 */
	keyRegister(req: Request, res: Response): void {
		const reqParameters: string[] = [
			'firstName',
			'lastName',
			'email',
			'username',
			'password',
			'socialMedia',
			'socialMediaKey',
		];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data: any = this.autoFillPostInformation(req.body);

		data['salt'] = this.helper.generateRandomString();
		data['password'] = this.helper.getPassword(data['password'], data['salt']);
		data['passwordExpiry'] = this.helper.passwordExpiry;
		data['verificationKey'] = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

		data['verified'] = true;
		data['languageId'] = data['languageId'] ? Number(data['languageId']) : this.helper.defaultLanguage;
		data['currencyId'] = data['currencyId'] ? Number(data['currencyId']) : this.helper.defaultCurrency;
		data['roleId'] = data['roleId'] ? Number(data['roleId']) : this.helper.defaultUserRole;

		const whereData = {
			where: {
				email: Buffer.from(data['email']).toString('base64'),
				socialMedia: 'NONE',
				socialMediaKey: null,
			},
			attributes: ['id'],
		};

		return req.models.users
			.findOne(whereData)
			.then((userFind: any) => {
				if (!userFind) {
					return req.models.users.create(this.helper.cleanData(data));
				}

				return userFind.update(
					{
						socialMedia: data['socialMedia'],
						socialMediaKey: data['socialMediaKey'],
					},
					whereData
				);
			})
			.then((userCreate: UsersAttributes) => {
				return this.response.success(res, 'register', userCreate.id || '');
			})
			.catch((error) => this.response.failed(res, 'register', error));
	}
}
