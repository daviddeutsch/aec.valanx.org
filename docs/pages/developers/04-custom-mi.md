# Custom Micro Integration

With your custom `Micro Integration`, you will be able to attach any kind of functionality you can program to an AEC `Payment Plan`.

The best way of showing you how to program your own is by example, so here is a simplified version of the E-Mail MI that is included with AEC:

```php
<?php
// Dont allow direct linking
defined('_JEXEC') or die();

class mi_email_simple extends MI
{
	// General information about the MI that shows up in the AEC administration
	function Info()
	{
		return array(
			'name' => 'E-Mail MI',
			'desc' => 'Sends an E-Mail'
		);
	}

	// Your custom settings on the second tab of the MI settings
	function Settings()
	{
		$settings = array();
		$settings['sender']      = array( 'inputE' );
		$settings['sender_name'] = array( 'inputE' );

		$settings['recipient']   = array( 'inputE' );

		$settings['subject']     = array( 'inputE' );
		$settings['text']        = array( 'editor' );

		return $settings;
	}

	/* The method relayAction is called any time something happens in the
	 * lifecycle of a payment plan that would concern the MIs attached to it
	 *
	 * Alternatively, you can also use
	 *
	 * function action( $request )
	 *
	 * for a shorthand where $request->action == 'action'
	function relayAction( $request )
	{
		// Only trigger on regular plan application
		if ( $request->action != 'action' ) {
			return null;
		}

		// Make sure we have something to say!
		if ( empty( $this->settings['text'] ) ) {
			return null;
		}

		// Actually send the E-Mail
		return xJ::sendMail(
			$this->settings['sender'],
			$this->settings['sender_name'],
			$this->settings['recipient'],
			$this->settings['subject'],
			$this->settings['text']
		);
	}
}
```

Once you have your file, you also need to put it into the right folder. Since we named our class `mi_email_simple`, the folder within /micro_integrations needs to be called `email_simple` and the file `email_simple.php`.

That's all you need to do!
