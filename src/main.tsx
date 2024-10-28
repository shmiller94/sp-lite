// @ts-expect-error: New relic types could not be resolved under current moduleResolution setting, so we ignore them for now
import { BrowserAgent } from '@newrelic/browser-agent';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { env } from '@/config/env';
import { getActiveLogin } from '@/lib/utils';

import { App } from './app';
import { enableMocking } from './testing/mocks';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

/**
 * Sets up a listener for window storage events.
 * This synchronizes state across browser windows and browser tabs.
 */
window.addEventListener('storage', (e: StorageEvent) => {
  if (e.key === null || e.key === 'activeLogin') {
    // Storage events fire when different tabs make changes.
    // On storage clear (key === null) or activeLogin change (key === 'activeLogin')
    // Refresh the page to ensure the active login is up to date.
    window.location.reload();
  }
});

/**
 * Since before we loaded service worker into the app, it might give some weird behavior for users
 * with the new vite app, therefore if we can find it, we unregister it
 *
 * NB: at some point we should bring back the import.meta.env.NODE_ENV === 'production' check
 * this kills ALL service workers and if we use it with mocked service worker that fakes API
 * it will most likely not work.
 *
 * This is currently tech debt introduced Sept 23, 2024 by NM
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        registrations.forEach((registration) => {
          registration.unregister().then((unregistered) => {
            if (unregistered) {
              console.log('Service worker unregistered:', registration);
            } else {
              console.warn('Failed to unregister:', registration);
            }
          });
        });
      }
    });
  });
}

/**
 * This values can be found if you go to:
 *
 * New relic => Browser => Application Settings => Find "Snippet Code" on the right
 * You will find there something like:
 *
 * <script type="text/javascript">
 * ;window.NREUM||(NREUM={});NREUM.init={...
 *
 * You need to take NREUM.init, NREUM.info and NREUM.loader_config and replace values that you need in doppler
 *
 * For session replay rates, adjust manually
 */
const options = {
  init: {
    session_replay: {
      enabled: true,
      block_selector: '',
      // P.S. if you have * here, all fields like h1, h2, p, etc will be replaced with *
      mask_text_selector: '',
      sampling_rate: 100.0,
      error_sampling_rate: 100.0,
      // P.S. if you have true here, all inputs on replay will be masked with ***
      mask_all_inputs: false,
      collect_fonts: true,
      inline_images: true,
      inline_stylesheet: true,
      mask_input_options: {},
    },
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.nr-data.net'] },
  }, // NREUM.init
  info: {
    beacon: 'bam.nr-data.net',
    errorBeacon: 'bam.nr-data.net',
    licenseKey: env.NEW_RELIC_INFO_LICENSE_KEY,
    applicationID: env.NEW_RELIC_INFO_APPLICATION_ID,
    sa: 1,
  }, // NREUM.info
  loader_config: {
    accountID: env.NEW_RELIC_LOADER_ACCOUNT_ID,
    trustKey: env.NEW_RELIC_LOADER_TRUST_KEY,
    agentID: env.NEW_RELIC_LOADER_AGENT_ID,
    licenseKey: env.NEW_RELIC_LOADER_LICENSE_KEY,
    applicationID: env.NEW_RELIC_LOADER_APPLICATION_ID,
  }, // NREUM.loader_config
};

/**
 * The agent loader code executes immediately on instantiation.
 *
 * To verify its working open console in browser and type newrelic,
 * you should be able to see an object here with all data
 */
const newrelic = new BrowserAgent(options);
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setuserid/
newrelic.setUserId(getActiveLogin()?.profile.userId);

enableMocking().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
