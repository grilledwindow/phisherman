import { describe, it } from 'vitest';
import { extractMainDomain, runTests, checkUrl } from '.';

describe.concurrent('main', () => {
    // it('extracts main domain', ({ expect }) => {
    //     const result = extractMainDomain('https://www.paypal.com');
    //     expect(result).toBe('paypal.com');
    // });

    it('runs tests', () => {
        runTests();
    });

   

});
