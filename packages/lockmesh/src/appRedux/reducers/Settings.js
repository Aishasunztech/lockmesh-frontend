import { 
  LANGUAGES, 
  SWITCH_LANGUAGE, 
  TOGGLE_COLLAPSED_NAV, 
  WINDOW_WIDTH, 
  GET_LANGUAGE 
} from "../../constants/ActionTypes";

import {
  LAYOUT_TYPE,
  LAYOUT_TYPE_FULL,
  NAV_STYLE,
  NAV_STYLE_FIXED,
  THEME_COLOR_SELECTION,
  THEME_COLOR_SELECTION_PRESET,
  THEME_TYPE,
  THEME_TYPE_SEMI_DARK,

} from "../../constants/ThemeSetting";


// import constants from '../constants';

import SettingStates from './InitialStates';


var { initialSettings } = SettingStates;

var { translation } = SettingStates;
// import enLang from "../../lngProvider/locales/en_US";

// initialSettings.
// const initialSettings = {
//   navCollapsed: true,
//   navStyle: NAV_STYLE_FIXED,
//   layoutType: LAYOUT_TYPE_FULL,
//   themeType: THEME_TYPE_SEMI_DARK,
//   colorSelection: THEME_COLOR_SELECTION_PRESET,

//   pathname: '',
//   width: window.innerWidth,
//   isDirectionRTL: false,
//   languages: [],
//   translation: enLang,
//   isSwitched: 'abc',
//   //  locale: {
//   //   languageId: 'english',
//   //   locale: 'en',
//   //   name: 'English',
//   //   icon: 'us',
//   // },
// };

const settings = (state = initialSettings, action) => {
  // console.log('Ubaid at red. ', initialSettings.translation)
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      // console.log('@@router/LOCATION_CHANGE');
      // console.log({
      //   ...state,
      //   pathname: action.payload.pathname,
      //   navCollapsed: false
      // });

      return {
        ...state,
        pathname: action.payload.pathname,
        navCollapsed: false
      };
    case TOGGLE_COLLAPSED_NAV:
      // console.log(TOGGLE_COLLAPSED_NAV);
      // console.log({
      //   ...state,
      //   navCollapsed: action.navCollapsed
      // });

      return {
        ...state,
        navCollapsed: action.navCollapsed
      };
    case WINDOW_WIDTH:
      return {
        ...state,
        width: action.width,
      };

    case GET_LANGUAGE: {
      if (action.response.status && action.response.data.length) {
        // console.log('GET_LANGUAGE response is the', action.response.data)
        // console.log(JSON.parse(action.response.data));
        // console.log('GET_LANGUAGE2 response is the', state.translation)
        // initialSettings["translation"] = action.response.data ? JSON.parse(action.response.data) : state.translation
        let passedTranslation = action.response.data ? JSON.parse(action.response.data) : state.translation;
        return {
          ...state,
          // locale: action.response.data[0] ? JSON.parse(action.response.data[0]['dealer_language']) : state.locale
          translation: passedTranslation,
          // deviceOptions: [
          //   { "key": "device_id", "value": DEVICE_ID },
          //   { "key": "user_id", "value": USER_ID },
          //   { "key": "validity", "value": DEVICE_REMAINING_DAYS },
          //   { "key": "status", "value": DEVICE_STATUS },
          //   { "key": "online", "value": DEVICE_MODE },
          //   { "key": "flagged", "value": DEVICE_FLAGGED },
          //   { "key": "name", "value": DEVICE_NAME },
          //   { "key": "account_email", "value": DEVICE_ACCOUNT_EMAIL },
          //   { "key": "client_id", "value": DEVICE_CLIENT_ID },
          //   { "key": "activation_code", "value": DEVICE_ACTIVATION_CODE },
          //   { "key": "pgp_email", "value": DEVICE_PGP_EMAIL },
          //   { "key": "sim_id", "value": DEVICE_SIM_ID },
          //   { "key": "chat_id", "value": DEVICE_CHAT_ID },
          //   { "key": "dealer_id", "value": DEVICE_DEALER_ID },
          //   { "key": "dealer_name", "value": DEVICE_DEALER_NAME },
          //   { "key": "dealer_pin", "value": DEVICE_DEALER_PIN },
          //   { "key": "mac_address", "value": DEVICE_MAC_ADDRESS },
          //   { "key": "imei_1", "value": DEVICE_IMEI_1 },
          //   { "key": "sim_1", "value": DEVICE_SIM_1 },
          //   { "key": "imei_2", "value": DEVICE_IMEI_2 },
          //   { "key": "sim_2", "value": DEVICE_SIM_2 },
          //   { "key": "serial_number", "value": DEVICE_SERIAL_NUMBER },
          //   { "key": "model", "value": DEVICE_MODEL },
          //   { "key": "s_dealer", "value": DEVICE_S_DEALER },
          //   { "key": "s_dealer_name", "value": DEVICE_S_DEALER_NAME },
          //   { "key": "start_date", "value": DEVICE_START_DATE },
          //   { "key": "expiry_date", "value": DEVICE_EXPIRY_DATE },
          // ],
          // dealerOptions: [
          //   { "key": "dealer_id", "value": DEALER_ID },
          //   { "key": "dealer_name", "value": DEALER_NAME },
          //   { "key": "dealer_email", "value": DEALER_EMAIL },
          //   { "key": "link_code", "value": DEALER_PIN },
          //   { "key": "connected_devices", "value": DEALER_DEVICES },
          //   { "key": "dealer_token", "value": DEALER_TOKENS },
          //   { "key": "parent_dealer", "value": Parent_Dealer },
          //   { "key": "parent_dealer_id", "value": Parent_Dealer_ID },
          // ],
          // APKOptions: [
          //   { "key": "permission", "value": APK_PERMISSION},
          //   { "key": "apk_status", "value": APK_SHOW_ON_DEVICE},
          //   { "key": "apk", "value": APK},
          //   { "key": "apk_name", "value": APK_APP_NAME},
          //   { "key": "apk_logo", "value": APK_APP_LOGO},
          // ],
        }
      }
    }
    case THEME_TYPE:
      return {
        ...state,
        themeType: action.themeType
      };
    case THEME_COLOR_SELECTION:
      return {
        ...state,
        colorSelection: action.colorSelection
      };

    case NAV_STYLE:
      return {
        ...state,
        navStyle: action.navStyle
      };
    case LAYOUT_TYPE:
      return {
        ...state,
        layoutType: action.layoutType
      };

    case SWITCH_LANGUAGE:
      // console.log('isSwitched working')
      return {
        ...state,
        isSwitched: new Date()
        // locale: action.payload,
      };
    case LANGUAGES:
      // console.log('All Languages are: ', action.payload);
      return {
        ...state,
        languages: action.payload,
      };
    default:
      // console.log("default Setting reducer");
      // console.log(state);
      return {
        ...state
      };
  }
};

export default settings;
