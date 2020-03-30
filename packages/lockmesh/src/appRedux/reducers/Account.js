import {
    IMPORT_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    RELEASE_CSV,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED,
    CREATE_BACKUP_DB,
    SHOW_BACKUP_MODAL,
    CHECK_BACKUP_PASS,
    SAVE_ID_PRICES,
    SAVE_PACKAGE,
    GET_PRICES,
    SET_PRICE,
    RESET_PRICE,
    GET_PACKAGES,
    PURCHASE_CREDITS,
    GET_OVERDUE_DETAILS,
    PACKAGE_PERMISSION_SAVED,
    DELETE_PACKAGE,
    EDIT_PACKAGE,
    LATEST_PAYMENT_HISTORY,
    RESYNC_IDS,
    GET_HARDWARE,
    MODIFY_ITEM_PRICE,
    SALES_REPORT,
    GET_DOMAINS,
    PERMISSION_DOMAINS,
} from "../../constants/ActionTypes";
import { message, Modal } from "antd";
import { findAndRemove_duplicate_in_array, removeDuplicateObjects, checkIsArray } from "../../routes/utils/commonUtils";

const success = Modal.success
const error = Modal.error

const initialState = {
    msg: "",
    showMsg: false,
    used_pgp_emails: [],
    used_sim_ids: [],
    used_chat_ids: [],
    duplicate_ids: [],
    duplicate_modal_show: false,
    duplicate_data_type: '',
    newData: [],
    backUpModal: false,
    prices: {
        sim_id: {},
        chat_id: {},
        pgp_email: {},
        vpn: {}
    },
    isPriceChanged: false,
    pricesCopy: {
        sim_id: {},
        chat_id: {},
        pgp_email: {},
        vpn: {}
    },
    packages: [],
    paymentHistory: [],
    overdueDetails: {},
    packagesCopy: [],
    hardwares: [],
    domainList: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SAVE_ID_PRICES: {
            // 
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
            } else {
                error({
                    title: action.response.msg
                })
            }
            return {
                ...state,
                isPriceChanged: false
            }
        }
        case SAVE_PACKAGE: {
            let dump = JSON.parse(JSON.stringify(state.packages));
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                if (action.response.data.length) {
                    // dump = JSON.parse(JSON.stringify(state.packages));
                    action.response.data[0]["permission_count"] = 0;
                    dump.push(action.response.data[0])
                }
            } else {
                error({
                    title: action.response.msg
                })
            }
            // 
            return {
                ...state,
                packages: dump
            }
        }

        case EDIT_PACKAGE: {
            let dump = JSON.parse(JSON.stringify(state.packages));;

            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                let objIndex = dump.findIndex((obj => obj.id === action.package_id));

                if (objIndex > -1) {

                    dump[objIndex] = action.response.data
                }

            } else {
                error({
                    title: action.response.msg
                })
            }
            // 
            return {
                ...state,
                packages: dump
            }
        }

        case GET_PRICES: {
            // 

            return {
                ...state,
                prices: action.response.data,
                pricesCopy: JSON.parse(JSON.stringify(action.response.data))

            }
        }

        case GET_PACKAGES: {
            // 

            return {
                ...state,
                packages: action.response.data,
                packagesCopy: JSON.parse(JSON.stringify(action.response.data))

            }
        }

        case GET_HARDWARE: {
            // 

            return {
                ...state,
                hardwares: action.response.data,

            }
        }

        case RESET_PRICE: {
            return {
                ...state,
                prices: state.pricesCopy,
                isPriceChanged: false
            }
        }
        case RESYNC_IDS: {
            success({
                title: "ID's data Refreshed successfully",
            });
            return {
                ...state
            }
        }

        case SET_PRICE: {
            let copyPrices = JSON.parse(JSON.stringify(state.prices));
            let price_for = action.payload.price_for;
            let field = action.payload.field;
            let value = action.payload.value;

            value = +value;
            if (price_for && price_for !== '') {
                copyPrices[price_for][field] = value.toString();
            }
            // 
            return {
                ...state,
                prices: copyPrices,
                isPriceChanged: true
            }
        }

        case LATEST_PAYMENT_HISTORY:
            return {
                ...state,
                paymentHistory: action.payload
            };

        case GET_OVERDUE_DETAILS:
            return {
                ...state,
                overdueDetails: action.payload
            };

        case IMPORT_CSV:
            return {
                ...state,
                msg: action.payload.msg,
                showMsg: action.showMsg,
            }
        case GET_USED_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                used_pgp_emails: action.payload
            }
        }
        case GET_USED_CHAT_IDS: {
            // alert("hello");
            return {
                ...state,
                used_chat_ids: action.payload
            }
        }
        case GET_USED_SIM_IDS: {
            // alert("hello");
            return {
                ...state,
                used_sim_ids: action.payload
            }
        }

        case NEW_DATA_INSERTED: {

            if (action.payload.status && action.showMsg) {
                success({
                    title: action.payload.msg,
                });
            } else if (action.payload.status === false && action.showMsg) {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                duplicate_ids: [],
                duplicate_data_type: '',
                duplicate_modal_show: false,
                newData: []

            }
        }

        case DUPLICATE_SIM_IDS: {
            return {
                ...state,
                duplicate_ids: action.payload.duplicateData,
                duplicate_data_type: action.payload.type,
                duplicate_modal_show: true,
                newData: action.payload.newData
            }
        }
        case CREATE_BACKUP_DB: {
            return {
                ...state,

            }
        }

        case RELEASE_CSV: {
            // alert("hello");
            // 
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            }
            else {
                error({
                    title: action.payload.msg,
                });

            }
            if (action.payload.type === 'sim') {
                return {
                    ...state,
                    used_sim_ids: action.payload.data
                }
            } else if (action.payload.type === 'chat') {
                return {
                    ...state,
                    used_chat_ids: action.payload.data
                }
            } else if (action.payload.type === 'pgp') {
                return {
                    ...state,
                    used_pgp_emails: action.payload.data
                }
            } else {
                return {
                    ...state,
                }
            }
        }
        case CHECK_BACKUP_PASS:
            if (action.payload.PasswordMatch.password_matched) {
                // success({
                //     title: action.payload.msg,
                // });
                return {
                    ...state,
                    backUpModal: true,
                }
            }
            else {
                error({
                    title: action.payload.msg,
                });
                return {
                    ...state,
                    backUpModal: false
                }
            }
        case SHOW_BACKUP_MODAL:
            // 

            return {
                ...state,
                backUpModal: action.payload,
            }



        case PURCHASE_CREDITS:
            // 
            if (action.response.status) {

                success({
                    title: action.response.msg,
                });
            }
            else {
                error({
                    title: action.response.msg,
                });

            }
            return {
                ...state,
            }

        // case PACKAGE_PERMSSION_SAVED: {
        //     // 
        //     success({
        //         title: action.payload
        //     });

        //     let objIndex = state.packages.findIndex((obj => obj.id === action.package_id));
        //     state.packages[objIndex].permission_count = action.permission_count;

        //     return {
        //         ...state,
        //         packages: [...state.packages]
        //     }
        // }

        // case PACKAGE_PERMSSION_SAVED: {

        //     // 
        //     if (action.payload.status) {
        //         success({
        //             title: action.payload.msg
        //         });
        //         let user = action.formData.user;
        //         let index = state.packages.findIndex((item) => item.id == action.formData.id);
        //         let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
        //         let oldDealers = (state.packages[index].dealer_permission) ? state.packages[index].dealer_permission : [];
        //         // 

        //         // Save permission for new dealers
        //         if (action.formData.action == "save") {

        //             if (index !== -1) {
        //                 newDealers = checkIsArray(newDealers).map((item) => {
        //                     return {
        //                         dealer_id: item,
        //                         dealer_type: user.type,
        //                         permission_by: user.id
        //                     }
        //                 });
        //                 if (!action.formData.statusAll) {
        //                     // let allDealers = findAndRemove_duplicate_in_array([...oldDealers, ...newDealers]);
        //                     let allDealers = removeDuplicateObjects([...oldDealers, ...newDealers], "dealer_id");
        //                     // 

        //                     state.packages[index].permission_count = allDealers.length;
        //                     state.packages[index].dealer_permission = allDealers;
        //                     state.packages[index].statusAll = false;
        //                 } else {
        //                     state.packages[index].permission_count = "All";
        //                     state.packages[index].statusAll = true;
        //                     state.packages[index].dealer_permission = newDealers;
        //                 }
        //             }
        //         }
        //         else if (action.formData.action == "delete") {
        //             // delete permission for dealers

        //             if (index !== -1) {
        //                 if (!action.formData.statusAll) {
        //                     let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
        //                     state.packages[index].dealer_permission = allDealers;
        //                     state.packages[index].permission_count = allDealers.length;
        //                 } else {
        //                     if (user && user.type === "dealer") {
        //                         state.packages[index].dealer_permission = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin")
        //                     }
        //                     else if (user && user.type === "sdealer") {
        //                         state.packages[index].dealer_permission = checkIsArray(oldDealers).filter((item) => item.dealer_type == "dealer")
        //                     }
        //                     else {
        //                         state.packages[index].dealer_permission = [];
        //                     }
        //                     state.packages[index].statusAll = false;
        //                     state.packages[index].permission_count = 0;
        //                 }
        //             }
        //         }
        //     } else {
        //         error({
        //             title: action.payload.msg
        //         });
        //     }

        //     return {
        //         ...state,
        //         isloading: false,
        //         packages: [...state.packages]
        //     }
        // }

        case PACKAGE_PERMISSION_SAVED: {

            // 
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });
                let user = action.formData.user;
                let index = state.packages.findIndex((item) => item.id == action.formData.id);
                let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
                let oldDealers = (state.packages[index].dealer_permission) ? state.packages[index].dealer_permission : [];
                // 

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
                            // 

                            state.packages[index].permission_count = allDealers.length;
                            state.packages[index].dealer_permission = allDealers;
                            state.packages[index].statusAll = false;
                        } else {
                            state.packages[index].permission_count = "All";
                            state.packages[index].statusAll = true;
                            // state.packages[index].dealer_permission = newDealers;
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
                                state.packages[index].dealer_permission = finalDealers;
                            } else {
                                state.packages[index].dealer_permission = newDealers;
                            }
                        }
                    }
                }
                else if (action.formData.action == "delete") {
                    // delete permission for dealers

                    if (index !== -1) {
                        if (!action.formData.statusAll) {
                            let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
                            // state.packages[index].dealer_permission = allDealers;
                            // state.packages[index].permission_count = allDealers.length;
                            // if (user && user.type !== "admin") {
                            //     let filterDealers = checkIsArray(allDealers).filter((item) => item.dealer_type === "admin");
                            //     state.packages[index].dealer_permission = filterDealers;
                            //     state.packages[index].permission_count = filterDealers.length;
                            // } else {
                            state.packages[index].dealer_permission = allDealers;
                            state.packages[index].permission_count = allDealers.length;
                            // }
                            state.packages[index].statusAll = false;
                        } else {
                            let allDealers = [];
                            if (user && user.type === "dealer") {
                                allDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin");
                                state.packages[index].dealer_permission = allDealers;
                                state.packages[index].permission_count = allDealers.length;
                            }
                            else if (user && user.type === "sdealer") {
                                allDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type == "dealer");
                                state.packages[index].dealer_permission = allDealers;
                                state.packages[index].permission_count = allDealers.length;
                            }
                            else {
                                state.packages[index].dealer_permission = [];
                                state.packages[index].permission_count = 0;
                            }
                            state.packages[index].statusAll = false;
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
                packages: [...state.packages]
            }
        }


        case DELETE_PACKAGE: {
            let packages = state.packages
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });
                let objIndex = packages.findIndex((obj => obj.id === action.package_id));
                // 
                if (objIndex > -1) {
                    packages.splice(objIndex, 1)
                }
            } else {
                error({
                    title: action.payload.msg
                });
            }

            return {
                ...state,
                packages: [...packages]
            }
        }
        case MODIFY_ITEM_PRICE: {
            // 
            if (action.item_type === 'package') {
                let packages = state.packages
                if (action.payload.status) {
                    success({
                        title: action.payload.msg
                    });
                    let objIndex = packages.findIndex((obj => obj.id === action.item_id));
                    if (objIndex > -1) {
                        state.packages[objIndex].pkg_price = action.price;
                    }
                } else {
                    error({
                        title: action.payload.msg
                    });
                }

                return {
                    ...state,
                    packages: [...state.packages]
                }
            } else if (action.item_type === "hardware") {
                let hardwares = state.hardwares
                if (action.payload.status) {
                    success({
                        title: action.payload.msg
                    });
                    let objIndex = hardwares.findIndex((obj => obj.id === action.item_id));
                    if (objIndex > -1) {
                        state.hardwares[objIndex].hardware_price = action.price;
                    }
                } else {
                    error({
                        title: action.payload.msg
                    });
                }

                return {
                    ...state,
                    hardwares: [...state.hardwares]
                }
            }
        }

        case GET_DOMAINS: {
            // 
            return {
                ...state,
                isloading: false,
                domainList: action.payload.domains
            }
        }

        case PERMISSION_DOMAINS: {

            // 
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });
                let user = action.formData.user;
                let index = state.domainList.findIndex((item) => item.id == action.formData.id);
                let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
                let oldDealers = (JSON.parse(state.domainList[index].dealers)) ? JSON.parse(state.domainList[index].dealers) : [];
                // 
                // 
                // 

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
                            // 

                            state.domainList[index].permission_count = allDealers.length;
                            state.domainList[index].dealers = JSON.stringify(allDealers);
                            state.domainList[index].statusAll = false;
                        } else {
                            state.domainList[index].permission_count = "All";
                            state.domainList[index].statusAll = true;
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
                                state.domainList[index].dealers = JSON.stringify(finalDealers);
                            } else {
                                state.domainList[index].dealers = JSON.stringify(newDealers);
                            }
                        }
                    }
                }
                else if (action.formData.action == "delete") {
                    // delete permission for dealers

                    if (index !== -1) {
                        if (!action.formData.statusAll) {
                            let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
                            // if (user && user.type !== "admin") {
                            //     let filterDealers = checkIsArray(allDealers).filter((item) => item.dealer_type === "admin");
                            //     state.domainList[index].dealers = JSON.stringify(filterDealers);
                            //     state.domainList[index].permission_count = filterDealers.length;
                            // } else {
                            state.domainList[index].dealers = JSON.stringify(allDealers);
                            state.domainList[index].permission_count = allDealers.length;
                            // }
                            state.domainList[index].statusAll = false;
                        } else {
                            if (user && user.type !== "admin") {
                                let filterDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type === "admin")
                                state.domainList[index].dealers = JSON.stringify(filterDealers)  //'[]';
                                state.domainList[index].permission_count = filterDealers.length;
                            } else {
                                state.domainList[index].dealers = '[]';
                                state.domainList[index].permission_count = 0;
                            }
                            state.domainList[index].statusAll = false;
                        }
                    }
                }
            } else {
                error({
                    title: action.payload.msg
                });
            }

            // 
            return {
                ...state,
                isloading: false,
                domainList: [...state.domainList]
            }
        }

        default:
            return state;
    }
}
