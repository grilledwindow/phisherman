import { parse } from 'tldts';
import levenshtein from 'fast-levenshtein';
import confusables from 'unicode-confusables';
import axios from 'axios';
import { trustedDomains, shortenedDomains } from './domains';

export const a = levenshtein.get('', '')

type Checked = { sus: boolean, message?: string };

function isShortenedUrl(url: string) {
    const { domain } = parse(url);
    console.log(`isshortenedurl, domain: ${domain}`)
    
    return shortenedDomains.includes(domain);
}

async function expandShortenedUrl(shortUrl: string) {
    if (!isShortenedUrl(shortUrl)) return shortUrl;
    
    try {
        const response = await axios.head(shortUrl, { timeout: 3000 });
        return response.request.res.responseUrl;  // Get the expanded URL from the response
    } catch (error) {
        // If HEAD request fails, try GET
        try {
            const response = await axios.get(shortUrl, { timeout: 5000, maxRedirects: 5});
            return response.request.res.responseUrl;
        } catch (error) {
            return `request to expand url failed: ${shortUrl}`;  // Return original if both requests fail
        }
    }
}

async function getWhois(domain: string) {
    try {
        const response = await axios.get(`https://whois-api.whoisxmlapi.com/api/v1?apiKey=YOUR_API_KEY&domainName=${domain}`);
        const creationDate = response.data.createdDate;
        const domainAgeDays = (new Date() - new Date(creationDate)) / (1000 * 3600 * 24);

        if (domainAgeDays < 90) {
            return `High Risk, ${domain} is less than 90 days old.`;
        }
    } catch (error) {
        return `WHOIS lookup failed: ${error.message}`;
    }
}

function extractMainDomain(url) {
  const {domain} = parse(url);
  console.log(domain)
  return domain;
}

function checkTyposquat(url, threshold = 2): Checked | null  {
    const domain = extractMainDomain(url);
    if (trustedDomains.includes(domain)){
        return { sus: false }
    }
    // Check for typosquatting
    for (let trusted of Object.keys(trustedDomains)) {
        if (levenshtein.get(domain, trusted) <= threshold) {
            return { sus: true, message: `⚠️ Possible typosquatting detected: ${url} (Did you mean ${trusted}?)` };
        }
    }
    return null;
}

function checkSubdomainSpoofed(url): Checked | null {
    const { subdomain } = parse(url);
    for (let trusted of trustedDomains) {
        const trustedBase = trusted.split('.')[0];
        if (subdomain.includes(trustedBase)) {
            return { sus: true, message: `⚠️ Possible subdomain spoofing detected: ${url} (Contains trusted name '${trustedBase}' in subdomain)` };
        }
    }
    return { sus: false };
}

// Placeholder for homoglyph check (you might need an alternative library or custom check)
function checkHomoglyph(url: string): Checked | null {
    // Placeholder: You can integrate homoglyph detection here or remove if not needed.
    if (!confusables.isConfusing(url)) return null;

    const homoglyphsFound = confusables.confusables(url)
        .filter(item => item.similarTo)  // Only keep items with 'similarTo' property
        .map(item => item.similarTo)   // Extract the 'similarTo' value
        .filter(letter => letter !== 'rn'); // Filter out 'rn' as a fake letter for 'm'

    if (homoglyphsFound > 0){
        console.log(homoglyphsFound)
        return { sus: true, message: `Confusable characters '${homoglyphsFound.join("', '")}'` };
    } else {
        return { sus: false };
    }
}

async function checkUrl(url: string) {
    const expandedUrl = await expandShortenedUrl(url);
    const parsedUrl = new URL(expandedUrl);
    
    const scheme = parsedUrl.protocol + "//"

    // define subdomain
    const parts = parsedUrl.hostname.split('.');

    // Join all parts before the last two as the subdomain
    const subdomain = parts.length <= 2 ? null : parts.slice(0, -2).join('.');
    const domain = extractMainDomain(expandedUrl);

    console.log(`test - domain = ${domain}`)
    console.log(`test - subdomain = ${subdomain}`)

    let fullDomain = subdomain ? subdomain + '.' + domain : domain;

    // Scheme score
    let schemeScore = 1;
    if (scheme === 'http://') schemeScore = 0.5;
    else if (scheme === 'https://') schemeScore = 0;

    let domainScore = 0;
    const reasons = [
        checkHomoglyph(expandedUrl),
        checkTyposquat(expandedUrl),
        checkSubdomainSpoofed(expandedUrl)
    ].reduce<Array<string | undefined>>((reasons, checked) => {
        if (checked !== null && checked.sus) {
            domainScore += 1;
            return [checked.message, ...reasons];
        }
        return reasons;
    }, []);

    getWhois(expandedUrl).then(result => result && reasons.push(result));

    return [
        {"content": scheme, type: "scheme", "score": schemeScore},
        {"content": fullDomain, "type": "domain", "score": domainScore},
        {"content": parsedUrl.pathname, type: "path", "score": null},
        {"content": reasons, type: "reason"}
    ]
}

export async function runTests() {
    const testUrls = [
        "http://www.paypal.com",
        "http://раyраl.com",
        "http://paypаl.com",
        "https://shorturl.at/xXfIb",
        "https://shorturl.at/dH6kn"
        // "http://www.sub.paypal.com",
        // "http://www.sub-paypal.com",
        // "http://www.paypal.secure.com"

        // "https://paypa1.com",
        // "https://confusable-homοglyphs.readthedocs.io/en/latest/apidocumentation.html#confusable-homoglyphs-package",
        // "https://shorturl.at/xXfIb",
        // "https://www.posb.com.sg/redirect?url=https://www.googl3.com", 
        // "https://shorturl.at/ZAaws",
        // "https://tinyurl.com/fake-google",
        // "https://example.com/login?redirect_url=https://phishing-site.com",
        // "https://paypalknkkn.com"
    ];

    for (let url of testUrls) {
        const result = await checkUrl(url);
        console.log("-------");
        console.log(result);
    }
}

