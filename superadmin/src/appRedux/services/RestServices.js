import axios from 'axios';
import { BASE_URL, USER_URL } from '../../constants/Application';
import io from "socket.io-client";

const RestService = {
    //============================================= Auth =================================================
    connectSocket: (token) => {
        let makeToken = "token=" + token + "&isWeb=true";
        let socket = io.connect(BASE_URL, {
            query: makeToken,
            // reconnectionDelay:1000,
            // reconnection:true,
            // forceNew:true
        });
        return socket;
    },
    login: (user) => {
        return axios.post(BASE_URL + 'auth/login', user);
    },
    verifyCode: (verifyForm) => {
        return axios.post(BASE_URL + 'users/verify_code', {
            verify_code: verifyForm.verify_code
        });
    },
    getHeader: () => {
        return {
            headers: {
                authorization: localStorage.getItem('token') //the token is a variable which holds the token
            }
        };
    },

    // for logout
    authLogOut: () => {
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('type');
        localStorage.removeItem('name');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('token');
        localStorage.removeItem('dealer_pin');
        // this.router.navigate(['/login']);
    },

    authLogIn: (data) => {
        //
        localStorage.setItem('id', data.id);
        localStorage.setItem('email', data.email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('firstName', data.first_name);
        localStorage.setItem('lastName', data.last_name);
        // localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('two_factor_auth', data.two_factor_auth);

    },
    setUserData: (data) => {

        //
        localStorage.setItem('email', data.email);
        localStorage.setItem('id', data.id);
        localStorage.setItem('name', data.name);

        localStorage.setItem('firstName', data.first_name);
        localStorage.setItem('lastName', data.last_name);

        // localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('two_factor_auth', data.two_factor_auth);


    },

    // checkAuth
    checkAuth: (response) => {
        if (response.success !== undefined && response.success === false) {
            return false;
        } else {
            return true;
        }

    },

    saveNewData: (data) => {
        return axios.post(BASE_URL + "users/save_new_data", data, RestService.getHeader());
    },

    getFile: (filename) => {
        window.location = BASE_URL + 'users/getFile/' + filename;
    },

    twoFactorAuth: (isEnable) => {
        return axios.post(BASE_URL + 'users/two_factor_auth', { isEnable: isEnable }, RestService.getHeader())
    },
    // Component Allowed
    checkComponent: (ComponentUri) => {
        return axios.post(BASE_URL + 'users/check_component', { ComponentUri: ComponentUri }, RestService.getHeader());

    },
    checkApkName: (name, apk_id = '') => {
        return axios.post(BASE_URL + 'users/checkApkName', { name, apk_id }, RestService.getHeader());
    },
    //
    getAllowedComponents: () => {

    },

    // isAdmin
    isAdmin: () => {

        return axios.get(BASE_URL + 'users/check_admin', RestService.getHeader());
    },

    // getuserType
    getUserType: () => {

    },

    // checkUserType
    checkUserType: () => {

    },

    // getMenu
    getMenu: () => {

    },

    // =========================================Sidebar Menus =====================================
    getAllWhiteLabels: () => {
        return axios.get(USER_URL + 'white-labels/all', RestService.getHeader());
    },
    getWhiteLabels: () => {
        return axios.get(USER_URL + 'white-labels/whitelabels', RestService.getHeader());
    },
    getWhiteLabelInfo: (id) => {
        return axios.get(USER_URL + 'get-white-labels/' + id, RestService.getHeader());
    },
    restartWhiteLabel: (wlID) => {
        return axios.post(USER_URL + 'restart-whitelabel', { wlID }, RestService.getHeader());
    },

    whitelabelBackups: (id) => {
        return axios.get(USER_URL + 'whitelabel_backups/' + id, RestService.getHeader());
    },

    editWhiteLabelInfo: (data) => {
        return axios.put(USER_URL + 'update-white-label', data, RestService.getHeader());
    },

    saveIDPrices: (data) => {

        return axios.patch(USER_URL + 'save-prices', data, RestService.getHeader());
    },

    getPrices: (whitelabel_id) => {
        //
        return axios.get(USER_URL + 'get-prices/' + whitelabel_id, RestService.getHeader());
    },

    getPackages: (whitelabel_id) => {
        //
        return axios.get(USER_URL + 'get-packages/' + whitelabel_id, RestService.getHeader());
    },

    getHardwares: (whitelabel_id) => {
        //
        return axios.get(USER_URL + 'get-Hardwares/' + whitelabel_id, RestService.getHeader());
    },

    getDomains: (whitelabel_id) => {
        //
        return axios.get(USER_URL + 'get-domains/' + whitelabel_id, RestService.getHeader());
    },

    addDomain: (data) => {
        return axios.post(USER_URL + 'add-domain', data, RestService.getHeader());
    },

    editDomain: (data) => {
        return axios.put(USER_URL + 'edit-domain', data, RestService.getHeader());
    },

    deleteDomains: (domain_id, wl_id) => {
        return axios.delete(USER_URL + 'delete-domains/' + domain_id + '/' + wl_id, RestService.getHeader());
    },

    deletePakage: (id) => {
        return axios.get(USER_URL + 'delete-package/' + id, RestService.getHeader());
    },

    setPackage: (data) => {

        return axios.patch(USER_URL + 'save-package', { data }, RestService.getHeader());
    },
    saveHardware: (data) => {
        return axios.patch(USER_URL + 'save-hardware', { data }, RestService.getHeader());
    },
    deleteHardware: (id) => {
        return axios.get(USER_URL + 'delete-hardware/' + id, RestService.getHeader());
    },

    editHardware: (data) => {
        return axios.post(USER_URL + 'edit-hardware', { data }, RestService.getHeader());
    },

    checkPackageName: (name) => {

        return axios.patch(USER_URL + 'check-package-name', { name, name }, RestService.getHeader());
    },

    checkHardwareName: (name) => {

        return axios.patch(USER_URL + 'check-hardware-name', { name, name }, RestService.getHeader());
    },


    // ======================================== Account ===========================================
    getSimIDs: () => {
        return axios.get(BASE_URL + 'users/get_sim_ids', RestService.getHeader());
    },

    getChatIDs: () => {
        //
        return axios.get(BASE_URL + 'users/get_chat_ids', RestService.getHeader());
    },
    getPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_pgp_emails', RestService.getHeader());
    },

    // get ids with label
    getSimIDsLabel: (labelID) => {
        //
        return axios.post(BASE_URL + 'users/get_label_sim_ids', { labelID }, RestService.getHeader());
    },
    getChatIDsLabel: (labelID) => {
        //
        return axios.post(BASE_URL + 'users/get_label_chat_ids', { labelID }, RestService.getHeader());
    },
    getPGPEmailsLabel: (labelID) => {
        return axios.post(BASE_URL + 'users/get_label_pgp_emails', { labelID }, RestService.getHeader());
    },
    // get used id
    getUsedPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_used_pgp_emails', RestService.getHeader());
    },
    getUsedSimIds: () => {
        return axios.get(BASE_URL + 'users/get_used_sim_ids', RestService.getHeader());
    },
    getUsedChatIds: () => {
        return axios.get(BASE_URL + 'users/get_used_chat_ids', RestService.getHeader());
    },

    importCSV: (formData, fieldName) => {
        return axios.post(BASE_URL + 'users/import/' + fieldName, formData, RestService.getHeader());
    },
    exportCSV: (fieldName) => {
        return axios.get(BASE_URL + 'users/export/' + fieldName, RestService.getHeader());
    },
    releaseCSV: (fieldName, ids) => {
        return axios.post(BASE_URL + 'users/releaseCSV/' + fieldName, { ids }, RestService.getHeader());
    },
    // Dealer and sdealers items apis
    getSelectedItems(pageName) {
        //
        return axios.get(BASE_URL + 'users/dealer/gtdropdown/' + pageName, RestService.getHeader());
    },

    postSelectedItems: (selectedItems, pageName) => {

        const items = JSON.stringify(selectedItems);
        return axios.post(BASE_URL + 'users/dealer/dropdown', { selected_items: items, pageName: pageName }, RestService.getHeader());

    },
    ApkList: () => {
        return axios.get(BASE_URL + 'users/apklist', RestService.getHeader());
    },
    addAPK: (formData) => {
        return axios.post(BASE_URL + 'users/addApk', formData, RestService.getHeader());
    },
    unlinkAPK: (apk_id) => {
        return axios.post(BASE_URL + 'users/apk/delete', { apk_id: apk_id }, RestService.getHeader());
    },
    // For Apk edit(admin dashboard)
    updateApkDetails: (formData) => {
        return axios.post(BASE_URL + 'users/edit/apk', formData, RestService.getHeader());

    },

    // OFFLINE DEVICES SECTION
    getOfflineDevices: () => {
        return axios.get(USER_URL + 'offline-devices', RestService.getHeader());
    },
    saveOfflineDevice: (data) => {
        return axios.put(USER_URL + 'save-offline-device', data, RestService.getHeader());
    },
    // suspendDevice: (data) => {
    //     return axios.put(USER_URL + 'device-status', { id: data }, RestService.getHeader());
    // },
    statusDevice: (data, requireStatus) => {
        //
        return axios.put(USER_URL + 'device-status', { data, requireStatus }, RestService.getHeader());
    },
    getNewCashRequests: () => {
        return axios.get(USER_URL + 'newRequests',
            RestService.getHeader()
        )
    },
    rejectRequest: (request) => {
        //
        return axios.put(USER_URL + 'delete_request/' + request.id, request, RestService.getHeader());
    },
    acceptRequest: (request, pass, dealer_pin) => {
        //
        return axios.put(USER_URL + 'accept_request/' + request.id, { request, pass, dealer_pin }, RestService.getHeader());
    },
    checkPass: (user) => {
        return axios.post(USER_URL + 'check-pwd', user, RestService.getHeader());
    },
    checkDealerPin: (data) => {
        return axios.post(USER_URL + 'check-dealer_pin', data, RestService.getHeader());
    },
    deleteCSVids: (type, ids) => {
        return axios.put(USER_URL + 'delete_CSV_ids/' + type, { ids }, RestService.getHeader())
    },
    syncWhiteLabelsIDs: () => {
        return axios.get(USER_URL + 'sync_whiteLabels_ids', RestService.getHeader())
    },
    getSalesList: () => {
        return axios.get(USER_URL + 'get_sales_list', RestService.getHeader());
    },
    getDealerList: (labelID) => {
        return axios.get(USER_URL + 'get_dealer_list/' + labelID, RestService.getHeader());
    },
    getDeviceList: (labelID) => {
        return axios.get(USER_URL + 'get_device_list/' + labelID, RestService.getHeader());
    },
    saveBackup: (id) => {
        return axios.post(USER_URL + 'save_backup', { id }, RestService.getHeader());
    },

    //All report
    // generateReport: (data, reportName) => {
    //     console.log('services: ',reportName)
    //     return axios.get(USER_URL + 'billing/reports/' + reportName, data, RestService.getHeader());
    // },

    // product report
    generateProductReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/product', data, RestService.getHeader());
    },

    //invoice report
    generateInvoiceReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/invoice', data, RestService.getHeader());
    },

    //payment history report
    generatePaymentHistoryReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/payment-history', data, RestService.getHeader());
    },

    //hardware report
    generateHardwareReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/hardware', data, RestService.getHeader());
    },

    //sales report
    generateSalesReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/sales', data, RestService.getHeader());
    },

    //Grace Days report
    generateGraceDaysReport: (data) => {
        return axios.post(USER_URL + 'billing/reports/grace-days', data, RestService.getHeader());
    },
}
export default RestService;
