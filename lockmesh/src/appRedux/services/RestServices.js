import { Modal } from "antd";
import axios from 'axios';
import io from "socket.io-client";
import SupportSystemSocketIO from "socket.io-client";
import { BASE_URL, SOCKET_BASE_URL, SUPERADMIN_URL, SUPPORT_URL, SUPPORT_SOCKET_URL, LOG_SERVER_URL, SOCKET_BASE_PATH, LOGSERVER_AUTH_PASS, LOGSERVER_AUTH_USER, SYSTEM_NAME, SYSTEM_ID } from '../../constants/Application';
import { checkIsArray } from '../../routes/utils/commonUtils';

axios.interceptors.request.use(function (config) {
    config.startTime = new Date().getTime();
    config.requestPage = window.location.href;
    return config;
    // return Promise.reject(config);
})
axios.interceptors.response.use(function (response) {
    // let userAgent = window.navigator.userAgent ? window.navigator.userAgent : {} ;
    // let currentTime = new Date().getTime();
    // let objectToSend = {
    //   apiResponseTime : currentTime,
    //   client_info : {
    //     userAgent: userAgent
    //   },
    //   system_name: SYSTEM_NAME,
    //   system_id: SYSTEM_ID
    // };
    // if(response.hasOwnProperty('config')){
    //   objectToSend.request = response.config;
    //   objectToSend.requestBody = response.config.data ? response.config.data : {};
    //   objectToSend.requestHeaders = response.config.headers ? response.config.headers : {};
    //   objectToSend.requestUrl = response.config.requestPage ? response.config.requestPage : '';
    //   objectToSend.apiResponseTime = currentTime - (response.config.startTime ? response.config.startTime : 0);;
    // }
    // if(response){
    //   objectToSend.response = response.data;
    //   objectToSend.code = response.status;
    //   objectToSend.message = response.statusText;
    //   objectToSend.request = response.config;
    //   objectToSend.requestBody = response.config.data;
    //   objectToSend.responseBody = response.data;
    //   objectToSend.responseHeaders = response.headers;
    //   objectToSend.requestHeaders = response.config.headers;
    // }
    //
    // try {
    //   let url = LOG_SERVER_URL + '/api/v1/logs';
    //   let u2 = new URL(url);
    //   fetch(url, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': 'Basic ' + btoa(LOGSERVER_AUTH_USER + ':' + LOGSERVER_AUTH_PASS)
    //     },
    //     body: JSON.stringify(objectToSend) // body data type must match "Content-Type" header
    //   }).then(d => {
    //   }).catch(err => {});
    // } catch(err){}
    return response;
}
    , function (error) {
        let userAgent = window.navigator.userAgent ? window.navigator.userAgent : {};
        let currentTime = new Date().getTime();
        let newObjectToSend = {
            client_info: {
                userAgent: userAgent
            },
            system_name: SYSTEM_NAME,
            system_id: SYSTEM_ID
        };
        if (error.config !== null) {
            newObjectToSend.request = error.config;
            newObjectToSend.requestBody = error.config.data ? error.config.data : {};
            newObjectToSend.requestHeaders = error.config.headers ? error.config.headers : {};
            newObjectToSend.requestUrl = error.config.requestPage ? error.config.requestPage : '';
            newObjectToSend.apiResponseTime = currentTime - (error.config.startTime ? error.config.startTime : 0);
        }
        if (!error.response) {
            newObjectToSend.response = null;
            newObjectToSend.code = null;
            newObjectToSend.message = null;
            newObjectToSend.responseBody = null;
            newObjectToSend.responseHeaders = null;
        } else {
            if (error.response.status == 422) {
                console.warn('ValidationError', error.response.data);
                Modal.error({ title: error.response.data.msg });
            }

            newObjectToSend.response = error.response.data;
            newObjectToSend.code = error.response.status;
            newObjectToSend.message = error.response.statusText;
            newObjectToSend.responseBody = error.response.data;
            newObjectToSend.responseHeaders = error.response.headers;
        }
        try {
            let url = LOG_SERVER_URL + '/api/v1/logs';
            let u2 = new URL(url);
            fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + + btoa(LOGSERVER_AUTH_USER + ':' + LOGSERVER_AUTH_PASS)
                },
                body: JSON.stringify(newObjectToSend) // body data type must match "Content-Type" header
            }).then(d => {
            }).catch(err => {
            });
            return Promise.reject(error);
        } catch (err) { }
    }
);

const RestService = {

    getHeader: () => {
        return {
            headers: {
                authorization: localStorage.getItem('token') //the token is a variable which holds the token
            }
        };
    },

    // Login
    connectSocket: () => {
        let token = localStorage.getItem('token');
        let makeToken = "token=" + token + "&isWeb=true";
        let socket = io.connect(SOCKET_BASE_URL, {
            path: SOCKET_BASE_PATH,
            transports: ['websocket'],
            query: makeToken,
            // reconnectionDelay:1000,
            // reconnection:true,
            // forceNew:true
            secure: true
        });
        // console.log('check 1', socket.connected);
        socket.on('connect', function () {
            console.log('socket connection: ', socket.connected);
        });

        return socket;
    },

    // Login


    connectSupportSystemSocket: () => {

        let token = localStorage.getItem('token');
        let id = localStorage.getItem('id');
        let type = localStorage.getItem('type');
        let makeToken = "token=" + token + "&isWeb=true&user_id=" + id + "&type=" + type;
        let socket = SupportSystemSocketIO.connect(SUPPORT_SOCKET_URL, {
            path: '/supports/v1/socket',
            transports: ['websocket'],
            query: makeToken,
            secure: true,
            forceNew: false
        });

        socket.on('reconnect_failed', () => {
            console.info(socket, "6 attempt to connect again");
        });

        return socket;
    },
    login: (user) => {
        return axios.post(BASE_URL + 'users/login', user);
    },
    verifyCode: (verifyForm) => {
        return axios.post(BASE_URL + 'users/verify_code', {
            verify_code: verifyForm.verify_code
        });
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
        localStorage.removeItem('connected_dealer');
        localStorage.removeItem('connected_devices');
        localStorage.removeItem('two_factor_auth');
        localStorage.removeItem('timezone');
        // this.router.navigate(['/login']);

    },

    authLogIn: (data) => {
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.user.dealer_name);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('connected_dealer', data.user.connected_dealer);
        localStorage.setItem('connected_devices', data.user.connected_devices[0].total);
        localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('dealer_pin', data.user.link_code);
        localStorage.setItem('two_factor_auth', data.user.two_factor_auth);
        localStorage.setItem('timezone', data.user.timezone);

    },
    setUserData: (data) => {
        // console.log("hello12312", data);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('name', data.user.dealer_name);
        localStorage.setItem('firstName', data.user.firstName);
        localStorage.setItem('lastName', data.user.lastName);
        localStorage.setItem('connected_dealer', data.user.connected_dealer);
        localStorage.setItem('connected_devices', data.user.connected_devices[0].total);
        localStorage.setItem('type', data.user.user_type);
        localStorage.setItem('dealer_pin', data.user.link_code);
        localStorage.setItem('two_factor_auth', data.user.two_factor_auth);
        localStorage.setItem('account_balance_status', data.user.account_balance_status);
        localStorage.setItem('timezone', data.user.timezone);
        localStorage.setItem('account_balance_status_by', data.user.account_balance_status_by)

    },
    // checkAuth
    checkAuth: (response) => {
        if (response.success === false) {
            return false;
        } else {
            return true;
        }
    },
    twoFactorAuth: (isEnable) => {
        return axios.post(BASE_URL + 'users/two_factor_auth', { isEnable: isEnable }, RestService.getHeader())
    },
    // Component Allowed
    checkComponent: (ComponentUri) => {
        return axios.post(BASE_URL + 'users/check_component', { ComponentUri: ComponentUri }, RestService.getHeader());

    },

    //
    getAllowedComponents: () => {

    },

    getSocketProcesses: (status, filter, offset, limit) => {
        let query = '';

        query = (status) ? query + `?status=${status}&` : query;
        query = (offset) ?
            (status) ? query + `start=${offset}&` : query + `?start=${offset}&`
            : query;
        query = (limit) ?
            (status || offset) ? query + `limit=${limit}&` : query + `?limit=${limit}&`
            : query;
        query = (filter) ?
            (status || offset || limit) ? query + `filter=${filter}` : query + `?filter=${filter}`
            : query.slice(0, -1);
        // console.log("query getSocketProcesses ", query);

        return axios.get(BASE_URL + `users/get-processes${query}`, RestService.getHeader());
    },

    // isAdmin
    isAdmin: () => {
        // var self = this;
        // this.setHeaders(this.sessionLogin('token'));

        // this.response= this.http.get(this.baseUrl + '/users/check_admin',this.oHeaders);
        // return this.response;
    },

    // getUserType
    getUserType: () => {

    },

    // checkUserType
    checkUserType: () => {

    },

    // getMenu
    getMenu: () => {

    },

    transferDeviceProfile: (data) => {
        // console.log('data is: ', data)
        return axios.post(BASE_URL + 'users/transfer/device_profile', data, RestService.getHeader());
    },
    transferUser: (data) => {
        return axios.post(BASE_URL + 'users/transfer/user', data, RestService.getHeader());
    },

    transferHistory: (device_id) => {
        return axios.get(BASE_URL + 'users/transfer/history/' + device_id, RestService.getHeader());
    },

    getServicesHistory: (usr_acc_id) => {
        return axios.get(BASE_URL + 'users/getServicesHistory/' + usr_acc_id, RestService.getHeader());
    },

    /**
     * @section Devices
     */

    // getDevices
    DeviceList: () => {
        return axios.get(BASE_URL + 'users/devices',
            RestService.getHeader()
        )
    },

    getDevicesForReport: () => {
        return axios.get(BASE_URL + 'users/get-devices-for-report',
            RestService.getHeader()
        )
    },

    getBulkDevicesList: (data) => {
        return axios.post(BASE_URL + 'users/filtered-bulkDevices', data, RestService.getHeader())
    },

    // getBulkDealers: (data) => {
    //     return axios.get(BASE_URL + 'users/bulk-dealers', data, RestService.getHeader())
    // },

    // getBulkUsers: (data) => {
    //     return axios.get(BASE_URL + 'users/bulk-users', data, RestService.getHeader())
    // },

    deleteUnlinkDevice: (action, devices) => {
        return axios.put(BASE_URL + 'users/deleteUnlinkDevice', { action, devices }, RestService.getHeader())
    },

    // getNewDevices
    NewDeviceList: () => {
        return axios.get(BASE_URL + 'users/new/devices',
            RestService.getHeader()
        )
    },

    getSimIDs: () => {
        return axios.get(BASE_URL + 'users/get_sim_ids', RestService.getHeader());
    },

    getChatIDs: (user_acc_id, dealer_id) => {
        return axios.get(BASE_URL + `users/get_chat_ids/${user_acc_id}/${dealer_id}`, RestService.getHeader());
    },
    getPGPEmails: (user_acc_id, dealer_id) => {
        return axios.get(BASE_URL + `users/get_pgp_emails/${user_acc_id}/${dealer_id}`, RestService.getHeader());
    },
    // get All ids
    getAllSimIDs: () => {
        return axios.get(BASE_URL + 'users/get_all_sim_ids', RestService.getHeader());
    },
    getAllChatIDs: () => {
        return axios.get(BASE_URL + 'users/get_all_chat_ids', RestService.getHeader());
    },
    getAllPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_all_pgp_emails', RestService.getHeader());
    },
    // get used ids
    getUsedPGPEmails: () => {
        return axios.get(BASE_URL + 'users/get_used_pgp_emails', RestService.getHeader());
    },
    getUsedSimIds: () => {
        return axios.get(BASE_URL + 'users/get_used_sim_ids', RestService.getHeader());
    },
    getUsedChatIds: () => {
        return axios.get(BASE_URL + 'users/get_used_chat_ids', RestService.getHeader());
    },
    addProduct: (payload) => {
        return axios.post(`${BASE_URL}users/create-service-product`, payload, RestService.getHeader());
    },
    activateICCID: (iccid, user_acc_id) => {
        return axios.post(`${BASE_URL}users/validate_sim_id`, { sim_id: iccid, user_acc_id }, RestService.getHeader());
    },
    /**
     * @section Dealers
     */

    // Dealers
    DealerList: (dealer) => {
        return axios.get(BASE_URL + 'users/dealers/' + dealer, RestService.getHeader());
    },
    getAllDealers: () => {
        return axios.get(BASE_URL + 'users/dealers', RestService.getHeader());
    },
    getAllToAllDealers: () => {
        return axios.get(BASE_URL + 'users/get-all-dealers', RestService.getHeader());
    },
    getAdmin: () => {
        return axios.get(BASE_URL + 'users/get-admin', RestService.getHeader());
    },
    getUserDealers: () => {
        return axios.get(BASE_URL + 'users/user_dealers', RestService.getHeader());
    },

    // For dealer(admin dashboard)
    updateDealerDetails: (formData) => {
        return axios.put(BASE_URL + 'users/edit/dealers', formData, RestService.getHeader());
    },
    // Undo For Dealer and Sub dealer
    undoDealer(dealer_id) {
        return axios.post(BASE_URL + 'users/dealer/undo', { dealer_id }, RestService.getHeader())
    },
    // unlink Dealer.
    unlinkDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/delete', { dealer_id }, RestService.getHeader());
    },

    // suspend dealer account
    suspendDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/suspend/', { dealer_id },
            RestService.getHeader()
        )

    },
    activateDealer: (dealer_id) => {
        return axios.post(BASE_URL + 'users/dealer/activate/', { dealer_id },
            RestService.getHeader()
        )
    },

    /**
     * @section Connect Dealer
     */
    getDealerDetails: (dealerId) => {
        return axios.get(BASE_URL + 'users/connect-dealer/' + dealerId, RestService.getHeader());
    },
    getDealerDomains: (dealerId) => {
        return axios.get(BASE_URL + 'users/dealer-domains/' + dealerId, RestService.getHeader());
    },
    getDealerPaymentHistory: (dealerId, status = '') => {
        return axios.post(BASE_URL + 'users/payment-history/' + dealerId, {
            status: status
        }, RestService.getHeader());
    },
    changeDealerStatus: (dealerId, dealerStatus) => {
        return axios.put(`${BASE_URL}users/dealer-status/${dealerId}`, { dealerStatus: dealerStatus }, RestService.getHeader());
    },
    setCreditLimit: (data) => {
        return axios.put(BASE_URL + 'users/set_credits_limit', data, RestService.getHeader());
    },

    setDemosLimit: (data) => {
        return axios.put(BASE_URL + 'users/set_demos_limit', data, RestService.getHeader());
    },

    getDealerSalesHistory: (dealerId) => {
        return axios.get(BASE_URL + 'users/sales-history/' + dealerId, RestService.getHeader());
    },

    ApkList: () => {
        return axios.get(BASE_URL + 'users/apklist', RestService.getHeader());
    },

    toggleApk: (apkData) => {
        return axios.post(BASE_URL + 'users/toggle', apkData, RestService.getHeader());
    },

    // getDeviceDetails
    getDeviceDetails: (device_id) => {
        //console.log('rest apoi')
        return axios.get(BASE_URL + 'users/connect/' + device_id, RestService.getHeader());
    },
    // getDeviceList for connect page
    getDeviceListConnectDevice: (device_id) => {
        //console.log('rest apoi')
        return axios.get(BASE_URL + 'users/connect/get-device-list', RestService.getHeader());
    },
    // getAppJobQueue
    getAppJobQueue: (device_id) => {
        //console.log('rest apoi')
        return axios.get(BASE_URL + 'users/getAppJobQueue/' + device_id, RestService.getHeader());
    },

    reSyncDevice: (deviceId) => {
        return axios.patch(BASE_URL + 'users/sync-device', { device_id: deviceId }, RestService.getHeader());
    },

    savePolicy: (data) => {
        //console.log('rest apoi')
        return axios.post(BASE_URL + 'users/save_policy', { data }, RestService.getHeader());
    },

    // connect devices for dealer dash.
    getDealerApps: () => {

        return axios.get(BASE_URL + "users/get_dealer_apps", RestService.getHeader());
    },

    // connect devices for dealer dash.
    getAppPermissions: () => {
        //   console.log('api called ')
        return axios.get(BASE_URL + "users/get_app_permissions", RestService.getHeader());
    },
    getSystemPermissions: () => {
        return axios.get(BASE_URL + 'users/get_system_permissions', RestService.getHeader());
    },

    deleteORStatusPolicy: (data) => {
        //   console.log('api called ')
        return axios.post(BASE_URL + "users/change_policy_status", data, RestService.getHeader());
    },
    createBackupDB: () => {
        //   console.log('api called ')
        return axios.post(BASE_URL + "users/create_backup_DB", {}, RestService.getHeader());
    },

    SavePolicyChanges: (record) => {
        // console.log('check perm:: ', record);
        // return;
        if (record.push_apps.length) {
            checkIsArray(record.push_apps).forEach((app) => {
                app.guest = (app.guest !== undefined) ? app.guest : false;
                app.enable = (app.enable !== undefined) ? app.enable : false;
                app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
            });
        }

        // if(record)
        checkIsArray(record.app_list).forEach((app) => {
            app.guest = (app.guest !== undefined) ? app.guest : false;
            app.enable = (app.enable !== undefined) ? app.enable : false;
            app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
        });
        checkIsArray(record.secure_apps).forEach((app) => {
            app.guest = (app.guest !== undefined) ? app.guest : false;
            app.enable = (app.enable !== undefined) ? app.enable : false;
        })

        let data = {
            id: record.id,
            push_apps: JSON.stringify(record.push_apps),
            controls: JSON.stringify(record.controls),
            permissions: JSON.stringify(record.secure_apps),
            app_list: JSON.stringify(record.app_list),
            policy_note: record.policy_note,
            policy_name: record.policy_name
        }
        return axios.post(BASE_URL + "users/save_policy_changes ", data, RestService.getHeader());
    },

    saveNewData: (data) => {
        return axios.post(BASE_URL + "users/save_new_data ", data, RestService.getHeader());
    },

    getDeviceApps: (device_id) => {
        return axios.get(BASE_URL + "users/get_apps/" + device_id, RestService.getHeader());

    },
    getDefaultApps: () => {
        return axios.get(BASE_URL + "users/default_apps", RestService.getHeader());
    },

    getUserAccountId: (d) => {
        // console.log('rest ser')
        return axios.get(BASE_URL + "users/get_usr_acc_id/" + d, RestService.getHeader());
    },


    //AUTHENTICATE UPDATE USER CREDENTIALS
    authenticateUpdateUser: (data) => {
        return axios.post(BASE_URL + 'users/authenticate_update_user', {
            email: data.email,
            pwd: data.pwd
        },
            RestService.getHeader()
        );
    },


    // dealer profile
    getProfile: () => {
        return axios.get(BASE_URL + '/users/get-info', RestService.getHeader());
    },

    // For Dealer update
    updateDeviceDetails: (formData) => {
        return axios.put(BASE_URL + 'users/edit/devices', formData, RestService.getHeader());
    },

    extendServices: (formData) => {
        return axios.put(BASE_URL + 'users/edit-device/extendServices', formData, RestService.getHeader());
    },

    addDataPlan: (formData) => {
        return axios.put(BASE_URL + 'users/add-data-plans', formData, RestService.getHeader());
    },


    cancelExtendedServices: (service_data) => {
        return axios.put(BASE_URL + 'users/cancel-extended-services', service_data, RestService.getHeader());
    },

    getDeviceBillingHistory: (device_id, dealer_id) => {
        return axios.get(BASE_URL + 'users/get-billing-history/' + device_id + "/" + dealer_id, RestService.getHeader());
    },

    resetChatPin: (data) => {
        return axios.post(BASE_URL + 'users/reset-chat-pin/', data, RestService.getHeader());
    },

    resetPgpLimit: (user_acc_id) => {
        return axios.put(BASE_URL + 'users/reset-pgp-limit', { user_acc_id }, RestService.getHeader());
    },

    changeSchatPinStatus: (data) => {
        return axios.post(BASE_URL + 'users/change-s-chat-pin-status/', data, RestService.getHeader());
    },

    // for dealer reset password(admin dashboard)
    updatePassword: (dealer) => {

        return axios.post(BASE_URL + 'users/resetpwd', dealer, RestService.getHeader());

    },

    changeTimeZone: (data) => {
        // console.log("at rest file ", data);
        return axios.post(BASE_URL + 'users/set-timezone', { data }, RestService.getHeader());
    },

    // For Apk edit(admin dashboard)
    updateApkDetails: (formData) => {
        return axios.post(BASE_URL + 'users/edit/apk', formData, RestService.getHeader());

    },
    // For check apk name
    checkApkName: (name, apk_id = '') => {
        return axios.post(BASE_URL + 'users/checkApkName', { name, apk_id }, RestService.getHeader());
    },
    // For Service Remaining data
    getServiceRefund: (service_id, user_acc_id) => {
        return axios.post(BASE_URL + 'users/check-service-refund-credits', { service_id, user_acc_id }, RestService.getHeader());
    },
    // For check apk name
    checkPolicyName: (name, policy_id = '') => {
        return axios.post(BASE_URL + 'users/check_policy_name', { name, policy_id }, RestService.getHeader());
    },

    updateUserProfile: (formData) => {
        return axios.put(BASE_URL + 'users/updateProfile/' + formData.dealerId, formData, RestService.getHeader());
    },
    getLoginHistory: (offset, limit) => {
        let query = `?start=${offset}&limit=${limit}`;
        return axios.get(BASE_URL + `users/login_history${query}`, RestService.getHeader());
    },

    getDeviceHistory: (device_id = "") => {
        return axios.post(BASE_URL + 'users/get_device_history', {
            device_id: device_id
        }, RestService.getHeader());
    },

    getDeviceProfiles: (device_id = "") => {
        return axios.post(BASE_URL + 'users/get_profiles', {
            device_id: device_id
        }, RestService.getHeader());

    },
    getPolicies: () => {
        return axios.get(BASE_URL + 'users/get_policies', RestService.getHeader());

    },

    // unlink Device
    unlinkDevice: (device) => {
        // console.log('unlinkDevice ', device)
        return axios.post(BASE_URL + 'users/unlink/' + device.usr_device_id, { device }, RestService.getHeader());

    },


    // unlink (dealer-cevices) admin dash.
    unlinkAPK: (apk_id) => {
        return axios.post(BASE_URL + 'users/apk/delete', { apk_id: apk_id }, RestService.getHeader());
    },

    // suspend account
    suspendDevice: (device_id) => {
        return axios.post(BASE_URL + 'users/suspend/' + device_id, device_id, RestService.getHeader())
    },



    wipe: (device_id) => {
        return axios.post(BASE_URL + 'users/wipe/' + device_id, device_id,
            RestService.getHeader()
        )
    },


    // activate account
    activateDevice: (device_id) => {
        return axios.post(BASE_URL + 'users/activate/' + device_id, device_id,
            RestService.getHeader()
        )
    },

    rejectDevice: (device) => {
        // console.log(device);
        return axios.put(BASE_URL + 'users/delete/' + device.device_id, device, RestService.getHeader());
    },

    relinkDevice: (id) => {
        // console.log(id);
        return axios.put(BASE_URL + 'users/relink-device/' + id, {}, RestService.getHeader());
    },



    // Undo For Dealer and Sub dealer
    undoDevice(id) {
        // this.token = this.sessionLogin('token');
        // this.setHeaders(this.sessionLogin('token'));
        // this.response = this.http.post(this.baseUrl + '/users/dealer/undo', {dealerId: id}, this.oHeaders );
        // this.authtoken(this.response);
        // return this.response;
    },
    addDevice: (device) => {
        return axios.put(BASE_URL + 'users/new/device', device, RestService.getHeader());
    },
    preActiveDevice: (device) => {
        return axios.post(BASE_URL + 'users/create/device_profile', device, RestService.getHeader());
    },
    // addDealer
    addDealer: (dealer) => {
        return axios.post(BASE_URL + 'users/add/dealer', dealer, RestService.getHeader())

    },

    addAPK: (formData) => {
        return axios.post(BASE_URL + 'users/addApk', formData, RestService.getHeader());
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
        // console.log('page name', pageName);
        return axios.get(BASE_URL + 'users/dealer/gtdropdown/' + pageName, RestService.getHeader());
    },


    // postSelectedItem
    postSelectedItems: (selectedItems, pageName) => {

        const items = JSON.stringify(selectedItems);
        return axios.post(BASE_URL + 'users/dealer/dropdown', { selected_items: items, pageName: pageName }, RestService.getHeader());

    },

    // applySettings
    applySettings: (device_setting, device_id = null, usr_acc_id) => {
        //  console.log('device settings', device_setting, 'device id ', device_id,'name', name, 'type',type );
        if (device_setting.app_list !== undefined) {
            checkIsArray(device_setting.app_list).forEach((elem) => {
                elem.packageName = elem.uniqueName.replace(elem.label, '');

                elem.guest = elem.guest ? true : false;
                elem.encrypted = elem.encrypted ? true : false;
                elem.enable = elem.enable ? true : false;
                delete elem.device_id;
            });
        }
        return axios.post(BASE_URL + 'users/apply_settings/' + device_id, {
            device_setting,
            usr_acc_id: usr_acc_id,
            device_id: device_id,
        }, RestService.getHeader());

    },

    applyPushApps: (push_apps, deviceId, usrAccId) => {
        return axios.post(BASE_URL + 'users/apply_pushapps/' + deviceId, {
            push_apps: push_apps,
            deviceId: deviceId,
            usrAccId: usrAccId
        }, RestService.getHeader());
    },

    applyPolicy: (deviceId, userAccId, policyId) => {
        return axios.post(BASE_URL + 'users/apply_policy/' + deviceId, {
            deviceId: deviceId,
            policyId: policyId,
            userAccId: userAccId
        }, RestService.getHeader());
    },

    applyPullApps: (pull_apps, deviceId, usrAccId) => {
        return axios.post(BASE_URL + 'users/apply_pullapps/' + deviceId, {
            pull_apps: pull_apps,
            deviceId: deviceId,
            usrAccId: usrAccId
        }, RestService.getHeader());
    },

    saveProfileCND: (device_setting, profileName = null, usr_acc_id) => {
        //  console.log('device settings', device_setting, 'device id ', device_id,'name', name, 'type',type );
        if (device_setting.app_list !== undefined) {
            checkIsArray(device_setting.app_list).forEach((elem) => {
                elem.packageName = elem.uniqueName.replace(elem.label, '');
                if (elem.guest) {
                    elem.guest = true;
                } else {
                    elem.guest = false;
                }
                if (elem.encrypted) {
                    elem.encrypted = true;
                } else {
                    elem.encrypted = false;
                }
                if (elem.enable) {
                    elem.enable = true;
                } else {
                    elem.enable = false;
                }
                delete elem.device_id;
                delete elem.isChanged;
            });
        }
        return axios.post(BASE_URL + 'users/save/profile', {
            device_setting,
            usr_acc_id: usr_acc_id,
            profileName: profileName,
            // device_id:device_id,
        }, RestService.getHeader());

    },

    deleteProfile: (profileId) => {
        // this.setHeaders(this.sessionLogin('token'));
        // this.http.delete(this.baseUrl + '/users/delete_profile/' + profileId, this.oHeaders).subscribe(resp => {
        //   this.authtoken(resp);
        // });
    },

    // Check pass
    checkPass: (user) => {
        return axios.post(BASE_URL + 'users/check_pass', { user }, RestService.getHeader());
    },
    saveIDPrices: (data) => {
        // console.log(data, 'save-prices data')
        return axios.patch(BASE_URL + 'users/save-prices', data, RestService.getHeader());
    },
    setPackage: (data) => {
        // console.log(data, 'data')
        return axios.post(BASE_URL + 'users/save-package', { data }, RestService.getHeader());
    },
    editPackage: (data) => {
        // console.log(data, 'data')
        return axios.put(BASE_URL + 'users/edit-package', { data }, RestService.getHeader());
    },
    getPrices: () => {
        // console.log(dealer_id, 'whte label on get price')
        return axios.get(BASE_URL + 'users/get-prices', RestService.getHeader());
    },

    getPackages: () => {
        // console.log(dealer_id, 'whte label on get price')
        return axios.get(BASE_URL + 'users/get-packages', RestService.getHeader());
    },

    getHardwares: () => {
        // console.log(dealer_id, 'whte label on get price')
        return axios.get(BASE_URL + 'users/get-Hardwares', RestService.getHeader());
    },
    getParentPackages: () => {
        // console.log(dealer_id, 'whte label on get price')
        return axios.get(BASE_URL + 'users/get-parent-packages', RestService.getHeader());
    },
    getProductPrices: () => {
        // console.log(dealer_id, 'whte label on get price')
        return axios.get(BASE_URL + 'users/get-parent-product-prices', RestService.getHeader());
    },

    getHardwaresPrices: () => {
        return axios.get(BASE_URL + 'users/get-parent-hardware-prices', RestService.getHeader());
    },

    checkPackageName: (name) => {

        return axios.patch(BASE_URL + 'users/check-package-name', { name }, RestService.getHeader());
    },
    purchaseCredits: (data) => {
        return axios.post(BASE_URL + 'users/purchase_credits', { data }, RestService.getHeader());
    },
    purchaseCreditsFromCC: (cardInfo, creditInfo) => {
        return axios.post(BASE_URL + 'users/purchase_credits_CC', { cardInfo: cardInfo, creditInfo: creditInfo }, RestService.getHeader());
    },

    getAll_Languages: () => {
        return axios.get(`${BASE_URL}users/get-all-languages`, RestService.getHeader());
    },

    switchLanguage: (language) => {
        // console.log(language, 'language is')
        return axios.patch(BASE_URL + 'users/save-language', { language }, RestService.getHeader());
    },

    getLanguage: () => {
        return axios.get(BASE_URL + 'users/get-language', RestService.getHeader());
    },

    invalidPage: () => {
    },
    getFile: (filename) => {
        window.location = BASE_URL + 'users/getFile/' + filename;
    },
    getBackupFile: (filename) => {
        window.location = BASE_URL + 'users/getBackupFile/' + filename;
    },
    postPagenation: (selectedValue, pageName) => {
        return axios.post(BASE_URL + 'users/dealer/postPagination', { selectedValue: selectedValue, pageName: pageName }, RestService.getHeader())
    },
    getPagination(pageName) {
        // console.log('page name', pageName);
        return axios.get(BASE_URL + 'users/dealer/getPagination/' + pageName, RestService.getHeader());
        // this.authtoken(this.response);
        // return this.response;
    },
    //Unflagg Device
    unflagged(device_id) {
        // alert("dadsada")
        return axios.post(BASE_URL + 'users/UnflagDevice/' + device_id, {}, RestService.getHeader());
    },
    //flag Device
    flagged(device_id, data) {
        return axios.post(BASE_URL + 'users/flagDevice/' + device_id, { data }, RestService.getHeader());

    },
    //GET IMEI History
    getImeiHistory: (device_id) => {
        return axios.get(BASE_URL + "users/get_imei_history/" + device_id, RestService.getHeader());
    },

    getActivities: (device_id) => {
        return axios.get(BASE_URL + "users/get_activities/" + device_id, RestService.getHeader());
    },

    //GET User List
    userList: () => {
        return axios.get(BASE_URL + 'users/userList',
            RestService.getHeader()
        )
    },

    //GET invoice id
    getInvoiceId: () => {
        return axios.get(BASE_URL + 'users/getInvoiceId', RestService.getHeader())
    },

    //GET User List against device dealer
    userListOfDevice: (dealerId) => {
        return axios.post(BASE_URL + 'users/userListOfDevice', { dealerId }, RestService.getHeader())
    },

    writeImei(device_id, usrAccId, type, imeiNo, device) {
        return axios.post(BASE_URL + 'users/writeImei/' + device_id, { usrAccId, type, imeiNo, device }, RestService.getHeader());
    },

    // ADD new user
    addUser: (user) => {
        return axios.post(BASE_URL + 'users/add/user', user, RestService.getHeader())
    },

    //EDIT user
    editUser: (user) => {
        return axios.post(BASE_URL + 'users/edit/user', user, RestService.getHeader())
    },
    //DELETE user
    deleteUser: (userId) => {
        return axios.put(BASE_URL + 'users/delete_user/' + userId, {}, RestService.getHeader())
    },
    //UNDO DELETE user
    undoDeleteUser: (userId) => {
        return axios.put(BASE_URL + 'users/undo_delete_user/' + userId, {}, RestService.getHeader())
    },

    // Transfer Secure market Apps
    transferApps: (data, space) => {
        return axios.post(BASE_URL + 'users/transferApps', { data, spaceType: space }, RestService.getHeader())
    },

    // Remove Secure market Apps
    removeSMapps: (data, spaceType) => {
        return axios.post(BASE_URL + 'users/remove_sm_apps', { data, spaceType }, RestService.getHeader())
    },

    // Change unistall app restriction for Secure market apps
    handleUninstall: (apk_id, value, space) => {
        return axios.put(BASE_URL + 'users/handleUninstall/' + apk_id, { value, spaceType: space }, RestService.getHeader())
    },
    getMarketApps: () => {
        return axios.get(BASE_URL + 'users/marketApplist', RestService.getHeader())
    },

    defaultPolicyChange: (enable, policy_id) => {
        return axios.post(BASE_URL + 'users/set_default_policy', { enable, policy_id }, RestService.getHeader())
    },
    getNewCashRequests: () => {
        return axios.get(BASE_URL + 'users/newRequests',
            RestService.getHeader()
        )
    },
    getTicketsNotifications: () => {
        return axios.get(SUPPORT_URL + 'tickets/notifications',
            RestService.getHeader()
        )
    },
    getUserCredit: () => {
        return axios.get(BASE_URL + 'users/get_user_credits',
            RestService.getHeader()
        )
    },
    exchangeCurrency: (e) => {
        return axios.get(SUPERADMIN_URL + 'pub/exchange-currency/' + e,
            RestService.getHeader()
        )
    },
    rejectRequest: (request) => {
        return axios.put(BASE_URL + 'users/delete_request/' + request.id, request, RestService.getHeader());
    },
    rejectServiceRequest: (request) => {
        return axios.put(BASE_URL + 'users/delete_service_request/' + request.id, null, RestService.getHeader());
    },

    acceptRequest: (request) => {
        return axios.put(BASE_URL + 'users/accept_request/' + request.id, request, RestService.getHeader());
    },

    acceptServiceRequest: (request) => {
        return axios.put(BASE_URL + 'users/accept_service_request/' + request.id, request, RestService.getHeader());
    },

    getCancelServiceRequests: () => {
        // console.log("object");
        return axios.get(BASE_URL + 'users/get-cancel-service-requests', RestService.getHeader());
    },

    simRegister: (data) => {
        return axios.post(BASE_URL + 'users/sim-register', { data }, RestService.getHeader());
    },
    getSims: (device_id) => {
        return axios.get(BASE_URL + 'users/get-sims/' + device_id, RestService.getHeader());
    },
    deleteSim: (data) => {
        return axios.post(BASE_URL + 'users/sim-delete', data, RestService.getHeader());
    },
    handleSimUpdate: (data) => {
        return axios.put(BASE_URL + 'users/sim-update', data, RestService.getHeader());
    },
    simHistory: (device_id) => {
        return axios.get(BASE_URL + 'users/sim-history/' + device_id, RestService.getHeader());
    },

    getUnRegisterSims: (device_id) => {
        return axios.get(BASE_URL + 'users/get-unRegSims/' + device_id, RestService.getHeader());
    },

    // Dealer Agents Section
    getAgentList: () => {
        return axios.get(BASE_URL + 'users/agents', RestService.getHeader())
    },
    addAgent: (agent) => {
        return axios.post(BASE_URL + 'users/agents', {
            ...agent
        }, RestService.getHeader());
    },
    updateAgent: (agent) => {
        return axios.put(BASE_URL + 'users/agents/' + agent.agent_id, {
            ...agent
        }, RestService.getHeader());
    },

    changeAgentStatus(agent, status) {
        return axios.put(BASE_URL + 'users/agents/' + agent.id + '/status', {
            status: status
        }, RestService.getHeader());
    },

    resetAgentPwd: (agentID) => {
        return axios.put(BASE_URL + 'users/agents/' + agentID + '/reset-pwd', {
        }, RestService.getHeader());
    },

    deleteAgent: (agentID) => {
        return axios.delete(BASE_URL + 'users/agents/' + agentID, RestService.getHeader());
    },

    deletePackage: (id) => {
        return axios.delete(BASE_URL + 'users/delete_package/' + id, RestService.getHeader());
    },

    modifyItemPrice: (id, price, retail_price, isModify, type) => {
        return axios.put(BASE_URL + 'users/modify_item_price/' + id, { price, retail_price, isModify, type }, RestService.getHeader());
    },

    getDashboardData: () => {
        return axios.get(BASE_URL + 'users/dashboard-data', RestService.getHeader());
    },


    //******************** */ Bulk Devices

    // suspend accounts
    bulkSuspendDevice: (devices) => {
        // console.log('at rest services page ', devices)
        return axios.post(BASE_URL + 'users/bulk-suspend', devices,
            RestService.getHeader()
        )
    },


    // activate accounts
    bulkActivateDevice: (device_ids) => {
        return axios.post(BASE_URL + 'users/bulk-activate', device_ids,
            RestService.getHeader()
        )
    },

    // get bulk devices history
    getbulkHistory: () => {
        return axios.get(BASE_URL + 'users/get-bulk-history', RestService.getHeader())
    },

    applyBulkPushApps: (data) => {
        // console.log('at rest serv file', data)
        return axios.post(BASE_URL + 'users/apply_bulk_pushapps', data, RestService.getHeader());
    },

    applyBulkPullApps: (data) => {
        return axios.post(BASE_URL + 'users/apply_bulk_pullapps', data, RestService.getHeader());
    },

    applyBulkPolicy: (data) => {
        return axios.post(BASE_URL + 'users/apply_bulk_policy', data, RestService.getHeader());
    },

    sendBulkMsg: (data, timezone) => {
        return axios.post(BASE_URL + 'users/send_bulk_msg', { data, timezone }, RestService.getHeader());
    },

    updateBulkMsg: (data, timezone) => {
        // delete data.data; // delete devices list
        return axios.post(BASE_URL + 'users/update_bulk_msg', { data, timezone }, RestService.getHeader());
    },

    getBulkMsgsList: (timezone) => {
        return axios.post(BASE_URL + 'users/get_bulk_msgs', { timezone }, RestService.getHeader());
    },

    deleteBulkMsg: (id) => {
        return axios.get(BASE_URL + 'users/delete_bulk_msg/' + id, RestService.getHeader());
    },


    // unlink bulk Devices
    unlinkBulkDevices: (data) => {
        return axios.post(BASE_URL + 'users/bulk-unlink', data, RestService.getHeader());
    },

    // wipe bulk Devices
    wipeBulkDevices: (data) => {
        return axios.post(BASE_URL + 'users/bulk-wipe', data, RestService.getHeader());
    },

    // *************************** end of bulk end points


    submitPassword: (data) => {
        return axios.post(BASE_URL + 'users/submit-device-passwords', data, RestService.getHeader());
    },
    getDomains: () => {
        return axios.get(BASE_URL + 'users/get-domains', RestService.getHeader());
    },
    dealerPermissions: (permissionId, dealers, action, statusAll, permissionType) => {
        // console.log("url ===========> ", BASE_URL + 'users/dealer-permissions/' + permissionType);
        return axios.post(BASE_URL + 'users/dealer-permissions/' + permissionType, {
            permissionId: permissionId,
            dealers: dealers,
            action: action,
            statusAll: statusAll
        },
            RestService.getHeader()
        );
    },

    connectDealerDomainPermission: (permissionIds, dealers, action, statusAll) => {
        return axios.post(BASE_URL + 'users/dealer-domain-permissions', {
            permissionIds,
            dealers,
            action,
            statusAll
        },
            RestService.getHeader()
        );
    },

    //product report
    generateProductReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/product', data, RestService.getHeader());
    },

    //invoice report
    generateInvoiceReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/invoice', data, RestService.getHeader());
    },

    //payment history report
    generatePaymentHistoryReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/payment-history', data, RestService.getHeader());
    },

    //hardware report
    generateHardwareReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/hardware', data, RestService.getHeader());
    },

    //sales report
    generateSalesReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/sales', data, RestService.getHeader());
    },

    //sales report
    generateGraceDaysReport: (data) => {
        return axios.post(BASE_URL + 'users/reports/grace-days', data, RestService.getHeader());
    },
    //get latest payment history
    getLatestPaymentHistory: (data) => {
        return axios.post(BASE_URL + 'users/get-latest-payment-history', data, RestService.getHeader());
    },

    //get overdue details
    getOverdueDetails: () => {
        return axios.get(BASE_URL + 'users/get-overdue-details', RestService.getHeader());
    },

    //genarete Random Usernanme
    generateRandomUsername: () => {
        return axios.get(BASE_URL + 'users/generate-random-username', RestService.getHeader());
    },

    //genarete Random Emails
    checkUniquePgpEmail: (value) => {
        return axios.post(BASE_URL + 'users/check-unique-pgp', { pgp_email: value }, RestService.getHeader());
    },


    //check support system running
    checkSupportServiceRunning: () => {
        return axios.get(SUPPORT_URL);
    },

    //support tickets
    //generate Support Ticket
    generateSupportTicket: (data) => {
        return axios.post(SUPPORT_URL + 'tickets/store', data, RestService.getHeader());
    },

    //generate Support Ticket
    supportTicketReply: (data) => {
        return axios.post(SUPPORT_URL + 'tickets/replies/store', data, RestService.getHeader());
    },

    //generate Support Ticket
    getSupportTickets: (data) => {
        return axios.get(SUPPORT_URL + 'tickets/' + data.id + '/' + data.type, RestService.getHeader());
    },

    //generate Support Ticket
    closeSupportTicket: (data) => {
        return axios.get(SUPPORT_URL + 'tickets/close/' + data, RestService.getHeader());
    },

    //delete Support Ticket
    deleteSupportTicket: (data) => {
        return axios.put(SUPPORT_URL + 'tickets/delete', data, RestService.getHeader());
    },

    //get Support Ticket replies
    getSupportTicketReplies: (data) => {
        return axios.get(SUPPORT_URL + 'tickets/replies/' + data, RestService.getHeader());
    },

    //update support ticket notifications
    updateTicketNotificationStatus: (data) => {
        return axios.post(SUPPORT_URL + 'tickets/update_notification', data, RestService.getHeader());
    },

    //Support System Messages

    //get Support System Messages
    getSupportSystemMessages: (data) => {
        return axios.get(SUPPORT_URL + 'system-messages', RestService.getHeader());
    },

    //get Support System Messages
    getReceivedSupportSystemMessages: (data) => {
        return axios.get(SUPPORT_URL + 'system-messages/received', RestService.getHeader());
    },

    //get Support System Messages
    getSupportSystemMessagesNotifications: (data) => {
        return axios.get(SUPPORT_URL + 'system-messages/notifications', RestService.getHeader());
    },

    //generate Support System Messages
    generateSupportSystemMessages: (data) => {
        return axios.post(SUPPORT_URL + 'system-messages/store', data, RestService.getHeader());
    },

    //update Support System Message Notification
    updateSupportSystemMessageNotification: (data) => {
        return axios.post(SUPPORT_URL + 'system-messages/update-notification', data, RestService.getHeader());
    },

    //SIMS MODULE
    //GET SIMS List
    getStandaloneSimsList: () => {
        return axios.get(BASE_URL + 'users/get-standalone-sims',
            RestService.getHeader()
        )
    },
    //CHANGE SIM STATUS ON TWILLIO

    changeSimStatus: (id, type) => {
        return axios.put(BASE_URL + 'users/change_sim_status',
            { id, type },
            RestService.getHeader()
        )
    },

    addStandAloneSim: (data) => {
        return axios.post(BASE_URL + 'users/add-standalone-sim',
            data,
            RestService.getHeader()
        )
    },


    //send Support Live Chat Message
    sendSupportLiveChatMessage: (data) => {
        return axios.post(SUPPORT_URL + 'messages/send', data, RestService.getHeader());
    },

    //get Support Live Chat conversations
    getSupportLiveChatConversation: (data) => {
        return axios.get(SUPPORT_URL + 'messages/conversations', RestService.getHeader());
    },

    //get Support Live Chat Message
    getSupportLiveChatMessages: (data) => {
        return axios.get(SUPPORT_URL + 'messages/get?type=' + data.type + '&id=' + data.id, RestService.getHeader());
    },

    //get Support Live Chat Previous Message
    getSupportLiveChatPreviousMessages: (data) => {
        return axios.get(SUPPORT_URL + 'messages/get?type=' + data.type + '&id=' + data.id + '&last=' + data.last, RestService.getHeader());
    },

    // Get Support Live Chat Notifications
    getSupportLiveChatNotifications: () => {
        return axios.get(SUPPORT_URL + 'messages/getNotifications', RestService.getHeader());
    },

    // read the chat message
    updateSupportLiveChatReadStatus: (data) => {
        return axios.put(SUPPORT_URL + 'messages/read', data, RestService.getHeader());
    }
};
export default RestService;
