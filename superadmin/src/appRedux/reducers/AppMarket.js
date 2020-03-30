import {
    TRANSFER_APPS,
    GET_MARKET_APPS,
    LOADING,
    UNINSTALL_PERMISSION_CHANGED
} from "constants/ActionTypes";
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error
const initialState = {
    isloading: false,
    apk_list: [],
    secureMarketList: [],
    availbleAppList: []
};

export default (state = initialState, action) => {

    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isloading: true,
            }
        case TRANSFER_APPS:
            if (action.status) {
                message.success("Apps Transferred Successfully")
                // success({
                //     title: "Apps Transferred Successfully",
                // });
            }
            return {
                ...state,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps,
                isloading: false

            }
        case GET_MARKET_APPS:
            return {
                ...state,
                isloading: false,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps
            }
        case UNINSTALL_PERMISSION_CHANGED:
            if (action.status) {
                message.success(action.msg)
            } else {
                message.error(action.msg)
            }

            return {
                ...state,
            }

        default:
            return state;

    }
}