import * as express from 'express';
import { expressjwt } from 'express-jwt';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import { expressCspHeader, SELF, EVAL } from 'express-csp-header';

import * as redisCache from 'express-redis-cache';

import * as authenticationRoutes from './routes/authentication-route';
import * as coreRoutes from './routes/core-route';

import { setup } from './models';

import { baseConfig } from './config';

express['application']['version'] = express.Router['group'] = function (arg1, arg2) {
	let fn, path;
	const router = express.Router(),
		self = this;
	if (typeof arg2 === 'undefined') {
		path = '/';
		fn = arg1;
	} else {
		path = '/' + arg1;
		fn = arg2;
	}
	fn(router);
	self.use(path, router);
	return router;
};

// process.env.TZ = 'Asia/Manila';
process.env.TZ = 'utc';

const mysql = setup();

class App {
	public express;
	public cache;
	public env = process.env.NODE_ENV || 'local';

	constructor() {
		this.express = express();
		this.express.disable('x-powered-by');

		this.addConfig();
		this.implementToken();
		this.implementCache();
		this.implementDocumentation();
		this.setRoute();
		this.setNotFound();
	}

	private addConfig(): void {
		/* @ts-ignore; */
		this.express.use(helmet({ frameguard: false }));
		this.express.use(compression());
		this.express.use(cors());
		this.express.use(express.json());
		this.express.use(express.urlencoded({ extended: true }));
	}

	private implementToken(): void {
		this.express.use(
			expressjwt({ secret: baseConfig.secretKeyHash, requestProperty: 'authentication', algorithms: ['HS256'] }).unless(
				{
					path: [/\/documentation*/, /\/v1\/auth*/],
				}
			)
		);

		this.express.use(function (err, req, res, next) {
			if (err.name === 'UnauthorizedError') {
				return res.status(401).json({
					status: 'failed',
					message: 'Invalid Authentication Token',
					executionTime: 0,
					data: '',
				});
			}
		});
	}
	private implementCache(): void {
		if (this.env === 'production') {
			this.cache = redisCache({
				host: baseConfig.cache[this.env].host,
				port: baseConfig.cache[this.env].port,
				auth_pass: baseConfig.cache[this.env].password,
				expire: baseConfig.cache[this.env].expire,
				prefix: baseConfig.name,
			});
			this.cache.on('message', (msg) => {
				console.log('Cache Status:', msg);
			});
		}
	}

	private implementDocumentation(): void {
		if (this.env === 'production') {
			// do something here
		} else {
			this.express.use(
				'/documentation',
				expressCspHeader({
					directives: {
						'script-src': [SELF, EVAL],
					},
				}),
				express.static(__dirname + '/doc')
			);
		}
	}

	private setRoute(): void {
		this.express = authenticationRoutes.setup(this.express, this.cache, baseConfig, mysql);
		this.express = coreRoutes.setup(this.express, this.cache, baseConfig, mysql);
	}

	private setNotFound(): void {
		this.express.use((req, res) =>
			res.status(404).json({
				status: 'failed',
				message: 'Page Not Found',
				executionTime: 0,
				data: '',
			})
		);
	}
}

export default new App().express;
