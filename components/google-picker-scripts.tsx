'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    tokenClient: any;
    gapi: any;
    google: any;
    onApiLoad: () => void;
    onPickerApiLoad: () => void;
    gisLoaded: () => void;
    openPicker: (config: any) => void;
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
        .setCallback((data: any) => {
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
