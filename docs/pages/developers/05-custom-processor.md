# Custom Processor

With your custom `Payment Processor`, you will be able to connect your checkout process to any payment service provider or even roll your own checkout process.

The best way of showing you how to program your own is by example, so here is a simplified version of the basic PayPal integration that is included with AEC:

```php
<?php
// Dont allow direct linking
defined('_JEXEC') or die();

class processor_paypal_simple extends POSTprocessor
{
	function info()
	{
		$info = array();
		$info['name']			= 'paypal';
		$info['longname']		= JText::_('AEC_PROC_INFO_PP_LNAME');
		$info['statement']		= JText::_('AEC_PROC_INFO_PP_STMNT');
		$info['description']	= JText::_('DESCRIPTION_PAYPAL');
		$info['currencies']		= 'EUR,USD,GBP,AUD,CAD,JPY,NZD,CHF,HKD,SGD,SEK,DKK,PLN,NOK,HUF,CZK,MXN,ILS,BRL,MYR,PHP,TWD,THB,ZAR';
		$info['languages']		= AECToolbox::getISO639_1_codes();
		$info['cc_list']		= 'visa,mastercard,discover,americanexpress,echeck,giropay';
		$info['recurring']		= 0;

		return $info;
	}

	function settings()
	{
		$settings = array();
		$settings['business']		= 'your@paypal@account.com';
		$settings['testmode']		= 0;
		$settings['currency']		= 'USD';
		$settings['item_name']		= sprintf( JText::_('CFG_PROCESSOR_ITEM_NAME_DEFAULT'), '[[cms_live_site]]', '[[user_name]]', '[[user_username]]' );
		$settings['item_number']	= '[[user_id]]';

		return $settings;
	}

	function backend_settings()
	{
		$settings = array();

		$settings['business']				= array( 'inputC' );
		$settings['testmode']				= array( 'toggle' );
		$settings['currency']				= array( 'list_currency' );
		$settings['item_name']				= array( 'inputE' );
		$settings['item_number']			= array( 'inputE' );

		$settings = AECToolbox::rewriteEngineInfo( null, $settings );

		return $settings;
	}

	function createGatewayLink( $request )
	{
		// The html form post URL on the checkout page
		if ( $this->settings['testmode'] ) {
			$var['post_url'] = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
		} else {
			$var['post_url'] = 'https://www.paypal.com/cgi-bin/webscr';
		}

		// A parameter required by PayPal that is put in verbatim
		$var['cmd'] = '_xclick';

		// The full invoice amount is stored in the int_var field under `amount`
		$var['amount'] = $request->int_var['amount'];

		// The PayPal business username
		$var['business'] = $this->settings['business'];

		// It is advisable to use the invoice number of the invoice to identify notifications
		$var['invoice'] = $request->invoice->invoice_number;

		// All notifications need to be sent to &task=[processor_name]notification
		$var['notify_url']	= AECToolbox::deadsureURL( 'index.php?option=com_acctexp&amp;task=paypalnotification' );

		// Using the Rewrite Engine to allow for custom values
		$var['item_number']		= AECToolbox::rewriteEngineRQ( $this->settings['item_number'], $request );
		$var['item_name']		= AECToolbox::rewriteEngineRQ( $this->settings['item_name'], $request );

		// The return URL is a Thank You page within AEC
		$var['return']			= $request->int_var['return_url'];

		// Finally, PayPal also wants to know which currency we're billing in
		$var['currency_code']	= $this->settings['currency'];

		return $var;
	}

	function parseNotification( $post )
	{
		$response = array();

		// As noted above, we identify which invoice we're receiving a notice for by the invoice number
		$response['invoice'] = $post['invoice'];

		// AEC checks on the currency and amount paid as a security feature, so we want to read it out here
		$response['amount_currency'] = $post['mc_currency'];
		$response['amount_paid'] = $post['mc_gross'];

		return $response;
	}

	function validateNotification( $response, $post, $invoice )
	{
		// Posting our details back to PayPal to authenticate the notification
		$path = '/cgi-bin/webscr';
		if ($this->settings['testmode']) {
			$ppurl = 'https://www.sandbox.paypal.com' . $path;
		} else {
			$ppurl = 'https://www.paypal.com' . $path;
		}

		$req = 'cmd=_notify-validate';

		foreach ( $post as $key => $value ) {
			$value = str_replace('\r\n', "QQLINEBREAKQQ", $value);

			$value = urlencode( stripslashes($value) );

			$value = str_replace( "QQLINEBREAKQQ", "\r\n", $value ); // linebreak fix

			$req .= "&$key=".$value;
		}

		$res = $this->transmitRequest( $ppurl, $path, $req );

		$response['fullresponse']['paypal_verification'] = $res;

		// Testing the transaction status
		$response['valid'] = 0;

		if ( ($post['payment_type'] == 'instant') && ($post['payment_status'] == 'Completed') ) {
			$response['valid'] = 1;
		}

		return $response;
	}
}

```

TODO: Clean up example further

Once you have your file, you also need to put it into the right folder. Since we named our class `processor_paypal_simple`, the folder within /processors needs to be called `paypal_simple` and the file `paypal_simple.php`.

That's all you need to do!

Be sure to check on other payment processor integrations that ship with AEC to see further examples of how you can go about integrating the service of your choice.
