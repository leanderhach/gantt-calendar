import { writable, type Writable } from "svelte/store";

// track which calendars are being used
export const usingGcal: Writable<boolean> = writable(false);
export const usingOutlookCal: Writable<boolean> = writable(false);

// track if the calendar has been connected
export const gcalConnected: Writable<boolean> = writable(false);
export const outlookCalConnected: Writable<boolean> = writable(false);

// store for current gapi state
export const gapiLoaded: Writable<boolean> = writable(false);
export const gsiTokenClient: Writable<google.accounts.oauth2.TokenClient | null> = writable(null);