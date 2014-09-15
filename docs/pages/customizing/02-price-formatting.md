# Price Formatting

## Confirmation Page

If you are tying to achieve the layout below for your confirmation page:

TODO: Image of confirmation page

This is done in the individual plans settings, which will allow you to change it for each plan, if so desired.

Go to AEC Central-->Plans, Choose the plan you want to change the layout on the confirmation page, then go to the Plan Text tab. you will see a screen similar to the one shown below.

TODO: Image of Plans Tab

Change the entry in Custom amount formatting to:

```
{aecjson}{"cmd":"condition","vars":[{"cmd":"data","vars":"payment.freetrial"},{"cmd":"concat","vars":[{"cmd":"constant","vars":"_CONFIRM_FREETRIAL"}," ",{"cmd":"data","vars":"payment.method_name"}]},{"cmd":"concat","vars":[{"cmd":"data","vars":"payment.currency_symbol"},{"cmd":"data","vars":"payment.amount"}," ",{"cmd":"data","vars":"payment.method_name"}]}]}{/aecjson}
```

## Checkout Page

If you also want to achieve the layout of the Checkout page to be similar to the one below:

TODO: Image of checkout page

Go to AEC Central--->Settings, Customize tab and look for the area called Price Formating, and switch the setting to the ones shown below.


TODO: Image of Settings
