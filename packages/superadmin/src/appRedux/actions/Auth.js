import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  LOGIN_USER_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_USER_SUCCESS,
  COMPONENT_ALLOWED,
  INVALID_TOKEN,
  INVALID_RESPONSE,
  UPDATE_PROFILE,
  BEFORE_COMPONENT_ALLOWED,
  TWO_FACTOR_AUTH,
  VERIFY_CODE,
  GOTO_LOGIN,
  RESET_REBOOT_CONFIRM,
  VERIFY_PASSWORD,
  RESET_PASSWORD_VARIFIED
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';
import { verify } from "crypto";


export const loginUser = (user) => {
  console.log(user);
  return (dispatch) => {

    RestService.login(user).then((resp) => {
      if (resp.data.status === false) {
        dispatch({
          type: LOGIN_FAILED,
          payload: {
            msg: resp.data.msg,
            status: resp.data.status
          }
        });
      } else {
        if (resp.data.two_factor_auth) {
          dispatch({
            type: VERIFY_CODE,
            payload: resp.data
          })
        } else {
          let payload = {
            id: resp.data.user.id,
            email: resp.data.user.email,
            first_name: resp.data.user.first_name,
            last_name: resp.data.user.last_name,
            name: resp.data.user.first_name + ' ' + resp.data.user.last_name,
            token: resp.data.user.token,
            // type: resp.data.user.user_type,
            // dealer_pin: resp.data.user.link_code,
            two_factor_auth: resp.data.user.two_factor_auth
          }
          // console.log("hello", payload);
          RestService.authLogIn(payload)
          dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: payload
          });
        }
      }
    });
  }
};

export const verifyCode = (verifyForm) => {
  return (dispatch) => {
    RestService.verifyCode(verifyForm).then((response) => {
      if (response.data.status) {
        let payload = {
          id: response.data.user.id,
          connected_dealer: response.data.user.connected_dealer,
          connected_devices: response.data.user.connected_devices[0].total,
          email: response.data.user.email,
          dealerId: response.data.user.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          name: response.data.user.dealer_name,
          token: response.data.token,
          type: response.data.user.user_type,
          dealer_pin: response.data.user.link_code,
          dealer_token: '',
          two_factor_auth: response.data.user.two_factor_auth
        }
        RestService.authLogIn(response.data)
        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: payload
        });
      } else {
        console.log(response.data);
      }

    });
  }

}

export const twoFactorAuth = (isEnable) => {
  return (dispatch) => {
    RestService.twoFactorAuth(isEnable).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: TWO_FACTOR_AUTH,
          payload: response.data
        })

      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
}

export const verifyPassword = (password) => {
  return (dispatch) => {
    RestService.checkPass(password).then((response) => {
      if (RestService.checkAuth(response.data)) {
        // console.log(response, 'response from checkpass')
        dispatch({
          type:  VERIFY_PASSWORD,
          response: response.data
        })

      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
}

export const reset_password_varified = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_PASSWORD_VARIFIED
    })
  }
}

export const goToLogin = () => {
  return (dispatch) => {
    dispatch({
      type: GOTO_LOGIN
    })
  }
}
export const checkComponent = (componentUri) => {
  return (dispatch) => {
    dispatch({
      type: BEFORE_COMPONENT_ALLOWED,
      payload: false,
    })

    RestService.checkComponent(componentUri).then((resp) => {
      if (RestService.checkAuth(resp.data)) {
        if (resp.data.status === true) {
          console.log(resp.data);

          let payload = {
            id: resp.data.user.id,
            email: resp.data.user.email,
            first_name: resp.data.user.first_name,
            last_name: resp.data.user.last_name,
            name: resp.data.user.first_name + ' ' + resp.data.user.last_name,
            token: resp.data.user.token,

            two_factor_auth: resp.data.user.two_factor_auth
          }
          RestService.setUserData(payload);

          dispatch({
            type: COMPONENT_ALLOWED,
            payload: {
              ComponentAllowed: resp.data.ComponentAllowed,
              ...payload
            }
          });

        } else {
          dispatch({
            type: INVALID_TOKEN
          });
        }
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
};


export const updateUserProfile = (fromData) => {
  return (dispatch) => {
    // alert("hello");
    RestService.updateUserProfile(fromData).then((resp) => {
      if (RestService.checkAuth(resp.data)) {
        if (resp.data.status === true) {

          dispatch({
            type: UPDATE_PROFILE,
            response: resp.data
          });

        } else {
          dispatch({
            type: INVALID_RESPONSE
          });
        }
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  }
};
export const resetConfirmReboot = () => {
  return (dispatch) => {
    // alert("hello");
    dispatch({
      type: RESET_REBOOT_CONFIRM,
    });
  }
};

export const logout = () => {
  RestService.authLogOut();
  return {
    type: LOGOUT_USER_SUCCESS
  };
};



export const loginSuccess = (authUser) => {

};

export const logoutSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
  }
};

export const showAuthMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};

export const setInitUrl = (url) => {
  return {
    type: INIT_URL,
    payload: url
  };
};

export const showAuthLoader = () => {
  return {
    type: ON_SHOW_LOADER,
  };
};

export const hideMessage = () => {
  return {
    type: HIDE_MESSAGE,
  };
};
export const hideAuthLoader = () => {
  return {
    type: ON_HIDE_LOADER,
  };
};
