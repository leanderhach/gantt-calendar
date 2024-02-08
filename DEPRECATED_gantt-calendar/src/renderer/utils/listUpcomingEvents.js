import store from '../store';

export default async function listUpcomingEvents(gapi) {
  gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 100,
    orderBy: 'startTime',
  }).then((response) => {
    const events = response.result.items;

    if (events.length > 0) {
      for (let i = 0; i < events.length; i += 1) {
        const event = events[i];
        let when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        store.dispatch('setCalendarEvents', event);
      }
    }
  });
}
