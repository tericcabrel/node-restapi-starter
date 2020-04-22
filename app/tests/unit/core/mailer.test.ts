import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

import mailer from '../../../core/mailer';
import { Locale } from '../../../core/locale';

type EmailData = {
	to: string;
	subject: string;
	template: string;
	context: {
		email: string;
		name: string;
		url: string;
	}
};

const data: EmailData = {
	to: 'expeditor@test.com',
	subject: 'mail.subject.confirm.account',
	template: 'confirm-account-email',
	context: {
		email: 'test@email.com',
		name: 'Test User',
		url: 'http://localhost:3000/account/confirm',
	},
};

describe('TestMailer Module', (): void => {

	before((): void => {
		Locale.setLocale('en');
	});

	afterEach((): void => {
		sinon.restore();
	});

	it('should send an email', () => {
		const spyPath: sinon.SinonSpy = sinon.spy(path, 'join');
		const fsPath: sinon.SinonSpy = sinon.spy(fs, 'readFileSync');
		const spyCompile: sinon.SinonSpy = sinon.spy(handlebars, 'compile');

		/*const spyNodeMailer: sinon.SinonStub = sinon.stub(nodeMailerSender, 'sendMail')
			.callsFake((mailOptions: Mail.Options): Promise<SentMessageInfo> => {
				return new Promise((resolve: any, reject: any): void => {
					console.log('Sending email...');

					resolve('success');
				});
			});*/

		mailer.sendMail(data);

		expect(spyPath.calledOnce).to.be.true;
		expect(fsPath.calledOnce).to.be.true;
		expect(spyCompile.calledOnce).to.be.true;
		// expect(spyNodeMailer.calledOnce).to.be.true;

		// const args: any = spyNodeMailer.getCall(0).args;
		// console.log(args);
	});
});
