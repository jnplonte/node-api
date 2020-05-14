export class BaseInterface {
    pageCache: any;
    nameCache: string;

    constructor(private app, private cache?) {
        if (app === 'sandbox') {
            // console.log('sandbox mode');
        } else {
            this.registerServices();
        }
    }

    get services(): Object {
        return {};
    }

    middleWare(verb: string = 'get') {
        if (this.cache && verb === 'get') {
            return this.cache.route();
        } else {
            return (req, res, next) => {
                console.log('==================================================');
                console.log('LOG TIME:', new Date());
                console.log('LOG URL:', req.originalUrl || '');
                console.log('LOG AUTH:', (req.authentication) ? JSON.stringify(req.authentication) : '');
                console.log('LOG HEADERS:', (req.headers['x-node-api-key']) ? JSON.stringify(req.headers['x-node-api-key']) : '');
                console.log('LOG QUERY:', (req.query) ? JSON.stringify(req.query) : '');
                console.log('LOG BODY:', (req.body) ? JSON.stringify(req.body) : '');
                console.log('LOG METHOD:', req.method || '');
                console.log('==================================================');

                next();
            };
        }
    }

    // errorHandler(req, res, next) {
    //     return res.status(405).json({
    //         'status': 'failed',
    //         'message': 'Method Not Found',
    //         'executionTime': 0,
    //         'data': ''
    //     });
    // }

    registerServices() {
        const routerServices = this.services;
        Object.keys(routerServices).forEach( (fullPath: string) => {
            const serviceFunction = routerServices[fullPath];
            const pathItems = fullPath.split(' ');
            const verb = (pathItems.length > 1 ? pathItems[0] : 'get').toLowerCase();
            const path = (pathItems.length > 1 ? pathItems[1] : fullPath);
            const noCache = (pathItems.length > 1 && pathItems[2] && pathItems[2] === 'noCache') ? true : false;

            if (noCache) {
                this.app[verb](path, this[serviceFunction].bind(this));
            } else {
                this.app[verb](path, this.middleWare(verb), this[serviceFunction].bind(this));
            }

            // this.app.all(path, this.errorHandler);
        });
    }
}
