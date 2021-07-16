import * as nodeMailer from 'nodemailer';

export class Mailer {
	transporter: any;

	constructor(private config) {
		this.transporter = nodeMailer.createTransport({
			host: 'smtp.gmail.com',
			port: '587',
			secureConnection: 'false',
			tls: {
				ciphers: 'SSLv3'
			},
			auth: {
				user: this.config.mail.username,
				pass: this.config.mail.password
			}
		});
	}

	send(email: Array<any> = []) {
		const promises: Array<any> = email.reduce( (promise: Array<any>, emailValue: Object) => {
			promise.push(
				this.transporter.sendMail({
					from: `"${this.config.name}" <${this.config.mail.username}>`,
					to: emailValue['to'] || null,
					subject: emailValue['subject'] || `${this.config.name} e-mail`,
					html: emailValue['html']
				})
			);

			return promise;
		}, []);

		return Promise.all(promises);
	}
}
