const jsdom = require('jsdom');

const { JSDOM } = jsdom;

/**
 * Translate the rule to string for those whose type of rule is TagsWithoutAttribute.
 */
function stringifyTagsWithoutAttribute({ Amount, Tag, AttributeName }) {
  if (Amount > 0) {
    return `There are ${Amount} <${Tag}> tag without ${AttributeName} attribute.`;
  }
  return null;
}

/**
 * Translate the rule to string for those whose type of rule is TagsNotInHead.
 */
function stringifyTagsNotInHead({ Result, Tag, AttributeName, AttributeValue }) {
  let outputTag;
  if (AttributeName !== undefined && AttributeValue !== undefined) {
    outputTag = `${Tag} ${AttributeName}="${AttributeValue}"`;
  } else {
    outputTag = `${Tag}`;
  }
  if (Result === true) {
    return `This HTML does not have <${outputTag}> in <head>`;
  }
  return null;
}

/**
 * Translate the rule to string for those whose type of rule is TagsMoreThan.
 */
function stringifyTagsMoreThan({ Result, Threshold, Tag }) {
  if (Result === true) {
    return `This HTML has more than ${Threshold} <${Tag}> tag`;
  }
  return null;
}
const stringify = {
  TagsWithoutAttribute: stringifyTagsWithoutAttribute,
  TagsNotInHead: stringifyTagsNotInHead,
  TagsMoreThan: stringifyTagsMoreThan,
};

/**
 * Map the validated rules to the final output string.
 * @param {Array} rules - the validated rules
 */
function outputString(rules) {
  return rules.map(data => stringify[data.Type](data));
}

/**
 * Validate the DOM model by the rule data which type is TagsWithoutAttribute.
 * @param {*} document - the document object model of the html
 * @param {*} data - the rule's data
 */
function handleTagsWithoutAttribute(document, data) {
  const { Tag: tag, AttributeName: attribute } = data;
  const tagNodes = document.querySelectorAll(tag);
  const tagNodesWithAttribute = document.querySelectorAll(`${tag}[${attribute}]`);
  const amount = tagNodes.length - tagNodesWithAttribute.length;
  return { ...data, Amount: amount };
}

/**
 * Validate the DOM model by the rule data which type is TagsNotInHead.
 * @param {*} document - the document object model of the html
 * @param {*} data - the rule's data
 */
function handleTagsNotInHead(document, data) {
  const { Tag: tag, AttributeName: attName, AttributeValue: attValue } = data;
  // TODO: 字串處理看似不易懂，要想辦法使易懂
  let att;
  if (attName !== undefined && attValue !== undefined) {
    att = `[${attName}="${attValue}"]`;
  } else if (attName !== undefined) {
    att = `[${attName}]`;
  }
  const nodes = document.querySelectorAll(`head>${tag}${att !== undefined ? att : ''}`);
  const result = nodes.length === 0;
  return { ...data, Result: result };
}

/**
 * Validate the DOM model by the rule data which type is TagsMoreThan.
 * @param {*} document - the document object model of the html
 * @param {*} data - the rule's data
 */
function handleTagsMoreThan(document, data) {
  const { Tag: tag, Threshold: threshold } = data;
  const nodes = document.querySelectorAll(tag);
  const result = nodes.length > threshold;
  return { ...data, Result: result };
}

/**
 * Validate the file by rules.
 * @param {*} filename - the file name of the file which we want to validate
 * @param {*} rules - the validation rules
 */
async function validator(filename, rules) {
  let dom;
  try {
    dom = await JSDOM.fromFile(filename);
  } catch (err) {
    console.log(err);
  }
  const { document } = dom.window;
  return rules.map((data) => {
    switch (data.Type) {
      case 'TagsWithoutAttribute':
        return handleTagsWithoutAttribute(document, data);
      case 'TagsNotInHead':
        return handleTagsNotInHead(document, data);
      case 'TagsMoreThan':
        return handleTagsMoreThan(document, data);
      default:
        throw Error('The type of the rule is undefined!');
    }
  });
}

module.exports = {
  validator,
  outputString,
  stringifyTagsWithoutAttribute,
  stringifyTagsNotInHead,
  stringifyTagsMoreThan,
};
