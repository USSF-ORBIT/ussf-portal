# Integrating handling personnel data in the portal

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps @minhlai
- Date: 2023-06-13

Technical Story: [Determine how we will ingest personnel data spreadsheets](https://app.shortcut.com/orbit-truss/story/2051/determine-how-we-will-ingest-personnel-data-spreadsheets-in-order-to-display-data-on-the-portal)
Epic Story: [Personnel data ingestion w/ static data](https://app.shortcut.com/orbit-truss/epic/2068)

## Context and Problem Statement

The project needs to read personnel data, but currently does not have access to the API that can provide it. As a temporary solution, we have been provided an export of personnel data in an Excel file that we can use to show on the portal until we are able to gain access to the API. We want to incorporate this data but also do not want to put too much work into processing the Excel file since we will eventually have access to an API.

## Decision Drivers

- Need to provide solution for accessing personnel data
- Avoiding significant investment in Excel processing that will eventually be replaced by an API
- Need for flexibility to switch to API backend in the future without much rework

## Considered Options

- Parse and store the personnel data as part of our client or CMS application
- Set up a small service or lambda that provides a graphql api to access the spreadsheet
- Combination of other two options, parse personnel data into database and set up a small service or lambda that provides a graphql api to access it

## Decision Outcome

Chosen option: "Set up a small service or lambda that provides a graphql api to access the spreadsheet" because it provides a simple solution for accessing personnel data while avoiding significant investment in storing that data, which will eventually be replaced by an API. Additionally, having an intermediary graphQL API will help insulate us from needing big changes once we have access to the API.

### Consequences of Decision Outcome

- Good, because it provides a simple solution for accessing personnel data while avoiding significant investment in storing that data, which will eventually be replaced by an API
- Good, because having the personnel data displayed as part of our application will happen as soon as possible.
- Good, because it will allow for flexibility to switch to an API backend in the future without changing the code too much
- Bad, because we have to add functionality to store and read from an Excel spreadsheet

## Pros and Cons of the Options

### Parse and store the data as part of our client or CMS application

- Good, because it provides a simple solution for accessing personnel data
- Bad, because having the personnel data stored as part of our application will require us to remove that data once we have access to the API
- Bad, because storing personnel data will require additional development effort to design a database model and access
- Bad, because a lot of code will need to be replaced when we have access to the API

### Set up a small service or lambda that provides a graphql api to access the spreadsheet

- Good, because it provides a simple solution for accessing personnel data while avoiding significant investment in loading the data into a database
- Good, it will allow for flexibility to switch to an API backend in the future without changing the graphql schema provided to the main app
- Good, can set a pattern for how to handle external integrations down the road
- Bad, because setting up and maintaining a new service/lambda may require additional development effort and resources

### Combination of other two options, parse personnel data into database and set up a small service or lambda that provides a graphql api to access it

- Good, because it provides a simple solution for accessing personnel data
- Good, it will allow for flexibility to switch to an API backend in the future without changing the graphql schema provided to the main app
- Good, can set a pattern for how to handle external integrations down the road
- Bad, because having the personnel data stored as part of our application will require us to remove that data once we have access to the API
- Bad, because storing personnel data will require additional development effort to design a database model and access
- Bad, because setting up and maintaining a new service/lambda may require additional development effort and resources
