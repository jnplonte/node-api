export interface ILoginInfo {
	id: string;
	code?: string;
	companyId?: string;
	companyKey?: string;
	companyCode?: string;
	firstName?: string;
	lastName?: string;
	password?: string;
	salt?: string;
	loginAttempt?: number;
	loginCount?: number;
	roleId?: number;
	forgotPasswordKey?: string;
	email?: string;
	permissionLevel?: number;
}
