import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import fs from 'fs';
import { URL } from 'url';

(async () => {
    const url = 'https://www.cbssports.com/betting';

    const browserServer = await chromium.launchServer({
        headless: true,
        args: ['--remote-debugging-port=9222'],
    });
    // setup lighthouse config
    console.log('Running Lighthouse analysis...');
    const { lhr } = await lighthouse(url, {
        port: 9222, 
        output: 'json',
        onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
    });
    // extract results
    const extractedScores = {
        Performance: Math.round(lhr.categories.performance.score * 100),
        Accessibility: Math.round(lhr.categories.accessibility.score * 100),
        "Best Practices": Math.round(lhr.categories["best-practices"].score * 100),
        SEO: Math.round(lhr.categories.seo.score * 100),
    };
    // save results to lighthouse-report.json
    const reportPath = './lighthouse-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(extractedScores, null, 2));
    console.log(`Lighthouse scores saved to ${reportPath}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();


    // check response and find broken links and add to list 
    const brokenResources = [];
    page.on('response', async (response) => {
        const status = response.status();
        if (status !== 200) {
            const resourceUrl = response.url();
            brokenResources.push({ url: resourceUrl, status });
        }
    });

    await page.goto(url);

    await page.waitForTimeout(5000); 

    // log broken resources if they exist
    if (brokenResources.length > 0) {
        console.log('Broken resources or resources with non-200 status codes:');
        brokenResources.forEach((resource) => {
            console.log(`URL: ${resource.url} - Status: ${resource.status}`);
        });

        // save broken links to broken-links.json
        const brokenLinksPath = './broken-links.json';
        fs.writeFileSync(brokenLinksPath, JSON.stringify(brokenResources, null, 2));
        console.log(`Broken links saved to ${brokenLinksPath}`);
    } else {
        console.log('All resources loaded successfully with status 200.');
    }

    await browser.close();
    await browserServer.close();
})();
