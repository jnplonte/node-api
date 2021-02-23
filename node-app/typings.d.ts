export {};

declare module '*.json' {
	const value: any;
	export default value;
}

declare global {
	namespace Express {
		interface Request {
			authentication: {
				id?: string;
				username?: string;
				languageId?: number;
				countryId?: number;
				permissionLevel?: number;
			};
			models?: any;
		}
		interface Response {
			startTime?: number;
		}
	}
}
