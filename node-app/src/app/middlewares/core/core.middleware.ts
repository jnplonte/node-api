import { Request, Response } from 'express';
import { BaseMiddleware } from '../base/base.middleware';

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

    all(req: Request, res: Response): void {

    }

    get(req: Request, res: Response): void {

    }

    post(req: Request, res: Response): void {

    }

    put(req: Request, res: Response): void {

    }

    delete(req: Request, res: Response): void {

    }

    protected getInclude(model?: any): Array<any> {
        return [];
    }

    protected postInclude(model?: any): Array<any> {
        return [];
    }

    protected autoFillPostInformation(data: object = {}, authData: object = {}): object {
        if (typeof(authData['id']) !== 'undefined') {
            data['createdUserId'] = authData['id'];
            data['updatedUserId'] = authData['id'];
        }

        data['createdAt'] = new Date();
        data['updatedAt'] = new Date();

        return data;
    }

    protected autoFillAllPostInformation(data: Array<object>, authData: object = {}): Array<object> {
        return data.map( (dataval) => {
            if (typeof(authData['id']) !== 'undefined') {
                dataval['createdUserId'] = authData['id'];
                dataval['updatedUserId'] = authData['id'];
            }

            dataval['createdAt'] = new Date();
            dataval['updatedAt'] = new Date();

            return dataval;
        });
    }

    protected autoFillPutInformation(data: object = {}, authData: object = {}): object {
        if (typeof(authData['id']) !== 'undefined') {
            data['updatedUserId'] = authData['id'];
        }

        data['updatedAt'] = new Date();

        return data;
    }

    protected autoFillAllPutInformation(data: Array<object>, authData: object = {}): Array<object> {
        return data.map( (dataval) => {
            if (typeof(authData['id']) !== 'undefined') {
                dataval['updatedUserId'] = authData['id'];
            }

            dataval['updatedAt'] = new Date();

            return dataval;
        });
    }

    protected isAdmin(authData: object = {}): boolean {
        return (authData['roleId'] && authData['roleId'] === 1);
    }

    protected cacheCheck(pageCache?, nameCache?) {
        if (pageCache && nameCache) {
            return (callback) => pageCache.del(nameCache, () => callback);
        } else {
            return (callback) => callback;
        }
    }
}
