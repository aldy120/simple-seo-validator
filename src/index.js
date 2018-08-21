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


module.exports = { validator };
