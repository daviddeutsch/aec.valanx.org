# Template Overrides

Template overrides are a powerful tool in Joomla to customize what output an extension (be it a standard extension in Joomla or one by a third-party developer like AEC) shows on the Frontend.

## Overrides in Joomla

The basic premise is that every component splits up the pages that are delivered to the user in the frontend have their own, separate HTML files that get called up and used when that page is requested. That makes it simple to then take the next step: Overriding individual pages.

The short version of how to do that is: Emulate the structure of the component you want to change in a new directory within your template /html directory. When either Joomla or the Components loads a view, it first checks the template /html directory - if it finds an override, it will display that override. Otherwise, it will load and display the standard view.

[This page](https://docs.joomla.org/How_to_override_the_output_from_the_Joomla!_core) in the official Joomla documentation explains it in more detail.

## Overrides in AEC

If you want to change something in AEC, there is one small difference - the system also supports partial views. As an example - the payment plans page has 9 separate partial views that get composed into a single view.

There is one "root" template called "plans" that calls up the partial views below it like so:

```php
@include( $tmpl->tmpl( 'list' ) );
```

This in turn loads the "list" partial where the actual plans are listed.

Overriding partials works exactly the same way as you are used to with standard template overrides - simply make sure that the file is named the rigt way ("list.php" in the example above) and it will get loaded instead of the default version.

## Example

Say you want to edit the user info block on the confirmation page. >ou look through the template structure of the component where you try to override something, find the file that corresponds to the page you want to modify and create an exact same file like that in your /html directory in your site template.

So for our example, you find out that in the AEC template structure, there is this file:

tmpl/etacarinae/confirmation/tmpl/info.php

That has the partial that you want to modify. To override it, you can now copy and paste the file to:

/path/to/your/template/html/com_acctexp/confirmation/tmpl/info.php

And modify it to your hearts content.

