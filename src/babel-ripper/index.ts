import { BabelMessagingResult, BabelTargetInterface } from '../babel-proxy';

export class BabelRipper {
  public translations: BabelMessagingResult[];
  constructor(translations: BabelMessagingResult[]) {
    this.translations = translations;
  }

  /**
   * Returns the translation result for a given
   * translation reference.
   *
   * @param {string} input - Translation reference.
   * @returns {string} - Translation result.
   *
   * @example
   *
   * const dictionary = {
   *   hello: 'messages.hello',
   *   bye: 'messages.bye'
   * }
   *
   * const babel = new BabelProxyService(...);
   * const result = await babel.loadGuttedTranslations(dictionary);
   *
   * result.get(dictionary.hello); // Hola!
   * result.get(dictionary.bye); // Adiós!
   *
   */
  public get(input: string | BabelTargetInterface): string {
    return (
      this.translations.find((el) =>
        typeof input === 'string' ? el.id === input : el.id === input.target,
      )?.message || ''
    );
  }

  /**
   * Returns the translation result for a given
   * translation reference.
   *
   * @deprecated This function will be deprecated in future versions. Please use the `get` function instead.
   *
   * @param {string} input - Translation reference.
   * @returns {string} - Translation result.
   *
   * @example
   *
   * const dictionary = {
   *   hello: 'messages.hello',
   *   bye: 'messages.bye'
   * }
   *
   * const babel = new BabelProxyService(...);
   * const result = await babel.loadGuttedTranslations(dictionary);
   *
   * result.getTranslation(dictionary.hello); // Hola!
   * result.getTranslation(dictionary.bye); // Adiós!
   *
   */
  public getTranslation(input: string | BabelTargetInterface): string {
    return (
      this.translations.find((el) =>
        typeof input === 'string' ? el.id === input : el.id === input.target,
      )?.message || ''
    );
  }

  /**
   * Returns the translation identifier for a given
   * translation message.
   *
   * @param {string} input - Translation message.
   * @returns {string} - Translation identifier.
   *
   */
  public getIdentifier(input: string | BabelMessagingResult) {
    return (
      this.translations.find((el) =>
        typeof input === 'string'
          ? el.message === input
          : el.message === input.message,
      )?.id || ''
    );
  }
}
