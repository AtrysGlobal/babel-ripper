import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ALLOWED_HEADERS } from '../enums';

// const defaultAddress =
//   'https://dev.services.telemedicina.com/translations/interpreter';

export interface AxiosInstanceParams {
  apiKey: string;
  baseURL: string;
  timeout?: number;
}

export abstract class BabelProxyHttp {
  /**
   * Receives basic communication values with babel service
   * and builds axios admissible configuration object.
   *
   * @param {string} baseURL - Babel API backend address.
   * @param {number} timeout - Response timeout (client side).
   *
   * @returns {AxiosRequestConfig} - Axios configuration object.
   */
  private static resolveInstanceConfig(
    baseURL: string,
    timeout?: number,
  ): AxiosRequestConfig {
    return {
      baseURL,
      timeout: timeout || 30000,
      responseType: 'json',
    };
  }

  /**
   * Creates and provides an Axios instance to communicate
   * with Babel's translation service.
   *
   * @param {string} apiKey - Authentication API Key with Babel service.
   * @param {string} baseURL - Babel API backend address.
   * @param {number} timeout - Response timeout (client side).
   * @returns {AxiosInstance}
   */
  public static getAxiosInstance({
    apiKey,
    baseURL,
    timeout,
  }: AxiosInstanceParams): AxiosInstance {
    const axiosInstance = axios.create(
      BabelProxyHttp.resolveInstanceConfig(baseURL, timeout),
    );

    /**
     * Interceptor to add API Key to every request.
     * Add any extra header here.
     */
    axiosInstance.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers[ALLOWED_HEADERS.API_KEY] = apiKey;
        }
        return config;
      },
      (error) => {
        throw error;
      },
    );

    return axiosInstance;
  }
}
