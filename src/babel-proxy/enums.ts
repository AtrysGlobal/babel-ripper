/**
 * List of Headers Allowed by this
 * service.
 *
 */
export enum ALLOWED_HEADERS {
  LOCALE = 'locale',
  API_KEY = 'X-Api-Key',
}

/**
 * List of available Babel Translation
 * Service's features. Organized by
 * endpoints.
 *
 */
export enum BABEL_FEATURES {
  MESSAGING = 'messaging',
  INTERPRETER = 'interpreter',
}

export enum HTTP_VERB {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATH = 'PATH',
  DELETE = 'DELETE',
}

/**
 * Supported Locale Codes
 */
export enum LOCALES {
  es_ES = 'es_ES',
  es_CO = 'es_CO',
  es_AR = 'es_AR',
  es_CL = 'es_CL',
  pt_BR = 'pt_BR',
  en_US = 'en_US',
}
