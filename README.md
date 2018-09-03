# simple-seo-validator
[![Build Status](https://travis-ci.org/aldy120/simple-seo-validator.svg?branch=master)](https://travis-ci.org/aldy120/simple-seo-validator)

A simple SEO validator with some rules built in.
# Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install simple-seo-validator
```


# Quick start
First, we create a simple `example.html` file for our example.

`example.html`
```
<!DOCTYPE html>
<html>
<head>
</head>
<body>
  <img />
</body>
</html>
```
> Note that `example.html` has a img tag without attribute alt.

Then we can validate the html file `example.html` with the rule (all img tag should have alt attribute).

`index.js`
```js
const { logReport } = require('simple-seo-validator');

const rules = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt' },
];

// Validate example.html and log the report in console.
logReport('example.html', rules); // There are 1 <img> tag without alt attribute.
```

# Rules
You can use the following rule types to validate a HTML file.
- `TagsWithoutAttribute`
- `TagsNotInHead`
- `TagsMoreThan`

## `TagsWithoutAttribute`
`TagsWithoutAttribute` can find the amount of the tags without a certain attribute, by specifying the tag name and attribute name. 

If we want to check whether there is some `img` tag without `alt` attribute, we can set the following rule.

Example rules: 
```js
[
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt' }
]
```

## `TagsNotInHead`
`TagsNotInHead` can validate whether a tag is in HTML head, by specifying tag name, attribute name, and attribute value. If you do not specify an attribute value, all the tags which has the attribute name will be counted.

If we want to know:
- whether `title` tag is not in head
- and whether `meta` tag with attribute name `name` and attribute value `descriptions`, is in head
we can apply the following two rules:

Example rules: 
```js

[
  { Type: 'TagsNotInHead', Tag: 'title' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions' }
]
```

## `TagsMoreThan`
`TagsMoreThan` can validate whether the number of the tags is more than the threshold, by specifing the tag name and the threshold.

If we want to know whether `h1` tag appears more than 1 time, use the following rule.

Example rules: 
```js
[
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1 }
]
```

# Mix the SEO rules
If you want to validate the following conditions:
```
1. Detect if any <img /> tag without alt attribute
2. Detect if any <a /> tag without rel attribute
3. In <head> tag
i. Detect if header doesn’t have <title> tag
ii. Detect if header doesn’t have <meta name=“descriptions” ... /> tag
iii. Detect if header doesn’t have <meta name=“keywords” ... /> tag
4. Detect if there’re more than 15 <strong> tag in HTML (15 is a value should be configurable by user)
5. Detect if a HTML have more than one <H1> tag.
```

You can set the rules to meet your requirements.
```js
const rules = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt' },
  { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel' },
  { Type: 'TagsNotInHead', Tag: 'title' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords' },
  { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15 },
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1 },
];
```

# Write report to a file
You can save the report to a file using `writeReport` function, which returns a promise.
```js
const { writeReport } = require('../src');

writeReport('example.html', rules, 'myReport.txt')
  .catch(console.log);
```

# Print report in console
As we show in quick start section, `logReport` can print report in console, which returns a promise.
```js
logReport('example.html', rules).catch(err => console.log(err))
  .catch(console.log);
```
