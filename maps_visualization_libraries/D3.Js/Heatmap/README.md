
This example visualizes the [Police Department Incident Reports: 2018 to Present](https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783) dataset. It is accessible at:

<https://data.sfgov.org/Public-Safety/Police-Department-Incident-Reports-2018-to-Present/wg3w-h783>

We will only look at the last week of incidents that resulted in an arrest.

## Base Maps

The dataset includes several regions that we could use for our basemap:

  - [Current Police Districts](https://data.sfgov.org/Public-Safety/Current-Police-Districts/wkhw-cjsf)

  - [Current Supervisor Districts](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Current-Supervisor-Districts/8nkz-x4ny)

  - [Analysis Neighborhoods](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h)

We are going to use the [Analysis Neighborhoods](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Analysis-Neighborhoods/p5b7-5n3h) for our primary basemap.

We are also going to include streets to help provide additional context:

  - [Streets Active and Retired](https://data.sfgov.org/Geographic-Locations-and-Boundaries/Streets-Active-and-Retired/3psu-pn9h)

These datasets could be loaded from their SODA API endpoints. However, that would require an app token. Since these maps do not change frequently, we will use the exported GeoJSON files instead for simplicity.

## Projection

We are going to use the [Conic Equal-Area](https://github.com/d3/d3-geo#conic-projections) projection. We need to give this projection [standard parallels](https://en.wikipedia.org/wiki/Map_projection#Conic) that will determine where distortion will be low.

To determine these parallels, we will use <https://www.latlong.net> to find parallels on either side of San Francisco:

<https://www.latlong.net/c/?lat=37.774929&long=-122.419418>

## Arrests Data

If we always want the last week of arrest data, we cannot simply export the dataset to a static JSON file. Instead, we are going to access the arrests dataset using the [SODA API](http://dev.socrata.com/). The endpoint for this API is:

<https://data.sfgov.org/resource/nwbb-fxkq.json>

If you want to replicate this example, you will need to request your own app token (free).

We specifically only want to include rows that have `Cite or Arrest Adult` or `Cite or Arrest Juvenile` as the `resolution`:

```
$where=starts_with(resolution, 'Cite or Arrest')
```

We will load the last week worth of data. We can calculate the date range in Javascript and D3, and then query for that date range using:

```
$where=incident_date between '2020-03-15' and '2020-03-21'
```

We can [combine the `where` clauses](https://dev.socrata.com/docs/queries/where.html) as follows:

```
$where=starts_with(resolution, 'Cite or Arrest') AND incident_date between '2020-03-15' and '2020-03-21'
```

We also want to remove anything that was not assigned a latitude or longitude, which we can do by checking the `point` column for `NULL` values:

```
$where=point IS NOT NULL
```

You may also want to set a reasonable limit like `$limit=1000` and URL encode the entire thing. Combined with our API endpoint, we end up with:

```
https://data.sfgov.org/resource/nwbb-fxkq.json?$where=starts_with(resolution, 'Cite or Arrest') AND incident_date between '2020-03-15' and '2020-03-21' AND point IS NOT NULL&$limit=1000
```

Except in our example we also include an app token (see below) and [URL encode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) our parameters.

## App Tokens

This example uses an app token registered specifically for this block. **You will not be able to use this app token yourself.** This token only works from the block URL.

You can simply remove the app token if you clone this example (but realize you may be throttled if you make too many requests), or download the necessary files and load them locally.

If you wish to register your own app token (only necessary for public examples you will share widely), see:

<https://dev.socrata.com/consumers/getting-started.html>

I suggest you go through this process for your projects (if appropriate), but not necessarily homework or labs.
