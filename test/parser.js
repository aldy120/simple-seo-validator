const assert = require('assert');
const { validator, outputString } = require('../src');


const rules = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt' },
  { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel' },
  { Type: 'TagsNotInHead', Tag: 'title' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords' },
  { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15 },
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1 },
];

const result = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 0 },
  { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel', Amount: 1 },
  { Type: 'TagsNotInHead', Tag: 'title', Result: false },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions', Result: false },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: false },
  { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: false },
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1, Result: false },
];

const stringArray = [
  null,
  'There are 1 <a> tag without rel attribute.',
  null,
  null,
  null,
  null,
  null,
];

const fakeResult = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 10 },
  { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel', Amount: 20 },
  { Type: 'TagsNotInHead', Tag: 'title', Result: true },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions', Result: true },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: true },
  { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: true },
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1, Result: true },
];

const fakeStringArray = [
  'There are 10 <img> tag without alt attribute.',
  'There are 20 <a> tag without rel attribute.',
  'This HTML does not have <title> in <head>',
  'This HTML does not have <meta name="descriptions"> in <head>',
  'This HTML does not have <meta name="keywords"> in <head>',
  'This HTML has more than 15 <strong> tag',
  'This HTML has more than 1 <h1> tag',
];

describe('validate', () => {
  it('example', async () => {
    const file = 'test/example.html';
    assert.deepEqual(result, await validator(file, rules));
  });
});

describe('stringify', () => {
  it('example', () => {
    assert.deepEqual(stringArray, outputString(result));
  });
  it('fake result', () => {
    assert.deepEqual(fakeStringArray, outputString(fakeResult));
  });
});

