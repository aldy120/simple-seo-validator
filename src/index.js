const jsdom = require('jsdom');
const util = require('util');

const { JSDOM } = jsdom;


function validator(filename) {
  // const filename = 'test/empty-alt.html';
  // const filename = 'test/no-alt.html';
  JSDOM.fromFile(filename)
    .then((dom) => {
      // console.log(dom.serialize());
      const { document } = dom.window;
      // Law 1
      const { total: law1Count } = passLaw1Count(document);
      console.log(`There are ${law1Count} <img> tag without alt attribute.`);
      // Law 2
      const { total: law2Count } = passLaw2Count(document);
      console.log(`There are ${law2Count} <a> tag without rel attribute.`);
      // Law 3.1
      const { total: law3TitleCount } = passHaveTitle(document);
      console.log(`This HTML has ${law3TitleCount} <title> tag`);
      // Law 3.2
      const { total: law3DescriptionsCount } = passMetaDescriptions(document);
      console.log(`This HTML has ${law3DescriptionsCount} <meta name="descriptions"> tag in <head>`);
      // Law 3.3
      const { total: law3KeywordsCount } = passMetaKeywords(document);
      console.log(`This HTML has ${law3KeywordsCount} <meta name="keywords"> tag in <head>`);
      // Law 4
      const { total: strongCount } = passStrong(document);
      console.log(`This HTML has ${strongCount} <strong> tag`);
      // Law 5
      const { total: h1Count } = passH1(document);
      console.log(`This HTML has ${h1Count} <h1> tag`);
    }).catch(err => console.log(err));

  return 200;
}

function passLaw1Count(document) {
  const imgNodes = document.querySelectorAll('img');
  const imgNodesWithAlt = document.querySelectorAll('img[alt]');
  return {
    total: imgNodes.length - imgNodesWithAlt.length,
  };
}

function passLaw2Count(document) {
  const aNodes = document.querySelectorAll('a');
  const aNodesWithRel = document.querySelectorAll('a[rel]');
  return {
    total: aNodes.length - aNodesWithRel.length,
  };
}

function passHaveTitle(document) {
  const titleNodes = document.querySelectorAll('head>title');
  return {
    total: titleNodes.length,
  };
}

function passMetaDescriptions(document) {
  const nodes = document.querySelectorAll('head>meta[name="descriptions"]');
  return { total: nodes.length };
}

function passMetaKeywords(document) {
  const nodes = document.querySelectorAll('head>meta[name="keywords"]');
  return { total: nodes.length };
}

function passStrong(document) {
  const nodes = document.querySelectorAll('strong');
  return { total: nodes.length };
}

function passH1(document) {
  const nodes = document.querySelectorAll('h1');
  return { total: nodes.length };
}

module.exports = { validator };
