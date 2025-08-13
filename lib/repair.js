// lib/repair.js
const fs = require('fs-extra');
const path = require('path');
const { DateTime } = require('luxon');
const { loadConfig, listModuleFiles, isValidZone } = require('./utils');

/**
 * Repair missing/invalid timestamps.
 * --fill-now: fill with current time (configured timezone)
 * --fill-mtime: fill with filesystem mtime (if entry.file exists)
 */
module.exports = function repair(options) {
  const fillNow = !!options.fillNow;
  const fillMtime = !!options.fillMtime;

  if (!fillNow && !fillMtime) {
    console.error("❌ Provide either --fill-now or --fill-mtime");
    return;
  }

  const cfg = loadConfig();
  if (!cfg || !cfg.timezone || !isValidZone(cfg.timezone)) {
    console.error("❌ Invalid or missing timezone in .modmap/config.json. Run 'modmap init --tz <Zone>' or 'modmap config --tz <Zone>'");
    return;
  }

  const tz = cfg.timezone;
  const files = listModuleFiles();
  let filled = 0;

  files.forEach(file => {
    const filePath = path.join('.modmap', file);
    const entries = fs.readJsonSync(filePath);
    const updated = entries.map(entry => {
      // Consider null, empty string, or unparsable as invalid
      const hasValidTimestamp = entry.timestamp && DateTime.fromISO(entry.timestamp).isValid;
      if (hasValidTimestamp) return entry;

      // Fill logic
      if (fillNow) {
        entry.timestamp = DateTime.now().setZone(tz).toISO();
        filled++;
        return entry;
      }

      if (fillMtime) {
        if (entry.file && fs.existsSync(entry.file)) {
          const stat = fs.statSync(entry.file);
          entry.timestamp = DateTime.fromJSDate(stat.mtime).setZone(tz).toISO();
          filled++;
          return entry;
        } else {
          // cannot derive from file mtime; leave it so user can decide
          return entry;
        }
      }

      return entry;
    });

    fs.writeJsonSync(filePath, updated, { spaces: 2 });
  });

  console.log(`✅ Repair complete. Filled timestamps for ${filled} entries.`);
};
