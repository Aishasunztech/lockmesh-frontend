let applicationConstants = require('../constants/Application')
let Constants = require('../constants/Constants')

module.exports = {
  footerText: `Copyright ${applicationConstants.APP_TITLE} © ${new Date().getFullYear()} (Version ${Constants.VERSION})`,
};
