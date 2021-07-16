import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { LanguagesAttributes } from './../../../../models/languages';

export class Languages extends CoreMiddleware {
	pageCache: any;
	nameCache: string = '/v1/core/language*';

	constructor(app, cache, private response, private helper, private query) {
		super(app, cache);
		this.pageCache = cache;
	}

	get services() {
		return {
			'GET /languages': 'all',
			'GET /language/:id': 'get',
			'POST /language': 'post',
			'PUT /language/:id': 'put',
			'DELETE /language/:id': 'delete',
		};
	}

	/**
	 * @api {get} /core/languages get all language
	 * @apiVersion 1.0.0
	 * @apiName all
	 * @apiGroup LANGUAGES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get all language
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
		};

		return this.query
			.getAll(req.models.languages, whereData, req.query)
			.then((languages: any) => {
				const { data, pagination } = languages || { data: [], pagination: {} };
				return this.response.success(res, 'get', data || [], pagination);
			})
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {get} /core/language/:id get language
	 * @apiVersion 1.0.0
	 * @apiName get
	 * @apiGroup LANGUAGES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get one language
	 *
	 * @apiParam (param) {Number} id language id
	 * @apiParam (query) {String} key key search <br/>Ex. ?key=name
	 */
	get(req: Request, res: Response): void {
		const whereData = {};

		return this.query
			.getOne(req.models.languages, whereData, req.query.key, req.params.id)
			.then((language: LanguagesAttributes) => this.response.success(res, 'get', language || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {post} /core/language insert language
	 * @apiVersion 1.0.0
	 * @apiName post
	 * @apiGroup LANGUAGES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription insert language
	 *
	 * @apiParam (body) {String} name name
	 * @apiParam (body) {String} code code
	 * @apiParam (body) {String} [description] description
	 * @apiParam (body) {Boolean} [default] is default value
	 */
	post(req: Request, res: Response): void {
		const reqParameters = ['code', 'name'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const data = req.body;

		return this.query
			.post(req.models.languages, data)
			.then((language: LanguagesAttributes) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(language ? this.response.success(res, 'post', language.id) : this.response.failed(res, 'post'))
			)
			.catch((error) => this.response.failed(res, 'post', error));
	}

	/**
	 * @api {put} /core/language/:id update language
	 * @apiVersion 1.0.0
	 * @apiName put
	 * @apiGroup LANGUAGES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription update language
	 *
	 * @apiParam (param) {Number} id language id
	 * @apiParam (body) {String} [name] name
	 * @apiParam (body) {String} [code] code
	 * @apiParam (body) {String} [description] description
	 * @apiParam (body) {Boolean} [default] is default value
	 * @apiParam (body) {Boolean} [active] is language active
	 */
	put(req: Request, res: Response): void {
		const id = req.params.id;
		const whereData = {
			where: {
				id: id,
			},
		};

		const data = req.body;

		return this.query
			.put(req.models.languages, data, whereData)
			.then((language: number[]) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(language[0] ? this.response.success(res, 'put', id) : this.response.failed(res, 'put'))
			)
			.catch((error) => this.response.failed(res, 'put', error));
	}

	/**
	 * @api {delete} /core/language/:id delete language
	 * @apiVersion 1.0.0
	 * @apiName delete
	 * @apiGroup LANGUAGES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription delete language
	 *
	 * @apiParam (param) {Number} id language id
	 */
	delete(req: Request, res: Response): void {
		const id = req.params.id;
		const whereData = {
			where: {
				id: id,
			},
		};

		return this.query
			.delete(req.models.languages, whereData)
			.then((language: number) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(language ? this.response.success(res, 'delete', id) : this.response.failed(res, 'delete'))
			)
			.catch((error) => this.response.failed(res, 'delete', error));
	}
}
