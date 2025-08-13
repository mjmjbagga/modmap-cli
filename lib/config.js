#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

const MODMAP_DIR = path.join(process.cwd(), '.modmap');
const CONFIG_PATH = path.join(MODMAP_DIR, 'config.json');

function isValidTimezone(tz) {
  return moment.tz.zone(tz) !== null;
}

function updateTimestampsInFile(filePath, tz) {
  if (!fs.existsSync(filePath)) return;

  try {
    let data = fs.readJsonSync(filePath);

    // Handle both array-based and object-based JSON files
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.timestamp) {
          const localTime = moment.tz(item.timestamp, tz);
          if (localTime.isValid()) {
            item.timestamp = localTime.format();
          }
        }
      });
    } else if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].timestamp) {
          const localTime = moment.tz(data[key].timestamp, tz);
          if (localTime.isValid()) {
            data[key].timestamp = localTime.format();
          }
        }
      });
    }

    fs.writeJsonSync(filePath, data, { spaces: 2 });
    console.log(`📝 Updated timestamps in ${path.basename(filePath)}`);
  } catch (err) {
    console.warn(`⚠️ Could not update timestamps in ${filePath}:`, err.message);
  }
}

module.exports = function configCmd(options) {
  const { tz } = options;

  if (!tz) {
    console.error(`❌ Please provide a timezone with --tz <Zone>`);
    process.exit(1);
  }

  if (!isValidTimezone(tz)) {
    console.error(`❌ Invalid timezone: ${tz}`);
    process.exit(1);
  }

  fs.ensureDirSync(MODMAP_DIR);

  // Update config.json
  const config = fs.existsSync(CONFIG_PATH) ? fs.readJsonSync(CONFIG_PATH) : {};
  config.timezone = tz;
  fs.writeJsonSync(CONFIG_PATH, config, { spaces: 2 });

  console.log(`✅ Timezone updated to ${tz}. Adjusting timestamps in all JSON files...`);

  // Update timestamps in every JSON file inside .modmap
  const files = fs.readdirSync(MODMAP_DIR).filter(f => f.endsWith('.json') && f !== 'config.json');
  files.forEach(file => {
    updateTimestampsInFile(path.join(MODMAP_DIR, file), tz);
  });
};
