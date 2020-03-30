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
	LOGIN_HISTORY
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export const loginUser = (user) => {

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
						connected_dealer: resp.data.user.connected_dealer,
						connected_devices: resp.data.user.connected_devices[0].total,
						email: resp.data.user.email,
						dealerId: resp.data.user.id,
						firstName: resp.data.user.firstName,
						lastName: resp.data.user.lastName,
						name: resp.data.user.dealer_name,
						token: resp.data.token,
						type: resp.data.user.user_type,
						dealer_pin: resp.data.user.link_code,
						dealer_token: '',
						account_balance_status: resp.data.user.account_balance_status,
						account_balance_status_by: resp.data.user.account_balance_status_by,
						two_factor_auth: resp.data.user.two_factor_auth,
						demos: resp.data.user.demos,
						remaining_demos: resp.data.user.remaining_demos,
						company_name: resp.data.user.company_name,
						company_address: resp.data.user.company_address,
						city: resp.data.user.city,
						state: resp.data.user.state,
						country: resp.data.user.country,
						postal_code: resp.data.user.postal_code,
						tel_no: resp.data.user.tel_no,
						website: resp.data.user.website,
						timezone: resp.data.user.timezone,
					}
					RestService.authLogIn(resp.data)
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
					two_factor_auth: response.data.user.two_factor_auth,
					account_balance_status: response.data.user.account_balance_status,
					account_balance_status_by: response.data.user.account_balance_status_by,
					demos: response.data.user.demos,
					remaining_demos: response.data.user.remaining_demos,
					company_name: response.data.user.company_name,
					company_address: response.data.user.company_address,
					city: response.data.user.city,
					state: response.data.user.state,
					country: response.data.user.country,
					postal_code: response.data.user.postal_code,
					tel_no: response.data.user.tel_no,
					website: response.data.user.website,
					timezone: response.data.user.timezone,
				}
				RestService.authLogIn(response.data)
				dispatch({
					type: LOGIN_USER_SUCCESS,
					payload: payload
				});
			} else {
				// console.log(response.data);
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
					let payload = {
						id: resp.data.user.id,
						connected_dealer: resp.data.user.connected_dealer,
						connected_devices: resp.data.user.connected_devices[0].total,
						email: resp.data.user.email,
						dealerId: resp.data.user.id,
						firstName: resp.data.user.firstName,
						lastName: resp.data.user.lastName,
						name: resp.data.user.dealer_name,
						// token: resp.data.token,
						type: resp.data.user.user_type,
						dealer_pin: resp.data.user.link_code,
						two_factor_auth: resp.data.user.two_factor_auth,
						verified: resp.data.user.verified,
						account_balance_status: resp.data.user.account_balance_status,
						account_balance_status_by: resp.data.user.account_balance_status_by,
						demos: resp.data.user.demos,
						remaining_demos: resp.data.user.remaining_demos,
						company_name: resp.data.user.company_name,
						company_address: resp.data.user.company_address,
						city: resp.data.user.city,
						state: resp.data.user.state,
						country: resp.data.user.country,
						postal_code: resp.data.user.postal_code,
						tel_no: resp.data.user.tel_no,
						website: resp.data.user.website,
						timezone: resp.data.user.timezone,
					}
					RestService.setUserData(resp.data);

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
export const getLoginHistory = (offset, limit) => {
	return (dispatch) => {
		// alert("hello");
		RestService.getLoginHistory(offset, limit).then((resp) => {
			if (RestService.checkAuth(resp.data)) {
				if (resp.data.status === true) {

					dispatch({
						type: LOGIN_HISTORY,
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
