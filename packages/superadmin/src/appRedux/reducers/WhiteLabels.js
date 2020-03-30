import {
    GET_WHITE_LABEL_INFO,
    EDIT_WHITE_LABEL_INFO,
    WHITE_LABEL_BACKUPS,
    GET_FILE,
    SAVE_ID_PRICES,
    SAVE_PACKAGE,
    GET_PRICES,
    SET_PRICE,
    RESET_PRICE,
    GET_PACKAGES,
    GET_HARDWARES,
    GET_ALL_WHITE_LABELS,
    SAVE_BACKUP,
    START_BACKUP_LOADING,
    SAVE_HARDWARE,
    DELETE_PAKAGE,
    DELETE_HARDWARE,
    EDIT_HARDWARE,
    GET_DOMAINS,
    DELETE_DOMAINS,
    ADD_DOMAIN,
    EDIT_DOMAIN
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error


const initialState = {
    whiteLabel: {},
    whitelabelBackups: [],
    whiteLabels: [],
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
    hardwares: [],
    packagesCopy: [],
    backupLoading: false,
    domains: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case GET_ALL_WHITE_LABELS: {
            return {
                ...state,
                whiteLabels: action.payload
            }
        }
        case GET_WHITE_LABEL_INFO: {
            // 
            return {
                ...state,
                whiteLabel: action.payload
            }
        }

        case GET_FILE: {
            if (action.payload.status && !action.payload.status) {
                Modal.error({
                    title: action.payload.msg
                })
            }
            return {
                ...state,
            }
        }

        case WHITE_LABEL_BACKUPS: {
            // 
            return {
                ...state,
                whitelabelBackups: action.payload.data
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

        case GET_HARDWARES: {
            return {
                ...state,
                hardwares: action.response.data,
            }
        }

        case DELETE_PAKAGE: {
            // console.log(state.packages, 'DELETE_PAKAGE reducer', action.response);
            let copyPkgs = state.packages;
            if (action.payload.status) {
                Modal.success({ title: action.payload.msg })
                copyPkgs = state.packages.filter((pkg) => pkg.id !== action.response)
            }
            else {
                Modal.error({ title: action.payload.msg })
            }

            return {
                ...state,
                packages: copyPkgs,
            }
        }


        case DELETE_HARDWARE: {
            // console.log(state.hardwares, 'DELETE_HARDWARE reducer', action.response);
            let copyHdw = state.hardwares;
            if (action.payload.status) {
                Modal.success({ title: action.payload.msg })
                copyHdw = state.hardwares.filter((hd) => hd.id !== action.response)
            }
            else {
                Modal.error({ title: action.payload.msg })
            }

            return {
                ...state,
                hardwares: copyHdw,
            }
        }

        case EDIT_HARDWARE: {
            console.log(state.hardwares, 'EDIT_HARDWARE reducer', action.response);
            let copyHdw = state.hardwares;

            if (action.payload.status) {
                let updateData = action.response;
                Modal.success({ title: action.payload.msg })

                let index = copyHdw.findIndex((hd) => hd.id === updateData.id);
                copyHdw[index] = updateData;
                copyHdw[index].name = updateData.new_name;
                copyHdw[index].price = updateData.new_price;
                console.log("copyHdw ", copyHdw)
            }
            else {
                Modal.error({ title: action.payload.msg })
            }
            return {
                ...state,
                hardwares: [...copyHdw],
            }
        }

        case SET_PRICE: {
            let copyPrices = state.prices;
            let price_for = action.payload.price_for;
            let field = action.payload.field;
            let value = action.payload.value;

            // 
            value = +value;
            if (price_for && price_for !== '') {
                copyPrices[price_for][field] = value.toString();
            }
            return {
                ...state,
                prices: copyPrices,
                isPriceChanged: true
            }

        }

        case SAVE_ID_PRICES: {
            // 
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                state.pricesCopy = JSON.parse(JSON.stringify(state.prices))
            } else {
                error({
                    title: action.response.msg
                })
                state.prices = JSON.parse(JSON.stringify(state.pricesCopy))
            }
            return {
                ...state,
                isPriceChanged: false
            }
        }

        case RESET_PRICE: {
            // 
            return {
                ...state,
                prices: JSON.parse(JSON.stringify(state.pricesCopy)),
                isPriceChanged: false
            }
        }

        case SAVE_PACKAGE: {

            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                if (action.response.data.length) {
                    state.packages.push(action.response.data[0])
                }
            } else {
                error({
                    title: action.response.msg
                })
            }
            return {
                ...state,
                packages: [...state.packages]
            }
        }

        case SAVE_HARDWARE: {

            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                if (action.response.data.length) {
                    state.hardwares.push(action.response.data[0])
                }
            } else {
                error({
                    title: action.response.msg
                })
            }
            return {
                ...state,
                hardwares: [...state.hardwares]
            }
        }


        case EDIT_WHITE_LABEL_INFO: {
            if (action.payload.status) {
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
            }
        }


        case SAVE_BACKUP: {
            let backups = state.whitelabelBackups
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                backups.push(action.response.data)
            } else {
                error({
                    title: action.response.msg,
                });
            }
            return {
                ...state,
                whitelabelBackups: [...backups],
                backupLoading: false

            }
        }
        case START_BACKUP_LOADING: {
            return {
                ...state,
                backupLoading: true
            }
        }

        case GET_DOMAINS: {
            return {
                ...state,
                domains: action.response.data
            }
        }

        case ADD_DOMAIN: {
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                state.domains.push(action.response.data)
                return {
                    ...state,
                    domains: [...state.domains]
                }
            } else {

                error({
                    title: action.response.msg
                })

                return {
                    ...state,
                }
            }
        }

        case EDIT_DOMAIN: {
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                let index = state.domains.findIndex(item => item.id === action.data.id)
                if (index != -1) {
                    state.domains[index].domain_name = action.data.domain_name
                }
                return {
                    ...state,
                    domains: [...state.domains]
                }
            } else {
                error({
                    title: action.response.msg
                })

                return {
                    ...state,
                }
            }
        }

        case DELETE_DOMAINS: {
            if (action.response.status) {
                success({
                    title: action.response.msg
                })
                let domains = state.domains.filter((item) => item.id !== action.id)
                return {
                    ...state,
                    domains: domains
                }
            } else {

                error({
                    title: action.response.msg
                })

                return {
                    ...state,
                }
            }
        }



        default:
            return state;

    }
}