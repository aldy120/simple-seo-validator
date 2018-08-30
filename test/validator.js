const assert = require('assert');
const { validator, outputString, logReport, writeReport } = require('../src');

const rules = [
  { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt' },
  { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel' },
  { Type: 'TagsNotInHead', Tag: 'title' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions' },
  { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords' },
  { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15 },
  { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1 },
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

describe('validator', () => {
  it('example', async () => {
    const expectResult = [
      { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 0 },
      { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel', Amount: 1 },
      { Type: 'TagsNotInHead', Tag: 'title', Result: false },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions', Result: false },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: false },
      { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: false },
      { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1, Result: false },
    ];
    
    const file = 'test/example.html';
    assert.deepEqual(expectResult, await validator(file, rules));
  });
  it('example2', async () => {
    const expectResult = [
      { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 3 },
      { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel', Amount: 2 },
      { Type: 'TagsNotInHead', Tag: 'title', Result: true },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions', Result: true },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: true },
      { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: true },
      { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1, Result: true },
    ];
    const file = 'test/example2.html';
    assert.deepEqual(expectResult, await validator(file, rules));
  });
  it('example3', async () => {
    const expectResult = [
      { Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 0 },
      { Type: 'TagsWithoutAttribute', Tag: 'a', AttributeName: 'rel', Amount: 0 },
      { Type: 'TagsNotInHead', Tag: 'title', Result: false },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'descriptions', Result: false },
      { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: false },
      { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: false },
      { Type: 'TagsMoreThan', Tag: 'h1', Threshold: 1, Result: false },
    ];
    const file = 'test/example3.html';
    assert.deepEqual(expectResult, await validator(file, rules));
  });
});

describe('outputString', () => {
  it('example', () => {
    const expectResult = [
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
    assert.deepEqual(stringArray, outputString(expectResult));
  });
  it('fake result', () => {
    const fakeStringArray = [
      'There are 10 <img> tag without alt attribute.',
      'There are 20 <a> tag without rel attribute.',
      'This HTML does not have <title> in <head>',
      'This HTML does not have <meta name="descriptions"> in <head>',
      'This HTML does not have <meta name="keywords"> in <head>',
      'This HTML has more than 15 <strong> tag',
      'This HTML has more than 1 <h1> tag',
    ];
    assert.deepEqual(fakeStringArray, outputString(fakeResult));
  });
});

// the following tests have side effect

// this test will log something in console
// describe('final output', () => {
//   it('example.html', async () => {
//     await logReport('test/example.html', rules);
//   });
// });

// this test will create a file test/a.txt
// describe('write result', () => {
//   it('write to a.txt', async () => {
//     await writeReport('test/example.html', rules, 'test/a.txt');
//   });
// });
