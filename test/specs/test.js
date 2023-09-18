const assert = require('assert');

async function waitUntilDashboardLoaded(browser, timeout=1000000000) {
    const text = 'Create Workspace';
    const h1Class = 'pf-c-title';
    const xpathSelector = `//h1[contains(text(), "${text}") and contains(@class, "${h1Class}")]`;
    await browser.waitUntil(
      async () => await browser.$(xpathSelector).isDisplayed(),
      {
        timeout,
      }
    );
    browser.pause(500);
}

async function refreshDashboard(browser) {
    let i = 0;
    while (true) {
        console.log(`Times refreshing the dashboard: ${++i}`);
        await browser.refresh();
        await waitUntilDashboardLoaded(browser);
    }
}

function checkFor4xxErrors(event) {
    if (event.response.status === 401 || event.response.status === 403) {
        debugger;
    } 
}

describe('Test', () => {
    it('refresh until 4xx errors', async () => {

        if (!process.env.CHE_URL) {
            assert.fail('Environment variable CHE_URL is required')
        }

        let url = process.env.CHE_URL;
        if (!url.endsWith('/')) {
            url = url + '/';
        }

        url = url + 'dashboard/#/create-workspace';

        await browser.url(url);
        await browser.cdp('Network', 'enable');

        // wait until logged in
        await waitUntilDashboardLoaded(browser);


        await browser.on('Network.responseReceived', async (event) => {
            checkFor4xxErrors(event);
        });

        await refreshDashboard(browser);


    })
})

