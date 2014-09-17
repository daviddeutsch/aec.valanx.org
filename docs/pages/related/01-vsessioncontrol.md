# vSessionControl

## What does it do?

With vSessionControl, you can determine how Joomla! reacts to multiple sessions for the same user account. By default, a user account can be logged in for an infinite number of times from all around the world. Since some administrators are concerned with account sharing (as a way of avoiding paying for your own account on membership sites), we have developed vSessionControl which helps you penalize multiple logins.

## Settings

### Restrict IP - Prevent any sort of double login - `one_ip_only`

Set to Yes to stop same username/password logging into the site more than one at a time

### Session Max - `restrict_amount`

Enter in the number of maximum sessions the user is allowed to have. The session lifetime is set in the Joomla Global Configuration, System tab, Session Settings.  For example, if you permit the user to login from home, work, and then other place per day, then you would set the session lifetime to 1440 (24 hours) and set the max sessions to 3.

### Logout Current - `logout_current`

Block the user exceeding the maximum number of sessions with his or her login.

### Logout All - `logout_all`

Logout all users using the same username when the user exceeding the maximum number of sessions - this can be used as a kind of penalty, but can be more frustrating to users than it is worth.

### Redirect URL - `redirect`

Redirect the last user trying to log in to this page when the maximum number of sessions is exceeded.

### AEC Plan Specifications

You can specify the way the plugin treats members of different plans. The structure used for this is a plain overwrite functionality. So by using this setting, you can override all of the above settings for a particular membership. You can find the variable names in brackets in the headlines above. An example would look like this:

```
4:restrict_amount=1|redirect=http://twitter.com
```

The beginning marks the plan id (4 in this case) and it is separated by the parameters by a ":".

The parameters themselves are separated by lines: "|" and the structure used is "parameter_name=paramenter_value". As I've written above, you can overwrite all settings.

So if you have another plan with the ID 5 and you want to make THAT allow 10 sessions but redirect to a URL on your server, but also penalize all users by logging them out when the quota is exceeded, you would do it like this:

```
5:restrict_amount=10|redirect=http://www.yourdomain.com/index.php?content=something|logout_all=1
```

You have to separate individual options by placing them in a new line in the text field.
