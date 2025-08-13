
const fs = require('fs-extra');
const { moduleFilePath } = require('./utils');

module.exports = function query(module) {
  const p = moduleFilePath(module);
  if (!fs.existsSync(p)) {
    console.error(`❌ Module '${module}' not found.`);
    process.exit(1);
  }
  const data = fs.readJsonSync(p);
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`ℹ️ No entries for module '${module}'.`);
    return;
  }
  console.log(`📦 Module: ${module}`);
  data.forEach((e, i) => {
    console.log(`
[${i+1}]`);
    if (e.file) console.log(`  file: ${e.file}`);
    if (e.function) console.log(`  function: ${e.function}`);
    if (e.line) console.log(`  line: ${e.line}`);
    console.log(`  description: ${e.description || ''}`);
    console.log(`  timestamp: ${e.timestamp}`);
  });
};
