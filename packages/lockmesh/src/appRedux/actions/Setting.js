import { 
  LANGUAGES, 
  SWITCH_LANGUAGE, 
  TOGGLE_COLLAPSED_NAV, 
  WINDOW_WIDTH, 
  INVALID_TOKEN, 
  GET_LANGUAGE 
} from "constants/ActionTypes";

import { 
  LAYOUT_TYPE, 
  NAV_STYLE, 
  THEME_COLOR_SELECTION, 
  THEME_TYPE 
} from "../../constants/ThemeSetting";

import RestService from '../services/RestServices';

export function toggleCollapsedSideNav(navCollapsed) {
  return { type: TOGGLE_COLLAPSED_NAV, navCollapsed };
}

export function updateWindowWidth(width) {
  return { type: WINDOW_WIDTH, width };
}

export function setThemeType(themeType) {
  return { type: THEME_TYPE, themeType };
}

export function setThemeColorSelection(colorSelection) {
  return { type: THEME_COLOR_SELECTION, colorSelection };
}

export function onNavStyleChange(navStyle) {
  return { type: NAV_STYLE, navStyle };
}

export function onLayoutTypeChange(layoutType) {
  return { type: LAYOUT_TYPE, layoutType };
}


export function getAll_Languages() {
  return (dispatch) => {
    RestService.getAll_Languages().then((response) => {
      // console.log("Language Resoonse" , response.data)
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: LANGUAGES,
          payload: response.data.data
        })
      }
    })
  }
}

export function switchLanguage(locale) {
  return (dispatch) => {
    RestService.switchLanguage(locale).then((response) => {
      if (RestService.checkAuth(response.data)) {
        // console.log('response', response.data);
        if (response.data) {
          dispatch({
            type: SWITCH_LANGUAGE,
            // payload: locale
          })
        } 
      } 
      // else {
      //   dispatch({
      //     type: INVALID_TOKEN
      //   });
      // }
    })
  }
}

export function getLanguage() {
  return (dispatch) => {
    RestService.getLanguage().then((response) => {
      if (RestService.checkAuth(response.data)) {
        // console.log('getLanguage response', response.data);
        if (response.data) {
          dispatch({
            type: GET_LANGUAGE,
            response: response.data
          })
        } 
        // else {
        //   dispatch({
        //     type: INVALID_TOKEN
        //   });
        // }
      } 
      // else {
      //   dispatch({
      //     type: INVALID_TOKEN
      //   });
      // }
    })
  }
}



