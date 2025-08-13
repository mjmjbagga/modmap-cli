
const { listModuleFiles } = require('./utils');
module.exports = function list() {
  const files = listModuleFiles();
  if (!files || files.length === 0) {
    console.log('No modules found.');
    return;
  }
  files.forEach(f => console.log('- ' + f.replace('.json','')));
};
