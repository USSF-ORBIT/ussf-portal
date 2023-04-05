# Use `jq` to Collect Stats on MongoDb user data

## Pre-requisites

This documentation assumes a couple of things.

1. You have `jq` installed.
   You can install it via brew `brew install jq`
2. You have a file with data from the user collection in JSON format.
   1. If the data is in Cloud One DocumentDB, [follow documentation on how to export mongodb on C1.](use-mongoexport-on-c1.md#use-mongoexport-on-cloud-one)

Tips: [JQ Manual](https://stedolan.github.io/jq/manual/) for details on built in functions and what they do. If you want to experiment not on the cli you can use [JQ Play's](https://jqplay.org) web interface to try things out quickly.

## Collecting Stats

Caveat many of the below commands make use of `unique` jq command since we currently have duplicate user accounts. Ideally we won't need those in the future.

### Total unique users

```sh
jq 'map(.userId) | unique | length' mongo-data-export.json
```

The above command maps all the data to be just a list of `userId`s and then filters out any duplicates and counts the total.

Alternatively this should work but due to duplicate users in the system this number is currently higher.

```
jq 'map(.userId) | length' mongo-data-export.json
```

### List all unique EDIPIs

```sh
jq 'map(.userId) | unique | map(split(".") | .[-1])' mongo-data-export.json > edipi.csv
```

Similar to the above this filters down the `userId` but then it splits the id on `.` and retrieves the last item which is the EDIPI.

### Total dark theme users

```sh
jq 'map(select(.theme == "dark") | .userId) | unique | length' mongo-data-export.json
```

Filters the list down to those with `theme` set to `dark`. Once that is done it continues the similar path of filtering down to `userId` and counting as before.

### Total accounts with duplicate user records

```sh
jq 'group_by(.userId) | map(select(length>1) | .[0]) | length' mongo-data-export.json
```

This will count how many users have duplicate accounts. This number might be less than the total number of duplicate accounts as users might have more than one duplicate record.

### Count `mySpace` collections in a users account for duplicate user

```sh
jq 'group_by(.userId) | map(select(length>1) | map((.mySpace | length)))' mongo-data-export.json
```

This will return a list of collection accounts. Each grouping is by user so any grouping has more than 0 collections it means duplicate accounts have mySpace collections.
