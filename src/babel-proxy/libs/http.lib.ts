import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
// import config from '../../../config';
import { ALLOWED_HEADERS } from '../enums';

export abstract class BabelProxyHttp {
  static getInstanceConfig(): AxiosRequestConfig {
    //TODO: ADD BABEL ADDRESS
    return {
      baseURL: 'config.babelAddress',
      timeout: 5000,
      responseType: 'json',
    };
  }

  static getInstance(): AxiosInstance {
    const instance = axios.create(BabelProxyHttp.getInstanceConfig());
    instance.interceptors.request.use(
      function (config) {
        //TODO: ADD BABEL API KEY
        if (config.headers) {
          config.headers[ALLOWED_HEADERS.API_KEY] = 'api Key';
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
