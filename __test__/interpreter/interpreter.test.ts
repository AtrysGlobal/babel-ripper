import * as dotenv from 'dotenv';
dotenv.config();

import { BabelProxyService } from '../../src';

describe('Interpreter Module Test Suite', () => {
  const apiKey = process.env.SAMPLE_API_KEY || '';
  const apiAddress = process.env.SAMPLE_API_ADDRESS || '';

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
      apiAddress,
      defaultLocale: 'es_CL',
    });

    const result = await babel.loadTranslations(request);
    expect(result.length).toBe(request.length);
  });

  it("Dictionary translation to 'pt_BR' ", async () => {
    const dictionary = {
      titleLabel: 'prescription-types.PRESCRIPTION',
      messageTitle: 'register-title',
    };

    const babel = new BabelProxyService({
      apiKey,
      apiAddress,
      defaultLocale: 'pt_BR',
    });
    const result = await babel.loadTranslationsFromObject(dictionary);
    expect(result.length).toBe(Object.values(dictionary).length);
  });
});

