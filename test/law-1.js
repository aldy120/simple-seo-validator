// Detect if any <img /> tag without alt attribute
const assert = require('assert');
const { validator } = require('../src');

const goodHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <p>Hello 你好!</p>  
  <img src="img.jpg" alt="image" />
</body>
</html>`;

const emptyAltHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <p>Hello 你好!</p>  
  <img src="img.jpg" alt="" />
</body>
</html>`;

const noAltHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <p>Hello 你好!</p>  
  <img src="img.jpg" />
</body>
</html>`;

describe('img alt', () => {
  it('has alt', () => {
    assert.equal(validator('test/example.html'), 200);
  });
  it('empty alt', () => {
    assert.equal(validator('test/empty-alt.html'), 200);
  });
  it('no alt', () => {
    assert.equal(validator('test/no-alt.html'), 200);
  });
  // it('has alt', () => {
  //   assert.equal(imgHasAlt(imgNode), true);
  // });
  // it('empty alt', () => {
  //   assert.equal(imgHasAlt(imgNode), true);
  // });
  // it('without alt', () => {
  //   assert.equal(imgHasAlt(imgNode), false);
  // });
});