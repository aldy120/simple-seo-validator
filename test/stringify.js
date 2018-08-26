const assert = require('assert');

const {
  stringifyTagsWithoutAttribute,
  stringifyTagsNotInHead,
  stringifyTagsMoreThan,
} = require('../src');

describe('stringifyTagsWithoutAttribute', () => {
  it('10 img without alt', () => {
    const expectResult = 'There are 10 <img> tag without alt attribute.';
    const input = {
      Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 10
    };
    assert.equal(expectResult, stringifyTagsWithoutAttribute(input));
  });
  it('0 img without alt', () => {
    const expectResult = null;
    const input = {
      Type: 'TagsWithoutAttribute', Tag: 'img', AttributeName: 'alt', Amount: 0
    };
    assert.equal(expectResult, stringifyTagsWithoutAttribute(input));
  });
});

describe('stringifyTagsNotInHead', () => {
  it('title not in head', () => {
    const input = { Type: 'TagsNotInHead', Tag: 'title', Result: true };
    const expectResult = 'This HTML does not have <title> in <head>';
    assert.equal(expectResult, stringifyTagsNotInHead(input));
  });
  it('meta description tag not in head', () => {
    const input = {
      Type: 'TagsNotInHead',
      Tag: 'meta',
      AttributeName: 'name',
      AttributeValue: 'descriptions',
      Result: true,
    };
    const expectResult = 'This HTML does not have <meta name="descriptions"> in <head>';
    assert.equal(expectResult, stringifyTagsNotInHead(input));
  });
  it('meta keywords tag in head', () => {
    const input = { Type: 'TagsNotInHead', Tag: 'meta', AttributeName: 'name', AttributeValue: 'keywords', Result: false };
    const expectResult = null;
    assert.equal(expectResult, stringifyTagsNotInHead(input));
  });
});

describe('stringifyTagsMoreThan', () => {
  it('more than 15 strong tag', () => {
    const input = { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: true };
    const expectResult = 'This HTML has more than 15 <strong> tag';
    assert.equal(expectResult, stringifyTagsMoreThan(input));
  });
  it('less than 15 strong tag', () => {
    const input = { Type: 'TagsMoreThan', Tag: 'strong', Threshold: 15, Result: false };
    const expectResult = null;
    assert.equal(expectResult, stringifyTagsMoreThan(input));
  });
});
