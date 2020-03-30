// import { APP_TITLE } from '../constants/Application'
let applicationConstants = require("../constants/Application");

module.exports = {
  footerText: `Copyright ${
    applicationConstants.APP_TITLE
  } © ${new Date().getFullYear()} (Version ${applicationConstants.VERSION})`
};
