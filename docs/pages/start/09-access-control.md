# Access Control

TODO: Needs to be brought up to speed with latest J! versions.

Joomla controls access to certain areas and features of a site through use of a basic ACL, or Access Control Level mechanism called Groups. Certain groups have certain access level features and they are directly related to the creation, editing and publishing of content (through the Front end and Back end interfaces) as well as to access to the Administrative (Back end) interface.

There are four Front-end groups available: Registered, Author, Editor, and Publisher. These are the levels we will be concerned with in AEC, since they control front end access. For more info on Access levels please read this Joomla FAQ.

In a simple configuration of AEC, where the content is either free or only available to one group (Registered), then AEC should be configured to but all paid subscribers into the Registered Group. But if you have different paid access levels, then you will need to assign the subscribers of those plans to different groups.

If you have only two paid levels, you can use the additional ACL of Author for the second paid level. Remember the groups of Author, Editor and Publisher show as “Special” under the access level switch on Joomla Content control and Menu Item control.

If you have more than that, you can look into third party components to add additional ACLs and groups. There are a few out there, for more information look here: check out the JED site here. AEC has Micro Integrations hat will integrate with JACL and JUGA.
