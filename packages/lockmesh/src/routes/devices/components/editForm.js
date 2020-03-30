// Libraries
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Markup } from 'interweave';
import axios from 'axios';

import moment from 'moment-timezone';


import { Button, Form, Input, Select, InputNumber, Spin, Modal, Table, Switch, DatePicker, Row, Col, Tooltip } from 'antd';

// Components
import AddUser from '../../users/components/AddUser';
import AddPGPEmailModal from './AddPGPEmailModal';
import Services from './Services';
import Invoice from './invoice';

// Helpers
import { checkValue, convertToLang, checkIsArray } from '../../utils/commonUtils'
import RestService from '../../../appRedux/services/RestServices';
import { inventorySales, refundServiceColumns } from '../../utils/columnsUtils';

// actions
import {
    getSimIDs,
    getChatIDs,
    getPGPEmails,
    getParentPackages,
    getProductPrices,
    extendServices,
    addUser,
    getUserList,
    getInvoiceId,
    getDomains,
    addProduct,
    addDataPlan,
    resetProductAddProps
} from "../../../appRedux/actions";

// Constants
import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, ADMIN, Model_text, Expire_Date, one_month, three_month, six_month, twelve_month, Days, Start_Date, Expire_Date_Require, Not_valid_Email, DEVICE_EXPIRED
} from '../../../constants/Constants';


import {
    Required_Fields,
    DEVICE_ID,
    USER_ID,
    DEVICE_SIM_ID,
    DEVICE_Select_SIM_ID,
    DEVICE_CHAT_ID,
    Device_Note,
    Device_Valid_For,
    Device_Valid_days_Required,
    DEVICE_Select_CHAT_ID,
    SELECT_USER_ID,
    USER_ID_IS_REQUIRED,
    SELECT_PGP_EMAILS,
    DEVICE_EDIT
} from '../../../constants/DeviceConstants';


import {
    Button_Add_User,
    Button_submit,
    Button_Cancel
} from '../../../constants/ButtonConstants';

import {
    LABEL_DATA_PGP_EMAIL,
    DUMY_TRANS_ID,
    LABEL_DATA_CHAT_ID,
    LABEL_DATA_SIM_ID,
    LABEL_APPLY_SERVICES
} from '../../../constants/LabelConstants';

import { PRE_ACTIVATE_DEVICE } from '../../../constants/ActionTypes';
import { SERVER_TIMEZONE } from '../../../constants/Application';

const { TextArea } = Input;
const confirm = Modal.confirm
const success = Modal.success
const error = Modal.error;
moment.tz.setDefault(SERVER_TIMEZONE);


class EditDevice extends Component {

    constructor(props) {
        super(props);

        const invoiceColumns = inventorySales(props.translation);
        const refundServicesColumns = refundServiceColumns(props.translation);
        this.data_plan_1_added = false;
        this.data_plan_2_added = false;

        this.state = {
            visible: false,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
            servicesModal: false,
            client_id: '',
            pgp_email: (this.props.device.pgp_email === 'N/A') ? "" : this.props.device.pgp_email,
            chat_id: (this.props.device.chat_id === 'N/A') ? "" : this.props.device.chat_id,
            sim_id: (this.props.device.sim_id === 'N/A') ? "" : this.props.device.sim_id,
            sim_id2: (this.props.device.sim_id2 === 'N/A') ? "" : this.props.device.sim_id2,
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableSim2: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            tabselect: '0',
            parent_packages: [],
            product_prices: [],
            products: [],
            packages: [],
            expiry_date: this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION ? this.props.device.expiry_date : this.props.device.expiry_months + " month",
            services: false,
            checkServices: {
                display: 'none',
            },
            term: false,
            unit_servcies_price: 0,
            total_price: 0,
            invoiceColumns: invoiceColumns,
            refundServicesColumns: refundServicesColumns,
            PkgSelectedRows: [],
            proSelectedRows: [],
            creditsToRefund: 0,
            serviceRemainingDays: 0,
            prevService_totalDays: 0,
            showConfirmCredit: false,
            serviceData: {},
            invoiceID: 'PI00001',
            paidByUser: "PAID",
            applyServicesValue: null,
            renewService: false,
            valid_sim_id_1: true,
            valid_sim_id_2: true,
            valid_toActivate_sim_id_1: false,
            valid_toActivate_sim_id_2: false,
            data_limit_1: '',
            data_limit_2: '',
            disable_data_plan_sim1: true,
            disable_data_plan_sim2: true,
            change_data_plan: false
        }
    }
    handleUserChange = (e) => {
        //
        this.setState({ addNewUserValue: e });
    }

    handleSubmit = (e) => {
        // alert('submit', this.props.editDeviceFunc);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //
                //
                values.prevPGP = this.props.device.pgp_email;
                values.prevChatID = this.props.device.chat_id;
                values.prevSimId = this.props.device.sim_id;
                values.prevSimId2 = this.props.device.sim_id2;
                values.finalStatus = this.props.device.finalStatus;
                values.prevService = this.props.device.services
                if (this.props.user.type === ADMIN) {
                    values.expiry_date = moment(values.expiry_date._d.toString()).format('YYYY/MM/DD')
                    console.log(values.expiry_date);
                }
                if (this.state.renewService) {
                    values.products = this.state.products;
                    values.packages = this.state.packages;
                    values.total_price = this.state.total_price
                    values.renewService = this.state.renewService
                    values.expiry_date = this.state.tabselect
                    values.service = true
                    this.setState({
                        serviceData: values,
                        showConfirmCredit: true
                    })
                }
                else if (this.state.services) {
                    let product_prices = this.filterList(this.state.term + ' month', this.props.product_prices, 'product');
                    let sim_id_price = checkIsArray(product_prices).filter((item) => {
                        if (item.price_for === 'sim_id') {
                            return item
                        }
                    })
                    if (this.state.sim_id2 && !this.sim_id2_added && !this.sim_id2_included) {
                        if (sim_id_price.length) {
                            let data = {
                                id: sim_id_price[0].id,
                                rowKey: sim_id_price[0].id,
                                unit_price: sim_id_price[0].unit_price,
                                rowKey: sim_id_price[0].id,
                                price_for: "SIM ID 2",
                                pkg_term: this.state.term + " Months"
                            }

                            this.state.proSelectedRows.push(data);
                            this.state.products.push(data);
                            this.state.total_price = this.state.total_price + Number(sim_id_price[0].unit_price)
                        }
                        this.sim_id2_added = true
                    } else if (this.state.sim_id2 === '' && this.sim_id2_added) {
                        this.state.proSelectedRows.pop()
                        this.state.products.pop()
                        this.state.total_price = this.state.total_price - Number(sim_id_price[0].unit_price)
                        this.sim_id2_added = false
                    }
                    let priceToCharge = this.state.total_price
                    if (this.state.applyServicesValue !== 'extend') {
                        priceToCharge = this.state.total_price - this.state.creditsToRefund
                    }

                    values.products = this.state.products;
                    values.packages = this.state.packages;

                    if (this.state.data_limit_1 && !this.data_plan_1_added) {
                        this.state.data_limit_1.sim_type = 'sim_id'
                        values.packages.push(this.state.data_limit_1)
                        // values.packages.push(this.state.data_limit_1)
                        this.state.PkgSelectedRows = values.packages;
                        priceToCharge = priceToCharge + Number(this.state.data_limit_1.pkg_price)
                        this.state.total_price += Number(this.state.data_limit_1.pkg_price)

                        this.data_plan_1_added = true
                    } else if (this.state.data_limit_1 === '') {
                        let index = values.packages.findIndex(item => item.sim_type === 'sim_id')
                        if (index !== -1) {
                            let data_plan_package = values.packages[index]
                            values.packages.splice(index, 1)
                            this.state.PkgSelectedRows = values.packages;
                            priceToCharge = priceToCharge - Number(data_plan_package.pkg_price)
                            this.state.total_price -= Number(data_plan_package.pkg_price)

                        }
                    }

                    if (this.state.data_limit_2 && !this.data_plan_2_added) {

                        this.state.data_limit_2.sim_type = 'sim_id2'
                        values.packages.push(this.state.data_limit_2)
                        this.state.PkgSelectedRows = values.packages
                        priceToCharge = priceToCharge + Number(this.state.data_limit_2.pkg_price)
                        this.state.total_price += Number(this.state.data_limit_2.pkg_price)
                        this.data_plan_2_added = true
                    }
                    else if (this.state.data_limit_2 === '') {
                        let index = values.packages.findIndex(item => item.sim_type === 'sim_id2')
                        if (index !== -1) {
                            let data_plan_package = values.packages[index]
                            values.packages.splice(index, 1)
                            this.state.PkgSelectedRows = values.packages;
                            priceToCharge = priceToCharge - Number(data_plan_package.pkg_price)
                            this.state.total_price -= Number(data_plan_package.pkg_price)
                        }
                    }
                    let data_plans = {
                        sim_id: this.state.data_limit_1 ? this.state.data_limit_1 : "",
                        sim_id2: this.state.data_limit_2 ? this.state.data_limit_2 : "",
                    }
                    values.data_plans = data_plans

                    values.expiry_date = this.state.term;
                    values.total_price = priceToCharge
                    values.service = true
                    this.setState({
                        serviceData: values,
                        showConfirmCredit: true
                    })
                } else {
                    if (this.state.applyServicesValue === 'cancel') {
                        values.cancelService = true
                        showCancelServiceConfirm(this, values)
                    } else {
                        values.cancelService = false
                        this.props.editDeviceFunc(values);
                        this.props.hideModal();
                        this.handleReset();
                    }
                }
            }
        });

    }

    componentDidMount() {
        // this.props.getSimIDs();
        this.props.getChatIDs(this.props.device.id, this.props.device.dealer_id);
        this.props.getPGPEmails(this.props.device.id, this.props.device.dealer_id);
        this.props.getUserList();
        this.props.getParentPackages()
        this.props.getProductPrices()
        if (this.props.device.services) {
            let disableChat = true
            let disablePgp = true
            let disableSim2 = true
            let disableSim = true
            let disableVpn = true
            let packages = JSON.parse(this.props.device.services.packages)
            let pkg_features = packages[0].pkg_features
            if (pkg_features) {
                if (pkg_features.pgp_email) {
                    disablePgp = false
                }
                if (pkg_features.sim_id) {
                    disableSim = false
                }
                if (pkg_features.sim_id2) {
                    disableSim2 = false
                }
                if (pkg_features.chat_id) {
                    disableChat = false
                }
                if (pkg_features.vpn) {
                    disableVpn = false
                }
                this.setState({
                    disablePgp: disablePgp,
                    disableChat: disableChat,
                    disableSim: disableSim,
                    disableSim2: disableSim2,
                    disableVpn: disableVpn,
                })
            }
        }
    }


    componentWillReceiveProps(nextProps) {

        if (this.props !== nextProps) {

            let updateState = {
                tabselect: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? '0' : '1',
                parent_packages: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? this.filterList('trial', nextProps.parent_packages, 'pkg') : this.filterList('1 month', nextProps.parent_packages, 'pkg'),
                product_prices: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? [] : this.filterList('1 month', nextProps.product_prices, 'product'),
            }

            if (nextProps.isloading) {
                updateState.addNewUserModal = true
                // this.setState({ addNewUserModal: true })
            }
            updateState.isloading = nextProps.isloading
            // this.setState({ isloading: nextProps.isloading })
            if (this.props.invoiceID !== nextProps.invoiceID) {
                updateState.invoiceID = nextProps.invoiceID
                // this.setState({ invoiceID: nextProps.invoiceID })
            }
            if (this.props.pgp_added !== nextProps.pgp_added) {
                if (nextProps.pgp_added) {
                    updateState.pgp_email = this.props.pgp_emails[0].pgp_email
                }
            }
            // console.log(this.props.chat_added, nextProps.chat_added);
            if (this.props.chat_added !== nextProps.chat_added) {
                if (nextProps.chat_added) {
                    updateState.chat_id = this.props.chat_ids[0].chat_id
                }
            }
            // console.log(updateState);
            this.setState(updateState)
        }
        // if (!this.state.disablePgp && nextProps.pgp_emails.length) {
        //     this.setState({
        //         pgp_email: nextProps.pgp_emails[0].pgp_email
        //     })
        // }
        // if (!this.state.disableChat && nextProps.chat_ids.length) {
        //     this.setState({
        //         chat_id: nextProps.chat_ids[0].chat_id
        //     })
        // }

    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handleServicesModal = async (e) => {
        if (this.props.device.extended_services) {
            this.setState({
                changeServiceMsg: "You have Applied a Renewal or Extension for this device, please cancel service first before choosing new service.",
                checkServices: { color: "Red" },
            })
        }
        else if (this.props.device.services && this.props.device.services.status === "request_for_cancel") {
            this.setState({
                changeServiceMsg: "This Device is pending cancellation. Please contact Admin.",
                checkServices: { color: "Red" },
            })
        } else {
            if (e === "extend" || e === 'change') {
                let prevService = this.props.device.services
                let creditsToRefund = 0
                let serviceRemainingDays = 0
                let totalDays = 0
                if (prevService) {
                    await RestService.getServiceRefund(prevService.id, prevService.user_acc_id).then((response) => {
                        if (RestService.checkAuth(response.data)) {
                            if (response.data.status) {
                                creditsToRefund = response.data.creditsToRefund
                                serviceRemainingDays = response.data.serviceRemainingDays
                                totalDays = response.data.totalDays
                            }
                            else {
                                return false
                            }
                        }
                    });
                }

                if (creditsToRefund !== null) {
                    this.setState({
                        servicesModal: true,
                        creditsToRefund: creditsToRefund,
                        serviceRemainingDays: serviceRemainingDays,
                        prevService_totalDays: totalDays,
                        applyServicesValue: e
                    })
                }
            } else {
                this.setState({
                    applyServicesValue: e,
                    changeServiceMsg: "You requested to cancel your services.",
                    checkServices: { display: 'inline', color: "Red", margin: 0 },
                })
            }
        }
    }


    handleReset = () => {
        this.props.form.resetFields();
    }

    get_current_date = () => {

        let day = new Date().getDay(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        var current_date = year + '/' + month + '/' + day;
        //
        return current_date;
    }

    confirmRenderList(packages, products, term = this.state ? this.state.term : null, duplicate = this.state ? this.state.duplicate : 1) {
        //
        let counter = 0
        let packagesList = packages.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Package`,
                description: item.pkg_name,
                term: item.pkg_term,
                unit_price: item.pkg_price,
                quantity: 1,
                line_total: item.pkg_price
            }
        });
        let productList = products.map((item, index) => {
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Product`,
                description: item.price_for,
                term: (term === '0') ? "TRIAL" : item.price_term,
                unit_price: item.unit_price,
                quantity: 1,
                line_total: item.unit_price
            }
        });
        return [...packagesList, ...productList]
    }

    refundServiceRenderList(services, serviceRemainingDays, creditsToRefund, prevService_totalDays) {
        if (services) {
            let service_term = ''
            if (services.packages) {
                let packages = JSON.parse(services.packages)
                if (packages.length) {
                    service_term = packages[0].pkg_term
                }
            } else if (services.products) {
                let products = JSON.parse(services.products)
                if (products.length) {
                    service_term = products[0].price_term
                }
            }
            return [{
                counter: 1,
                id: services.id,
                rowKey: 1,
                item: `REFUND`,
                description: "Previous Service Refund",
                term: service_term,
                remaining_term: serviceRemainingDays,
                unit_price: "-" + (services.total_credits / prevService_totalDays).toFixed(2),
                line_total: "-" + creditsToRefund
            }]
        } else {
            return []
        }
    }

    handleCancelForm = () => {
        this.setState({
            visible: false,
            addNewUserModal: false,
            addNewUserValue: '',
            renewService: false
        });
        this.props.resetProductAddProps()
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    filterList = (type, list, listType) => {
        let dummyPackages = [];
        if (list.length) {
            checkIsArray(list).filter(function (item) {
                let packageTerm;
                if (listType === 'pkg') {
                    packageTerm = item.pkg_term
                } else {
                    packageTerm = item.price_term
                }
                if (packageTerm == type) {
                    dummyPackages.push(item);
                }
            });
        }
        return dummyPackages;
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false,
            applyServicesValue: null,
            checkServices: { display: 'none' },
            renewService: false
        });
    }


    handleChangeTab = (value) => {
        //
        switch (value) {
            case '0':
                this.setState({
                    parent_packages: [],
                    product_prices: [],
                    tabselect: '0',
                })
                break;
            case '1':
                this.setState({
                    parent_packages: this.filterList('1 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('1 month', this.props.product_prices, 'product'),
                    tabselect: '1',
                })
                break;
            case '3':
                this.setState({
                    parent_packages: this.filterList('3 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('3 month', this.props.product_prices, 'product'),
                    tabselect: '3',
                })
                break;
            case '6':
                this.setState({
                    parent_packages: this.filterList('6 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('6 month', this.props.product_prices, 'product'),
                    tabselect: '6',
                })
                break;
            case '12':
                this.setState({
                    parent_packages: this.filterList('12 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('12 month', this.props.product_prices, 'product'),
                    tabselect: '12',
                })
                break;

            default:
                this.setState({
                    parent_packages: [],
                    product_prices: [],
                    tabselect: '0',
                })
                break;
        }
    }

    handleServicesSubmit = (products, packages, term) => {
        let disableChat = true;
        let disablePgp = true;
        let disableSim = true;
        let disableSim2 = true;
        let vpn = '';
        //
        let packagesData = []
        let productData = []
        let total_price = 0
        if (packages && packages.length) {
            packages.map((item) => {
                let data = {
                    id: item.id,
                    pkg_features: item.pkg_features,
                    pkg_price: item.pkg_price,
                    pkg_dealer_type: item.dealer_type,
                    pkg_name: item.pkg_name,
                    pkg_term: item.pkg_term,
                    retail_price: item.retail_price
                }
                total_price = total_price + Number(item.pkg_price)
                packagesData.push(data)
                let services = item.pkg_features;
                if (services.chat_id) {
                    disableChat = false
                }
                if (services.sim_id) {
                    disableSim = false
                }
                if (services.sim_id2) {

                    disableSim2 = false
                    this.sim_id2_included = true
                    // } else {
                    //     this.sim_id2_included = false
                }

                if (services.pgp_email) {
                    disablePgp = false
                }
                if (services.vpn) {
                    vpn = "1"
                }
                //
            })
        }
        // if (products && products.length) {
        //     products.map((item) => {
        //         let data = {
        //             id: item.id,
        //             price_for: item.item,
        //             unit_price: item.unit_price,
        //             price_term: item.price_term
        //         }
        //         total_price = total_price + Number(item.unit_price)
        //         productData.push(data)
        //         if (item.item == 'chat_id') {
        //             disableChat = false
        //         }
        //         else if (item.item == 'sim_id') {
        //             disableSim = false
        //         }
        //         else if (item.item == 'pgp_email') {
        //             disablePgp = false
        //         }
        //         else if (item.item == 'vpn') {
        //             vpn = "1"
        //         }
        //     })
        // }

        let expiry_date = ''
        if (term === '0') {
            expiry_date = "7 Days";
        } else {
            expiry_date = term + " Months";
        }
        let services = (packages.length > 0 || products.length > 0) ? true : false;


        this.setState({
            pgp_email: (this.state.pgp_email && !disablePgp) ? this.state.pgp_email : (this.props.pgp_emails.length && !disablePgp) ? this.props.pgp_emails[0].pgp_email : '',
            chat_id: (this.state.chat_id && !disableChat) ? this.state.chat_id : (this.props.chat_ids.length && !disableChat) ? this.props.chat_ids[0].chat_id : '',
            sim_id: (this.state.sim_id && !disableSim) ? this.state.sim_id : (this.props.sim_ids.length > 0 && !disableSim) ? this.props.sim_ids[0].sim_id : '',
            sim_id2: (this.state.sim_id2 && !disableSim2) ? this.state.sim_id2 : (!disableSim2) ? (this.props.sim_ids.length > 1) ? this.props.sim_ids[1].sim_id : undefined : undefined,
            vpn: vpn,
            disableSim: disableSim,
            disableSim2: disableSim2,
            disableChat: disableChat,
            disablePgp: disablePgp,
            packages: packagesData,
            products: productData,
            expiry_date: expiry_date,
            services: services,
            checkServices: (services) ? { display: 'inline', color: "Red", margin: 0 } : { display: 'none' },
            changeServiceMsg: (this.state.applyServicesValue === 'extend') ? "You requested to extend your services." : "You requested to change your services.",
            term: term,
            unit_servcies_price: total_price,
            total_price: total_price,
            PkgSelectedRows: packages,
            proSelectedRows: products,
            renewService: false,
            servicesModal: false,
            visible: false,
        })
    }


    submitServicesConfirm(pay_now) {

        this.props.getInvoiceId();
        this.state.serviceData.pay_now = pay_now;

        if (pay_now) {
            if (this.state.serviceData.total_price <= this.props.user_credit || !this.state.serviceData.pay_now) {
                this.setState({ invoiceVisible: true, invoiceType: "pay_now" })
            } else {
                showCreditPurchase(this)
            }
        } else {
            if (this.state.serviceData.term == 0) {
                this.setState({ invoiceVisible: true, invoiceType: "pay_later" })
            } else {
                let after_pay_credits = this.props.user_credit - this.state.serviceData.total_price
                let credits_limit = this.props.credits_limit
                if (credits_limit > after_pay_credits) {
                    showCreditPurchase(this, "Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits.")
                } else {
                    this.setState({ invoiceVisible: true, invoiceType: "pay_later" })
                }
            }
        }
    }

    handleOkInvoice = () => {
        //
        if (this.state.serviceData.total_price <= this.props.user_credit || !this.state.serviceData.pay_now) {
            this.state.serviceData.paid_by_user = this.state.paidByUser
            if (this.state.change_data_plan) {
                delete this.state.serviceData.packages;
                console.log(this.state.serviceData);
                this.props.addDataPlan(this.state.serviceData)
            }
            else if (this.state.renewService || this.state.applyServicesValue === 'extend') {
                this.props.extendServices(this.state.serviceData)
            } else {
                this.props.editDeviceFunc(this.state.serviceData)
            }
            this.props.hideModal();
            this.handleReset();
            this.setState({
                serviceData: {},
                showConfirmCredit: false,
                invoiceVisible: false,
                servicesModal: false,
                change_data_plan: false,
            })
        } else {
            showCreditPurchase(this)
        }

    }

    handleCancelInvoice = () => {
        this.setState({ invoiceVisible: false })
    }

    handlePaidUser = (e) => {
        //
        if (e) {
            this.setState({
                paidByUser: "PAID"
            })
        } else {
            this.setState({
                paidByUser: "UNPAID"
            })
        }
    }

    handleRenewService = () => {
        if (this.props.device.finalStatus !== DEVICE_TRIAL) {
            let packagesData = this.props.device.services ? JSON.parse(this.props.device.services.packages) : []
            let productData = this.props.device.services ? JSON.parse(this.props.device.services.products) : []
            let total_price = 0
            if (packagesData && packagesData.length) {
                packagesData.map((item) => {
                    total_price = total_price + Number(item.pkg_price)
                })
            }
            if (productData && productData.length) {
                productData.map((item) => {
                    total_price = total_price + Number(item.unit_price)
                })
            }
            //

            this.setState({
                packages: packagesData,
                products: productData,
                total_price: total_price,
                visible: false,
                servicesModal: false,
                renewService: true,
                checkServices: { display: 'inline', color: "Red", margin: 0 },
                changeServiceMsg: "You requested to renew current services.",
                PkgSelectedRows: packagesData,
                proSelectedRows: productData,
                expiry_date: this.state.tabselect + " Months"
            })
        }
    }

    disabledDate = (current) => {
        // Can not select days before today and today
        //
        // let expiry_date =
        //
        return ((current && current < moment().endOf('day')) || current > moment(this.props.device.expiry_date).add(1, 'M'))
        // return ;
    }
    validateValidDays = (rule, value, callback) => {
        // console.log(value);
        if (value !== '') {
            if (value % 1 !== 0) {
                callback('Please Enter a Integer Value.');
            }
            else if (value > 30 || value < 1) {
                callback('Range 1-30 Please Enter a valid input.');
            } else {
                callback();
            }
        } else {
            callback();
        }
    }
    handlePGPModal = () => {
        // console.log(this.props.device.pgp_remaining_limit);
        if (this.props.device.pgp_remaining_limit > 0) {
            this.addPGPEmailModal.showModal();
        } else {
            error({
                title: "ERROR: You are not allowed to create new PGP EMAIL. Your Max limit has been exeeded to create PGP EMAILS on this device."
            })
        }
    }

    handleChatID = (e) => {
        let device = this.props.device
        let payload = {
            type: 'chat_id',
            auto_generated: true,
            product_data: {},
            user_acc_id: device.id,
            dealer_id: device.dealer_id
        }
        this.props.addProduct(payload)
    }


    validateICCID = (rule, value, callback, simField) => {
        // console.log(simField);
        if ((value !== undefined) && value.length > 0) {
            if (simField === 'sim_id') {
                this.setState({
                    valid_sim_id_1: false,
                    valid_toActivate_sim_id_1: false
                })
            } else if (simField === 'sim_id2') {
                this.setState({
                    valid_sim_id_2: false,
                    valid_toActivate_sim_id_2: false
                })
            }
            console.log("validation: ", ((this.state.disableSim === false && this.state.valid_sim_id_1 === false) || (this.state.disableSim2 === false && this.state.valid_sim_id_2 === false)), this.state.valid_sim_id_1, this.state.valid_sim_id_2)
            if (/^[0-9]+$/.test(value)) {
                if (value.length != 20 && value.length != 19) {
                    return callback(`${convertToLang(this.props.translation[''], "ICC ID should be 19 or 20 digits long")}  :(${value.length})`);
                }
                else {
                    if (simField === 'sim_id') {
                        this.setState({
                            valid_toActivate_sim_id_1: true
                        })
                    } else if (simField === 'sim_id2') {
                        this.setState({
                            valid_toActivate_sim_id_2: true
                        })
                    }
                }
            } else {
                return callback(convertToLang(this.props.translation[''], "Please insert only numbers"));
            }
        } else {
            if (simField === 'sim_id') {
                this.setState({
                    valid_sim_id_1: true
                })
            } else if (simField === 'sim_id2') {
                this.setState({
                    valid_sim_id_2: true
                })
            }
        }



        return callback();
    }

    activateICCID = (simField) => {
        let value = this.props.form.getFieldValue(simField);
        if (value) {
            RestService.activateICCID(value, this.props.device.id).then((response) => {
                if (response.data) {
                    if (response.data.valid) {
                        if (simField === 'sim_id') {
                            this.setState({
                                valid_sim_id_1: true
                            })
                        } else if (simField === 'sim_id2') {
                            this.setState({
                                valid_sim_id_2: true
                            })
                        }
                        success({
                            title: response.data.msg
                        })
                    } else {
                        error({
                            title: response.data.msg
                        })
                    }
                }
                // should be logged out
                else {

                }
            });
        } else {
            this.props.form.setFields({
                [simField]: {
                    errors: [new Error('Please enter sim id to activate.')],
                },
            });
        }
    }

    renderDataLimitOptions = () => {

        let data_plan_term = this.state.term ? this.state.term : this.props.device.expiry_months
        // console.log(this.props.device.expiry_months);
        // console.log(this.props.device.expiry_months);
        return this.props.parent_packages.map((packageItem) => {
            // console.log(packageItem.pkg_term, this.state.term + ' month', packageItem.pkg_term == (this.state.term + ' month'))
            if (packageItem.package_type === 'data_plan' && packageItem.pkg_term == (data_plan_term + ' month')) {
                return <Select.Option key={packageItem.id} value={packageItem.id} >{packageItem.pkg_name}</Select.Option>
            }
        })
    }

    changeDataLimit = (type, value) => {
        if (value) {
            let data_plan = this.props.parent_packages.find(item => item.id == value)
            if (type === 'data_limit_1') {
                let disable_data_plan_sim1 = false
                if ((!this.state.disableSim && this.state.services)) {
                    disable_data_plan_sim1 = true
                }
                // else if ((this.props.device.sim_id2_data_plan && JSON.parse(this.props.device.sim_id_data_plan.data_plan_package).id !== value)) {
                //     disable_data_plan_sim1 = false
                // }
                this.setState({
                    data_limit_1: data_plan ? data_plan : '',
                    disable_data_plan_sim1: disable_data_plan_sim1
                })
                this.data_plan_1_added = false
            } else if (type === 'data_limit_2') {
                let disable_data_plan_sim2 = false
                if ((!this.state.disableSim2 && this.state.services)) {
                    disable_data_plan_sim2 = true
                }
                this.setState({
                    data_limit_2: data_plan ? data_plan : '',
                    disable_data_plan_sim2: disable_data_plan_sim2
                })
                this.data_plan_2_added = false
            }
        } else {
            if (type === 'data_limit_1') {
                this.setState({
                    data_limit_1: '',
                    disable_data_plan_sim1: true
                })
            } else if (type === 'data_limit_2') {
                this.setState({
                    data_limit_2: '',
                    disable_data_plan_sim2: true
                })
            }
        }
    }


    addDataPlan(type) {
        let data_plan = null
        if (type == 'sim_id') {
            data_plan = this.state.data_limit_1
        } else if (type == 'sim_id2') {
            data_plan = this.state.data_limit_2
        }
        confirmDataPlanChange(this, type, data_plan)
    }


    onChangeAdjustExpiry = (value, dateString) => {
        // console.log(dateString);
        // console.log(value);
        // console.log(moment(value._d.toString()).format('YYYY/MM/DD'));
        // console.log(moment.tz(value._d, "America/Toronto").format());
        // console.log(moment(moment.tz(value._d, "America/Toronto").format()).format("YYYY/MM/DD"));
    }

    render() {
        //
        const { users_list, device } = this.props;
        // console.log(device);
        return (
            <div>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h3 className="edit_dev_title">
                            <div> {convertToLang(this.props.translation[DEVICE_EDIT], "Edit Device")}
                                {/* <br />
                                <span> {convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID")}: {this.props.device.device_id} </span> */}
                            </div>
                        </h3>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10} xl={10} className="text-right">
                        <p>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    {/*   <p className="mb-4">(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    {
                        (this.props.device.extended_services) ?
                            <div style={{ color: 'red', textAlign: 'center', margin: 15 }}>
                                <span>{convertToLang(this.props.translation[DUMY_TRANS_ID], "*You need to cancel your extended services to use apply service function.")}</span>
                            </div>
                            : null
                    } */}
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="p-0">

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={(this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION) ? convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID") : null}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('device_id', {
                                        initialValue: this.props.device.device_id,
                                    })(

                                        <Input type={(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? 'hidden' : ''} disabled />
                                    )}
                                </Form.Item>
                            </Col>

                            {/* {(isloading ?

                                <div className="addUserSpin">
                                    <Spin />
                                </div>
                                :
                                // (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? null :
                                <Fragment>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >


                                        {this.props.form.getFieldDecorator('user_id', {
                                            initialValue: this.state.addNewUserModal ? lastObject.user_id : this.props.device.user_id,

                                            // rules: [
                                            //     (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? {} :
                                            //         {
                                            //             required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], "User ID is Required !"),
                                            //         }
                                            // ]
                                        })(
                                            <Select
                                                className="pos_rel"
                                                setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                                showSearch
                                                disabled
                                                // disabled={(this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? true : false}
                                                placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                                optionFilterProp="children"
                                                onChange={this.handleUserChange}
                                                filterOption={
                                                    (input, option) => {
                                                        //
                                                        // return null;
                                                        return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                                    }
                                                }
                                                disabled={true}
                                            >
                                                <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                                {users_list.map((item, index) => {
                                                    return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                                })}
                                            </Select>
                                        )}
                                        {(this.props.user.type === ADMIN || (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1')) ? null :
                                            <Button
                                                className="add_user_btn"
                                                type="primary"
                                                onClick={() => this.handleUserModal()}
                                            >
                                                {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                            </Button>
                                        }

                                    </Form.Item>

                                </Fragment>
                            )} */}

                            < Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('dealer_id', {
                                    initialValue: this.props.device.dealer_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            < Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.props.device.user_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_device_id', {
                                    initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_acc_id', {
                                    initialValue: this.props.new ? "" : this.props.device.id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            {(this.props.user.type === ADMIN) ? null :
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={<Markup content={convertToLang(this.props.translation[''], "APPLY <br />SERVICES")} />}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        className="apply_services"
                                    >
                                        {this.props.form.getFieldDecorator('service', {
                                            // initialValue: this.state.applyServicesValue
                                        })(
                                            <Fragment>
                                                <Select
                                                    placeholder={convertToLang(this.props.translation[""], " ")}
                                                    optionFilterProp="children"
                                                    onChange={(e) => this.handleServicesModal(e)}
                                                    value={this.state.applyServicesValue}
                                                // className="apply_services"
                                                // disabled={(this.props.device.extended_services) ? true : false}
                                                >
                                                    {(this.props.device.services && this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION && this.props.device.services.is_temp == 0) ?

                                                        <Select.Option value="extend">{convertToLang(this.props.translation[DUMY_TRANS_ID], "EXTEND SERVICES")}</Select.Option>
                                                        : null}
                                                    <Select.Option value="change">{convertToLang(this.props.translation[DUMY_TRANS_ID], "CHANGE SERVICES")}</Select.Option>
                                                    {(this.props.device.services && this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION && this.props.device.finalStatus !== DEVICE_EXPIRED && this.props.device.services.is_temp == 0) ?
                                                        <Select.Option value="cancel">{convertToLang(this.props.translation[DUMY_TRANS_ID], "CANCEL SERVICES")}</Select.Option>
                                                        : null}
                                                </Select>
                                                <span style={this.state.checkServices}>{this.state.changeServiceMsg}</span>

                                            </Fragment>
                                        )}
                                    </Form.Item>
                                </Col>
                            }
                            {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? null :
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[Model_text], "Model")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('model', {
                                            initialValue: checkValue(this.props.device.model),
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            }
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[Start_Date], "Start Date ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('start_date', {
                                        initialValue: (this.props.device.start_date) ? this.props.device.start_date : this.createdDate()
                                    })(

                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>
                            {this.props.user.type === ADMIN && this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[""], <span>Adjust <br className="disp_n_768" /> Date Expiry</span>)}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        className="apply_services"
                                    >
                                        {this.props.form.getFieldDecorator('expiry_date', {
                                            initialValue: moment(this.state.expiry_date, 'YYYY/MM/DD hh:mm:ss'),
                                            // rules: [{
                                            //     required: true, message: convertToLang(this.props.translation[Expire_Date_Require], "Expiry Date is Required ! "),
                                            // }],
                                        })(
                                            <DatePicker onChange={this.onChangeAdjustExpiry} style={{ width: '100%' }} disabledDate={this.disabledDate} format={'YYYY/MM/DD'} disabled={(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION)} />
                                        )}

                                    </Form.Item>
                                </Col>
                                :
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[Expire_Date], "Extend Expire Date")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('expiry_date', {
                                            initialValue: this.state.expiry_date,
                                            // rules: [{
                                            //     required: true, message: convertToLang(this.props.translation[Expire_Date_Require], "Expiry Date is Required ! "),
                                            // }],
                                        })(
                                            <Input disabled />
                                        )}

                                    </Form.Item>
                                </Col>
                            }
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[Device_Note], "Note ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('note', {
                                        initialValue: this.props.device.note,
                                    })(
                                        <TextArea
                                            autosize={{ minRows: 3, maxRows: 5 }}
                                        />
                                    )}

                                </Form.Item>
                            </Col>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="p-0">

                            {/**
                             * @author Usman Hafeez
                             * @description added button of PGP Email
                             */}

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button
                                    disabled={this.state.disablePgp}
                                    className="add_user_btn"
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={() => this.handlePGPModal()}
                                    style={{ width: "100%" }}
                                >Add PGP Email</Button>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('pgp_email', {
                                        initialValue: this.state.pgp_email,
                                        rules: [{
                                            type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                                        }],
                                    })(
                                        <Select
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}
                                            optionFilterProp="children"
                                            onChange={(e) => this.setState({ pgp_email: e })}
                                            autoComplete="new-password"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            disabled={this.state.disablePgp}
                                        >
                                            {this.props.pgp_emails.map((pgp_email) => {
                                                if (this.props.device.pgp_email == pgp_email.pgp_email) {
                                                    return (
                                                        <Select.Option key={pgp_email.id} value={pgp_email.pgp_email.trim()}>
                                                            {`${pgp_email.pgp_email.trim()} (Current)`}
                                                        </Select.Option>
                                                    )
                                                }
                                                return (
                                                    <Select.Option key={pgp_email.id} value={pgp_email.pgp_email.trim()}>
                                                        {pgp_email.pgp_email.trim()}
                                                    </Select.Option>
                                                )
                                            })}
                                        </Select>
                                        // <Input />
                                    )}
                                </Form.Item>
                            </Col>

                            {/**
                             * @author Usman Hafeez
                             * @description added button of Chat ID
                             */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button
                                    disabled={this.state.disableChat}
                                    className="add_user_btn"
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={this.handleChatID}
                                    style={{ width: "100%" }}
                                >Generate Chat ID</Button>
                            </Col>

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "Chat ID ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('chat_id', {
                                        initialValue: this.state.chat_id,
                                    })(
                                        // <Input />
                                        <Select
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select Chat ID")}
                                            optionFilterProp="children"
                                            onChange={(value) => this.setState({ chat_id: value })}
                                            // onFocus={handleFocus}
                                            // onBlur={handleBlur}
                                            filterOption={(input, option) => {
                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }}
                                            disabled={this.state.disableChat}
                                        >
                                            {checkIsArray(this.props.chat_ids).map((chat_id, index) => {

                                                if (this.props.device.chat_id == chat_id.chat_id) {
                                                    return (<Select.Option key={index} value={chat_id.chat_id}>{`${chat_id.chat_id} (Current)`}</Select.Option>)
                                                }
                                                return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            {/**
                             * @author Usman Hafeez
                             * @description added button of Chat ID
                             */}
                            {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Button
                                    disabled={true}
                                    className="add_user_btn"
                                    type="primary"
                                    style={{ width: "100%" }}
                                    onClick={this.handleChatID}
                                    style={{ width: "100%" }}
                                >ADD SIM ID</Button>
                            </Col> */}

                            {/* Sim ID Input */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "Sim ID ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('sim_id', {
                                        initialValue: this.state.sim_id,
                                        rules: [
                                            // {
                                            //     required: true, message: "SIM ID is required"
                                            // },
                                            {
                                                validator: (rule, value, callback) => { this.validateICCID(rule, value, callback, 'sim_id') },
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Enter Sim ID")}
                                            disabled={this.state.disableSim}
                                        // onChange={(value) => this.setState({ sim_id: value })}
                                        />
                                        // <Select
                                        //     // className="pos_rel"
                                        //     showSearch
                                        //     placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select Sim ID ")}
                                        //     optionFilterProp="children"
                                        //     onChange={(value) => this.setState({ sim_id: value })}
                                        //     // onFocus={handleFocus}
                                        //     // onBlur={handleBlur}
                                        //     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        //     disabled={this.state.disableSim}
                                        // >
                                        //     {this.props.sim_ids.map((sim_id, index) => {
                                        //         return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                        //     })}
                                        // </Select>
                                    )}
                                </Form.Item>
                            </Col>


                            {/**
                             * @author Usman Hafeez
                             * @description Add SIM ID button
                             */}
                            {(this.state.valid_toActivate_sim_id_1)
                                ?

                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        // label={''}
                                        labelCol={{ span: 0 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <Button
                                            className="add_user_btn"
                                            type="primary"
                                            style={{ width: "100%" }}
                                            onClick={this.handleChatID}
                                            style={{ width: "100%" }}
                                            // disabled={this.state.disableSim || this.state.valid_sim_id_1}
                                            disabled={this.state.disableSim}
                                            onClick={(e) => { this.activateICCID('sim_id') }}
                                        >
                                            {convertToLang(this.props.translation[''], "Activate Sim ID")}
                                        </Button>
                                    </Form.Item>
                                </Col>
                                : null
                            }

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                {(!this.state.disableSim) ?
                                    (this.state.services) ?
                                        <div style={{ color: 'red', textAlign: "center" }}>Basic Data Limit for SIM ID is 2 GB</div>
                                        :
                                        (device.sim_id_data_plan) ?
                                            <div style={{ color: 'red', textAlign: "center" }}>Current Data Limit for SIM ID is {device.sim_id_data_plan.total_data / 1000} GB</div>
                                            : null
                                    : null
                                }
                                {(this.props.user.type == ADMIN) ? null :
                                    <Form.Item
                                        label={<Markup content={convertToLang(this.props.translation[''], "ADD DATA <br />(SIM ID 1)")} />}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        className="apply_services"
                                    >
                                        {this.props.form.getFieldDecorator('data_limit_1', {
                                            initialValue: '',
                                            // rules: [
                                            //     // {
                                            //     //     required: true, message: "SIM ID is required"
                                            //     // },
                                            //     {
                                            //         validator: (rule, value, callback) => { this.validateICCID(rule, value, callback, 'sim_id') },
                                            //     }
                                            // ]
                                        })(

                                            <Select
                                                placeholder="SELECT SIM DATA PLAN FOR SIM ID 1"

                                                disabled={this.state.disableSim}
                                                onChange={(value) => {
                                                    this.changeDataLimit('data_limit_1', value)
                                                }}
                                            >
                                                <Select.Option key={""} value="" >SELECT DATA PLAN</Select.Option>
                                                {this.renderDataLimitOptions()}

                                            </Select>
                                        )}
                                    </Form.Item>
                                }
                            </Col>
                            {((!this.state.services && !this.state.disable_data_plan_sim1)) ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Button
                                        disabled={this.state.disable_data_plan_sim1}
                                        className="add_user_btn"
                                        type="primary"
                                        style={{ width: "100%" }}
                                        onClick={() => {
                                            this.addDataPlan('sim_id')
                                        }}
                                        style={{ width: "100%" }}
                                    >Add Data Plan SIM ID 1</Button>
                                </Col>
                                : null
                            }

                            {/* Sim ID 2 Input */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Sim ID 2 ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('sim_id2', {
                                        initialValue: this.state.sim_id2,
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => { this.validateICCID(rule, value, callback, 'sim_id2') },
                                            }
                                        ]
                                    })(
                                        <Input
                                            placeholder={convertToLang(this.props.translation[''], "Enter Sim ID 2")}
                                            disabled={this.state.disableSim2}
                                        // onChange={(value) => this.setState({sim_id2: value})}
                                        />
                                        // <Select
                                        //     // className="pos_rel"
                                        //     showSearch
                                        //     placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Select Sim ID 2")}
                                        //     optionFilterProp="children"
                                        //     onChange={(value) => this.setState({ sim_id2: value })}
                                        //     // onFocus={handleFocus}
                                        //     // onBlur={handleBlur}
                                        //     filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        //     disabled={this.state.disableSim2}
                                        // >
                                        //     <Select.Option value=""> {convertToLang(this.props.translation[DUMY_TRANS_ID], "Select Sim ID 2")}</Select.Option>
                                        //     {this.props.sim_ids.map((sim_id, index) => {
                                        //         if (index > 0) {

                                        //             return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                        //         }
                                        //     })}
                                        // </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            {/**
                             * @author Usman Hafeez
                             * @description Add SIM ID 2 button
                             */}
                            {(this.state.valid_toActivate_sim_id_2)
                                ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        // label={''}
                                        labelCol={{ span: 0 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <Button
                                            className="add_user_btn"
                                            type="primary"
                                            style={{ width: "100%" }}
                                            onClick={this.handleChatID}
                                            style={{ width: "100%" }}
                                            disabled={this.state.disableSim2}
                                            onClick={(e) => { this.activateICCID('sim_id2') }}

                                        >
                                            {convertToLang(this.props.translation[''], "Activate Sim ID 2")}
                                        </Button>
                                    </Form.Item>
                                </Col>
                                : null
                            }
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                {(!this.state.disableSim2) ?
                                    (this.state.services) ?
                                        <div style={{ color: 'red', textAlign: "center" }}>Basic Data Limit for SIM ID 2 is 2 GB</div>
                                        :
                                        (device.sim_id2_data_plan) ?
                                            <div style={{ color: 'red', textAlign: "center" }}>Current Data Limit for SIM ID 2 is {device.sim_id2_data_plan.total_data / 1000} GB</div>
                                            : null
                                    : null
                                }
                                {(this.props.user.type == ADMIN) ? null :
                                    <Form.Item
                                        label={<Markup content={convertToLang(this.props.translation[''], "ADD DATA <br />(SIM ID 2)")} />}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        className="apply_services"

                                    >
                                        {this.props.form.getFieldDecorator('data_limit_2', {
                                            initialValue: '',
                                            // rules: [
                                            //     // {
                                            //     //     required: true, message: "SIM ID is required"
                                            //     // },
                                            //     {
                                            //         validator: (rule, value, callback) => { this.validateICCID(rule, value, callback, 'sim_id') },
                                            //     }
                                            // ]
                                        })(

                                            <Select
                                                placeholder="SELECT SIM DATA PLAN FOR SIM ID 2"

                                                disabled={this.state.disableSim2}
                                                onChange={(value) => {
                                                    this.changeDataLimit('data_limit_2', value)
                                                }}
                                            >
                                                <Select.Option key={""} value="" >SELECT DATA PLAN</Select.Option>
                                                {this.renderDataLimitOptions()}

                                            </Select>
                                        )}
                                    </Form.Item>
                                }
                            </Col>
                            {((!this.state.services && !this.state.disable_data_plan_sim2)) ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Button
                                        disabled={this.state.disable_data_plan_sim2}
                                        className="add_user_btn"
                                        type="primary"
                                        style={{ width: "100%" }}
                                        onClick={() => {
                                            this.addDataPlan('sim_id2')
                                        }}
                                        style={{ width: "100%" }}
                                    >Add Data Plan SIM ID 2</Button>
                                </Col>
                                : null
                            }
                            {/* VPN Input */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[DUMY_TRANS_ID], "VPN")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('vpn', {
                                        initialValue: this.props.device.vpn
                                    })(
                                        <Select
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN")}
                                            optionFilterProp="children"
                                            onChange={(value) => this.setState({ vpn: value })}

                                            disabled={this.state.disableVpn}
                                        >
                                            <Select.Option value="">{convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN ")}</Select.Option>
                                            <Select.Option value="1">{convertToLang(this.props.translation[DUMY_TRANS_ID], "YES")}</Select.Option>
                                            <Select.Option value="0">{convertToLang(this.props.translation[DUMY_TRANS_ID], "NO")}</Select.Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Client ID Input */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Client ID ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('client_id', {
                                        initialValue: this.props.device.client_id,

                                    })(
                                        <Input
                                            onChange={e => {
                                                this.setState({ client_id: e.target.value });
                                            }} />
                                    )}
                                </Form.Item>
                            </Col>

                            {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ?
                                <Fragment>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS)  ")}
                                            labelCol={{ span: 12 }}
                                            wrapperCol={{ span: 12 }}
                                            className="val_days"
                                        >
                                            {this.props.form.getFieldDecorator('validity', {
                                                initialValue: this.props.device.validity,
                                                rules: [{
                                                    required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required "),
                                                },
                                                {
                                                    validator: this.validateValidDays
                                                }
                                                ],
                                            })(
                                                <InputNumber min={1} />
                                            )}

                                        </Form.Item>
                                    </Col>
                                </Fragment>
                                :
                                null
                            }

                            {/* section 3 */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="text-right">
                                <Form.Item className="edit_ftr_btn11"
                                    wrapperCol={{
                                        xs: { span: 24, offset: 0 },
                                        sm: { span: 24, offset: 0 },
                                    }}
                                >
                                    <Button key="back" type="button" onClick={() => { this.props.handleCancel(); this.handleCancelForm() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        disabled={((this.state.disableSim === false && this.state.valid_sim_id_1 === false) || (this.state.disableSim2 === false && this.state.valid_sim_id_2 === false)) ? true : false}

                                    >{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                                </Form.Item>
                            </Col>
                        </Col>
                    </Row>
                </Form>

                {/**
                 * @section AddUserModal
                 */}
                <AddUser ref="add_user" translation={this.props.translation} />

                {/**
                 * @author Usman Hafeez
                 * @description from here pgp email will be generated
                 */}

                <AddPGPEmailModal
                    ref="addPGPEmailModal"
                    translation={this.props.translation}
                    wrappedComponentRef={(form) => this.addPGPEmailModal = form}
                    device={this.props.device}
                    // actions
                    getDomains={this.props.getDomains}
                    addProduct={this.props.addProduct}
                    // data
                    domainList={this.props.domainList}

                />

                {/**
                 *
                 * @section ServicesModal
                 *  */}
                <Modal
                    width={750}
                    visible={this.state.servicesModal}
                    title={convertToLang(this.props.translation[DUMY_TRANS_ID], this.state.applyServicesValue ? this.state.applyServicesValue.toUpperCase() + " SERVICES" : "")}
                    maskClosable={false}
                    onOk={this.handleOk}
                    closable={false}
                    // onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    bodyStyle={{ height: '440px', overflow: 'overlay' }}
                >
                    <Services
                        handleCancel={this.handleCancel}
                        parent_packages={this.state.parent_packages}
                        product_prices={this.state.product_prices}
                        tabselect={this.state.tabselect}
                        handleChangeTab={this.handleChangeTab}
                        translation={this.props.translation}
                        handleServicesSubmit={this.handleServicesSubmit}
                        user_credit={this.props.user_credit}
                        history={this.props.history}
                        current_services={this.props.device.services}
                        creditsToRefund={this.state.creditsToRefund}
                        type={"edit"}
                        device={this.props.device}
                        applyServicesValue={this.state.applyServicesValue}
                        handleRenewService={this.handleRenewService}
                    />
                </Modal>

                {/**
                 *
                 * @section ServicesDetailsModal
                 *  */}
                <Modal
                    width={900}
                    visible={this.state.showConfirmCredit}
                    title={<span style={{ fontWeight: "bold" }}> {convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICE CHANGE DETAILS")} </span>}
                    maskClosable={false}
                    // onOk={this.handleOk}
                    closable={false}
                    onCancel={
                        () => {
                            this.setState({
                                showConfirmCredit: false
                            })
                        }
                    }
                    footer={null}
                    className="edit_form"
                >
                    <Fragment>

                        {(this.state.renewService || this.state.applyServicesValue === 'extend') ? null :
                            <div style={{ marginTop: 20 }}>
                                {/* <h4 style={{ textAlign: "center" }}><b>CURRENT SERVICES</b></h4> */}
                                <h4>REFUND APPLIED ON EXISTING SERVICE</h4>
                                <Table
                                    id='packages'
                                    className={"devices mb-20"}
                                    // rowSelection={packageRowSelection}
                                    size="middle"
                                    bordered
                                    columns={this.state.refundServicesColumns}
                                    dataSource={this.refundServiceRenderList(this.props.device.services, this.state.serviceRemainingDays, this.state.creditsToRefund, this.state.prevService_totalDays)}
                                    pagination={
                                        false
                                    }
                                />
                                {/* <h5 style={{ textAlign: "right" }}>Remaining days of services : {this.state.serviceRemainingDays}</h5> */}
                                <h5 style={{ textAlign: "right" }}><b>TOTAL REFUND CREDITS :  -{this.state.creditsToRefund} Credits </b></h5>
                            </div >
                        }

                        <div style={{ marginTop: 20 }}>
                            {(this.state.renewService && this.state.applyServicesValue === 'extend') ? <h4><b>RENEW SERVICES</b></h4>
                                : <h4><b>NEW SERVICES</b></h4>}
                            <Table
                                id='packages'
                                className={"devices mb-20"}
                                // rowSelection={packageRowSelection}
                                size="middle"
                                bordered
                                columns={this.state.invoiceColumns}
                                dataSource={this.confirmRenderList(this.state.PkgSelectedRows, this.state.proSelectedRows)}
                                pagination={
                                    false
                                }
                            />
                        </div >
                        <div>
                            <h5 style={{ textAlign: "right" }}>Sub Total :  {this.state.total_price} Credits</h5>
                            {(this.state.renewService || this.state.applyServicesValue === 'extend') ? null :
                                <h5 style={{ textAlign: "right" }}>REFUND :  -{this.state.creditsToRefund} Credits</h5>
                            }
                            <h5 style={{ textAlign: "right" }}><b>TOTAL :  {this.state.serviceData.total_price} Credits</b></h5>
                            {/* <h4 style={{ textAlign: "center" }}><b>There will be a charge of {this.state.serviceData.total_price} Credits</b></h4> */}
                        </div>
                        <div className="edit_ftr_btn" >
                            <Button onClick={() => { this.setState({ showConfirmCredit: false }) }}>CANCEL</Button>
                            {this.state.serviceData.expiry_date == 0 ? <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PROCEED</Button> :
                                <Fragment>
                                    {(this.props.user_credit < this.state.serviceData.total_price && this.props.user.account_balance_status === 'active') ?
                                        <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PAY LATER</Button>
                                        : null
                                    }
                                    <Button style={{ backgroundColor: "green", color: "white" }} onClick={() => { this.submitServicesConfirm(true) }}>PAY NOW (-3%)</Button>
                                </Fragment>
                            }
                        </div >
                    </Fragment>
                </Modal>

                {/**
                 *
                 * @section InvoiceModal
                 *  */}
                <Modal
                    width="850px"
                    visible={this.state.invoiceVisible}
                    maskClosable={false}
                    closable={false}
                    // title={convertToLang(this.props.translation[""], "MDM PANEL SERVICES")}
                    onOk={this.handleOkInvoice}
                    onCancel={this.handleCancelInvoice}
                    className="edit_form"
                    bodyStyle={{ overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[""], "CHECKOUT")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Invoice
                        PkgSelectedRows={this.state.PkgSelectedRows}
                        proSelectedRows={this.state.proSelectedRows}
                        renderInvoiceList={this.confirmRenderList}
                        subTotal={this.state.total_price}
                        total={this.state.serviceData.total_price}
                        invoiceType={this.state.invoiceType}
                        term={this.state.term}
                        duplicate={1}
                        deviceAction={"Edit"}
                        renewService={this.state.renewService}
                        device_id={this.props.device.device_id}
                        user_id={this.props.device.user_id}
                        invoiceID={this.state.invoiceID}
                        currentPakages={this.props.device.services}
                        serviceRemainingDays={this.state.serviceRemainingDays}
                        creditsToRefund={this.state.creditsToRefund}
                        translation={this.props.translation}
                        refundServiceRenderList={this.refundServiceRenderList}
                        prevService_totalDays={this.state.prevService_totalDays}
                        applyServicesValue={this.state.applyServicesValue}
                    />
                    <div style={{ float: "right" }}><b>PAID BY USER: </b> <Switch size="small" defaultChecked onChange={this.handlePaidUser} /></div>
                </Modal>
            </div >

        )

    }
}

const WrappedEditDeviceForm = Form.create({ name: 'editDevice' })(EditDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        getUserList: getUserList,
        addUser: addUser,
        getParentPackages: getParentPackages,
        getProductPrices: getProductPrices,
        getInvoiceId: getInvoiceId,
        extendServices: extendServices,
        getDomains: getDomains,
        addProduct: addProduct,
        addDataPlan: addDataPlan,
        resetProductAddProps: resetProductAddProps

    }, dispatch);
}
var mapStateToProps = ({ routing, devices, users, auth, settings, sidebar, account }) => {
    //
    // console.log(devices.pgp_emails);
    return {
        invoiceID: users.invoiceID,
        user: auth.authUser,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        pgp_added: devices.pgp_added,
        chat_added: devices.chat_added,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation,
        parent_packages: devices.parent_packages,
        product_prices: devices.product_prices,
        user_credit: sidebar.user_credit,
        credits_limit: sidebar.credits_limit,
        domainList: account.domainList,
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedEditDeviceForm);

function showCreditPurchase(_this) {
    confirm({
        title: "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.",
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {
        },
    })
}

function showCancelServiceConfirm(_this, values) {
    confirm({
        title: <span>Are you sure you want to cancel services on this device?  <br /> This action cannot be reversed.</span>,
        okText: "PROCEED WITH CANCELLATION",
        onOk() {
            _this.props.editDeviceFunc(values);
            _this.props.hideModal();
            _this.handleReset();
        },
        onCancel() {
        },
    })
}

function confirmDataPlanChange(_this, type, data_plan) {
    let data_plan_id = data_plan.id
    let sim_type = "sim id 1"
    if (type === 'sim_id2') {
        sim_type = "sim id 2"
    }
    confirm({
        title: "Are you sure you want to add data plan on " + sim_type + " ?",
        okText: "PROCEED WITH ADD DATA PLAN",
        onOk() {
            let values = {}
            values.packages = [data_plan];
            values.total_price = data_plan.pkg_price
            values.renewService = true
            values.usr_acc_id = _this.props.device.id
            values.usr_device_id = _this.props.device.usr_device_id
            values.user_id = _this.props.device.user_id
            values.device_id = _this.props.device.device_id
            values.data_plan_package_id = data_plan_id
            values.sim_type = type
            _this.setState({
                serviceData: values,
                showConfirmCredit: true,
                renewService: true,
                total_price: values.total_price,
                PkgSelectedRows: [data_plan],
                change_data_plan: true
            })
        }
    })
}
