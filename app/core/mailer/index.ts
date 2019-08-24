import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import handlebars from 'handlebars';

import * as config from '../config';
import Logger from '../logger';
import Locale from '../locale';

/**
 * This class is responsible to send email with HTML template
 *
 * @class
 */
class Mailer {
  /**
   * Set a value in Redis
   * @static
   *
   * @param {Object} data
   *
   * @return void
   */
  static sendMail(data: any) {
    try {
      const user: string = config.MAIL_USERNAME;

      const smtpTransport = nodemailer.createTransport({
        // @ts-ignore
        host: config.MAIL_HOST,
        port: config.MAIL_PORT,
        auth: {
          user,
          pass: config.MAIL_PASSWORD,
        },
      });

      const filePath = `${path.join(__dirname, `./templates/${Locale.getLocale()}`)}/${data.template}.html`;
      const source = fs.readFileSync(filePath);
      const template = handlebars.compile(source.toString());
      const html = template(data.context);

      const updatedData = {
        ...data,
        from: `Node Starter <${user}>`,
        subject: Locale.trans(data.subject),
        html
      };

      smtpTransport.sendMail(updatedData);
    } catch (e) {
      Logger.error(e);
    }
  }
}

export default Mailer;
