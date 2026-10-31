import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:'browser.spec.mjs',fullyParallel:false,workers:1,
 timeout:45000,retries:0,
 reporter:[['list'],['html',{open:'never'}],['json',{outputFile:'test-results/browser-results.json'}]],
 use:{baseURL:'http://127.0.0.1:4190',viewport:{width:1440,height:1000},trace:'retain-on-failure',screenshot:'only-on-failure',headless:true},
 webServer:{command:'node scripts/serve-built.mjs',url:'http://127.0.0.1:4190',env:{PORT:'4190'},reuseExistingServer:false,timeout:20000}
});
