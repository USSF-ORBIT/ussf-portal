# Use National Weather Service API for Weather Widget

* Status: accepted
* Deciders: @gidjin, @abbyoung, @jcbcapps, @jbecker
* Date: 2023-07-13
Technical Story: [Investigate weather APIs to use for weather widget](https://app.shortcut.com/orbit-truss/story/1442/investigate-weather-apis-to-use-for-weather-widget)

## Context and Problem Statement

We need to choose an API to power the new weather widget for My Space. While the widget has not been designed yet, there are a few known requirements:

* Users can have multiple weather widgets on their My Space.
* Users should be able to pass in a zip code to retrieve the location / weather.
* For v1 of the widget, we can assume Users will be searching for US-based locations.


## Decision Drivers 

* We want to pass in a zip code and retrieve a location-based forecast.
* We want a low-cost solution that is sustainable.  As the application user base grows, the number of API calls per minute will increase.
* We want a well-documented API that is developer-friendly and quick to set up.

## Considered Options

* [OpenWeatherMap](https://openweathermap.org/api)
* [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
* [Microsoft Azure Maps](https://azure.microsoft.com/en-us/products/azure-maps/)

## Decision Outcome

**Chosen option: National Weather Service API**

We decided to use the free National Weather Service API. It has the data we need to build v1 of the weather widget, and it can be replaced in the future as our needs change (international support, etc.)

### Positive Consequences <!-- optional -->

* Free and open to the public
* We can start development immediately
* Well-documented
    * [OpenAPI spec](https://weather-gov.github.io/api/general-faqs#:~:text=https%3A//api.weather.gov/openapi.yaml) to view full docs using Swagger
    * [Developer documentation](https://weather-gov.github.io/api/)
    * [Code example](https://weather-gov.github.io/api/general-faqs)
* BONUS: We get to support a fellow government service!

### Negative Consequences <!-- optional -->

* No geocoding endpoint, so we'll need to use a separate API or [store the information ourselves.](https://github.com/midwire/free_zipcode_data)
* The rate limit is unknown to the public. Even though it sounds like normal usage won't be throttled, there's a chance we could run into performance issues down the line.
* Each forecast will take two API calls to retrieve the data we need to display in the widget.

## Pros and Cons of the Options <!-- optional -->

### OpenWeatherMap

Freemium product, based in London, UK.

* Good, because it includes worldwide weather data.
* Good, because has its own geocoding endpoint.
* Bad, because pricing for our needs starts at $180/mo and would rise to an estimated $470/mo.
* Bad, because out-of-the-box widgets are limited and cannot be customized.

### Microsoft Azure Maps
Real-time weather data part of the Microsoft Azure Maps subscription. 

* Good, because USSF uses Microsoft products and would be familiar with the ecosystem.
* Good, because has its own geocoding API.
* Bad, because it is a very robust maps API, and we only need access to one or two endpoints for weather data.
* Bad, because it is a subscription with an opaque pricing structure that requires working through a sales process and could delay development.

## Links <!-- optional -->

* [Weather Widget API Discovery](https://docs.google.com/document/d/18i_L30mcTkBA_yjVP6eFALcLWF2QyrAQqX7g9GDbdbo/edit)

<!-- markdownlint-disable-file MD013 -->