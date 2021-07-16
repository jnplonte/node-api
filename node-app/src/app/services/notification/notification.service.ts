import * as fs from 'fs';

import { Helper } from './../helper/helper.service';
import { Mailer } from './../mailer/mailer.service';

export class Notification {
	helper: Helper;
	mailer: Mailer;

	constructor(private config) {
		this.helper = new Helper(this.config);
		this.mailer = new Mailer(this.config);
	}

	sendForgotPasswordEmail(email: string = '', data: Object = {}, isTest?: boolean): Promise<string> {
		const resetPasswordLink: string = this.helper.replaceHtml(data['return'], {'key': encodeURIComponent(data['forgotPasswordKey'])});

		if (isTest) {
			return Promise.resolve(resetPasswordLink);
		}

		const subject: string = (data['subject']) ? data['subject'] : `${this.config.name} forgot password`;
		const template: string = (data['template']) ? data['template'] : 'forgot-password-01';
		const htmlTemplate: string = fs.readFileSync(`${__dirname}/../../../../src/templates/${template}.html`, 'utf8');

		const dataSend: Array<any> = [
			{
				'to': email,
				'subject': subject,
				'html': this.helper.replaceHtml(htmlTemplate, {
					'subject': subject,
					'logo': (data['logo']) ? data['logo'] : this.config.logo,
					'email': email,
					'name': `${data['firstName']} ${data['lastName']}`,
					'resetPasswordLink': resetPasswordLink
				})
			}
		];

		return this.mailer.send(dataSend)
			.then( (mdata) => {
				return resetPasswordLink;
			})
			.catch( (error) => error );
	}

	sendVerificationEmail(email: string = '', data: Object = {}, isTest?: boolean): Promise<string> {
		const verificationLink: string = this.helper.replaceHtml(data['return'], {'key': encodeURIComponent(data['verificationKey'])});

		if (isTest) {
			return Promise.resolve(verificationLink);
		}

		const subject: string = (data['subject']) ? data['subject'] : `${this.config.name} user verification`;
		const template: string = (data['template']) ? data['template'] : 'verify-user-01';
		const htmlTemplate: string = fs.readFileSync(`${__dirname}/../../../../src/templates/${template}.html`, 'utf8');

		const dataSend: Array<any> = [
			{
				'to': email,
				'subject': subject,
				'html': this.helper.replaceHtml(htmlTemplate, {
					'subject': subject,
					'logo': (data['logo']) ? data['logo'] : this.config.logo,
					'email': email,
					'name': `${data['firstName']} ${data['lastName']}`,
					'verificationLink': verificationLink
				})
			}
		];

		return this.mailer.send(dataSend)
			.then( (mdata) => {
				return verificationLink;
			})
			.catch( (error) => error );
	}
}
