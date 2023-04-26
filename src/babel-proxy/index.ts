import { AxiosInstance, Method } from 'axios';
import { BabelRipper } from '../babel-ripper';
import { ALLOWED_HEADERS, BABEL_FEATURES, HTTP_VERB, LOCALES } from './enums';
import { BabelHandler } from './libs/handler.lib';
import { BabelProxyHttp } from './libs/http.lib';
import {
  disasterMessagingTemplate,
  okMessagingTemplate,
} from './libs/templates.lib';

export interface ITranslationPayload {
  [key: string]: string | BabelTargetInterface;
}

export interface IBabelService {
  loadTranslations(
    targetList: BabelTargetInterface[],
    options: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]>;

  loadMessage(
    target: any,
    options: BabelRequestOptions,
  ): Promise<BabelMessagingResult>;

  loadTranslationsFromObject(
    dictionaryKeyPair: ITranslationPayload,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]>;
}

export interface BabelRequestOptions {
  locale: string;
}

export interface BabelMessagingResult {
  id: string;
  message: string;
  httpCode?: number;
  internalCode?: string;
}

export interface BabelTargetInterface {
  target: string;
  params?: any;
}

export interface BabelServiceConfigParams {
  defaultOkResponse?: boolean;
  defaultLocale?: string;
  apiKey: string;
  apiAddress: string;
  clientTimeout?: number;
}

/**
 * Manages the organized retrieval of translations and pre-built
 * of error messages from atrys babel service.
 *
 * Babel Service is organized in two main sections:
 *
 * - Translations: Used to retrieve translations
 *   for a given target.
 * - Interpreter: Used to retrieve pre-built error
 *   messages for a given target.
 *
 * Also provides a method to retrieve translations
 * from a given structured object via Ripper tool.
 *
 */
export default class BabelProxyService implements IBabelService {
  private httpInstance: AxiosInstance;
  private serviceUrl: string;
  private defaultLocale: string;
  private recoveryMessagingTemplate: BabelMessagingResult;
  private recoveryInterpreterTemplate: any[];

  constructor(options: BabelServiceConfigParams) {
    // Api Key must be specified in any case and must
    // not be an empty string.
    if (!options || !options.apiKey || !options.apiKey.length) {
      throw new Error(
        'Babel Implementation Exception: Must provide a valid API key. Contact support center for more information.',
      );
    }

    // Api Address must be specified in any case and must
    // not be an empty string.
    if (!options.apiAddress || !options.apiAddress.length) {
      throw new Error(
        'Babel Implementation Exception: Must provide a valid API address. Contact support center for more information.',
      );
    }

    // Obtain shared axios instance.
    this.httpInstance = BabelProxyHttp.getAxiosInstance({
      apiKey: options.apiKey,
      baseURL: options.apiAddress,
      timeout: options.clientTimeout,
    });

    // Obtain shared babel api address.
    this.serviceUrl = options.apiAddress;

    // Configure shared default locale.
    this.defaultLocale =
      options && options.defaultLocale?.length
        ? options.defaultLocale
        : LOCALES.es_ES;

    // Configure default response mechanism
    // (by default service always responds with status 200).
    this.recoveryMessagingTemplate =
      options && options?.defaultOkResponse === true
        ? okMessagingTemplate
        : disasterMessagingTemplate;
    this.recoveryInterpreterTemplate = [];
  }

  private resolveCorePayload(mod: string, payload: unknown) {
    const base = {
      module: mod,
    };

    if (mod === BABEL_FEATURES.MESSAGING) {
      Object.assign(base, { message: payload });
    } else {
      Object.assign(base, { translations: payload });
    }

    return base;
  }

  /**
   * Core handler for Messaging features.
   *
   * @param {Method} method - HTTP verb to use.
   * @param {unknown} payload - Payload to send.
   * @param {BabelRequestOptions} options - Options to use.
   *
   * @returns {Promise<BabelMessagingResult>} - Promise with the result.
   */
  private async coreMessaging(
    method: Method,
    payload: unknown,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult> {
    try {
      const transactionConfig = {
        headers: {
          [ALLOWED_HEADERS.LOCALE]: options?.locale || this.defaultLocale,
        },
      };

      const response = await this.httpInstance.request({
        baseURL: `${this.serviceUrl}`,
        method: method,
        data: this.resolveCorePayload(BABEL_FEATURES.MESSAGING, payload),
        headers: transactionConfig.headers,
      });

      if (response.data) {
        const { id, message, httpCode, internalCode } = response.data;
        return {
          id,
          message,
          httpCode,
          internalCode,
        };
      }

      return this.recoveryMessagingTemplate;
    } catch (error) {
      BabelHandler.fromAxios(error);
      throw Error(
        `INTERNAL Exception while obtaining [BABEL] message(s): ${error}`,
      );
    }
  }

  /**
   * Core handler for Interpreter features.
   *
   * @param {Method} method - HTTP verb to use.
   * @param {unknown} payload - Payload to send.
   * @param {BabelRequestOptions} options - Options to use.
   *
   * @returns {Promise<BabelMessagingResult[]>} - Promise with the result.
   */
  private async coreInterpreter(
    method: Method,
    payload: unknown,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    try {
      const transactionConfig = {
        headers: {
          [ALLOWED_HEADERS.LOCALE]: options?.locale || this.defaultLocale,
        },
      };

      const response = await this.httpInstance.request({
        baseURL: `${this.serviceUrl}`,
        method: method,
        data: this.resolveCorePayload(BABEL_FEATURES.INTERPRETER, payload),
        headers: transactionConfig.headers,
      });

      if (response.data) {
        return response.data;
      }

      return this.recoveryInterpreterTemplate;
    } catch (error) {
      BabelHandler.fromAxios(error);
      throw Error(
        `INTERNAL Exception while obtaining [BABEL] translation(s): ${error}`,
      );
    }
  }

  /**
   * Manages the translation of multiple messages
   * through a reference list (i18n).
   *
   * Includes support for interpolation of parameters.
   *
   * @param {BabelTargetInterface[]} targetList - Translations reference list.
   * @param {BabelRequestOptions} options - On-the-fly configuration options.
   * @returns {BabelMessagingResult[]} - List of translated messages.
   */
  public loadTranslations(
    targetList: BabelTargetInterface[],
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    return this.coreInterpreter(HTTP_VERB.POST, targetList, options);
  }

  /**
   * Message translation process tool through
   * reference dictionary (i18n).
   *
   * This tool will respond with a BabelMessagingResult
   * array. This mean that the translation result extracted
   * and/or processing have to be defined by the client.
   *
   * @param {ITranslationPayload} dictionaryKeyPair - Reference dictionary.
   * @param {BabelRequestOptions} options - On-the-fly configuration options.
   * @returns {BabelMessagingResult[]} - List of translated messages.
   */

  public loadTranslationsFromObject(
    dictionaryKeyPair: ITranslationPayload,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    const converted = Object.values(dictionaryKeyPair).map((target) => {
      if (typeof target === 'string') {
        return { target };
      } else if (target.target) {
        const obs = { target: target.target };
        if (target.params) {
          Object.assign(obs, { params: target.params });
        }
        return obs;
      } else {
        throw new Error('Fatal error');
      }
    });

    return this.loadTranslations(converted, options);
  }

  /**
   * Message translation process tool through
   * reference dictionary (i18n).
   *
   * This tool will respond with a BabelRipper
   * object for an organized handling of translations.
   *
   * @example
   *
   * const dictionary = {
   *    hello: 'messages.hello',
   *    bye: 'messages.bye'
   * }
   *
   * const babel = new BabelProxyService(...);
   * const result = await babel.loadGuttedTranslations(dictionary);
   *
   * result.get(dictionary.hello); // Hola!
   * result.get(dictionary.bye); // Adiós!
   *
   *
   * @param {ITranslationPayload} dictionaryKeyPair - Reference dictionary.
   * @param {BabelRequestOptions} options - On-the-fly configuration options.
   * @returns {BabelRipper} - Organized translation object.
   */
  public async loadGuttedTranslations(
    dictionaryKeyPair: ITranslationPayload,
    options?: BabelRequestOptions,
  ): Promise<BabelRipper> {
    const translations = await this.loadTranslationsFromObject(
      dictionaryKeyPair,
      options,
    );
    return new BabelRipper(translations);
  }

  /**
   * Get a pre-defined message (success or error)
   * translated through the babel service.
   *
   * Includes support for interpolation of parameters.
   *
   * @param {BabelTargetInterface} target - Object with message reference to be translated.
   * @param {BabelRequestOptions} options - On-the-fly configuration options.
   * @returns {BabelMessagingResult} - Translated message (or List of translated messages).
   */
  public async loadMessage(
    target: BabelTargetInterface,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult> {
    return this.coreMessaging(HTTP_VERB.POST, target, options);
  }
}
