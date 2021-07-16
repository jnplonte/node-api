import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { CountriesAttributes } from './../../../../models/countries';

export class Countries extends CoreMiddleware {
	pageCache: any;
	nameCache: string = '/v1/core/countr*';

	constructor(app, cache, private response, private helper, private query) {
		super(app, cache);
		this.pageCache = cache;
	}

	get services() {
		return {
			'GET /countries': 'all',
			'GET /country/:id': 'get',
			'POST /country': 'post',
			'PUT /country/:id': 'put',
			'DELETE /country/:id': 'delete',
		};
	}

	/**
	 * @api {get} /core/countries get all country
	 * @apiVersion 1.0.0
	 * @apiName all
	 * @apiGroup COUNTRIES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get all country
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
			.getAll(req.models.countries, whereData, req.query)
			.then((countries: any) => {
				const { data, pagination } = countries || { data: [], pagination: {} };
				return this.response.success(res, 'get', data || [], pagination);
			})
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {get} /core/country/:id get country
	 * @apiVersion 1.0.0
	 * @apiName get
	 * @apiGroup COUNTRIES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription get one country
	 *
	 * @apiParam (param) {Number} id country id
	 * @apiParam (query) {String} key key search <br/>Ex. ?key=name
	 */
	get(req: Request, res: Response): void {
		const whereData = {};

		return this.query
			.getOne(req.models.countries, whereData, req.query.key, req.params.id)
			.then((country: CountriesAttributes) => this.response.success(res, 'get', country || {}))
			.catch((error) => this.response.failed(res, 'get', error));
	}

	/**
	 * @api {post} /core/country insert country
	 * @apiVersion 1.0.0
	 * @apiName post
	 * @apiGroup COUNTRIES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription insert country
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
			.post(req.models.countries, data)
			.then((country: CountriesAttributes) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(country ? this.response.success(res, 'post', country.id) : this.response.failed(res, 'post'))
			)
			.catch((error) => this.response.failed(res, 'post', error));
	}

	/**
	 * @api {put} /core/country/:id update country
	 * @apiVersion 1.0.0
	 * @apiName put
	 * @apiGroup COUNTRIES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription update country
	 *
	 * @apiParam (param) {Number} id country id
	 * @apiParam (body) {String} [name] name
	 * @apiParam (body) {String} [code] code
	 * @apiParam (body) {String} [description] description
	 * @apiParam (body) {Boolean} [default] is default value
	 * @apiParam (body) {Boolean} [active] is country active
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
			.put(req.models.countries, data, whereData)
			.then((country: number[]) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(country[0] ? this.response.success(res, 'put', id) : this.response.failed(res, 'put'))
			)
			.catch((error) => this.response.failed(res, 'put', error));
	}

	/**
	 * @api {delete} /core/country/:id delete country
	 * @apiVersion 1.0.0
	 * @apiName delete
	 * @apiGroup COUNTRIES
	 * @apiPermission authenticated-user
	 *
	 * @apiDescription delete country
	 *
	 * @apiParam (param) {Number} id country id
	 */
	delete(req: Request, res: Response): void {
		const id = req.params.id;
		const whereData = {
			where: {
				id: id,
			},
		};

		return this.query
			.delete(req.models.countries, whereData)
			.then((country: number) =>
				this.cacheCheck(
					this.pageCache,
					this.nameCache
				)(country ? this.response.success(res, 'delete', id) : this.response.failed(res, 'delete'))
			)
			.catch((error) => this.response.failed(res, 'delete', error));
	}
}
