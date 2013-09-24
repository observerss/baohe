var path = require('path'),
    util = require('util'),
    fs = require('fs');

var version = require('./package.json').version;

var Commands = [
  'all',
  'cd',
  'cp',
  'current',
  'help',
  'ls',
  'pwd',
  'use',
  'version',
];

var Supports = ['baidu'];
var ConfigFileName = '.baohe.json';

function getConfigFile() {
  var configDir = process.env.HOME || process.env.TMPDIR;
  return path.join(configDir, ConfigFileName);
}

function Baohe() {}

Baohe.prototype.getCommand = function(name) {
  var command = 'help';
  if (Commands.indexOf(name) !== -1) {
    command = name;
  }
  return require('./lib/' + command);
};

Baohe.prototype.getService = function(serviceName) {
  return require('./lib/' + serviceName);
};

Baohe.prototype.getConfig = function(service) {
  if (!this.config) {
    var configFile = getConfigFile();
    if (fs.existsSync(configFile)) {
      this.config = require(configFile);
    } else {
      this.config = {};
    }
  }
  return this.config[service];
};

Baohe.prototype.login = function(user, password, service) {
  var result = false;
  //test if success
  if (result) {
    this.config[service] = {
      user: user,
      password: password
    };
    // write to config file
    this._writeConfigFile();
  }
  return result;
};

Baohe.prototype.debug = function() {
  if (/\bbaohe\b/.test(process.env.NODE_DEBUG)) {
    console.error('[BAOHE] %s', util.format.apply(util, arguments));
  }
};

Baohe.prototype._writeConfigFile = function() {
  fs.writeFile(getConfigFile(), JSON.stringify(this.config, null, 2),
    function(err) {
      if (err) {
        console.err(err);
      }
    });
};

exports = module.exports = new Baohe();

exports.Version = version;
exports.Commands = Commands;
exports.Supports = Supports;
