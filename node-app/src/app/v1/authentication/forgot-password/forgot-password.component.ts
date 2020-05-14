import { Request, Response } from 'express';
import { CoreInterface } from './../../../interfaces/core/core.interface';

import { UsersAttributes } from './../../../../models/users';

export class ForgotPassword extends CoreInterface {
    constructor(app, private response, private helper, private notification) {
        super(app);
    }

    get services() {
        return {
            'POST /forgot': 'forgot',
            'POST /forgotsend': 'forgotSend'
        };
    }

    /**
     * @api {post} /auth/forgot change user password
     * @apiVersion 1.0.0
     * @apiName forgot
     * @apiGroup AUTHENTICATION
     * @apiPermission all
     *
     * @apiDescription change user password
     *
     * @apiParam (body) {String} forgotPasswordKey forgot password key
     * @apiParam (body) {String} password MD5 hash password
     */
    forgot(req: Request, res: Response): void {
        const reqParameters: string[] = ['forgotPasswordKey', 'password'];
        if (!this.helper.validateData(req.body, reqParameters)) {
            return this.response.failed(res, 'data', reqParameters);
        }

        const whereData = {
            'where': {
                'forgotPasswordKey': decodeURIComponent(req.body.forgotPasswordKey),
                'active': true
            }
        };

        req.body.salt = this.helper.generateRandomString();
        req.body.password = this.helper.getPassword(req.body.password, req.body.salt);
        req.body.passwordExpiry = this.helper.passwordExpiry;
        req.body.forgotPasswordKey = '';

        const data = req.body;

        return req.models.users.update(this.helper.cleanData(data), whereData)
            .then(
                (user: number[]) => (user[0]) ? this.response.success(res, 'put') : this.response.failed(res, 'put')
            )
            .catch(
                (error) => this.response.failed(res, 'put', error)
            );
    }

    /**
     * @api {post} /auth/forgotsend forgot user password
     * @apiVersion 1.0.0
     * @apiName forgotSend
     * @apiGroup AUTHENTICATION
     * @apiPermission all
     *
     * @apiDescription forgot user password
     *
     * @apiParam (body) {String} username user name
     * @apiParam (body) {String} return url callback <br /> Expected Value: `https://wwww.jnpl.me/forgot?p={{key}}`
     * @apiParam (body) {String} [subject] email subject
     * @apiParam (body) {String} [template] email template
     * @apiParam (body) {String} [logo] email logo
     */
    forgotSend(req: Request, res: Response): void {
        const reqParameters: string[] = ['username', 'return'];
        if (!this.helper.validateData(req.body, reqParameters)) {
            return this.response.failed(res, 'data', reqParameters);
        }

        const whereData = {
            'where': {
                'username': req.body.username,
                'active': true
            }
        };

        let userInfo: UsersAttributes = {};

        return req.models.users.findOne(whereData)
            .then(
                (user: UsersAttributes) => {
                    if (!user) {
                        return Promise.reject('invalid username');
                    }

                    userInfo = this.helper.cleanSequelizeData(user);
                    userInfo.forgotPasswordKey = this.helper.encode(`${this.helper.generateRandomString(50)}${new Date().getTime()}`);

                    return req.models.users.update( { 'forgotPasswordKey': userInfo.forgotPasswordKey, 'loginAttempt': 0 }, { 'where': { 'id': userInfo.id, 'active': true } } );
                }
            )
            .then(
                (user: number[]) => {
                    if (!user[0]) {
                        return Promise.reject('forgot token update failed');
                    }

                    return this.notification.sendForgotPasswordEmail(userInfo.email, {...userInfo, ...req.body}, req.query.test);
                }
            )
            .then(
                (forgotPasswordUrl: string) => {
                    if (!forgotPasswordUrl) {
                      return Promise.reject('email forgot failed');
                    }

                    return this.response.success(res, 'forgot', forgotPasswordUrl);
                }
            )
            .catch(
                (error) => this.response.failed(res, 'forgot', error)
            );
    }
}
