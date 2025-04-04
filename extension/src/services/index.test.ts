import { describe, it } from 'vitest';
import { extractMainDomain } from '.';

describe.concurrent('main', () => {
    it('extracts main domain', ({ expect }) => {
        const result = extractMainDomain('https://www.phisherman.com');
        expect(result).toBe('phisherman.com');
    });
});
