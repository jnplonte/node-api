import { Helper } from '../app/services/helper/helper.service';
import { ApiResponse } from '../app/services/api-response/api-response.service';
import { Notification } from '../app/services/notification/notification.service';

import { LogIn } from '../app/v1/authentication/login/login.component';
import { Register } from '../app/v1/authentication/register/register.component';
import { VerifyUser } from '../app/v1/authentication/verify-user/verify-user.component';
import { ForgotPassword } from '../app/v1/authentication/forgot-password/forgot-password.component';

export function setup(app, cache, config, models) {
    const response = new ApiResponse(), helper = new Helper(config);
    const notification = new Notification(config);

    app.version('v1/auth', appAuth => {
        appAuth.use((req, res, next) => {
            res.startTime = new Date().getTime();
            if (typeof(req.headers) === 'undefined' || helper.isEmpty(req.headers[config.secretKey]) || Buffer.from(req.headers[config.secretKey], 'base64').toString('ascii') !== config.secretKeyHash) {
                return response.failed(res, 'token', '', 401);
            }

            req.models = models;

            if (!req.models) {
                return response.failed(res, 'model', '', 500);
            }

            next();
        });

        new LogIn(appAuth, response, helper);
        new Register(appAuth, response, helper, notification);
        new VerifyUser(appAuth, response, helper, notification);
        new ForgotPassword(appAuth, response, helper, notification);
    });

    return app;
}
