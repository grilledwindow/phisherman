import { describe, it } from 'vitest';
import { extractMainDomain, runTests } from '.';

describe.concurrent('main', () => {
    it('extracts main domain', ({ expect }) => {
        const result = extractMainDomain('https://www.phisherman.com');
        expect(result).toBe('phisherman.com');
    });

    it('runs tests', () => {
        runTests();
    });
});
