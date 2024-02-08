import { PUBLIC_GAPI_API_KEY, PUBLIC_GAPI_CLIENT_ID, PUBLIC_GAPI_DISCOVERY_DOCS, PUBLIC_GAPI_SCOPES } from "$env/static/public";
import { gapiLoaded, gsiTokenClient } from "$lib/store/calendarHosts";
import { get } from "svelte/store";

let tokenClient: google.accounts.oauth2.TokenClient | null = null;


export async function initGapi() {
  console.log("initialising gapi client")
  console.log(gapi)
  gapi.load("client", startGapi);
  gapiLoaded.set(true);
}

async function startGapi() {
  await gapi.client.init({
    apiKey: PUBLIC_GAPI_API_KEY,
    discoveryDocs: PUBLIC_GAPI_DISCOVERY_DOCS.split(" "),
  });
}

export async function initGsi() {
  console.log("initialising gsi client")
  gsiTokenClient.set(google.accounts.oauth2.initTokenClient({
    client_id: PUBLIC_GAPI_CLIENT_ID,
    scope: PUBLIC_GAPI_SCOPES,
    callback: async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          await listUpcomingEvents();
        }
    ,
  }));
}

export async function handleAuthClick() {
  const client = get(gsiTokenClient);
  console.log(gapi.client)

  if (!client || !gapi.client) return;

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    client.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    client.requestAccessToken({prompt: ''});
  }
}

export async function listUpcomingEvents(count: number = 10, calendarId: string = "primary", timeMin: string = (new Date()).toISOString()) {
 let response;
  try {
    const request = {
      'calendarId': calendarId,
      'timeMin': timeMin,
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': count,
      'orderBy': 'startTime',
    };
    response = await gapi.client.calendar.events.list(request);
  } catch (err) {
    console.log(err);
    return;
  }

  const events = response.result.items;
  console.log(events)

  return events;
}

