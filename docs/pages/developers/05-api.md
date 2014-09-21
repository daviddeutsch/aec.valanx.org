# AEC API

With the AEC API, you can securely query AEC for information.

## API Entry Point

The URL to call is:

```
www.yourserver.com/index.php?option=com_acctexp&task=api
```

## Security

To ensure that the request really is secure, you need to identify the application that is making the call with the URL variables `app` and `key`. You can configure which applications are allowed and what key they have in the Settings.

So - if your `app` is called 'myapp' and its `key` is 'mykey', you want to call:

```
www.yourserver.com/index.php?option=com_acctexp&task=api&app=myapp&key=mykey
```

## Query the API

Next, you want to identify what you want from the API by handing in a request object encoded as JSON.

You can also pass in a list of requests simply by passing in a JSON array of objects - the API connector will handle them one by one and pass them back in the same order.

A request would look like this:

```
{
	"action": "Command",
	"user": "Object or String"
}
```

## Commands

Here is a list of commands you can use in your query:

| Command | Details |
|---------|---------|
|`UserExists`|Do we find any record for the user object?|
|`MembershipDetails`|Give a detailed membership object.|
|`Auth`|Carries out the same check that a login would make.|
|`RestrictionCheck`|Check against a restriction.|

### `UserExists`

Sample Request:

```
{
	"action": "UserExists",
	"user": "testusername"
}
```

Response:

```
{
	"response": {
		"result": true
	},
	"error": null
}
```


The resulting object would look something like this:

```
{
	"response": {}
	"error": null
}
```
