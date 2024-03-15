# Additional Testing Tools

We've found the following testing tools useful for debugging and writing [unit and integration tests](code-coverage-testing.md). 

  - [Apollo Server Explorer](#apollo-server-explorer)
  - [Wiremock](#wiremock)


## Apollo Server Explorer

Apollo server comes with a built in tool for executing graphql queries against your local server. It's disabled by default, but you can easily enable it. To do so switch the `ApolloServerPluginLandingPageDisabled` in `src/pages/api/graphql.tsx` to the below with `ApolloServerPluginLandingPageLocalDefault` instead. Note you will need to enable embedding to allow it to connect properly to your server. Details about the options are [documented here](https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages)

```diff
diff --git a/src/pages/api/graphql.tsx b/src/pages/api/graphql.tsx
index 5fd1b8d..1979e22 100644
--- a/src/pages/api/graphql.tsx
+++ b/src/pages/api/graphql.tsx
@@ -6,7 +6,11 @@ import {
   ApolloError,
   gql,
 } from 'apollo-server-micro'
-import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
+import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
 import type { PageConfig } from 'next'

 import { typeDefs } from '../../schema'
@@ -64,7 +68,12 @@ const clientConnection = async () => {
 export const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
-  plugins: [ApolloServerPluginLandingPageDisabled()],
+  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
   context: async ({ req, res }) => {
```

## Wiremock

We use wiremock to avoid making 3rd party API calls during e2e testing. For example we use it to mock out the expected weather api calls that our end to end tests will make. Below is a table of the valid zip codes in the mock data long with the relevant data they will return. Once the service is running you can see all the mappings via the admin api: http://localhost:8181/__admin/. Note only the following zipcodes will work in e2e tests with this setup.

| city               | zipcode  | points url                         | gridpoint url                          | temp |
| :----------------- | :------- | :--------------------------------- | :------------------------------------- | :--- |
| Beverely Hills, CA | 90210    | /points/34.0901,-118.4065          | /gridpoints/LOX/149,48/forecast/hourly | 105  |
| Tempe, AZ          | 85202    | /points/33.3851,-111.8724          | /gridpoints/PSR/166,54/forecast/hourly | 29   |
| Chicago, IL        | 60601    | /points/41.8858,-87.6181           | /gridpoints/LOT/76,73/forecast/hourly  | 68   |
| Atlanta, GA        | 30310    | /points/33.7278,-84.42319999999998 | /gridpoints/FFC/49,86/forecast/hourly  | 83   |
| Guadalupe, AZ      | 85001    | /points/33.4484,-112.074           | /gridpoints/PSR/159,58/forecast/hourly | 99   |

Mappings are defined in [the mappings folder](../e2e/mappings). For more details see the [wiremock documentation](https://wiremock.org/docs/)