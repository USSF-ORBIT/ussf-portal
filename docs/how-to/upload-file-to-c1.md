# Upload a file to Cloud One

## Pre-requisites
- You are able to log into a Cloud One Bastion Host.
- You have access to Dev/Test/Prod Artifactory OR
- You have access to `DoD SAFE`.

## Background
Cloud One Bastion Hosts are `Windows x86-64 based virtual machines`. There is also no Internet connectivity nor Administrator Privilege. We will also need Artifactory to copy the file from Dev=>Test=>Prod as there is no way to promote between the environments bar copying via Artifactory.

You can also do a direct download of the file from `DoD SAFE` if you have previously created a dropoff request. 

## Uploading the file via Artifactory
1. Prepare the file for upload. Be aware that if the file is meant to be run in the Bastion host, it must be a portable binary for `Windows x86-64`. If the file requires Administrative Privileges to install something, it will not run in the Windows VM. Consider zipping the file as well.
2. Navigate to Dev Artifactory and change repositories to `Artifactory/Artifacts/PORTALIncoming` in the left navigation.
3. Click `⤒ Deploy` in the top right and click "Drop file or Select File" and select the file to upload. You may also click and drop a file. 
4. When the file is uploaded, edit the `Target Path` field by deleting the leading `/` as this will attempt to deploy the file to the Root repository (which will be denied).
5. Click `Deploy` and confirm that the file is in `Artifactory/Artifacts/PORTALIncoming` repository.
6. Right click on the "deployed" file and select `Copy`. In the popup window, select `PORTALReadyForTest` in the `Target Repository` dropdown. Click `Dry Run` and confirm a successful dry run. You should see something like:
   
```
Artifacts successfully copied to: PORTALReadyForTest:mongodb-database-tools-windows-x86_64-100.7.0.zip
```

7. You can click `Copy` now in the popup window. It will take up to a couple hours for the file to be replicated to the Artifactory instances in the other environments. Do the same for `PORTALReadyForProduction` after you have confirmed everything in your workflow works on Test.
8. After the file has been replicated to Test or Production Artifactory, you can open a Test or Production Cloud One Bastion host, and download  the file from Artifactory and unzip it if necessary.

## Uploading the file via DoD SAFE
Follow documentation in [Transferring files To and From Cloud One using DoD SAFE](transfer-file-to-from-c1-dod-safe.md#uploading-a-file-to-cloud-one)
