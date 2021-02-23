import { Request, Response } from 'express';
import { CoreMiddleware } from '../../../middlewares/core/core.middleware';

import { UsersAttributes } from './../../../../models/users';

export class VerifyUser extends CoreMiddleware {
	constructor(app, private response, private helper, private notification) {
		super(app);
	}

	get services() {
		return {
			'POST /verify': 'verify',
			'POST /verifysend': 'verifySend',
		};
	}

	/**
	 * @api {post} /auth/verify verify user
	 * @apiVersion 1.0.0
	 * @apiName verify
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription verify user
	 *
	 * @apiParam (body) {String} verificationKey verification key
	 * @apiParam (body) {String} username user name
	 */
	verify(req: Request, res: Response): void {
		const reqParameters: string[] = ['username', 'verificationKey'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const whereData = {
			where: {
				verificationKey: decodeURIComponent(req.body.verificationKey),
				username: req.body.username,
				active: true,
				verified: false,
			},
		};

		return req.models.users
			.update({ verified: true }, whereData)
			.then((user: number[]) => (user[0] ? this.response.success(res, 'verify') : this.response.failed(res, 'verify')))
			.catch((error) => this.response.failed(res, 'verify', error));
	}

	/**
	 * @api {post} /auth/verifysend send verification email
	 * @apiVersion 1.0.0
	 * @apiName verifysend
	 * @apiGroup AUTHENTICATION
	 * @apiPermission all
	 *
	 * @apiDescription send verification email
	 *
	 * @apiParam (body) {String} username user name
	 * @apiParam (body) {String} return url callback <br /> Expected Value: `https://wwww.jnpl.me/forgot?p={{key}}`
	 * @apiParam (body) {String} [subject] email subject
	 * @apiParam (body) {String} [template] email template
	 * @apiParam (body) {String} [logo] email logo
	 */
	verifySend(req: Request, res: Response): void {
		const reqParameters: string[] = ['username', 'return'];
		if (!this.helper.validateData(req.body, reqParameters)) {
			return this.response.failed(res, 'data', reqParameters);
		}

		const whereData = {
			where: {
				username: req.body.username,
				active: true,
			},
		};

		return req.models.users
			.findOne(whereData)
			.then((user: UsersAttributes) => {
				if (!user) {
					return Promise.reject('invalid username');
				}

				const userInfo = this.helper.cleanSequelizeData(user);
				return this.notification.sendVerificationEmail(userInfo.email, { ...userInfo, ...req.body }, req.query.test);
			})
			.then((verificationUrl: string) => {
				if (!verificationUrl) {
					return Promise.reject('email verificaion failed');
				}

				return this.response.success(res, 'verify', verificationUrl);
			})
			.catch((error) => this.response.failed(res, 'verify', error));
	}
}
