'use client';

import Script from 'next/script';
import { useEffect } from 'react';

/*
  1. get appId, clientId, developerKey from GCP- unique per application, not customer 
  2. connect to google drive
  3. use connectionId and providerKey from Nango to get the accessToken from Nango
  4. feed accessToken, appId, clientId, developerKey into google picker
  5. call nango-sdk from nango.updateMetadata()
  6. re-syncing frontend with updated metadata
  7. grab the data from google drive, embed it, etc...
*/

interface GooglePickerResponse {
  action: string;
  [key: string]: any;
}

declare global {
  interface Window {
    tokenClient: any;
    gapi: any;
    google: any;
    onApiLoad: () => void;
    onPickerApiLoad: () => void;
    gisLoaded: () => void;
    openPicker: (config: { appId: string; clientId: string; developerKey: string; accessToken: string; callbackFunction: (data: GooglePickerResponse) => void; }) => void;
  }
}

let pickerInited = false;
let gisInited = false;

export function GooglePickerScripts() {
  useEffect(() => {
    console.log('[GooglePicker] Initializing scripts...');
    
    // Define global functions that the scripts will call
    window.onApiLoad = () => {
      console.log('[GooglePicker] API loaded, initializing picker...');
      window.gapi.load('picker', window.onPickerApiLoad);
    };

    window.onPickerApiLoad = () => {
      console.log('[GooglePicker] Picker API initialized');
      pickerInited = true;
    };

    window.gisLoaded = () => {
      console.log('[GooglePicker] GIS client loaded');
      gisInited = true;
    };

    // Define the openPicker function that will be called from other components
    window.openPicker = (config) => {
      console.log('[GooglePicker] Opening picker with config:', {
        appId: config.appId,
        hasAccessToken: !!config.accessToken,
        pickerInited,
        gisInited
      });

      if (!pickerInited || !gisInited) {
        console.error('[GooglePicker] Error: Picker or GIS not initialized');
        return;
      }

      const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
      console.log('[GooglePicker] Created view');

      const picker = new window.google.picker.PickerBuilder()
        .setAppId(config.appId)
        .setOAuthToken(config.accessToken)
        .addView(view)
        .setCallback((data: GooglePickerResponse) => {
          console.log('[GooglePicker] Picker callback data:', data);
          config.callbackFunction(data);
        })
        .setDeveloperKey(config.developerKey)
        .setTitle('Select a file')
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .enableFeature(window.google.picker.Feature.SUPPORT_DRIVES)
        .build();
      
      console.log('[GooglePicker] Picker built, showing dialog');
      picker.setVisible(true);
    };
  }, []);

  return (
    <>
      <Script
        src="https://apis.google.com/js/api.js"
        onLoad={() => {
          console.log('[GooglePicker] Google API script loaded');
          window.onApiLoad();
        }}
        strategy="lazyOnload"
      />
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => {
          console.log('[GooglePicker] GIS client script loaded');
          window.gisLoaded();
        }}
        strategy="lazyOnload"
      />
    </>
  );
}
