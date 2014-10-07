# Toolbox

Where Micro Integrations extend `Payment Plans` and `Processors` hook into the checkout process, `Tools` in the `Toolbox` are extensions to the backend administration.

A number of tools warrant their own documentation.

Furthermore, you can find a few smaller tools in the toolbox:

## Cleanup

If a user is deleted in Joomla, the membership record in AEC will remain without a user account assigned to it. With this tool, you can clean up all those orphaned records.

## Database Search & Replace

With this tool, you can search and replace directly in the AEC database - do be careful, though, since there is no undo function.

## Invoice Cleanup

Users often make up their minds halfway through a checkout process and leave invoices unpaid. You can use this tool to clean out old ones beyond a certain cutoff.

## Invoice Reactivate

If a user has expired on a recurring billing invoice due to a technical error, you can reinstate the invoice and account to how they were before the expiration. The expiration date will be set in 1 minute ago so that another attempt at charging the account can be made.

## Micro Integration Import & Export

With these two tools, you can save all settings of an MI into a (json encoded) file or load a file like that into your system. This can help you migrate functionality between servers if you have many installations of AEC.

## Processor Delete & Replace

Since processors hook deeply into the system and losing one affects many parts of the system, we have somewhat hidden the ability to remove one inside of a tool. Since there are a number of objects in AEC that require having a processor assigned to them, you must select a replacement processor. The tool will update the history, subscriptions and invoices tables.

## Pretend

With this tool, you can generate fake data in your system - from users to membership plans to memberships and payment records.

## Raw Data Edit

Some Item types (Metauser information, Processors and Invoices) lack a full edit screen. With this, you can at least edit their raw data.
