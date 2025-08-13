
const fs = require('fs-extra');
const path = require('path');
const { IANAZone, DateTime } = require('luxon');

function modmapDir() {
  return path.join(process.cwd(), '.modmap');
}

function ensureModmapDir() {
  const dir = modmapDir();
  if (!fs.existsSync(dir)) fs.mkdirpSync(dir);
}

function configPath() {
  return path.join(modmapDir(), 'config.json');
}

function loadConfig() {
  ensureModmapDir();
  const cfgPath = configPath();
  if (fs.existsSync(cfgPath)) {
    return fs.readJsonSync(cfgPath);
  }
  return null;
}

function saveConfig(cfg) {
  ensureModmapDir();
  fs.writeJsonSync(configPath(), cfg, { spaces: 2 });
}

function isValidZone(zone) {
  if (!zone) return false;
  return IANAZone.isValidZone(zone);
}

function moduleFilePath(module) {
  return path.join(modmapDir(), `${module}.json`);
}

function listModuleFiles() {
  ensureModmapDir();
  return fs.readdirSync(modmapDir()).filter(f => f.endsWith('.json') && f !== 'config.json');
}

module.exports = {
  modmapDir,
  ensureModmapDir,
  configPath,
  loadConfig,
  saveConfig,
  isValidZone,
  moduleFilePath,
  listModuleFiles,
  DateTime
};
