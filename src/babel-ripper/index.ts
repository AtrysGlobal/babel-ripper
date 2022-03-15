import { BabelMessagingResult, BabelTargetInterface } from '../babel-proxy';

export class BabelRipper {
  public translations: BabelMessagingResult[];
  constructor(translations: BabelMessagingResult[]) {
    this.translations = translations;
  }

  public getTranslation(input: string | BabelTargetInterface) {
    return (
      this.translations.find((el) =>
        typeof input === 'string' ? el.id === input : el.id === input.target,
      )?.message ?? ''
    );
  }

  public getIdentifier(input: string | BabelMessagingResult) {
    return (
      this.translations.find((el) =>
        typeof input === 'string'
          ? el.message === input
          : el.message === input.message,
      )?.id ?? ''
    );
  }
}
