# Rewrite Engine

TODO: Explain basic functionality

TODO: Example of use in Payment Plan lifecycle

TODO: Example of use in MI

## AECjson

AECjson strings can be a bit hard to grasp, so here is a ton of examples that you could either reuse or modify to your needs.

## Condition Trial Statement

```
{aecjson}{"cmd":"condition","vars":[{"cmd":"data","vars":"payment.freetrial"},{"cmd":"concat","vars":[{"cmd":"constant","vars":"_CONFIRM_FREETRIAL"},"&nbsp;",{"cmd":"data","vars":"payment.method_name"}]},{"cmd":"concat","vars":[{"cmd":"data","vars":"payment.amount"},{"cmd":"data","vars":"payment.currency_symbol"},"&nbsp;-&nbsp;",{"cmd":"data","vars":"payment.method_name"}]}]}{/aecjson}
```

**Result** (depending on whether or not it is a Free Trial, as determined by the payment->freetrial property)

```
Free Trial PayPal Subscription
```

**or**

```
25.00€ - PayPal
```

## Condition based on a string of text

```
{aecjson}{"cmd":"condition","vars":[{"cmd":"hastext","vars":[{"cmd":"metaUser","vars":"cmsUser.email"},"@gmail.com"]},"Yes","No"]}{/aecjson}
```

**Result** (depending on whether or not the email address of the user contains the text "@gmail.com")

```
Yes
```

**or**

```
No
```

## Standard alternative Invoice Number Formatting

```
{aecjson}{"cmd":"concat","vars":[{"cmd":"date","vars":["Y",{"cmd":"rw_constant","vars":"invoice_created_date"}]},"-",{"cmd":"rw_constant","vars":"invoice_id"}]}{/aecjson}
```

**Result**

```
2011-2345
```

## Alternative Invoice Number Formatting

```
{aecjson}{"cmd":"concat","vars":["RX",{"cmd":"pad","vars":[{"cmd":"rw_constant","vars":"invoice_id"},5,"0","left"]}]}{/aecjson}
```

**Result**

```
RX00123
```

## Custom field from the Custom Params in a User Account

```
{aecjson}{"cmd":"metaUser","vars":"meta.custom_params.food_preference"}{/aecjson}
```

**Result**

```
Vegetarian
```

## Formatting the Subscription Expiration Date

```
{aecjson}{"cmd":"date","vars":["Y-m-d",{"cmd":"rw_constant","vars":"subscription_expiration_date"}]}{/aecjson}
```

**Result**

```
2012-09-15
```

## Addition

```
{aecjson}{"cmd":"math","vars":["+",{"cmd":"rw_constant","vars":"user_id"},"500"]}{/aecjson}
```

**Result** (with user having a userid of 62)

```
562
```

## Get info from MI Form Parameters

```
{aecjson}{"cmd":"metaUser","vars":"meta.params.mi.1.vat_number"}{/aecjson}
```

**Result**

```
DE123456789
```

```
{aecjson}{"cmd":"condition","vars":[{"cmd":"checkdata","vars":"metaUser.meta.params.mi.1.vat_number"},{"cmd":"safedata","vars":"metauser.meta.params.mi.1.vat_number"},{"cmd":"not supplied or not verified","vars":""}]}{/aecjson}
```

**Result** (depending on whether or not a VAT Number was provided)

```
HU12345678
```

**or**

```
not supplied or not verified
```

## Random String of Alphanumeric Characters

```
{aecjson}{"cmd":"randomstring_alphanum","vars":"8"}{/aecjson}
```

**Result**

```
AP2nC0y9
```

* * *

```
{aecjson}{"cmd":"randomstring_alphanum_large","vars":"4"}{/aecjson}
```

**Result**

```
3C1X
```
