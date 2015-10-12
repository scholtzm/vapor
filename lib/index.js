var Vapor = require('./vapor.js');
var plugins = require('./plugins');

function vaporBuilder() {
  var vapor = new Vapor();
  return vapor;
}

// Export Vapor builder function
exports = module.exports = vaporBuilder;

// Export built-in plugins
exports.plugins = plugins;
