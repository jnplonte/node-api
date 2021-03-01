import { Request, Response } from 'express';
import { BaseMiddleware } from '../base/base.middleware';

import { isAdmin } from './inheritances/is-admin.inheritance';
import {
	autoFillPostInformation,
	autoFillAllPostInformation,
} from './inheritances/auto-fill-post-information.inheritance';
import {
	autoFillPutInformation,
	autoFillAllPutInformation,
} from './inheritances/auto-fill-put-information.inheritance';

export class CoreMiddleware extends BaseMiddleware {
	constructor(app, cache?) {
		super(app, cache);
	}

	get attributes(): any {
		return [];
	}

	get requiredParameters(): string[] {
		return [];
	}

	all(req: Request, res: Response): void {}

	get(req: Request, res: Response): void {}

	post(req: Request, res: Response): void {}

	put(req: Request, res: Response): void {}

	delete(req: Request, res: Response): void {}

	protected getInclude(model?: any): Array<any> {
		return [];
	}

	protected postInclude(model?: any): Array<any> {
		return [];
	}

	protected cacheCheck(pageCache?, nameCache?) {
		if (pageCache && nameCache) {
			return (callback) => pageCache.del(nameCache, () => callback);
		} else {
			return (callback) => callback;
		}
	}

	protected autoFillPostInformation(data: object = {}, authData: object = {}): object {
		return autoFillPostInformation(data, authData);
	}

	protected autoFillAllPostInformation(data: Array<object>, authData: object = {}): Array<object> {
		return autoFillAllPostInformation(data, authData);
	}

	protected autoFillPutInformation(data: object = {}, authData: object = {}): object {
		return autoFillPutInformation(data, authData);
	}

	protected autoFillAllPutInformation(data: Array<object>, authData: object = {}): Array<object> {
		return autoFillAllPutInformation(data, authData);
	}

	protected isAdmin(authData: object = {}): boolean {
		return isAdmin(authData);
	}
}
