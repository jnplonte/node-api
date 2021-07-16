import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class LogIn extends CoreMiddleware {
	constructor(app, private response, private helper) {
		super(app);
	}

	get services() {
		return {
			'POST /login': 'login',
			'POST /keylogin': 'keyLogin',
		};
	}

	/**
	 * @api {post} /auth/login login user
	 * @apiVersion 1.0.0
	 * @apiName login
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription authenticate user and provide JWT token
	 *
	 * @apiParam (body) {String} username user name
	 * @apiParam (body) {String} password MD5 hash password
	 * @apiParam (query) {String} roleId role id <br/>Ex. ?roleId=1,2,3
	 */
	login(req: Request, res: Response): void {
		const reqParameters: string[] = ['username', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const roleIds: Array<any> = req.query.roleId
			? req.query.roleId
					.toString()
					.split(',')
					.map((i) => Number(i))
			: [];

		const whereData = {
			where: {
				username: this.helper.cleanData(req.body.username),
				active: true,
			},
			attributes: ['id', 'salt', 'loginAttempt', 'loginCount'],
		};

		if (roleIds.length >= 1) {
			whereData['where']['roleId'] = {
				[Op.in]: roleIds,
			};
		}

		let loginInfo: UsersAttributes = {};

		return req.models.users
			.findOne(whereData)
			.then((user: UsersAttributes) => {
				if (!user) {
					return Promise.reject('');
				}

				loginInfo = user;

				return req.models.users.findOne({
					where: {
						username: this.helper.cleanData(req.body.username),
						password: this.helper.getPassword(req.body.password, loginInfo.salt),
						active: true,
					},
					attributes: ['id', 'username', 'firstName', 'lastName', 'roleId', 'loginCount'],
				});
			})
			.then((user: UsersAttributes) => {
				if (!user) {
					return this.updateLoginAttempt(req.models.users, loginInfo.id, loginInfo.loginAttempt).then((data) =>
						this.response.failed(res, 'login', '')
					);
				}

				const cleanUser: UsersAttributes = this.helper.cleanSequelizeData(user);
				return this.updateLastLogIn(req.models.users, cleanUser.id, cleanUser.loginCount).then(
					// permission level hardcoded to 1 first
					(data) =>
						this.response.success(res, 'login', this.helper.createJwtToken({ ...cleanUser, permissionLevel: 1 }))
				);
			})
			.catch((error) => this.response.failed(res, 'login', error));
	}

	/**
	 * @api {post} /auth/login key login user
	 * @apiVersion 1.0.0
	 * @apiName keyLogin
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription authenticate user and provide JWT token
	 *
	 * @apiParam (body) {String} type login type
	 * @apiParam (body) {String} email email address
	 * @apiParam (body) {String} key login key
	 * @apiParam (query) {String} roleId role id <br/>Ex. ?roleId=1,2,3
	 */
	keyLogin(req: Request, res: Response): void {
		const reqParameters: string[] = ['type', 'email', 'key'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const roleIds: Array<any> = req.query.roleId
			? req.query.roleId
					.toString()
					.split(',')
					.map((i) => Number(i))
			: [];

		const whereData = {
			where: {
				email: Buffer.from(req.body.email).toString('base64'),
				active: true,
			},
			attributes: ['id', 'loginAttempt', 'loginCount'],
		};

		if (roleIds.length >= 1) {
			whereData['where']['roleId'] = {
				[Op.in]: roleIds,
			};
		}

		let loginInfo: UsersAttributes = {};

		return req.models.users
			.findOne(whereData)
			.then((user: UsersAttributes) => {
				if (!user) {
					return Promise.reject('');
				}

				loginInfo = user;

				return req.models.users.findOne({
					where: {
						email: Buffer.from(req.body.email).toString('base64'),
						socialMedia: this.helper.cleanData(req.body.type),
						socialMediaKey: this.helper.cleanData(req.body.key),
						active: true,
					},
					attributes: ['id', 'username', 'firstName', 'lastName', 'roleId', 'loginCount'],
				});
			})
			.then((user: UsersAttributes) => {
				if (!user) {
					return this.updateLoginAttempt(req.models.users, loginInfo.id, loginInfo.loginAttempt).then((data) =>
						this.response.failed(res, 'login', '')
					);
				}

				const cleanUser: UsersAttributes = this.helper.cleanSequelizeData(user);
				return this.updateLastLogIn(req.models.users, cleanUser.id, cleanUser.loginCount).then(
					// permission level hardcoded to 1 first
					(data) =>
						this.response.success(res, 'login', this.helper.createJwtToken({ ...cleanUser, permissionLevel: 1 }))
				);
			})
			.catch((error) => this.response.failed(res, 'login', error));
	}

	private updateLastLogIn(model: any, id: string = '', loginCount: number = 0): Promise<any> {
		const data = {
			lastLogin: new Date(),
			loginAttempt: 0,
			loginCount: Number(loginCount) + 1,
		};

		return model.update(data, { where: { id: id } });
	}

	private updateLoginAttempt(model: any, id: string = '', loginAttempt: number = 0): Promise<any> {
		const data = {
			loginAttempt: Number(loginAttempt) + 1,
		};

		return model.update(data, { where: { id: id } });
	}
}
