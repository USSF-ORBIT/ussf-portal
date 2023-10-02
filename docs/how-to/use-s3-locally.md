# Use S3 locally for CMS and Personnel projects

## Pre-requisites
- You are able to log into the Space Force team 1Password vault
- You have access to Space Force's dev AWS environment

## Background

Both the `ussf-portal-cms` and `ussf-personnel-api` projects make use of S3 for storing image uploads and personnel spreadsheets, respectively. Both projects are setup so that when you check them out they use the local filesystem by default. This works for most development and testing needs, but occasionally one will need to connect to S3 to test that connection out. This document will walk through the steps for doing that, they are the same for both projects.

## Note

If you need to add files to S3 for testing, say if there is a new personnel data spreadsheet the simplest way is to log into the AWS console and upload the file. Once in the console go to the [S3 home page](https://s3.console.aws.amazon.com/s3/home) and find the bucket you want to add to. Once in the bucket you can upload via the `Upload` button.

## Use dev AWS S3 locally

### Inspect the `.envrc`

The `.envrc` file that is checked into the repo will contain the following:

```sh
export S3_BUCKET_NAME='test_bucket'
export S3_REGION='test_region'
export S3_ACCESS_KEY_ID='thiscanbeanything'
export S3_SECRET_ACCESS_KEY='thiscanbeanything'
```

The code that handles files in the `cms` and `personnel` repos uses `S3_BUCKET_NAME` to toggle local mode vs S3 mode. If `S3_BUCKET_NAME` is set to `test_bucket` the code will *NOT* connect to S3 but instead use the local filesystem. The `cms` will store files in `public/images` and `public/files`. The `personnel` project will read spreadsheets from the `spreadsheets` folder in the root.

### Look up the credentials

Open `1Password` and search the `Space Force Portal` vault for the document `USSF Personnel API S3`. This will show the 4 values you will need for the next step.

### Modify or Create `.envrc.local`

Add the following to your `.envrc.local` file that is in the root of the project. If you don't have one create one. [direnv](https://direnv.net) will read the `.envrc` and use the `.envrc.local` to over ride it. Also the `.envrc.local` is in our `.gitignore` file so it won't be checked in accidentally.

```sh
export S3_BUCKET_NAME='real-name-from-1password'
export S3_REGION='real-region-from-1password'
export S3_ACCESS_KEY_ID='real-access-key-id-from-1password'
export S3_SECRET_ACCESS_KEY='real-secret-access-key-from-1password'
```

> :warning: The values for the above need to be kept secure, thus cannot be in this document nor checked into our repo. 

Save the file.

### Tell `direnv` to load new values

`direnv` will might warn you that you need to allow the new values to take effect. Either way you need to run the `direnv allow` command.

```sh
> direnv allow
direnv: loading ~/code/sign/ussf-portal-cms/.envrc
direnv: loading ~/code/sign/ussf-portal-cms/.envrc.local
direnv: export +ASSET_BASE_URL +COMPOSE_FILE +COMPOSE_PATH_SEPARATOR +DATABASE_URL +DB_UI_CLIENT +DB_UI_CMS +NEXT_TELEMETRY_DISABLED +PORT +PORTAL_URL +RDS_TLS_CERT +REDIS_URL +S3_ACCESS_KEY_ID +S3_BUCKET_NAME +S3_REGION +S3_SECRET_ACCESS_KEY +SESSION_DOMAIN +SESSION_SECRET
```

### Restart the project

For this step simply stop the `cms` or `personnel` service and run `yarn dev` in the appropriate terminal window.

### Use the project

For the `cms` you will see any files you upload show up in the bucket in dev AWS. To see them in the bucket you can log into the AWS console. For the `personnel` project you will see data returned from the spreadsheets in S3.
