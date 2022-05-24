import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ALLOWED_HEADERS } from '../enums';

const defaultAddress =
  'https://dev.services.telemedicina.com/translations/interpreter';

const BABEL_ADDRESS = process.env.BABEL_SERVICE ?? defaultAddress;
const BABEL_TIMEOUT = 5000;
export abstract class BabelProxyHttp {
  static getInstanceConfig(): AxiosRequestConfig {
    return {
      baseURL: BABEL_ADDRESS,
      timeout: BABEL_TIMEOUT,
      responseType: 'json',
    };
  }

  static getInstance(apiKey: string): AxiosInstance {
    const instance = axios.create(BabelProxyHttp.getInstanceConfig());
    instance.interceptors.request.use(
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

    return instance;
  }
}
