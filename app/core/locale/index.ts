import * as path from 'path';
import * as fs from 'fs';
import { Locales } from "../types";

/**
 * This class is responsible for internationalization
 * @class
 *
 * @property {string[]} availables - Languages available
 * @property {string} locale - Represents the current locale
 * @property {Object} locales - Represents translation keys
 * @property {boolean} initialized - Indicates if the locale files is loaded
 */
class Locale {
  /**
   * @private
   * @static
   * */
  private static availables: string[] = ['en', 'fr'];

  /**
   * @private
   * @static
   * */
  private static locale: string;

  /**
   * @private
   * @static
   * */
  private static locales: Locales = {};

  /**
   * @private
   * @static
   * */
  private static initialized = false;

  /**
   * Initialize locale in the application
   * @public
   * @static
   *
   * @return void
   */
  public static init() {
    if (!Locale.initialized) {
      Locale.readLanguageFile();
      Locale.initialized = true;
      Locale.locale = Locale.availables[0];
    }
  }

  /**
   * Get available locales
   * @public
   * @static
   *
   * @return string[]
   */
  public static getAvailableLocales(): string[] {
    return Locale.availables;
  }

  /**
   * Set the current locale
   * @public
   * @static
   *
   * @param {string} locale=en - Locale to set as the current
   *
   * @return void
   */
  public static setLocale(locale: string = 'en'): void {
    Locale.locale = locale;
  }

  /**
   * Get the current locale
   * @public
   * @static
   *
   * @return string
   */
  public static getLocale(): string {
    return Locale.locale;
  }

  /**
   * Get the text based on the current locale
   *
   * @public
   * @static
   *
   * @param {string} key - Key in the object for which we want to translate the value
   * @param {Object} params - Object containing the locale's keys
   * @param {string} defaultValue='' - Value to return if the key is not found
   *
   * @return string
   */
  public static trans(key: string, params: { [string: string]: string } = {}, defaultValue = '') {
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

  /**
   * Load all the locale files to get translation keys and values
   *
   * @private
   *
   * @return void
   */
  private static readLanguageFile() {
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

export { Locale };
