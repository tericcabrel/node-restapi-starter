import * as nodemailer from 'nodemailer';
import * as path from 'path';
import Logger from '../logger';

const hbs = require('nodemailer-express-handlebars');

import * as config from '../config';
import Locale from '../locale';

class Mailer {
  static sendMail(data: any) {
    try{
      const user = 'contact@tecogill.com';//config.MAIL_USERNAME;
      const pass = '73ecoGill95!'; //config.MAIL_PASSWORD;
      const host = 'pro1.mail.ovh.net'; // config.MAIL_HOST;
      const port = 587; //config.MAIL_PORT;

      const handlebarsOptions = {
        viewEngine: {
          extname: '.html',
          partialsDir: path.join(__dirname, `./templates/${Locale.getLocale()}/`),
          layoutsDir: path.join(__dirname, `./templates/${Locale.getLocale()}/`),
        },
        viewPath: path.join(__dirname, `./templates/${Locale.getLocale()}/`),
        extName: '.html',
      };
      const smtpTransport = nodemailer.createTransport({
        // @ts-ignore
        host,
        port,
        auth: {
          user,
          pass,
        },
      });

      smtpTransport.use('compile', hbs(handlebarsOptions));

      const updatedData = {
        ...data,
        from: `MyApp <${user}>`,
        subject: Locale.trans(data.subject),
      };

      smtpTransport.sendMail(updatedData);
    } catch (e) {
      Logger.error(e);
    }
  }
}

export default Mailer;
