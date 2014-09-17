# Hacking AEC

## Decode the "Encrypted" Database Fields

In AEC, we pack a lot of data into the parameter fields. We do this by serializing and then base64_encoding PHP objects so that they can be recreated later on.

You can decode them with this PHP call:

```
$result = unserialize( base64_decode( $field ) );
```

And if you want to encode a field, you do it the other way round:

```
$encoded = base64_encode( serialize( $object ) );
```
