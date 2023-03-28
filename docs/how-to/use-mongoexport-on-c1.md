# Use `mongoexport` on Cloud One

## Pre-requisites
- You are able to log into a Cloud One Bastion Host.
- You know the name of the Database and Collection that needs exporting.

## Background
In order to export MongoDB (DocumentDB on AWS), we need to have access to a host machine that has network access to the database. Cloud One Bastian Hosts can be accessed with a CAC and are in the same VPC as our DocumentDB clusters so there is implicit network access. Cloud One Bastion Hosts are `Windows x86-64 based virtual machines`. There is also no Internet connectivity nor Administrator Privilege. This means we have to get `mongodb-database-tools-windows-x86_64` binaries onto the Bastion host via Artifactory before we can use the tools. We will also need Artifactory to copy the binaries from Dev=>Test=>Prod as there is no way to promote between the environments bar copying via Artifactory. Alternatively, you can use DoD SAFE and request multiple drop-offs into each C1 environment.

## Uploading the `mongodb-database-tools`
1. Open a web browser and navigate to [MongoDB Command Line Database Tools Download](https://www.mongodb.com/try/download/database-tools). Select the appropriate Version (currently onl 100.7.0), `Windows x86_64` Platform, and `zip` Package to download. If you download `msi` Package, that file will require Administrative Privileges to install the tools rather than being a portable binary.
2. Follow the documentation in [upload a file to Cloud One](upload-file-to-c1.md#upload-a-file-to-cloud-one).
 
# Preparing to run `mongoexport` and Executing the Command
1. In the Cloud One Test/Prod Bastion Host, open AWS Console and navigate to DocumentDB. Select the Cluster you are trying to export from. Here you will find instructions on how to connect to the DocumentDB cluster.
2. Download the Amazon DocumentDB Certificate Authority (CA) certificate required to authenticate to your cluster. In the Bastion Host, you can paste the wget command into Powershell or a browser to download the certificate. It is simpler to download/copy the certificate to the same directory as where you unzipped the Mongo tools.
3. Take note of the `mongo shell` command to connect to the cluster. We will be taking several of the options and using them in `mongoexport`. Particularly we will be copying the values/flags `ssl, host, sslCAFile, and username`.
4. In AWS Console, navigate to the System Manager service and open the Parameter Store. Select `/{{ env }}/portal-client/db/docdb/user/muser/pwd` and take note of the password. Keep this tab open as you will need to paste this password when prompted by the `mongoexport` command.
5. Open Powershell and navigate to the directory where you unzipped `mongoexport`. You can use `cd` to change directory. Try `.\mongoexport.exe --help` to see available options if you wish to further modify the command.
6. Enter the following command, filling in the values. When prompted, paste or type in the password. `Right Click` to paste the password in the Powershell prompt on a macbook in the Windows VM.

```
.\mongoexport.exe --ssl --sslCAFile {{ CA certificate filename}} --host="{{ host }}" --db={{ db name }} --collection=users --username={{ username }} --out={{ output filename }} --jsonArray
```
Note: the db name in Test is `test` and `portal` in Prod
7. Examine the file. If the export worked in Test, you can move on to Prod.

## Exfiltrating the Data from Cloud One
As the Cloud One Bastion Hosts do not have Internet Access, we need to use DoD Safe to exfiltrate the data from the zone. Follow the documentation at [Download a file from Cloud One](transfer-file-to-from-c1-dod-safe.md#downloading-a-file-from-cloud-one
).
