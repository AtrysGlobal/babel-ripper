import { AxiosInstance, Method } from 'axios';
import { BabelRipper } from '../babel-ripper';
import { ALLOWED_HEADERS, BABEL_FEATURES, HTTP_VERB, LOCALES } from './enums';
import { BabelHandler } from './libs/handler.lib';
import { BabelProxyHttp } from './libs/http.lib';
import {
  disasterMessagingTemplate,
  okMessagingTemplate,
} from './libs/templates.lib';

interface ITranslationPayload {
  [key: string]: string | BabelTargetInterface;
}

interface IBabelService {
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
}

/**
 * Clase basada en el patrón proxy destinada a gestionar
 * la comunicación con servicio externo dedicado de
 * traducciones [Babel Serverless].
 *
 */
export default class BabelProxyService implements IBabelService {
  private httpInstance: AxiosInstance;
  private serviceUrl: string;
  private defaultLocale: string;
  private recoveryMessagingTemplate: BabelMessagingResult;
  private recoveryInterpreterTemplate: any[];

  constructor(options: BabelServiceConfigParams) {
    if (!options || !options.apiKey || !options.apiKey.length) {
      throw new Error('Must provide a valid [BABEL] API Key');
    }

    this.httpInstance = BabelProxyHttp.getInstance(options.apiKey);
    this.serviceUrl = BabelProxyHttp.getInstanceConfig().baseURL ?? '';

    this.defaultLocale =
      options && options.defaultLocale?.length
        ? options.defaultLocale
        : LOCALES.es_ES;
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
   * Core handler for POST Requests
   * (Messaging feature)
   *
   * @param endpoint
   * @returns
   */
  private async coreMessaging(
    method: Method,
    payload: unknown,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult> {
    try {
      const transactionConfig = {
        headers: {
          [ALLOWED_HEADERS.LOCALE]: options?.locale ?? this.defaultLocale,
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

  private async coreInterpreter(
    method: Method,
    payload: unknown,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    try {
      const transactionConfig = {
        headers: {
          [ALLOWED_HEADERS.LOCALE]: options?.locale ?? this.defaultLocale,
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
   * Listado de textos a ser traducidos/interpretados a
   * través de babel.
   * Incluye soporte de interpolación de
   * parámetros.
   *
   *
   * @param targetList Listado de objetos de traducción/interpretación
   * @param options Opciones de configuración (Request)
   * @returns Listado de traducciones
   */
  public loadTranslations(
    targetList: BabelTargetInterface[],
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    return this.coreInterpreter(HTTP_VERB.POST, targetList, options);
  }

  /**
   * Objeto (diccionario con referencias i18n) destinado
   * a mapear un conjunto de traducciones para simplificar
   * proceso de traducción de grandes volúmenes de datos.
   *
   *
   * @param targetList Listado de objetos de traducción/interpretación
   * @param options Opciones de configuración (Request)
   * @returns Objeto de traducciones
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
   * Objeto (diccionario con referencias i18n) destinado
   * a mapear un conjunto de traducciones para simplificar
   * proceso de traducción de grandes volúmenes de datos.
   *
   * Esta función retorna un objeto BabelRipper ya listo
   * para ser utilizado.
   *
   *
   * @param targetList Listado de objetos de traducción/interpretación
   * @param options Opciones de configuración (Request)
   * @returns Objeto BabelRipper
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
     * Obtiene un mensaje específico (éxito/error) a través
     * del servicio de traducción babel. 
     * Incluye soporte de interpolación de
     * parámetros.

     * @param target Objeto de mensaje a traducir
     * @param options Opciones de configuración (Request)
     * @returns Mensaje traducido
     */
  public async loadMessage(
    target: BabelTargetInterface,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult> {
    return this.coreMessaging(HTTP_VERB.POST, target, options);
  }
}
