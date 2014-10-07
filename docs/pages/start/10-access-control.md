# Access Control

## AEC does not control access

This may be counter-intuitive, but AEC itself does not carry out access restrictions. This has two reasons - first, Joomla already has a very capable access control system and it is an accepted convention for any extension to make the most use of it. Second, we do not want to lock you into AEC by adding our own access control - even if you remove AEC from your CMS, the access restrictions that have been put in place through AEC will remain.

## Access Control in Joomla

Joomla controls access to certain areas and features of a site through use of a basic ACL (Access Control Level) mechanism called Groups. Certain groups have certain access level features and they are directly related to the creation, editing and publishing of content (through the Front end and Back end interfaces) as well as to access to the Administrative (Back end) interface.

In the initial setup, there are four frontend groups available: Registered, Author, Editor, and Publisher. These are the levels we will be concerned with in AEC, since they control front end access. For more info on Access levels please read this Joomla FAQ. (TODO: Link to Joomla FAQ)

## Using Joomla ACL through AEC

In a simple configuration of AEC, where the content is either free or only available to one group (`Registered`), AEC should be configured to put all paid subscribers into the Registered Group in the [Payment Plan settings](memberships/02-payment-plans). But if you have different paid access levels, then you will need to assign the subscribers of those plans to different groups.

If you have only two paid levels, you can use the additional ACL of `Author` for the second paid level (this assumes that you're not actually making use of user authorship). Remember the groups of `Author`, `Editor` and `Publisher` show as “Special” under the access level switch on Joomla Content control and Menu Item control. (TODO: Is this actually still true?)

Recent versions of Joomla have added the capability to extend existing groups and access levels. This allows for even more fine-grained control over what your users will have access to, especially since a user can hold multiple usergroup memberships at the same time, so that their individual access rights are combined. (TODO: Maybe another link here)
