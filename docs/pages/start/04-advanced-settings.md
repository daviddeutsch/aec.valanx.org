# Advanced Settings

TODO: Split off template page since some of the settings were moved to the Carina template.

Further settings in AEC are a bit more complex. Also note that we have left out a couple here, you will find them in the entry on customization.

The first option is actually just a taste preference - some people like the Quicksearch right on top of the central page.

## Proxy

If your hosting provider has certain restrictions on outgoing traffic (i.e. if AEC calls other websites or services), you need to set the details of the proxy that they provide to you in here.

## Subscribed Member Buttons

These are the buttons that show up when a user logs in without an active membership.

## Date Formatting

If you want a custom formatting for dates in AEC, you can put in the codes here. Refer to this manual for details. If you leave this empty, AEC will just use standard Joomla formatting.

## Invoice Number Formatting

This one is a bit trickier as we use our aecJSON formatting. Refer to that page in our manual for details. The idea is that you can have pretty much any formatting you want if you switch on formatting and put in your syntax.

The standard formatting in that field is "YEAR-INVOICE_ID", so something like "2011-23434".

## ReCAPTCHA

This is actually just a hack to put ReCAPTCHA in a standard Joomla signup form. This does not work with anything but the standard Joomla registration.

## Custom Redirects

Sometimes, you want the user to go to certain pages instead of the standard AEC pages. This is what you can do here. Just put in full URLs and AEC will use them.

## Page ItemIds

This one is a bit trickier - In Joomla, every menu item has an ID, what you typically see as &ItemID=XX in your URLs. Once you have set up menu items for AEC, going into the settings will search your menus and take the first ItemIDs and put them into these settings.

Maybe, though, you want to change them to custom ItemIDs - so that is what you can do here

## Alert Levels

These are rarely used and just change the styling of the "you have X Days until your membership expires" box on the MySubscription page.

## Cushions

These Settings determine how fast AEC reacts to certain changes. For instance - the Expiration Cushion is how much time AEC allows for a payment notification to come in before it expires a user. This can be helpful if you use a payment processor with recurring payments, reducing the chance that a user won't be able to log in even though it's just the processor taking a while to notify you.

## Expert Heartbeats

If you want to trigger heartbeats on your own schedule, you can call the frontend with:

http://www.youdomain.com/index.php?option=com_acctexp&task=heartbeat&hash=HASH

And provide the hash that you set in the settings. Also note the backend heartbeat setting - it usually makes sense to trigger them more often on the backend. Heartbeats can take a bit of time, so it's better to inflict them on administrators and not customers.

## Countries

There are a number of country forms that can show up in AEC. It always shows all possible countries, but with Ctrl+Clicking some from this list, you can boil down that list.

## Registration Flow

AEC usually skips pages that don't require a decision (pages with only one button, like a single payment plan with a single processor), if you don't want that, you can restrict it here.

Expired users can be a security problem for AEC because we cannot let them log in, but we also cannot let anybody access their account. So we use a grace period - once a user has provided a password, we grant 15 minutes to do a checkout. If they run out, we prompt for a password again.

The other two settings are for showing a coupon field on the Confirmation page and whether expired users should also see a custom intro page.

## Confirmation Page

Here, you can set whether the user should get "change my user details" and "change the membership I selected" links on the Confirmation page.

## Checkout Page

An experimental Javascript validation for Checkout forms.
MySubscription Page

If you want to build your own navigation for the MySubscription page, you can disable the standard navigation here.

## Subscription Plans

Root Group ReWrite is a way of using the ReWrite Engine to determine which root group the user is shown. This can be used to dynamically target certain usergroups with different root groups.

With the Entry Plan, you can give any user that is logging in, but hasn't got a membership yet the plan you have selected here. Keep in mind that this means that users will get a free membership, no matter what price you've set.

The Per-Plan MIs were an experimental feature that has since been discontinued.

## Security

Here, you can force whether SSL encryption is forced on the entire Signup and MySubscription pages. Of course, you will need to have set up an SSL certificate.

By allowing the checkout of unpublished items, you can allow your users to pay for an invoice even if the item they are paying for has since been unpublished.
