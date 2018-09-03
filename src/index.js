const { JSDOM } = require('jsdom');
const fs = require('fs');

/**
 * Translate the rule to string for those whose type of rule is TagsWithoutAttribute.
 * @param {Object} rule - The rule which has enough info to render.
 * @param {number} rule.Amount - The amount of certain tags without the attribute
 * @param {string} rule.Tag - The tag name
 * @param {string} rule.AttributeName - The attribute name
 * @private
 */
function stringifyTagsWithoutAttribute({ Amount, Tag, AttributeName }) {
  if (Amount > 0) {
    return `There are ${Amount} <${Tag}> tag without ${AttributeName} attribute.`;
  }
  return null;
}

/**
 * Translate the rule to string for those whose type of rule is TagsNotInHead.
 * @private
 * @param {Object} rule - The rule which has enough info to render.
 * @param {boolean} rule.Result - The result show whether the rule is broken
 * @param {string} rule.Tag - The tag name
 * @param {string} rule.AttributeName - The attribute name
 * @param {string} rule.AttributeValue - The amount of certain tags without the attribute
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
 * @param {Object} rule - The rule which has enough info to render.
 * @param {boolean} rule.Result - The result show whether the rule is broken.
 * @param {number} rule.Threshold - The upper bound which number of tags cannot more than.
 * @param {string} rule.Tag - The tag name
 * @private
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
 * @param {Object[]} rules - the validated rules
 * @private
 */
function outputString(rules) {
  return rules.map(data => stringify[data.Type](data));
}

/**
 * Validate the DOM model by the rule data which type is TagsWithoutAttribute.
 * @param {Object} document - the document object model of the html
 * @param {Object} data - the rule's data
 * @param {string} data.Tag - The tag name
 * @param {string} data.AttributeName - The attribute name
 * @private
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
 * @param {Object} data - the rule's data
 * @param {string} data.Tag - The tag name
 * @param {string} data.AttributeName - The attribute name
 * @param {string} data.AttributeValue - The amount of certain tags without the attribute
 * @private
 */
function handleTagsNotInHead(document, data) {
  const { Tag: tag, AttributeName: attName, AttributeValue: attValue } = data;
  let att = '';
  if (attName !== undefined && attValue !== undefined) {
    att = `[${attName}="${attValue}"]`;
  } else if (attName !== undefined) {
    att = `[${attName}]`;
  }

  // Find tag with attribute name(name/value)
  const nodes = document.querySelectorAll(`head>${tag}${att}`);
  const result = nodes.length === 0;
  return { ...data, Result: result };
}

/**
 * Validate the DOM model by the rule data which type is TagsMoreThan.
 * @param {*} document - the document object model of the html
 * @param {*} data - the rule's data
 * @param {number} data.Threshold - The upper bound which number of tags cannot more than.
 * @param {string} data.Tag - The tag name
 * @private
 */
function handleTagsMoreThan(document, data) {
  const { Tag: tag, Threshold: threshold } = data;
  const nodes = document.querySelectorAll(tag);
  const result = nodes.length > threshold;
  return { ...data, Result: result };
}

/**
 * Validate the file by rules.
 * @param {string} filename - the file name of the file which we want to validate
 * @param {Object[]} rules - the validation rules
 * @private
 */
async function validator(filename, rules = []) {
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

/**
 * Log the validate result to the console
 * @param {string} filename - Html file name
 * @param {Object[]} rules - Array of rules
 */
async function logReport(filename, rules) {
  const data = await validator(filename, rules);
  const output = outputString(data).filter(x => x !== null).join('\n');
  console.log(output);
}
/**
 * Write the report to a file
 * @param {string} filename - Html file name
 * @param {object[]} rules - Array of rules
 * @param {string} outputFilename - File path to write
 */
async function writeReport(filename, rules, outputFilename) {
  const data = await validator(filename, rules);
  const output = outputString(data).filter(x => x !== null).join('\n');
  fs.writeFileSync(outputFilename, output);
}

module.exports = {
  validator,
  outputString,
  stringifyTagsWithoutAttribute,
  stringifyTagsNotInHead,
  stringifyTagsMoreThan,
  logReport,
  writeReport,
};
