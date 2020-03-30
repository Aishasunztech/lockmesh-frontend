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
	PERMSSION_SAVED,
	DEALERS_LIST,
	RESET_UPLOAD_FORM,
	// ADD_APK
} from "../../constants/ActionTypes";

import {
	APK_SHOW_ON_DEVICE,
	APK,
	APK_APP_NAME,
	APK_APP_LOGO,
	APK_PERMISSION
} from '../../constants/ApkConstants';
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
	isloading: false,
	apk_list: [],
	selectedOptions: [],
	DisplayPages: '10',
	options: [
		APK_PERMISSION,
		APK_SHOW_ON_DEVICE,
		APK,
		APK_APP_NAME,
		APK_APP_LOGO,
	]
};

export default (state = initialState, action) => {

	switch (action.type) {

		case LOADING:
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


		case UNLINK_APK:

			// console.log(UNLINK_APK);
			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				state.apk_list = state.apk_list.filter(apk => apk.apk_id !== action.payload);

			}
			return {
				...state,
				isloading: false,
				apk_list: state.apk_list,
				options: state.options
			}

		case ADD_APK:
			// console.log(ADD_APK);

			if (action.response.status) {
				success({
					title: action.response.msg,
				});
				state.apk_list.push(action.payload)
			}
			else {
				error({
					title: action.response.msg,
				});
			}
			return {
				...state,
				apk_list: [...state.apk_list],
			}

		case EDIT_APK:
			// console.log('action edit id');
			// console.log(action.payload);
			// console.log(EDIT_APK);			
			if (action.response.status) {
				let objIndex1 = state.apk_list.findIndex((obj => obj.apk_id === action.payload.apk_id));
				if (objIndex1 !== undefined) {
					state.apk_list[objIndex1].apk_name = action.payload.name
					state.apk_list[objIndex1].apk = action.payload.apk
					state.apk_list[objIndex1].logo = action.payload.logo
				}
				success({
					title: action.response.msg,
				});;
			}
			else {
				error({
					title: action.response.msg,
				});;
			}


			return {
				...state,
				isloading: false,
				apk_list: [...state.apk_list],
				options: state.options
			}

		case APK_STATUS_CHANGED: {
			// console.log(APK_STATUS_CHANGED)
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.payload));
			// console.log('index of item',objIndex);
			message.success('Status Changed Successfully')
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
		case PERMSSION_SAVED: {
			success({
				title: action.payload
			});;
			let dealers = JSON.parse(action.dealers)
			// console.log(dealers.length ,'itrititt',action.apk_id);
			let objIndex = state.apk_list.findIndex((obj => obj.apk_id === action.apk_id));
			state.apk_list[objIndex].permission_count = action.permission_count;

			return {
				...state,
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

		default:

			return state;

	}
}