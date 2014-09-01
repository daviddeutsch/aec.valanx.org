# Setup

## Requirements

### Server Requirements

  * Linux Server recommended
  * PHP 5.2+ (PHP 5.3 or later strongly recommended)
  * MySQL 4.1+

### Supported Joomla Versions

AEC works fine on any version of the Joomla! CMS - even older ones like 1.5, but also the latest version 3.3.

## Installing

Download the All-in-One package and upload it to your server using the standard Joomla installer.

### Re-trigger Install Process

AEC has quite an elaborate setup routine that does a number of system checks. If you ever find yourself wanting to do the whole thing again, but you don't want to upload the entire component, just call this URL:

http://www.yourserver.com/administrator/index.php?option=com_acctexp&task=recallinstall

This can be helpful, for instance, when you're writing your own processor as one of the things that the setup routines checks are updating whether the processor information has changed.

## Uninstalling

To make sure that you don't erase your whole customer database by accident, AEC has a little security feature - if you want to actually get rid of all your data, you have to set these two settings to Yes first.

Otherwise, AEC will just leave the tables intact for when you install it the next time.
