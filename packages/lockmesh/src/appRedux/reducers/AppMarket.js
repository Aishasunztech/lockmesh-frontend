import {
    TRANSFER_APPS,
    GET_MARKET_APPS,
    LOADING,
    UNINSTALL_PERMISSION_CHANGED
} from "constants/ActionTypes";
import { message, Modal } from 'antd';
import { REMOVE_APPS } from "../../constants/ActionTypes";

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

        case REMOVE_APPS: {
            let smApps = state.secureMarketList;
            let availableApps = state.availbleAppList;

            if (action.payload.status) {
                message.success(action.payload.msg);

                console.log('at REMOVE_APPS reducer:: ', action)
                // console.log(state.secureMarketList)

                smApps = action.payload.data.marketApplist;
                availableApps = action.payload.data.availableApps;

                // if (action.response === "all") {
                //     smApps = state.secureMarketList.filter((app) => app.space_type !== action.space)
                // } else {
                //     smApps = state.secureMarketList.filter((app) => app.id !== action.response[0] && app.space_type === action.space)
                // }
                // console.log(smApps)
            } else {
                message.error(action.payload.msg)
            }
            return {
                ...state,
                secureMarketList: smApps,
                availbleAppList: availableApps
            }
        }
        case TRANSFER_APPS: {
            if (action.status) {
                message.success(action.msg)
                // success({
                //     title: "Apps Transferred Successfully",
                // });
                return {
                    ...state,
                    secureMarketList: action.payload.marketApplist,
                    availbleAppList: action.payload.availableApps,
                    isloading: false

                }
            } else {
                message.error(action.msg);
                return { ...state }
            }
        }
        case GET_MARKET_APPS:
            return {
                ...state,
                isloading: false,
                secureMarketList: action.payload.marketApplist,
                availbleAppList: action.payload.availableApps
            }
        case UNINSTALL_PERMISSION_CHANGED:
            // console.log(state.secureMarketList, 'UNINSTALL_PERMISSION_CHANGED ', action.payload)

            if (action.status) {

                let index = state.secureMarketList.findIndex((app) => app.id === action.payload.apk_id && app.space_type === action.payload.space)
                if (index !== -1) {
                    state.secureMarketList[index].is_restrict_uninstall = action.payload.value;
                }
                // console.log("action.payload.value ", action.payload.value)

                if (action.payload.value) {
                    message.success("Unintall permission granted");
                } else {
                    message.success("Uninstall permission denied");
                }
                // message.success(action.msg)

            } else {
                message.error(action.msg)
            }

            return {
                ...state,
                secureMarketList: [...state.secureMarketList]
            }

        default:
            return state;

    }
}