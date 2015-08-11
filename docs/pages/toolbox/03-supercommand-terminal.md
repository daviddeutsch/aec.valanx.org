# **Supercommand** Terminal

## Examples

Say you want to get rid of an existing "base entry plan" and replace it with a new one. For that, you want to first put everybody on the new plan and then expire them.

You can do that with these two queries:

```
supercommand: users|everybody|apply:plan:42

supercommand: users|has:plan:42|expire
```

(Don't worry about carrying out the commands - it will first "test" them and tell you how many users would be affected before you carry it out properly.)

You could of course also limit the first command to users within a certain plan like so:

```
supercommand: users|has:plan:12|apply:plan:42
```

Also note that you might want to send out an email only to those users. If they're not too many users (ie. not enough to make mailservers think you're spamming them), you can create an instance of the E-Mail MI with text explaining the change that fires on expiration and attach it, temporarily, to the new plan you want to set up. Alternatively, you can set up the MI without attaching it anywhere and simply run it as a supercommand as well:

```
supercommand: users|has:plan:42|apply:mi:128
```
