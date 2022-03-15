import { AxiosInstance, Method } from 'axios';
import { ALLOWED_HEADERS, BABEL_FEATURES, HTTP_VERB } from './enums';
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
  defaultOkResponse: boolean;
  defaultLocale?: string;
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

  constructor(options?: BabelServiceConfigParams) {
    this.httpInstance = BabelProxyHttp.getInstance();
    this.serviceUrl = BabelProxyHttp.getInstanceConfig().baseURL ?? '';

    //TODO: DEFINE SERVICE LOCALE
    this.defaultLocale =
      options && options.defaultLocale?.length
        ? options.defaultLocale
        : 'config.serviceLocale';
    this.recoveryMessagingTemplate =
      options && options?.defaultOkResponse === true
        ? okMessagingTemplate
        : disasterMessagingTemplate;
    this.recoveryInterpreterTemplate = [];
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
    const transactionConfig = {
      headers: {
        [ALLOWED_HEADERS.LOCALE]: options?.locale ?? this.defaultLocale,
      },
    };

    const response = await this.httpInstance.request({
      baseURL: `${this.serviceUrl}${BABEL_FEATURES.MESSAGING}`,
      method: method,
      data: payload,
      headers: transactionConfig.headers,
    });

    // const response = await this.httpInstance.post(payload, headOpts);

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
  }

  private async coreInterpreter(
    method: Method,
    payload: unknown,
    options?: BabelRequestOptions,
  ): Promise<BabelMessagingResult[]> {
    const transactionConfig = {
      headers: {
        [ALLOWED_HEADERS.LOCALE]: options?.locale ?? this.defaultLocale,
      },
    };

    const response = await this.httpInstance.request({
      baseURL: `${this.serviceUrl}${BABEL_FEATURES.INTERPRETER}`,
      method: method,
      data: payload,
      headers: transactionConfig.headers,
    });

    if (response.data) {
      return response.data;
    }

    return this.recoveryInterpreterTemplate;
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

    // return this.babelService.getInterpreter(converted);
    return this.loadTranslations(converted, options);
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
