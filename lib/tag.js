
const fs = require('fs-extra');
const { loadConfig, moduleFilePath, ensureModmapDir, isValidZone, DateTime } = require('./utils');

module.exports = function tag(options) {
  const { module: moduleName, file, function: func, line, desc } = options;
  if (!file && !func && !line) {
    console.error('❌ Provide at least one of --file, --function or --line');
    process.exit(1);
  }
  const cfg = loadConfig();
  if (!cfg || !cfg.timezone || !isValidZone(cfg.timezone)) {
    console.error('❌ Invalid or missing timezone in .modmap/config.json. Run: modmap init --tz <Zone> or modmap config --tz <Zone>');
    process.exit(1);
  }
  const tz = cfg.timezone;
  const timestamp = DateTime.now().setZone(tz).toISO();
  const entry = { timestamp, description: desc || '' };
  if (file) entry.file = file;
  if (func) entry.function = func;
  if (line) entry.line = line;
  ensureModmapDir();
  const mfile = moduleFilePath(moduleName);
  const existing = (fs.existsSync(mfile)) ? fs.readJsonSync(mfile) : [];
  existing.push(entry);
  fs.writeJsonSync(mfile, existing, { spaces: 2 });
  console.log(`✅ Tagged entry under module '${moduleName}'`);
};
