import { BaseMiddleware } from '../base/base.middleware';

import { autoFillPostInformation } from './inheritances/auto-fill-post-information.inheritance';

export class AuthenticationMiddleware extends BaseMiddleware {
	constructor(app, cache?) {
		super(app, cache);
	}

	protected autoFillPostInformation(data: object = {}, authData: object = {}): object {
		return autoFillPostInformation(data, authData);
	}
}
