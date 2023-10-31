const assert = require('assert');

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

        await createWorkspace(browser);
        await waitUntilEditorLoaded(browser, 300000);


        await refreshEditorLoop(browser);
    })
})


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

function checkFor4xxErrors(event) {
    if (event.response.status === 401 || event.response.status === 403) {
        debugger;
    } 
}

async function createWorkspace(browser) {
    const devfile = encodeURIComponent(`${process.env.CHE_URL}dashboard/devfile-registry/devfiles/empty.yaml`);
    await browser.url(`${process.env.CHE_URL}/dashboard/#/load-factory?url=${devfile}&storageType=common`);
}

async function waitUntilEditorLoaded(browser, timeout=20000) {
    const monaco = await browser.$('.monaco-grid-view');
    await monaco.waitForExist({ timeout });

}

async function refreshEditorLoop(browser) {
    let i = 0;
    while (true) {
        await browser.refresh();
        console.log(`Times refreshing the editor: ${++i}`);
        try {
            await waitUntilEditorLoaded(browser);
        } catch(e) {
            console.log(`Editor did not load properly.`)
            await browser.pause(10000);
        }
        await browser.pause(1000);
    }
}
