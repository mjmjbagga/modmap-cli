
const { saveConfig, isValidZone } = require('./utils');

module.exports = function init(options) {
  const tz = options.tz;
  if (!isValidZone(tz)) {
    console.error(`❌ Invalid timezone: ${tz}`);
    process.exit(1);
  }
  saveConfig({ timezone: tz });
  console.log(`✅ Initialized .modmap with timezone: ${tz}`);
};
