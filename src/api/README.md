# JourneyMate backend

The journeymate backend API uses a few routes with each representing a different part of functionality.
All parts of the API are located under https://[siteroot]/api/, where [siteroot] represents the domain.
All of the following routes use this url as base, so when (for example) a route `/auth` is mentioned, this expands to https://[siteroot]/api/auth

## Authentication

The authentication API is split up into two parts: signing up and signing in.

### Signing up

When a user is registered for the first time, they will need to make a POST request to `/auth/signup`. 
This route expects a json payload of this form: 
```perl
{
    ...
    "username": "[someusername]",
    "password": "[somepassword]",
    "email": "[someemail]"
    ...
}
```
This will either return a http response 200 on success or an http response 400 with json object with error code on failure:
```perl
{
    "status": "[error message]"
}
```

### Signing in

Signing in will authenticate the user and provide a session token which will need to be supplied in every next non-auth request.
To sign in and obtain a token, users must POST to `/auth/`.
This route expects a json payload of this form:
```perl
{
    ...
    "username": "[someusername]",
    "password": "[someusername]"
    ...
}
```
This will either return an http response 200 on success with a json response with token or an http response 400 with error code on failure. Succesfull responses are of this form:
```perl
{
    "token": "[sometoken]"
}
```

## Planner

The planner API provides routes for getting location data for known locations, getting the closest stations and planning an eventual route.

### Getting locations

This route is meant to get location data which will be used by the rest of the api. When a user wishes to fetch location data, a GET request must be sent with json payload of this form:
```perl
{
    "location": "[somelocation]"
}
```
Where `location` is a string with the name of the location you wish to fetch. For example, if I wish to request locations for `amsterdam`, I would send this request: 
```perl
{
    "location": "amsterdam"
}
```
This will either return an http response 200 with a list of possible locations matching the input string, or an http error code with json error response.
Successfull responses may look like this:
```
{
    "
}
```