https://chows-plan-trip.surge.sh/

:wave:
**parcel index.html**
Runs the app in the development mode.

1. parcel index.html
1. delete dist file
1. parcel build index.html
1. surge -d https://[domain].surge.sh

Connecting to the [Winnipeg Transit Data API](https://api.winnipegtransit.com/), the search will return a list of streets that match the search query. Clicking on any of the streets in the returned list will display the next buses, for each route, at all the stops on a the selected street.

Provide a search function that will allow users to search for a particular street by name. Winnipeg transit has a [Streets resource](https://api.winnipegtransit.com/home/api/v3/services/streets) to which you can submit a string and get back a list of matching streets (or an empty array).

Next, when a user clicks on a street, get all the stops on the chosen street. You'll need to use the [stops endpoint](https://api.winnipegtransit.com/home/api/v3/services/stops) to accomplish this.

Take these results and find the next 2 buses for each route, and populate that data into the table at each stop using the [stop schedules endpoint](https://api.winnipegtransit.com/home/api/v3/services/stop-schedules). Use Promise.all to display all the schedule data at the same time.
