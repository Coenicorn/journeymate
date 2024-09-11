# JourneyMate backend

The journeymate backend API uses a few routes with each representing a different part of functionality.
All parts of the API are located under https://[siteroot]/api/, where [siteroot] represents the domain.
All of the following routes use this url as base, so when (for example) a route `/auth` is mentioned, this expands to https://[siteroot]/api/auth

## Authentication

The authentication API is split up into two parts: signing up and signing in.

### Signing up

When a user is registered for the first time, they will need to make a call to `/auth/signup`. 
This route expects a json payload of this form: ``