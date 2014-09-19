# Membership Administration

## Membership Overview

From the central page in AEC, you have several options to take a look into existing Memberships, either by clicking **a state from the top menu**, or the `Members` button from the schematic (which links to active members):

![Membership List Filters - Status](docs/img/membership-list-path-to.png)

These all lead to basically the same membership list, only with a different focus selected.

![Membership List Example - Expired List](docs/img/membership-list-example-expired.png)

### Status Filter

The important thing on that page is in the upper section of the screen, where you can see the current filter settings. When you click on `Expired`, you will have that Membership status selected in the filter.

![Membership List Filters - Status](docs/img/membership-list-filters-status.png)

If you want to, you can even select multiple items in the status selection. The only thing that is not possible is displaying members and non-members (`Not Subscribed`) at the same time.

### Plan, Group, Search Filter

Filtering by `Payment Plan`, `Plan Group` and `Ordering` should be pretty self-explanatory. More interesting are the things on the right side.

Except for the `Search` box (which should also be rather self-explanatory), the first two dropdowns let you **assign a Membership** to multiple users or **modify their expiration**.

### Bulk-update memberships

**Modifying the expiration** gives you a whole host of options. You can **switch their status** to any of the available Membership states (`Active`, `Cancelled`...). You also have the option to **set or add to the expiration date**. With the first, you force it to be "1 month from now", with the second you "add 1 month to the current expiration date".

And don't forget that you have to select Members from the list before you apply something!

## Membership Details

Selecting a membership brings you to a subscription overview for this user:

![Membership Details - Full View](docs/img/membership-details-full.png)

As you can see - this page does not list just one `Membership`, but gives you an overview of the User with one `Membership` that you currently focus on. When the user holds multiple Memberships, the page will display them and you can switch between them. Of course, when coming from the Membership list, the one you selected will be in focus.

### Expiration

![Membership Details - Expiration](docs/img/membership-details-expiration.png)

Under Expiration, you can modify the expiration date of the currently selected Membership. You can also set it to Lifetime by clicking the checkbox for it and change the Membership status with the dropdown for that. You can also apply a specific membership plan.

### Subscription History

![Membership Details - Subscription History](docs/img/membership-details-subscription-history.png)

Further down, under Subscription, you see a history of previous memberships in exact detail.

### Invoices

![Membership Details - Invoices](docs/img/membership-details-invoices.png)

For Invoices, there is a special feature when an invoice is uncleared - it shows you a number of options for this invoice. The repeat Link is simply a link that you can hand your client to get to the checkout quickly. The cancel removes the invoice from the system.

The last two are crucial - The first, "mark cleared" only marks the invoice as being paid for, while the second - "clear & apply Plan" simulates a payment notification and thus also applies the Membership referenced in the invoice.

Below the invoices, you an see which coupons the user has used so far and you can also put in notes on the user.
