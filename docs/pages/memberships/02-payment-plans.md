# Payment Plans

A payment plan in AEC is basically a blueprint for a membership - something that your users can buy to get a subscription. What makes a membership is really what you make the payment plan assign to it.

## General

Every Payment Plan needs a name, which you provide here. Furthermore, you can (de-) activate a plan or make it invisible (you can link to it, but it will not show in the frontend on its own).

### Details

Once the plan is paid for, the user gets an active subscription - if you don't want that, you can deactivate this behavior and have them pending until your approval.

By default, payment plans take the role of a primary subscription once applied, but you can also make them secondary. If it is a secondary subscription, you can make it at least search for another existing, similar subscription that gets updated with this subscription.

The redirect is a hard redirect - when the user chooses this plan, it instead redirects to something else.

The two links are direct links simulating choosing the item on the frontend (useful for building your own plans page).

### Groups

Assign this plan to an existing group or delete such an assignment.

### Cost & Details

Either choose the membership to be free, or set a price - and, of course, provide a membership term.

You may also choose to hide the duration (for example if it doesn't matter).
Joomla User

You can make the payment plan assign a usergroup in Joomla.

For new members, you may also choose to force their account to be activated (instead of having to click an activation link) and skip the standard registration email (only works with Joomla registrations, not with other components).

### Plan Relation

The Plan Fallback is a way of automatically following a subscription with another - the fallback is automatically applied (for free) once this plan runs out for a user.

If it is a secondary plan, you might run into a situation where users buy it without having a primary membership - in that case, you can force a parent plan here.
Shopping Cart

The Cart Behavior is a bit tricky, but it allows for a useful feature: Instead of following the global rule of either checking out one item at a time or a full shopping cart, you can decide which one to use for this plan only.

The redirect is a useful tool to decide what happens when a user chooses this plan.

## Trial

This is pretty much a verbatim copy of the Cost&Details above, except that it is for a Trial.

A trial for a subscription plan is always offered only once per user.

Please make sure that the processor you want to use supports trials!

## Micro Integrations

We deal with most of the other tabs in separate articles (see below), but the last tab has an important bit, the assignment of MicroIntegrations:

As you can see, this has two fields - first, the MIs it has been assigned by the Group they are in. Second, you can choose which ones you want to attach directly.

## TODO: Relationships
