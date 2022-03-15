/**
 * List of Headers Allowed by this
 * service.
 *
 */
export enum ALLOWED_HEADERS {
  LOCALE = 'Locale-Target',
  API_KEY = 'X-Api-Key',
}

/**
 * List of available Babel Translation
 * Service's features. Organized by
 * endpoints.
 *
 */
export enum BABEL_FEATURES {
  MESSAGING = '/services/tcr/messaging',
  INTERPRETER = '/services/tcr/interpreter',
}

export enum HTTP_VERB {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATH = 'PATH',
  DELETE = 'DELETE',
}
