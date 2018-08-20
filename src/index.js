const fs =  require('fs');

function validator() {
  const body = fs.readFileSync('test/example.html', 'utf8');

  return 200;
}


module.exports = validator;
