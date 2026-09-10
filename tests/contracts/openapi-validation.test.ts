import { readFileSync } from 'node:fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import { expect, it } from 'vitest';

it('the generated foundation API validates against OpenAPI 3.0 with only declared document references', async () => {
  const document = JSON.parse(readFileSync(new URL('../../contracts/generated/foundation-openapi.json', import.meta.url), 'utf8'));
  const references: string[] = [];
  function inspect(value: unknown): void {
    if (value === null || typeof value !== 'object') return;
    for (const [key, nested] of Object.entries(value)) {
      if (key === '$ref') {
        expect(typeof nested, 'Every $ref must be a string').toBe('string');
        expect(nested, 'External file and network references are forbidden').toMatch(/^#(?:\/|$)/);
        references.push(nested as string);
      } else inspect(nested);
    }
  }
  inspect(document);
  for (const reference of references) {
    const pointer = decodeURIComponent(reference.slice(1));
    let target: unknown = document;
    for (const encoded of pointer ? pointer.slice(1).split('/') : []) {
      expect(encoded, `Invalid JSON pointer escape in ${reference}`).not.toMatch(/~(?:[^01]|$)/);
      const key = encoded.replace(/~1/g, '/').replace(/~0/g, '~');
      expect(target !== null && typeof target === 'object' && Object.hasOwn(target, key), `Undeclared local reference ${reference}`).toBe(true);
      target = (target as Record<string, unknown>)[key];
    }
  }
  const parser = new SwaggerParser();
  const validated = await parser.validate(structuredClone(document), {
    resolve: { external: false, file: false, http: false },
    validate: { schema: true, spec: true },
  });
  expect(validated).toHaveProperty('openapi', '3.0.3');
  expect(parser.$refs.paths()).toHaveLength(1);
});
