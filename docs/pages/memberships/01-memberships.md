# Memberships

A Membership is a rather broad term in AEC. In general, what a membership does is attach additional data to a Joomla User account. Memberships typically have functionality attached to them through the [Payment Plan Settings](memberships/02-payment-plans) or assigned Micro Integrations.

## `Primary` & `Secondary`

In AEC, a user can have **one** `Primary` and an unlimited number of `Secondary` Memberships.

A `Primary` Membership is mandatory and controls overall access to the account. If the `Primary` membership expires, the user cannot log in (unless you have configured AEC to allow for access in that case).

`Secondary` Memberships are completely separate and can be used to control individual feature like granular access rights.

## Membership Status

The Membership status signals the last thing that happened to a Membership. Let's walk through them here:

|Status       |Description|
|-------------|-----------|
|**Active**   |After a user has paid for a Payment Plan and the Invoice is cleared, the membership is granted to the user and the status is set to `Active`.|
|**Pending**  |See below!|
|**Hold**     |Certain processor notifications can trigger a `Hold`. This is usually done on a fraud attempt or chargeback of a Credit Card payment - as a stronger kind of punishment (the error message that the user gets on login can be different).|
|**Cancelled**|When a user makes a decision to stop a recurring payment, that action is called a `Cancel`.|
|**Closed**   |Can only be assigned by an admin and it is virtually identical with the status of `Expired`.|
|**Expired**  |When the expiration date of a membership has been reached, AEC sets the membership to `Expired`. Only when this flag (or it's counterpart - `Closed`) has been set on the primary Membership is the user prevented from logging in.|
|**Excluded** |Another status that can only be set by an administrator. When a Membership is `Excluded`, it will never expire - unless it is forced to expire by an admin.|

### What about "Pending"?

Since `Pending` sounds like "waiting for a membership to clear", most people assume that as soon as a user has set up an invoice to buy a Payment Plan, their account should show up as `Pending`.

**That is not the case.**

Having an unpaid invoice in is not any particular state in AEC - it is more like a *non-state*. If a user has no Membership, you can find them under "Non-Members".

There is one exception to this rule - You can configure a payment plan to **not** activate users right away after they have paid. If you choose that option, the user will show up as `Pending` after the payment has cleared.
