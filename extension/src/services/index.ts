import { parse } from 'tldts';
import levenshtein from 'fast-levenshtein';
import confusables from 'unicode-confusables'; //might not need
import axios from 'axios';
import { trustedDomains, shortenedDomains } from './domains';
import {tall} from 'tall'
const whois = require("whois-json");

//mission: debug url expander
// import {https} from "follow-redirects";
// import urlExpander from "expand-url";
// const express = require('express')
import puppeteer from "puppeteer"

type Checked = { sus: boolean, message?: string };

function isShortenedUrl(url: string) {
    const { domain } = parse(url);
    console.log(`isshortenedurl, domain: ${domain}`)
    console.log(shortenedDomains.includes(domain))
    return shortenedDomains.includes(domain);
}

async function expandShortenedUrl(shortUrl: string) { //exxxxxxx
    if (!isShortenedUrl(shortUrl)) return shortUrl;


    console.log("before try")
    try {
        console.log("entered try")
        const unshortenedUrl = await tall(shortUrl)
        console.log(unshortenedUrl)
        console.log('Tall url', unshortenedUrl)
    } catch (err) {
        console.error('AAAW 👻', err)
    }
    

    // try{
    // const response = await fetch(shortUrl, {
    //     method: 'HEAD',
    //     redirect: 'follow'
    //   })
    //   console.log('Expanded URL:', response.url);
    //   return response.url; // Return the final unshortened URL
    // } catch (err) {
    //     console.error('Error expanding URL:', err);
    //     return shortUrl; // Return the original URL if an error occurs
    // }


    //Approach 1:
    // try {
    //     const response = await axios.head(shortUrl, { timeout: 300000 });
    //     return response.request.res.responseUrl;  // Get the expanded URL from the response
    // } catch (error) {
    //     // If HEAD request fails, try GET
    //     console.error("HEAD request failed:", error.message);
    //     try {
    //         const response = await axios.get(shortUrl, { timeout: 100000, maxRedirects: 100});
    //         return response
    //         return response.request.res.responseUrl;
    //     } catch (error) {
    //         console.error("GET request failed:", error.message);
    //         return shortUrl // `request to expand url failed: ${shortUrl}`;  // Return original if both requests fail
    //     }
    // }

    // Approach 2: Browser imitation (node.js library)
    // const browser = await puppeteer.launch(); // Launch headless browser
    // const page = await browser.newPage();

    // try {
    //     await page.goto(shortUrl, { waitUntil: 'networkidle0' }); // Wait for network to be idle (good for redirects)
    //     const finalUrl = page.url(); // Get the final URL after redirects
    //     console.log(`Expanded URL: ${finalUrl}`);
    //     return finalUrl;
    // } catch (error) {
    //     console.error("Error expanding URL:", error.message);
    //     return shortUrl; // Return the original shortened URL if something goes wrong
    // } finally {
    //     await browser.close(); // Close the browser after processing
    // }



    //Approach 3: some scuffed ass 9 yr ago code
    //return urlExpander.expand(shortUrl);


    //Approach 4:
    // return new Promise((resolve, reject) => {
    //     https.get(shortUrl, (res) => {
    //         resolve(res.responseUrl || shortUrl);
    //     }).on("error", (err) => {
    //         console.error("Error expanding URL:", err.message);
    //         reject(shortUrl);
    //     });
    // });


    
    
}


async function getWhois(domain: string) {
    // Approach 1: Public API (limited requests, need account)
    // try {
    //     const response = await axios.get(`https://whois-api.whoisxmlapi.com/api/v1?apiKey=YOUR_API_KEY&domainName=${domain}`);
    //     const creationDate = response.data.createdDate;
    //     const domainAgeDays = (new Date() - new Date(creationDate)) / (1000 * 3600 * 24);

    //     if (domainAgeDays < 90) {
    //         return `High Risk, ${domain} is less than 90 days old.`;
    //     }
    // } catch (error) {
    //     return `WHOIS lookup failed: ${error.message}`;
    // }


    // Approach 2: making use of "whois-json"
    try {
        const data = await whois(domain);

        const creationDate = data.creationDate || data["created"] || data["Creation Date"];
        if (!creationDate) {
            return "Could not retrieve domain creation date.";
        }

        const domainAgeDays = (new Date() - new Date(creationDate)) / (1000 * 3600 * 24);

        return domainAgeDays < 90
            ? `High Risk: ${domain} is ${Math.floor(domainAgeDays)} days old (less than 90 days).`
            : null;
    } catch (error) {
        return `WHOIS lookup failed: ${error.message}`;
    }
}

export function extractMainDomain(url) {
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
    
    const nonLatinRegex = /[^\x00-\x7F]/g //non latin
    const homoglyphsFound = url.match(nonLatinRegex) || [];

    
    if (!hasHomoglyph(url)) return null;

    if (homoglyphsFound.length > 0) {

        return { sus: true, message: `Confusable characters '${homoglyphsFound.join("', '")}'` };
    } else {
        return { sus: false };
    }
}

function hasHomoglyph(url) {
    // Placeholder: You can integrate homoglyph detection here or remove if not needed.
    const nonLatinRegex = /[^\x00-\x7F]/g

    const nonLatins = url.match(nonLatinRegex) || [];

    // If non-Latin characters are found, return a message
    if (nonLatins.length > 0) {
        return `Confusable characters detected: ${nonLatins.join(', ')}`;
    } 

    return null;
}

export async function checkUrl(url: string) {
    const expandedUrl = await expandShortenedUrl(url);
    const parsedUrl = new URL(expandedUrl);
    //console.log(parsedUrl)
    
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

    let domainScore = null; // if domainScore stays null at the end, pass it to AI Model
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
        {"content": fullDomain, type: "domain", "score": domainScore},
        {"content": parsedUrl.pathname, type: "path", "score": null},
        {"content": reasons, type: "reason"}
    ]
}

export async function runTests() {
    const testUrls = [
        // "http://www.paypal.com",
        //  "http://раyраl.com",
        // "http://paypаl.com",
        // "https://shorturl.at/xXfIb",
        "https://shorturl.at/dH6kn",
        "https://shorturl.at/caaqg" // youtube
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
        console.log(expandShortenedUrl(url),"hi")
        // try {
        // const expanded = await expandShortenedUrl("https://shorturl.at/dH6kn")
        // console.log(`Expanded: ${expanded}`);
        // } catch (error) {
        //     console.error(`Error expanding ${url}:`, error);
        // }
        console.log("-------");
        console.log(result)
    }
}

