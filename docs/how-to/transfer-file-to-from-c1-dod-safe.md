# Transferring files To and From Cloud One using DoD SAFE

## Pre-requisites
- You are able to log into a Cloud One Bastion Host.
- You have access to `DoD SAFE`.

## Background
Cloud One Bastion Hosts are `Windows x86-64 based virtual machines` and have no Internet connectivity. The preferred way of getting a file out of Cloud One is `DoD SAFE`. For uploading a file, you may use Artifactory or `DoD SAFE`.

## Downloading a File from Cloud One
1. Open [DoD Safe](https://safe.apps.mil/) and select `Request a Drop-off`
2. Add your Name and Email to the recipients in the fields under `Who do you want to send the request to:`. You can add any other emails you want if you are working with others.
3. Fill out the Subject and Body of the Request if applicable.
4. Check your email inbox for a `DoD Safe Request URL`. Go to the Cloud One Bastion host and enter the Request URL into a web browser.
5. Add as many recipients as you wish and edit the note if applicable.
6. Add a file via "Click to Add Files or Drag Them Here" and confirm that the files do **NOT** contain classified information. You also have the option to encrypt the file if it contains CUI, PII, PHI.
7. Click "Send Drop-off" and wait for the `Confirmation of Completed Drop-off` email which will contain Recipient URL to download the files.
8. Copy the `Recipient URL` in the `Confirmation of Completed Drop-off` email and enter that into a web browser. Copy the `Claim Passcode` from the same email and paste that when prompted.
9.  Download the file.

## Uploading a File to Cloud One
1. Prepare the file for upload. Be aware that if the file is meant to be run in the Bastion host, it must be a portable binary for `Windows x86-64`. If the file requires Administrative Privileges to install something, it will not run in the Windows VM. Consider zipping the file as well.
2. Open [DoD Safe](https://safe.apps.mil/) and select `Request a Drop-off`
3. Add your Name and Email to the recipients in the fields under `Who do you want to send the request to:`. You can add any other emails you want if you are working with others.
4. Fill out the Subject and Body of the Request if applicable.
5. Check your email inbox for a `DoD Safe Request URL`. Open the Request URL.
6. Add as many recipients as you wish and edit the note if applicable.
7. Add a file via "Click to Add Files or Drag Them Here" and confirm that the files do **NOT** contain classified information. You also have the option to encrypt the file if it contains CUI, PII, PHI.
8. Click "Send Drop-off" and wait for the email which will contain links to download the files.
9. Copy the `Recipient URL` in the `Confirmation of Completed Drop-off` email and enter that into a web browser in the appropriate Cloud One Bastion host. Copy the `Claim Passcode` from the same email and paste that when prompted.
10. Download the file.
