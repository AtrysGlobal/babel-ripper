import * as dotenv from 'dotenv';
dotenv.config();

import { BabelProxyService } from '../../src';

describe('Interpreter Module Test Suite', () => {
  const apiKey = process.env.SAMPLE_API_KEY ?? '';

  it("List translation to 'es_CL' ", async () => {
    const request = [
      {
        target: 'appointment-document.bioSigns.titleLabel',
      },
      {
        target:
          'messagingText.TEXT.sendCrossAppointmentAddComment.messageTitle',
      },
    ];

    const babel = new BabelProxyService({
      apiKey,
      defaultLocale: 'es_CL',
    });
    const result = await babel.loadTranslations(request);
    expect(result.length).toBe(request.length);
  });

  it("Dictionary translation to 'pt_BR' ", async () => {
    const dictionary = {
      titleLabel: 'appointment-document.bioSigns.titleLabel',
      messageTitle:
        'messagingText.TEXT.sendCrossAppointmentAddComment.messageTitle',
    };

    const babel = new BabelProxyService({
      apiKey,
      defaultLocale: 'pt_BR',
    });
    const result = await babel.loadTranslationsFromObject(dictionary);
    expect(result.length).toBe(Object.values(dictionary).length);
  });
});
