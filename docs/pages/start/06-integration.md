# Integration

AEC works with a number of components through the MicroIntegrations, but this article is actually only about user data and integration of the registration process.

## Integrating the Signup

By default, as soon as you activate "Integrate Registration" in the AEC Settings, it will try to wrap around your registration process in one way or another, asking the user to get a membership at the same time.

The bottom line for every integration is this: AEC should do most of what you need right out of the box. As long as you have set it to integrate and have the AEC plugins published, it should do just fine.

### Standard Joomla

With Joomla, we integrate the standard registration process so that we show the payment plan selection either before, or immediately after the registration information was submitted.

### JomSocial

For JomSocial, we do a very crude wrapping, so you can also have the payment plans before or after the registration, but it's not one continuous form - instead, AEC stores the data it needs in a cookie during registration and only routes to and from the JomSocial registration pages.
CommunityBuilder

The CB integration is similar to how the basic Joomla integration works, just, of course, with a couple of exceptions for the advanced forms.

Do note that there are a couple of problems with the way the CB registration might be configured. We have found that AEC works on 99% of the cases we check on, but some are just to complex to handle, especially if using complex form requests like uploading of images during registration.

### JomSocial & CommunityBuilder at the same time?

This is a suprisingly common issue that we find - some people are led to believe that they need to install both, JomSocial and CB. If you do that, the automatic integration in AEC will have problems finding out what to do, so please decide on one first and use that.
