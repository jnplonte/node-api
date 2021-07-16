import { Helper } from '../app/services/helper/helper.service';
import { ApiResponse } from '../app/services/api-response/api-response.service';
import { Query } from '../app/services/query/query.service';

import { Users } from '../app/v1/core/users/users.component';

import { Countries } from '../app/v1/core/countries/countries.component';
import { Languages } from '../app/v1/core/languages/languages.component';

export function setup(app, cache, config, models) {
	const response = new ApiResponse(), helper = new Helper(config), query = new Query(config);

	app.version('v1/core', appCore => {
		appCore.use((req, res, next) => {
			res.startTime = new Date().getTime();

			if (typeof(req.authentication) === 'undefined' || helper.isEmpty(req.authentication.id)) {
				return response.failed(res, 'token', '', 401);
			}

			res.express_redis_cache_name = `${req.originalUrl}:`;
			req.models = models;

			if (!req.models) {
				return response.failed(res, 'model', '', 500);
			}

			next();
		});

		new Users(appCore, cache, response, helper, query);

		new Countries(appCore, cache, response, helper, query);
		new Languages(appCore, cache, response, helper, query);
	});

	return app;
}
