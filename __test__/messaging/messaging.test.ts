import * as dotenv from 'dotenv';
dotenv.config();

import { BabelProxyService } from '../../src';

describe('Messaging Module Test Suite', () => {
  const apiKey = process.env.SAMPLE_API_KEY ?? '';

  it("Valid messaging result from 'es_ES' ", async () => {
    const messaging = {
      target: 'appointment-document.bioSigns.titleLabel',
    };

    const babel = new BabelProxyService({
      apiKey,
      defaultLocale: 'es_ES',
    });
    const result = await babel.loadMessage(messaging);
    expect(result.id).toBe(messaging.target);
    expect(result.message.length).not.toBe(0);
    expect(result.httpCode).not.toBe(undefined);
  });
});
