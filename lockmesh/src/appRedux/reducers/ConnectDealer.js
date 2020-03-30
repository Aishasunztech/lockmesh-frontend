import { message, Modal, Alert, Icon } from 'antd';

import {
    DEALER_DETAILS,
    CONNECT_EDIT_DEALER,
    CONNECT_SUSPEND_DEALER,
    CONNECT_ACTIVATE_DEALER,
    CONNECT_DELETE_DEALER,
    CONNECT_UNDO_DEALER,
    DEALER_PAYMENT_HISTORY,
    SET_DEALER_LIMIT,
    DEALER_SALES_HISTORY,
    DEALER_DOMAINS,
    CONNECT_DEALER_LOADING,
    DEALER_ACCOUNT_STATUS,
    SET_DEMOS_LIMIT,
    CD_PERMISSION_DOMAINS,
    DEALER_DOMAINS_LOADING,
    ERROR_PERMISSION_DOMAINS
} from "../../constants/ActionTypes";
import { checkIsArray } from '../../routes/utils/commonUtils';

// import { Button_Cancel } from '../../constants/ButtonConstants';
// import { convertToLang } from '../../routes/utils/commonUtils';
// import { WIPE_DEVICE_DESCRIPTION } from '../../constants/DeviceConstants';

const success = Modal.success
const error = Modal.error

const initialState = {
    isLoading: false,
    messageText: '',
    messageType: '',
    showMessage: false,

    dealer: null,
    paymentHistory: [],
    salesHistory: [],
    domains: [],
    connectDealerLoading: false,
    dealerDomainLoading: false
};

export default (state = initialState, action) => {

    switch (action.type) {

        case CONNECT_DEALER_LOADING: {
            return {
                ...state,
                connectDealerLoading: true
            }
        }

        case DEALER_DETAILS: {
            // console.log(DEALER_DETAILS,':',action.payload)
            return {
                ...state,
                dealer: action.payload.dealer,
                connectDealerLoading: false
            }
        }

        case DEALER_DOMAINS: {
            console.log(DEALER_DOMAINS, ':', action.payload)
            return {
                ...state,
                domains: action.payload.domains
            }
        }

        case DEALER_SALES_HISTORY: {
            return {
                ...state,
                salesHistory: action.payload.data

            }
        }

        case DEALER_PAYMENT_HISTORY: {
            return {
                ...state,
                paymentHistory: action.payload.data
            }
        }

        case CONNECT_EDIT_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            // let dealer = state.dealer;
            if (action.response.status) {
                dealer.dealer_name = action.payload.formData.name;
                dealer.dealer_email = action.payload.formData.email;
                if (action.response.alreadyAvailable === false) {
                    success({
                        title: action.response.msg,
                    });
                } else {
                    error({
                        title: action.response.msg, // "Given email is already in use. Please choose different Email",
                    });
                }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            return {
                ...state,
                dealer: dealer

            };
        }

        case CONNECT_SUSPEND_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status === true) {
                dealer.account_status = 'suspended';
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                dealer: dealer
            }
        }

        case CONNECT_ACTIVATE_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status) {
                // let objIndex1 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex1].account_status = null;
                dealer.account_status = null;
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                dealer: dealer
            }
        }

        case CONNECT_DELETE_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));

            if (action.response.status) {
                // let objIndex2 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex2].unlink_status = 1;
                dealer.unlink_status = 1;
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }


            return {
                ...state,
                dealer: dealer
            }
        }

        case CONNECT_UNDO_DEALER: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.response.status) {
                // let objIndex3 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                // state.dealers[objIndex3].unlink_status = 0;
                dealer.unlink_status = 0
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                dealer: dealer
            }
        }

        case SET_DEALER_LIMIT: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            // let dealer = state.dealer;
            if (action.payload.status) {
                dealer.credits_limit = action.formData.credits_limit;
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                dealer: dealer
            };
        }

        case SET_DEMOS_LIMIT: {
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            // let dealer = state.dealer;
            if (action.payload.status) {
                dealer.demos = action.payload.data.demos;
                dealer.remaining_demos = action.payload.data.remaining_demos;
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                dealer: dealer
            };
        }

        case DEALER_ACCOUNT_STATUS: {
            // console.log(DEALER_ACCOUNT_STATUS, ':', action.payload);
            let dealer = JSON.parse(JSON.stringify(state.dealer));
            if (action.payload.status === true) {
                dealer.account_balance_status = action.payload.account_balance_status;
                dealer.account_balance_status_by = action.payload.account_balance_status_by;
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                dealer: dealer

            }
        }

        case DEALER_DOMAINS_LOADING: {
            return {
                ...state,
                dealerDomainLoading: true
            }
        }

        case ERROR_PERMISSION_DOMAINS: {
            // error({
            //     title: "Data not validated"
            // });
            return {
                ...state,
                isloading: false,
                dealerDomainLoading: false
            }
        }
        case CD_PERMISSION_DOMAINS: {
            // console.log("action.selectedDomains ", action, state.domains);
            let dealerDomains = state.domains;
            // let domainLoading = false;
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });

                // Save permission for new dealers
                if (action.formData.action == "save") {
                    let newPermittedDomains = action.selectedDomains.map(e => { e['permission_by'] = action.formData.user.name; return e; })
                    // console.log(action.formData.user.name, "newPermittedDomains  ", newPermittedDomains);
                    dealerDomains = state.domains.concat(newPermittedDomains)
                }
                else if (action.formData.action == "delete") {
                    dealerDomains = checkIsArray(state.domains).filter(item => item.id !== action.selectedDomains)
                }
            } else {
                error({
                    title: action.payload.msg
                });
            }

            return {
                ...state,
                isloading: false,
                domains: dealerDomains,
                dealerDomainLoading: false // domainLoading
            }
        }

        default:
            return state;

    }
}
