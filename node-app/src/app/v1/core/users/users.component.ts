import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class Users extends CoreMiddleware {
	pageCache: any;
	nameCache: string = '/v1/core/user*';

	constructor(app, cache, private response, private helper, private query) {
		super(app, cache);
		this.pageCache = cache;
	}

	get services() {
		return {
			'GET /myuser': 'getMe',
			'GET /users': 'all',
			'GET /user/:id': 'get',
			'POST /user': 'post',
			'PUT /user/:id': 'put',
			'DELETE /user/:id': 'delete',
		};
	}

	get attributes(): any {
		return {
			exclude: [
				'salt',
				'password',
				'forgotPasswordKey',
				'verificationKey',
				'socialMediaKey',
				'createdUserId',
				'updatedUserId',
			],
		};
	}

	/**
	 * @api {get} /core/users get all user
	 * @apiVersion 1.0.0
	 * @apiName all
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get all user
	 *
	 * @apiParam (query) {String} [query] filter query <br/>Ex. ?query=key:value
	 * @apiParam (query) {Number} [limit=10] data limit <br/>Ex. ?limit=1
	 * @apiParam (query) {Number} [page=1] page number <br/>Ex. ?page=1
	 */
	all(req: Request, res: Response): void {
		const whereData = {
			where: {
				active: true,
			},
			include: this.getInclude(req.models),
			attributes: this.attributes,
		};

		return this.query
			.getAll(req.models.users, whereData, req.query)
			.then((users: any) => {
				const { data, pagination } = users || { data: [], pagination: {} };
				return this.response.success(res, 'get', data || [], pagination);
			})
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {get} /core/user/:id get user
	 * @apiVersion 1.0.0
	 * @apiName get
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get one user
	 *
	 * @apiParam (param) {String} id user id
	 * @apiParam (query) {String} key key search <br/>Ex. ?key=name
	 */
	get(req: Request, res: Response): void {
		const whereData = {
			where: {
				active: true,
			},
			include: this.getInclude(req.models),
			attributes: this.attributes,
		};

		return this.query
			.getOne(req.models.users, whereData, req.query.key, req.params.id)
			.then((user: UsersAttributes) => this.response.success(res, 'get', user || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {get} /core/myuser get my user
	 * @apiVersion 1.0.0
	 * @apiName getMe
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get my user
	 *
	 */
	getMe(req: Request, res: Response): void {
		const whereData = {
			where: {
				id: req.authentication.id || null,
				active: true,
			},
			include: this.getInclude(req.models),
			attributes: this.attributes,
		};

		return this.query
			.getOne(req.models.users, whereData)
			.then((user: UsersAttributes) => this.response.success(res, 'get', user || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {post} /core/user insert user
	 * @apiVersion 1.0.0
	 * @apiName post
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription insert user
	 *
	 * @apiParam (body) {String} firstName first name
	 * @apiParam (body) {String} lastName last name
	 * @apiParam (body) {String} email unique email address
	 * @apiParam (body) {String} username unique user name
	 * @apiParam (body) {String} password MD5 hash password
	 * @apiParam (body) {String} [phone] contact number
	 * @apiParam (body) {String} [socialMedia=NONE] social media <br /> Expected Value: `FACEBOOK|INSTAGRAM|TWITTER`
	 * @apiParam (body) {String} [socialMediaKey] social media key
	 * @apiParam (body) {Number} [languageId] language id
	 * @apiParam (body) {Number} [roleId] role id
	 */
	post(req: Request, res: Response): void {
		const reqParameters = ['firstName', 'lastName', 'email', 'username', 'password'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data = this.autoFillPostInformation(req.body, req.authentication);

		return this.query
			.post(req.models.users, data)
			.then((user: UsersAttributes) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(user ? this.response.success(res, 'post', user.id) : this.response.failed(res, 'post'))
			)
			.catch((error) => this.response.failed(res, 'post', error));
	}

	/**
	 * @api {put} /core/user/:id update user
	 * @apiVersion 1.0.0
	 * @apiName put
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription update user
	 *
	 * @apiParam (param) {String} id user id
	 * @apiParam (body) {String} [firstName] first name
	 * @apiParam (body) {String} [lastName] last name
	 * @apiParam (body) {String} [email] unique email address
	 * @apiParam (body) {String} [password] MD5 hash password
	 * @apiParam (body) {String} [phone] contact number
	 * @apiParam (body) {String} [socialMedia=NONE] social media <br /> Expected Value: `FACEBOOK|INSTAGRAM|TWITTER`
	 * @apiParam (body) {String} [socialMediaKey] social media key
	 * @apiParam (body) {Number} [languageId] language id
	 * @apiParam (body) {Number} [currencyId] currency id
	 * @apiParam (body) {Boolean} [verified] is user verified
	 * @apiParam (body) {Boolean} [active] is user active
	 */
	put(req: Request, res: Response): void {
		const id = req.params.id;

		const whereData = {
			where: {
				id: id,
			},
		};

		const data = this.autoFillPutInformation(req.body, req.authentication);

		return this.query
			.put(req.models.users, data, whereData)
			.then((user: number[]) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(user[0] ? this.response.success(res, 'put', id) : this.response.failed(res, 'put'))
			)
			.catch((error) => this.response.failed(res, 'put', error));
	}

	/**
	 * @api {delete} /core/user/:id delete user
	 * @apiVersion 1.0.0
	 * @apiName delete
	 * @apiGroup USERS
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription delete user
	 *
	 * @apiParam (param) {String} id user id
	 */
	delete(req: Request, res: Response): void {
		const id = req.params.id;
		const whereData = {
			where: {
				id: id,
			},
		};

		return this.query
			.put(req.models.users, { active: false, updatedUserId: req.authentication.id || null }, whereData)
			.then((users: number[]) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(users[0] ? this.response.success(res, 'delete', id) : this.response.failed(res, 'delete'))
			)
			.catch((error) => this.response.failed(res, 'delete', error));
	}

	protected getInclude(model: any): Array<any> {
		const includedData: Array<any> = [
			{
				model: model.roles,
				required: true,
				attributes: ['id', 'name', 'permissionLevel'],
			},
			{
				model: model.languages,
				required: false,
				attributes: ['id', 'code', 'name'],
			},
			{
				model: model.countries,
				required: false,
				attributes: ['id', 'code', 'name'],
			},
		];

		return includedData;
	}

	protected autoFillPostInformation(data: UsersAttributes, authData: Object = {}) {
		if (typeof data.password !== 'undefined') {
			data.salt = this.helper.generateRandomString();
			data.password = this.helper.getPassword(data.password, data.salt);
			data.passwordExpiry = this.helper.passwordExpiry;
		}

		data.roleId = data.roleId ? Number(data.roleId) : this.helper.defaultUserRole;

		if (typeof authData['id'] !== 'undefined') {
			data.createdUserId = authData['id'];
			data.updatedUserId = authData['id'];
		}

		return data;
	}

	protected autoFillPutInformation(data: UsersAttributes, authData: Object = {}): Object {
		if (typeof data.password !== 'undefined') {
			data.salt = this.helper.generateRandomString();
			data.password = this.helper.getPassword(data.password, data.salt);
			data.passwordExpiry = this.helper.passwordExpiry;
		}

		if (typeof authData['id'] !== 'undefined') {
			data.updatedUserId = authData['id'];
		}

		delete data.username;

		return data;
	}
}
