# Integrating handling personnel data in the portal

- Status: Accepted
- Deciders: @gidjin @abbyoung @jcbcapps @minhlai
- Date: 2023-06-13

Technical Story: [Determine how we will ingest personnel data spreadsheets](https://app.shortcut.com/orbit-truss/story/2051/determine-how-we-will-ingest-personnel-data-spreadsheets-in-order-to-display-data-on-the-portal)


## Context and Problem Statement

The project needs to read user data, but currently does not have access to the API that can provide this data. As a temporary solution, we have been provided an export of data in an Excel file that we can use to show the data until we are able to gain access to the API. We also do not want to put much work into processing the exported data since we will eventually have access to the API.

## Decision Drivers

- Need to provide a temporary solution for accessing user data from Excel
- Avoiding significant investment in Excel processing that will eventually be replaced by an API
- Need for flexibility to switch to API backend in the future
- Scalability and maintainability of the code

## Considered Options

- Parse and store the data as part of our client or CMS application
- Set up a small service or lambda that provides a graphql api to access the spreadsheet data
- Set up a small service or lambda that provides a graphql api to access the data after it's imported to a database

## Decision Outcome

Chosen option: "Set up a small service or lambda that provides a graphql api to access the spreadsheet data" because it provides a simple solution for accessing user data while avoiding significant investment in Excel processing and storing data that will eventually be replaced by an API. Additionally, having an intermediary graphQL API will help insulate us from needing big changes once we have access to the API.

### Consequences of Decision Outcome

- Good, because it provides a simple solution for accessing user data while avoiding significant investment in Excel processing that will eventually be replaced by an API
- Good, because having the data stored as part of our application will allow for flexibility to switch to an API backend in the future without changing the code too much
- Good, because this option will be more scalable than using a lambda function
- Bad, because parsing and storing the data may require additional development effort and resources

## Pros and Cons of the Options

### Parse and store the data as part of our client or CMS application

- Good, because it provides a simple solution for accessing user data
- Bad, because having the data stored as part of our application will require us to remove that data once we have access to the API
- Bad, because storing the data will require additional development effort

### Set up a small service or lambda that provides a graphql api to access the spreadsheet data

- Good, because it provides a temporary solution for accessing user data while avoiding significant investment in loading the data into a database
- Good, it will allow for flexibility to switch to an API backend in the future without changing the graphql schema provided to the main app
- Good, can set a pattern for how to handle external integrations down the road
- Bad, because setting up and maintaining a new service/lambda may require additional development effort and resources

### Set up a small service or lambda that provides a graphql api to access the data after it's imported to a database

- Good, because it provides a temporary solution for accessing user data while avoiding significant investment in loading the data into a database
- Good, it will allow for flexibility to switch to an API backend in the future without changing the graphql schema provided to the main app
- Good, can set a pattern for how to handle external integrations down the road
- Bad, because setting up and maintaining a new service/lambda may require additional development effort and resources
- Bad, because extra work goes into load the data into a database that will need to be removed once we have the API
