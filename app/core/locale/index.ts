import * as path from 'path';
import * as fs from 'fs';
import { Locales } from "../types";

class Locale {
  static availables: string[] = ['en', 'fr'];
  static locale: string = 'en';
  static locales: Locales = {};
  static initialized = false;

  constructor() {
    if (!Locale.initialized) {
      this.readLanguageFile();
      Locale.initialized = true;
    }
  }

  static setLocale(locale: string = 'en'): void {
    Locale.locale = locale;
  }

  static getLocale(): string {
    return Locale.locale;
  }

  static trans(key: string, params: { [string: string]: string } = {}, defaultValue = '') {
    if (!Locale.locales[Locale.locale]) {
      return defaultValue;
    }
    let message = Locale.locales[Locale.locale][key];
    if (message) {
      const keys = Object.keys(params);
      if (keys.length > 0) {
        keys.forEach((k) => {
          message = message.replace(`{${k}}`, params[k]);
        });
      }

      return message;
    }

    return defaultValue;
  }

  readLanguageFile() {
    const langFolderPath = path.join(__dirname, '../../locale');
    const files = fs.readdirSync(langFolderPath);
    const length = files.length;

    for (let i = 0; i < length; i += 1) {
      const file = files[i];
      const filePath = `${langFolderPath}/${file}`;
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        const localeFiles = fs.readdirSync(filePath);
        Locale.locales[file] = {};
        const localeFilesLength = localeFiles.length;
        for (let j = 0; j < localeFilesLength; j += 1) {
          const content = fs.readFileSync(`${filePath}/${localeFiles[j]}`, { encoding: 'utf8' });
          Locale.locales[file] = { ...Locale.locales[file], ...(JSON.parse(content)) };
        }
      }
    }
  }
}

export default Locale;
