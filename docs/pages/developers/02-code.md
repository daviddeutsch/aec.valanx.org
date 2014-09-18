# Code

## Include the AEC class

To call up AEC in your own software, you first need to include our main class file:

```
include_once( JPATH_ROOT."/components/com_acctexp/acctexp.class.php" );
```

## Load a metaUser object

The most useful object you will want to use is the metaUser, which is the central class handling everything and anything about a member in AEC - $userid in this case is of course the joomla user ID.

```
$metaUser = new metaUser( $userid );
```

Once you have this, here are some nice things you can do with it:

```
// The focusSubscription is the one subscription
// that you are currently working on

$metaUser->focusSubscription; // <- this here

// You can check whether it's expired
$metaUser->focusSubscription->is_expired();

// ...or a lifetime membership
$metaUser->focusSubscription->is_lifetime();

// ...or get its status
$status = $metaUser->focusSubscription->verify();

// $status can be 'expired', 'pending' or 'hold'
// it can also be a boolean true if it's still active
echo $status; // array( true, 'expired', 'pending', 'hold' )

// Another object is the objSubscription
// which is always the PRIMARY membership

$metaUser->objSubscription; // <- this here

// Expire the users main subscription
// (thus preventing them from logging in)
$metaUser->objSubscription->expire();

// Load and apply Subscription Plan
$plan = new SubscriptionPlan( $db );
$plan->load( $plan_id );

$metaUser->establishFocus( $plan );

$metaUser->focusSubscription->applyUsage( $plan_id, 'none', 1 );

// If you want to change the expiration

$unit = 'D'; // array( 'H', 'D', 'W', 'M', 'Y' );
$value = 5; // the amount
$extend = true // use the expiration date OR current date, whichever later

// Extend the subscription in focus by 5 days
$metaUser->focusSubscription->setExpiration( $unit, $value, $extend );
```

## Restrictions

AEC has a very extensive restrictions system built in, here's how to use it:

```
// First, you create an array of restrictions
$restrictions = array();

// Previous plan to be either 5,6 or 7
$restrictions['plan_previous'] = array( 5, 6, 7 );

$response = $metaUser->permissionResponse( $restrictions );

// Might look something like
// $response['plan_previous'] = true;
```
