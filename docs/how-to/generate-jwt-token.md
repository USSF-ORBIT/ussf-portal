# How to Test JWT Auth for Mobile Connect <-> USSF Portal

## Step 0: Grab user info from dev

Since we’re logging in with our actual credentials, we need to create a user in the local db that matches. First, get the correct info by logging into dev with your CAC.


1. Go to [dev.ussforbit.us](https://dev.ussforbit.us) and log in using your CAC.
2. In your browser, open dev tools > Network > filter requests on `user`
3. Click the `user` request > click Response
4. Copy your `nameID` and `edipi` for future reference.

## Step 1: Set up local user in test IDP

A new user has been added to `users.php` called `localuser`. It pulls in your info from environment variables set in `.envrc.local`, and has the username/password of `localuser`, `localuserpass` to follow the same format as our other test users.


1. In your `.envrc.local` file, add the following variables:

```
export COMMON_NAME=<nameID value goes here>
export EDIPI=<edipi goes here>
export GIVENNAME=<your first name>
export SURNAME=<your last name>
```


The Test IDP service in `docker-compose.services.yaml` now looks at this local file for environment variables.

1. Restart your services, run the app, and make sure you can log in with `localuser`/`localuserpass`. You should see your name in the greeting, and a matching record in Mongo Express.

## Step 2: Set up Mobile Connect Test

1. Install the Test Flight app on your phone: https://apps.apple.com/us/app/testflight/id899247664?mt=8
2. Open a browser on your phone and go to this url: https://testflight.apple.com/join/IU5A1Ozh
3. Under `Join the Beta`, click `Start Testing` to install the Mobile Connect Test app.
4. Once the app is installed, open it to walk through registration. You’ll need your computer, too.

* Open this link on your desktop browser: https://mobileconnect.test.cce.af.mil/
* When you are prompted to log in, make sure your CAC is plugged in and Log In with PKI (since you don’t have Mobile Connect set up yet).
* You’ll be redirected to the Mobile Connect USAF page. Make sure it has the big red TEST banner.
* Open the Mobile Connect TEST app on your phone, and scan the QR code on the screen. Continue through app onboarding to set up a pin.

NOW YOU’RE READY TO GENERATE A TOKEN!!!!


## Step 3: Generate a token

1. Download the Postman collection USSF Third Party API from Abigail. It contains three folders:

* Public
    * Contains requests that require no authorization 
* Auth
    * Contains requests that require Authorization header. Token is set automatically by a utility request.
* Utility
    * Contains requests that mimic functionality from the Guardian One app / third party.
    * Generate Token requires a code from Mobile Connect login, and then will return and automatically set the Bearer Token to be used in auth requests.
        

2. Get a code to use in the Generate Token request.

* Open up your broswer and its dev tools. Make sure the Network tab is open.
* Go to the url: ~https://federation.test.cce.af.mil/pool/sso/federate?client_id=guardian-one&nonce=asdf&redirect_uri=guardian-one://oidc/callback&response_type=code&scope=openid+profile&state=fdsfds&u=https://guardian-one~
* Click I agree > then for SSO, click `MobileConnect CCE Test`.
* Open the MobileConnect TEST app on your phone, scan the QR code and enter your PIN.
* Once you’ve successfully authenticated, you’ll be redirected. If it gets stuck on the redirect screen, click the link to redirect. If you see a screen that says there was an API error, that’s ok.
* In the Network tab, you should see a canceled request in red that begins with `callback?code=`. Click this request, and click Payload. Copy the value after code.

3. Generate token in Postman


* Import the collection downloaded earlier to Postman.
* Click on the collection title USSF Third-Party API in the left nav bar.
* In the main panel, click Variables > Paste your code in the value field for code.
* Click on the request Utility > POST Generate Token in the left nav bar.
* Click send. You should receive a 200 response similar to:

```
  {
      "access_token: ...
      "token_type":....
      "id_token": ...
  }
```


* Postman will automatically set the `id_token` variable to use in our auth requests. To check that it worked, you can go back to USSF Third-Party API in the left nav bar and confirm the correct value is set for the variable `id_token`.

## Step 4: Test the API

1. In Postman, click the request under USSF Third Party API > Auth > POST getDisplayName.
2. Click Send
3. If everything works, you should receive back your display name used on the portal.
4. WE DID IT!

