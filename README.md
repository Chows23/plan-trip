https://chows-plan-trip.surge.sh/

:wave:
**parcel index.html**
Runs the app in the development mode.

1. parcel index.html
1. delete dist file
1. parcel build index.html
1. surge -d https://[domain].surge.sh

# Instructions
For this project, you will build a trip planning application using the [Geocoding API of MapBox](https://docs.mapbox.com/api/search/) and the [Trip Planning API from Winnipeg Transit](https://api.winnipegtransit.com/home/api/v3/services/trip-planner).
* Use the bbox option which will limit geocoding to a border box. The border box around the Winnipeg area can be defined by the following coordinates `-97.325875, 49.766204, -96.953987, 49.99275`.
