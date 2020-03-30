import {
	APK_LIST,
	ADD_APK,
	UNLINK_APK,
	EDIT_APK,
	APK_STATUS_CHANGED,
	LOADING,
	POST_DROPDOWN,
	GET_DROPDOWN,
	GET_PAGINATION,
	PERMISSION_SAVED,
	RESET_UPLOAD_FORM,
	CHECK_APK_NAME,
	AUTHENTICATE_UPDATE_USER,
	RESET_AUTH_UPDATE,
	CHECK_BULK_PASS,
	RESET_BULK_FLAG,
	APK_LOADING
} from "../../constants/ActionTypes";

import {
	APK_SHOW_ON_DEVICE,
	APK,
	APK_APP_NAME,
	APK_APP_LOGO,
	APK_PERMISSION
} from '../../constants/ApkConstants';
import { message, Modal } from 'antd';
import { findAndRemove_duplicate_in_array, removeDuplicateObjects, checkIsArray } from "../../routes/utils/commonUtils";

const success = Modal.success
const error = Modal.error

const initialState = {
	isloading: false,
	apk_list: [],
	selectedOptions: [],
	DisplayPages: '10',
	// options: [
	// 	APK_PERMISSION,
	// 	APK_SHOW_ON_DEVICE,
	// 	APK,
	// 	APK_APP_NAME,
	// 	APK_APP_LOGO,
	// ],
	resetUploadForm: false,
	authenticateUpdateUser: false,
	isBulkActivity: false
};

export default (state = initialState, action) => {

	switch (action.type) {

		case APK_LOADING:
			return {
				...state,
				isloading: true,
			}

		case APK_LIST:
			// console.log(action.payload);

			return {
				...state,
				isloading: false,
				apk_list: action.payload,
				options: state.options
			}


		case UNLINK_APK: {

			// console.log(UNLINK_APK);
			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				state.apk_list = checkIsArray(state.apk_list).filter(apk => apk.apk_id !== action.payload);
			}

			return {
				...state,
				isloading: false,
				apk_list: state.apk_list,
				options: state.options
			}
		}

		case ADD_APK: {
			// console.log(ADD_APK);
			let newApkList = state.apk_list
			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				// console.log("INSERTED DATA", state.apk_list);
				newApkList.push(action.payload)
				// console.log("INSERTED DATA", state.apk_list);
			} else {
				error({
					title: action.response.msg,
				});
			}
			return {
				...state,
				apk_list: [...newApkList],
			}
		}
		case EDIT_APK:
			// console.log('action edit id');
			// console.log(action.payload);
			// console.log(EDIT_APK);	
			let apkList = state.apk_list
			if (action.response.status) {

				success({
					title: action.response.msg,
				});
				let objIndex1 = apkList.findIndex((obj => obj.apk_id === action.payload.apk_id));
				if (objIndex1 !== undefined) {
					apkList[objIndex1] = action.payload
				}
			}
			else {
				error({
					title: action.response.msg,
				});;
			}
			return {
				...state,
				isloading: false,
				apk_list: [...apkList],
				options: state.options
			}

		case APK_STATUS_CHANGED: {
			// console.log(APK_STATUS_CHANGED)
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.payload));
			// console.log('index of item',objIndex);
			// message.success('Status Changed Successfully')
			message.success(action.msg)
			if (state.apk_list[objIndex].apk_status === 'Off') {
				// console.log('apk_status_off',state.apk_list[objIndex].apk_status);
				state.apk_list[objIndex].apk_status = "On";
			}
			else {
				// console.log('apk_status_on',state.apk_list[objIndex].apk_status);
				state.apk_list[objIndex].apk_status = "Off";
			}

			// console.log('new_apk_list',state.apk_list)
			return {
				...state,
				isloading: false,
				apk_list: [...state.apk_list],
				options: state.options
			}
		}
		// case PERMISSION_SAVED: {
		// 	success({
		// 		title: action.payload
		// 	});;
		// 	let dealers = JSON.parse(action.dealers)
		// 	// console.log(dealers.length ,'itrititt',action.apk_id);
		// 	let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.apk_id));
		// 	state.apk_list[objIndex].permission_count = action.permission_count;

		// 	return {
		// 		...state,
		// 		apk_list: [...state.apk_list]
		// 	}
		// }

		// case PERMISSION_SAVED: {

		// 	// console.log("at reducer PERMISSION_SAVED:: ", state.apk_list, action);
		// 	if (action.payload.status) {
		// 		success({
		// 			title: action.payload.msg
		// 		});
		// 		let user = action.formData.user;
		// 		let index = state.apk_list.findIndex((item) => item.apk_id == action.formData.id);
		// 		let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
		// 		let oldDealers = (state.apk_list[index].permissions) ? state.apk_list[index].permissions : [];
		// 		// console.log('index is: ', index);

		// 		// Save permission for new dealers
		// 		if (action.formData.action == "save") {

		// 			if (index !== -1) {
		// 				newDealers = checkIsArray(newDealers).map((item) => {
		// 					return {
		// 						dealer_id: item,
		// 						dealer_type: user.type,
		// 						permission_by: user.id
		// 					}
		// 				});
		// 				if (!action.formData.statusAll) {
		// 					// let allDealers = findAndRemove_duplicate_in_array([...oldDealers, ...newDealers]);
		// 					let allDealers = removeDuplicateObjects([...oldDealers, ...newDealers], "dealer_id");
		// 					// console.log("allDealers ", allDealers);

		// 					state.apk_list[index].permission_count = allDealers.length;
		// 					state.apk_list[index].permissions = allDealers;
		// 					state.apk_list[index].statusAll = false;
		// 				} else {
		// 					state.apk_list[index].permission_count = "All";
		// 					state.apk_list[index].statusAll = true;
		// 					state.apk_list[index].permissions = newDealers;
		// 				}
		// 			}
		// 		}
		// 		else if (action.formData.action == "delete") {
		// 			// delete permission for dealers

		// 			if (index !== -1) {
		// 				if (!action.formData.statusAll) {
		// 					let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
		// 					state.apk_list[index].permissions = allDealers;
		// 					state.apk_list[index].permission_count = allDealers.length;
		// 				} else {
		// 					if (user && user.type !== "admin") {
		// 						state.apk_list[index].permissions = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin");
		// 					} else {
		// 						state.apk_list[index].permissions = [];
		// 					}
		// 					state.apk_list[index].statusAll = false;
		// 					state.apk_list[index].permission_count = 0;
		// 				}
		// 			}
		// 		}
		// 	} else {
		// 		error({
		// 			title: action.payload.msg
		// 		});
		// 	}

		// 	return {
		// 		...state,
		// 		isloading: false,
		// 		apk_list: [...state.apk_list]
		// 	}
		// }


		case PERMISSION_SAVED: {

			// console.log("at reducer PERMISSION_SAVED:: ", state.apk_list, action);
			if (action.payload.status) {
				success({
					title: action.payload.msg
				});
				let user = action.formData.user;
				let index = state.apk_list.findIndex((item) => item.apk_id == action.formData.id);
				let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
				let oldDealers = (state.apk_list[index].permissions) ? state.apk_list[index].permissions : [];
				// console.log('index is: ', index);

				// Save permission for new dealers
				if (action.formData.action == "save") {

					if (index !== -1) {
						newDealers = checkIsArray(newDealers).map((item) => {
							return {
								dealer_id: item,
								dealer_type: user.type,
								permission_by: user.id
							}
						});
						if (!action.formData.statusAll) {
							// let allDealers = findAndRemove_duplicate_in_array([...oldDealers, ...newDealers]);
							let allDealers = removeDuplicateObjects([...oldDealers, ...newDealers], "dealer_id");
							// console.log("allDealers ", allDealers);

							state.apk_list[index].permission_count = allDealers.length;
							state.apk_list[index].permissions = allDealers;
							state.apk_list[index].statusAll = false;
						} else {
							state.apk_list[index].permission_count = "All";
							state.apk_list[index].statusAll = true;
							// state.apk_list[index].permissions = newDealers;
							if (user.type !== "admin") {

								let finalDealers = [];
								let deleteIds = checkIsArray(oldDealers).map((dlr) => dlr.dealer_id);
								checkIsArray(newDealers).forEach((item) => {
									if (deleteIds.includes(item.dealer_id)) {
										let indexIs = oldDealers.findIndex((e) => e.dealer_id === item.dealer_id);
										finalDealers.push(oldDealers[indexIs]);
									} else {
										finalDealers.push(item);

									}
								})
								state.apk_list[index].permissions = finalDealers;
							} else {
								state.apk_list[index].permissions = newDealers;
							}
						}
					}
				}
				else if (action.formData.action == "delete") {
					// delete permission for dealers

					if (index !== -1) {
						if (!action.formData.statusAll) {
							let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
							// state.apk_list[index].permissions = allDealers;
							// state.apk_list[index].permission_count = allDealers.length;
							// if (user && user.type !== "admin") {
							// 	let filterDealers = checkIsArray(allDealers).filter((item) => item.dealer_type === "admin");
							// 	state.apk_list[index].permissions = filterDealers;
							// 	state.apk_list[index].permission_count = filterDealers.length;
							// } else {
							state.apk_list[index].permissions = allDealers;
							state.apk_list[index].permission_count = allDealers.length;
							// }
							state.apk_list[index].statusAll = false;
						} else {
							if (user && user.type !== "admin") {
								let filterDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type === "admin")
								state.apk_list[index].permissions = filterDealers;
								state.apk_list[index].permission_count = filterDealers.length;
							} else {
								state.apk_list[index].permissions = [];
								state.apk_list[index].permission_count = 0;
							}
							state.apk_list[index].statusAll = false;
						}
					}
				}
			} else {
				error({
					title: action.payload.msg
				});
			}

			return {
				...state,
				isloading: false,
				apk_list: [...state.apk_list]
			}
		}

		case GET_PAGINATION: {
			// console.log(GET_PAGINATION)
			// console.log(GET_DROPDOWN);
			// console.log({
			//     ...state,
			//     selectedOptions: action.payload
			// });
			return {
				...state,
				DisplayPages: action.payload
			}
		}
		case GET_DROPDOWN: {
			// console.log(GET_DROPDOWN)
			// console.log(GET_DROPDOWN);
			// console.log({
			//     ...state,
			//     selectedOptions: action.payload
			// });
			return {
				...state,
				selectedOptions: action.payload
			}
		}
		case RESET_UPLOAD_FORM: {
			return {
				...state,
				resetUploadForm: action.payload
			}
		}

		case POST_DROPDOWN: {
			return {
				...state
			}
		}
		case CHECK_APK_NAME: {
			// console.log(action);
			if (action.response.status) {
				// console.log("ssadas");
			}
			return {
				...state
			}
		}
		case RESET_AUTH_UPDATE: {
			return {
				...state,
				authenticateUpdateUser: false
			}
		}
		case AUTHENTICATE_UPDATE_USER: {
			let authenticate = false
			if (action.payload.status) {
				authenticate = true
			} else {
				error({
					title: action.payload.msg, // 'Invalid email or password. Please try again.',
				});;
			}
			return {
				...state,
				authenticateUpdateUser: authenticate

			}
		}
		case CHECK_BULK_PASS: {
			if (action.payload.PasswordMatch.password_matched) {

				return {
					...state,
					isBulkActivity: true
				}
			}
			else {
				error({
					title: action.payload.msg,
				});
				return {
					...state
				}
			}
		}
		case RESET_BULK_FLAG: {
			return {
				...state,
				isBulkActivity: false
			}
		}

		default:

			return state;

	}
}