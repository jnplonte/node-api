import {    toJson, toString, isEmail, isEmpty, isNotEmpty, cleanData, isEmptyObject, isStringExist,
			checkObjectInList, filterData, removeData, replaceHtml, generateRandomString, flatObject,
			readJwtToken, createJwtToken, encodePassword, isInteger, isInArray, cleanDataWithNull, titleCase,
			cleanDataRemoveNull, encode, decode, dateTimeNowStart, dateTimeNowEnd
		} from 'jnpl-helper';

export class Helper {
	env: string = process.env.NODE_ENV || 'local';

	constructor(private config) {

	}

	cleanSequelizeData(data: any): Object {
		return (typeof(data.get) !== 'undefined') ? data.get({ plain: true}) : data;
	}

	cleanSequelizeDataArray(data: any): Array<any> {
		return data.map(this.cleanSequelizeData);
	}

	toJson(jsonData: any = ''): any {
		return toJson(jsonData);
	}

	toString(jsonData: any = ''): any {
		return toString(jsonData);
	}

	cleanData(data: any = ''): any {
		return cleanData(data);
	}

	cleanDataWithNull(data: any = ''): any {
		return cleanDataWithNull(data);
	}

	cleanDataRemoveNull(data: any = ''): any {
		return cleanDataRemoveNull(data);
	}

	isEmptyObject(obj: Object = {}): boolean {
		return isEmptyObject(obj);
	}

	stringExist(string: string = '', character: string = ''): boolean {
		return isStringExist(string, character);
	}

	isNotEmpty(v: any = null): boolean {
		return isNotEmpty(v);
	}

	isEmpty(v: any = null): boolean {
		return isEmpty(v);
	}

	isEmail(email: string = ''): boolean {
		return isEmail(email);
	}

	validateData(obj: Object = {}, list: Array<any> = []): boolean {
		return checkObjectInList(obj, list);
	}

	filterDataArray(data: any, show: Array<any> = []): any {
		data = this.cleanSequelizeDataArray(data);

		return filterData(data, show);
	}

	filterData(data: any, show: Array<any> = []): any {
		data = this.cleanSequelizeData(data);

		return filterData(data, show);
	}

	removeDataArray(data: any, remove: Array<any> = []): any {
		data = this.cleanSequelizeDataArray(data);

		return removeData(data, remove);
	}

	removeData(data: any, remove: Array<any> = []): any {
		data = this.cleanSequelizeData(data);

		return removeData(data, remove);
	}

	replaceHtml(html: string = '', data: Object = {}): string {
		return replaceHtml(html, data);
	}

	generateRandomString(num: number = 10): string {
		return generateRandomString(num);
	}

	getPassword(password: string = '', salt: string = ''): string {
		return encodePassword(password, salt);
	}

	createJwtToken(userInformation: Object = {}, hasExpiration: boolean = true): string {
		return createJwtToken(this.config.secretKeyHash, userInformation, hasExpiration, this.config.secretKeyLength);
	}

	readJwtToken(jwtToken: string = ''): Object {
		return readJwtToken(this.config.secretKeyHash, jwtToken);
	}

	checkAccess(authenticationToken: Object = {}, permissionLevel: number = 1): boolean {
		return (authenticationToken['permissionLevel']) ? (authenticationToken['permissionLevel'] <= permissionLevel) : false;
	}

	flatObject(obj: Object = {}, result: Object = {}): Object {
		obj = this.cleanSequelizeData(obj);

		return flatObject(obj, result);
	}

	isInteger(num: number = 0): boolean {
		return isInteger(num);
	}

	isInArray(value: any = '', array: Array<any> = []): boolean {
		return isInArray(value, array);
	}

	titleCase(string: string = ''): string {
		return titleCase(string);
	}

	get passwordExpiry(): Date {
		const dateExpiry = new Date();
		dateExpiry.setDate(dateExpiry.getDate() + this.config.passwordExpiryLength || 30);

		return dateExpiry;
	}

	get secretKey(): string {
		return this.config.secretKey || '';
	}

	get secretHash(): string {
		return this.config.secretKeyHash || '';
	}

	get defaultUserRole(): number {
		return this.config.defaultUserRole || 5;
	}

	get defaultLanguage(): number {
		return this.config.defaultLanguage || 1;
	}

	get defaultCurrency(): number {
		return this.config.defaultCurrency || 85;
	}

	get startDate(): string {
		return dateTimeNowStart;
	}

	get endDate(): string {
		return dateTimeNowEnd;
	}

	encode(data): string {
		return Buffer.from(data).toString('base64');
	}

	decode(data): string {
		return Buffer.from(data, 'base64').toString('ascii');
	}

	hashEncode(data): any {
		return encode(this.config.secretKeyHash, this.toString(data));
	}

	hashDecode(data: any): any {
		return decode(this.config.secretKeyHash, this.toString(data));
	}
}
