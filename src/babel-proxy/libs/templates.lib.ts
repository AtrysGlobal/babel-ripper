/**
 * Template responses for disaster scenarios
 */

import { BabelMessagingResult } from '..';

export const okMessagingTemplate: BabelMessagingResult = {
  id: 'unknown',
  message: 'Operation done',
  httpCode: 200,
  internalCode: 'AAXX999',
};

export const disasterMessagingTemplate: BabelMessagingResult = {
  id: 'unknown',
  message: 'Critical Failure Message',
  httpCode: 500,
  internalCode: 'YYZZ898',
};
