import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import handlebars from 'handlebars';

import * as config from '../config';
import Logger from '../logger';
import Locale from '../locale';

class Mailer {
  static sendMail(data: any) {
    try{
      const user = config.MAIL_USERNAME;
      const pass = config.MAIL_PASSWORD;
      const host = config.MAIL_HOST;
      const port = config.MAIL_PORT;

      const smtpTransport = nodemailer.createTransport({
        // @ts-ignore
        host,
        port,
        auth: {
          user,
          pass,
        },
      });

      const filePath = `${path.join(__dirname, `./templates/${Locale.getLocale()}`)}/${data.template}.html`;
      const source = fs.readFileSync(filePath);
      const template = handlebars.compile(source.toString());
      const html = template(data.context);

      const updatedData = {
        ...data,
        from: `MyApp <${user}>`,
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
