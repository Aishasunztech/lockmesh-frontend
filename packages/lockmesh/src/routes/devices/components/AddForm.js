// Libraries
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import Picky from 'react-picky';
import { Markup } from 'interweave';
import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon, Row, Col, Spin, Table, Checkbox, Switch } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';
import moment from 'moment';

// components
import AddUser from '../../users/components/AddUser';
import Services from './Services';
import AddSimPermission from './AddSimPermission';
import Invoice from './invoice';
import AddPGPEmailModal from './AddPGPEmailModal';

// helpers
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { inventorySales } from '../../utils/columnsUtils';
import RestService from '../../../appRedux/services/RestServices'

// actions
import {
    getSimIDs,
    getChatIDs,
    getPGPEmails,
    getParentPackages,
    getProductPrices,
    getHardwaresPrices,
    addUser,
    getUserList,
    getInvoiceId,
    getPolicies,
    getDomains,
    addProduct,
    resetIds
} from "../../../appRedux/actions";

// constants
import { Button_Cancel, Button_submit, Button_Add_User, Button_Add_Device } from '../../../constants/ButtonConstants';
import { LABEL_DATA_PGP_EMAIL, LABEL_DATA_SIM_ID, LABEL_DATA_CHAT_ID, DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { SINGLE_DEVICE, DUPLICATE_DEVICES, Required_Fields, USER_ID, DEVICE_ID, USER_ID_IS_REQUIRED, SELECT_PGP_EMAILS, DEVICE_Select_CHAT_ID, SELECT_USER_ID, DEVICE_CLIENT_ID, DEVICE_Select_SIM_ID, DEVICE_MODE, DEVICE_MODEL, Device_Note, Device_Valid_For, Device_Valid_days_Required, DUPLICATE_DEVICES_REQUIRED, DEVICE_IMEI_1, DEVICE_SIM_1, DEVICE_IMEI_2, DEVICE_SIM_2, DUPLICATE_DEVICES_HELPING_TEXT } from '../../../constants/DeviceConstants';
import { Not_valid_Email, POLICY, Start_Date, Expire_Date, Expire_Date_Require, SELECT_POLICY, ADMIN } from '../../../constants/Constants';
import { DEALER_PIN } from '../../../constants/DealerConstants';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error;

const { TextArea } = Input;
class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.sim_id2_added = false;
        this.data_plan_1_added = false;
        this.data_plan_2_added = false;
        this.hardware_added = false;
        this.sim_id2_included = false;
        const invoiceColumns = inventorySales(props.translation);


        this.state = {
            visible: false,
            invoiceVisible: false,
            invoiceType: '',
            type: 0,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
            client_id: '',
            pgp_email: '',
            chat_id: '',
            sim_id: '',
            sim_id2: undefined,
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableSim2: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            servicesModal: false,
            tabselect: '0',
            parent_packages: [],
            product_prices: [],
            products: [],
            packages: [],
            expiry_date: '',
            services: false,
            checkServices: {
                display: 'none',
            },
            term: '',
            unit_servcies_price: 0,
            total_price: 0,
            invoiceColumns: invoiceColumns,
            PkgSelectedRows: [],
            proSelectedRows: [],
            duplicate: 0,
            showConfirmCredit: false,
            serviceData: {},
            invoiceID: 'PI00001',
            selectedHardwareValues: [],
            hardwarePrice: 0,
            hardwares: [],
            paidByUser: "PAID",
            valid_sim_id_1: true,
            valid_sim_id_2: true,
            valid_toActivate_sim_id_1: false,
            valid_toActivate_sim_id_2: false,
            data_limit_1: '',
            data_limit_2: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values);
            if (this.state.services) {
                if (!err) {

                    if (this.state.term == 0 && this.props.user.remaining_demos <= 0) {
                        Modal.error({
                            title: "Your Demos Limit has been exceeded, you cannot use Trial Packages. Please Contact with you admin."
                        })
                        return
                    }

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
                                price_for: "SIM ID 2"
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
                    values.products = this.state.products;
                    values.packages = this.state.packages;

                    // console.log("data_limit_1", this.state.data_limit_1, this.state.data_limit_2);

                    if (this.state.data_limit_1 && !this.data_plan_1_added) {
                        this.state.data_limit_1.sim_type = 'sim_id'
                        values.packages.push(this.state.data_limit_1)
                        // values.packages.push(this.state.data_limit_1)
                        this.state.PkgSelectedRows = values.packages;
                        this.state.total_price = this.state.total_price + Number(this.state.data_limit_1.pkg_price)
                        this.data_plan_1_added = true
                    } else if (this.state.data_limit_1 === '') {
                        let index = values.packages.findIndex(item => item.sim_type === 'sim_id')
                        if (index !== -1) {
                            let data_plan_package = values.packages[index]
                            values.packages.splice(index, 1)
                            this.state.PkgSelectedRows = values.packages;
                            this.state.total_price = this.state.total_price - Number(data_plan_package.pkg_price)
                        }
                    }

                    if (this.state.data_limit_2 && !this.data_plan_2_added) {

                        this.state.data_limit_2.sim_type = 'sim_id2'
                        values.packages.push(this.state.data_limit_2)
                        this.state.PkgSelectedRows = values.packages
                        this.state.total_price = this.state.total_price + Number(this.state.data_limit_2.pkg_price)
                        this.data_plan_2_added = true
                    }
                    else if (this.state.data_limit_2 === '') {
                        let index = values.packages.findIndex(item => item.sim_type === 'sim_id2')
                        if (index !== -1) {
                            let data_plan_package = values.packages[index]
                            values.packages.splice(index, 1)
                            this.state.PkgSelectedRows = values.packages;
                            this.state.total_price = this.state.total_price - Number(data_plan_package.pkg_price)
                        }
                    }
                    // let data_limit2 = null;
                    // // console.log(values.data_limit_2)
                    // if (values.data_limit_2) {
                    //     // console.log(this.props.parent_packages)
                    //     data_limit2 = this.props.parent_packages.find((packageItem) => packageItem.id = values.data_limit_2)

                    //     console.log(data_limit2, data_limit)
                    //     if (data_limit2) {
                    //         values.packages.push(data_limit2)
                    //         this.setState(state => {
                    //             const list = state.PkgSelectedRows.push(data_limit2);
                    //             return list;
                    //         });
                    //         this.state.total_price = this.state.total_price + Number(data_limit.pkg_price)
                    //     }
                    // }

                    // values.packages.push()
                    // console.log("On form Submit packages : ", this.state.packages);
                    let data_plans = {
                        sim_id: this.state.data_limit_1 ? this.state.data_limit_1 : '',
                        sim_id2: this.state.data_limit_2 ? this.state.data_limit_2 : '',
                    }
                    values.data_plans = data_plans
                    values.term = this.state.term;
                    values.total_price = this.state.total_price
                    values.hardwarePrice = this.state.duplicate > 0 ? this.state.hardwarePrice * this.state.duplicate : this.state.hardwarePrice
                    values.hardwares = this.state.hardwares

                    this.setState({
                        serviceData: values,
                        showConfirmCredit: true
                    })
                }
            } else {
                this.setState({
                    checkServices: {
                        display: 'inline',
                        color: 'Red',
                        margin: 0
                    }
                })
            }
        });
    }

    componentDidMount() {
        this.props.getUserList();
        if (this.props.user.type !== ADMIN) {
            this.props.getParentPackages();
            this.props.getProductPrices();
            this.props.getHardwaresPrices();
        }
        if (!this.props.preActive) {
            this.props.getPolicies(this.props.device.id, this.props.device.dealer_id);
            this.props.getSimIDs(this.props.device.id, this.props.device.dealer_id);
            this.props.getChatIDs(this.props.device.id, this.props.device.dealer_id);
            this.props.getPGPEmails(this.props.device.id, this.props.device.dealer_id);
            console.log("dasd");
        } else {
            this.props.resetIds()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })

        if (this.props.invoiceID !== nextProps.invoiceID) {
            this.setState({ invoiceID: nextProps.invoiceID })
        }
        if (this.props.parent_packages !== nextProps.parent_packages) {
            this.setState({
                parent_packages: this.filterList('trial', nextProps.parent_packages, 'pkg'),
                tabselect: '0',
            })
        }
        if (!this.state.disablePgp && nextProps.pgp_emails.length) {
            this.setState({
                pgp_email: nextProps.pgp_emails[0].pgp_email
            })
        }
        if (!this.state.disableChat && nextProps.chat_ids.length) {
            this.setState({
                chat_id: nextProps.chat_ids[0].chat_id
            })
        }

    }

    handleReset = () => {

        // this.props.getSimIDs();
        // this.props.getChatIDs();
        // this.props.getPGPEmails();
        // this.props.getUserList();
        this.props.form.resetFields();
    }

    confirmRenderList = (packages, products, hardwares, term = this.state.term, duplicate = this.state.duplicate) => {
        // console.log('state is: ', this.state)
        let counter = 0
        let hardwareList = checkIsArray(hardwares).map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Hardware`,
                description: item.hardware_name,
                term: '---',
                unit_price: item.hardware_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.hardware_price * duplicate : item.hardware_price
            }
        });

        let packagesList = checkIsArray(packages).map((item, index) => {
            // console.log("packages list: ", item);
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.rowKey,
                item: `Package`,
                description: item.pkg_name,
                term: (term === '0' || term === "trial") ? "TRIAL" : term + " Month",
                unit_price: item.pkg_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.pkg_price * duplicate : item.pkg_price
            }
        });
        let productList = checkIsArray(products).map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.rowKey,
                item: `Product`,
                description: item.price_for,
                term: (term === '0') ? "TRIAL" : term + " Month",
                unit_price: item.unit_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.unit_price * duplicate : item.unit_price
            }
        });

        return [...packagesList, ...productList, ...hardwareList]
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false,

        });
    }

    handleChange = (e) => {
        // console.log(e);
        // this.setState({ pgp_email: e });
        this.setState({ type: e.target.value });
    }

    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handlePGPModal = () => {
        this.addPGPEmailModal.showModal();
    }

    handleChatID = (e) => {
        let device = this.props.device
        let payload = {
            type: 'chat_id',
            auto_generated: true,
            product_data: {},
            user_acc_id: device ? device.user_acc_id : null,
            dealer_id: device ? device.dealer_id : null,

        }
        this.props.addProduct(payload)
    }

    handleSimPermissionModal = () => {
        let handleSubmit = this.props.addSimPermission;
        this.refs.add_sim_permission.showModal(handleSubmit);
    }

    handleServicesSubmit = (products, packages, term) => {
        let disableChat = true;
        let disablePgp = true;
        let disableSim = true;
        let disableSim2 = true;
        let vpn = '';

        let packagesData = []
        let productData = []
        let total_price = 0;
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
                }
                if (services.pgp_email) {
                    disablePgp = false
                }
                if (services.vpn) {
                    vpn = "1"
                }
                // console.log(item.pkg_features);
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
            pgp_email: (this.props.pgp_emails.length && !disablePgp) ? this.props.pgp_emails[0].pgp_email : '',
            chat_id: (this.props.chat_ids.length && !disableChat) ? this.props.chat_ids[0].chat_id : '',
            sim_id: '',
            sim_id2: undefined,
            vpn: vpn,
            disableSim: disableSim,
            disableSim2: disableSim2,
            disableChat: disableChat,
            disablePgp: disablePgp,
            packages: packagesData,
            products: productData,
            expiry_date: expiry_date,
            services: services,
            checkServices: (services) ? { display: 'none' } : { display: 'inline', color: "Red", margin: 0 },
            term: term,
            unit_servcies_price: total_price,
            total_price: this.state.duplicate > 0 ? total_price * this.state.duplicate : total_price,
            PkgSelectedRows: packages,
            proSelectedRows: products,
            servicesModal: false,
            visible: false,
        })
    }

    handleServicesModal = () => {
        this.setState({
            servicesModal: true
        })
    }


    // packageChange = (value) => {
    //     if (value != '') {
    //         let userPackage = this.props.parent_packages.filter((item) => {
    //             if (item.id === value) {
    //                 return item
    //             }
    //         })
    //         // console.log(userPackage);
    //         // console.log(userPackage.pkg_features);
    //         let services = JSON.parse(userPackage[0].pkg_features)
    //         // console.log(services);
    //         let sim_id = '';
    //         let chat_id = '';
    //         let pgp_email = '';
    //         let vpn = '';
    //         let disableChat = false;
    //         let disablePgp = false;
    //         let disableSim = false;
    //         let disableSim2 = false;
    //         let disableVpn = false
    //         let error = false
    //         if (services.sim_id) {
    //             if (this.props.sim_ids.length) {
    //                 sim_id = this.props.sim_ids[0].sim_id
    //             }
    //             else {
    //                 error = true
    //             }
    //             disableSim = true
    //         }

    //         if (services.chat_id) {
    //             if (this.props.chat_ids.length) {
    //                 chat_id = this.props.chat_ids[0].chat_id
    //             }
    //             else {
    //                 error = true
    //             }
    //             disableChat = true
    //         }
    //         if (services.pgp_email) {
    //             if (this.props.pgp_emails.length) {
    //                 pgp_email = this.props.pgp_emails[0].pgp_email
    //             }
    //             else {
    //                 error = true
    //             }
    //             disablePgp = true
    //         }
    //         if (services.vpn) {
    //             disableVpn = true
    //         }
    //         if (error) {
    //             let _this = this
    //             confirm({
    //                 title: "All Services are not found. Please Contact your ADMIN or click CONTINUE ANYWAYS to add later.",
    //                 okText: 'CONTINUE ANYWAYS',
    //                 onOk() {
    //                     _this.setState({
    //                         packageId: value,
    //                         sim_id: sim_id,
    //                         chat_id: chat_id,
    //                         pgp_email: pgp_email,
    //                         vpn: (services.vpn) ? "1" : "0",
    //                         disableSim: disableSim,
    //                         disableChat: disableChat,
    //                         disablePgp: disablePgp,
    //                         disableVpn: disableVpn,

    //                     })

    //                 },
    //                 onCancel() {
    //                     _this.setState({
    //                         packageId: '',
    //                         sim_id: '',
    //                         chat_id: '',
    //                         pgp_email: '',
    //                         vpn: '',
    //                         disableSim: false,
    //                         disableChat: false,
    //                         disablePgp: false,
    //                         disableVpn: false,
    //                     })
    //                 },

    //             })

    //         } else {
    //             this.setState({
    //                 packageId: value,
    //                 sim_id: sim_id,
    //                 chat_id: chat_id,
    //                 pgp_email: pgp_email,
    //                 vpn: (services.vpn) ? "1" : "0",
    //                 disableSim: disableSim,
    //                 disableSim2: disableSim2,
    //                 disableChat: disableChat,
    //                 disablePgp: disablePgp,
    //                 disableVpn: disableVpn,

    //             })
    //         }
    //     }
    //     else {
    //         this.setState({
    //             packageId: value,
    //             sim_id: '',
    //             chat_id: '',
    //             pgp_email: '',
    //             vpn: '',
    //             disableSim: false,
    //             disableSim2: false,
    //             disableChat: false,
    //             disablePgp: false,
    //             disableVpn: false,
    //         })

    //     }
    // }


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



    handleChangetab = (value) => {
        switch (value) {
            case '0':
                this.setState({
                    parent_packages: this.filterList('trial', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('trial', this.props.product_prices, 'product'),
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

    handleDuplicate = (e) => {
        // console.log(e);
        let duplicates = e;
        // console.log(this.state.total_price);
        let total_price = this.state.unit_servcies_price * duplicates
        this.setState({
            total_price: total_price,
            duplicate: e
        })
    }

    submitServicesConfirm(pay_now) {
        this.props.getInvoiceId();
        this.state.serviceData.pay_now = pay_now;

        if (pay_now) {
            if ((this.state.total_price + this.state.hardwarePrice) <= this.props.user_credit || !this.state.serviceData.pay_now || this.state.serviceData.term == 0) {
                this.setState({ invoiceVisible: true, invoiceType: "pay_now" })
            } else {
                showCreditPurchase(this, "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.")
            }
        } else {
            if (this.state.serviceData.term == 0) {
                this.setState({ invoiceVisible: true, invoiceType: "pay_later" })
            } else {
                let after_pay_credits = this.props.user_credit - (this.state.total_price + this.state.hardwarePrice)
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
        // console.log("handleOk for invoice", this.state.serviceData)

        if ((this.state.total_price + this.state.hardwarePrice) <= this.props.user_credit || !this.state.serviceData.pay_now) {
            this.state.serviceData.paid_by_user = this.state.paidByUser
            this.props.AddDeviceHandler(this.state.serviceData);
            this.props.hideModal();
            this.handleReset();
            this.setState({
                serviceData: {},
                showConfirmCredit: false
            })
        } else {
            showCreditPurchase(this, "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.")
        }

        this.setState({
            invoiceVisible: false,
            // showConfirmCredit: false,
            servicesModal: false
        })
    }

    handleCancelInvoice = () => {
        this.setState({ invoiceVisible: false })
    }

    setDropdowns(values) {
        // console.log('setDropdowns val : ', values)
        this.setState({
            selectedHardwareValues: values,
        });
    }

    handleHardwareChange = (e, added) => {

        let hardware = this.props.parent_hardwares.find((item) => item.id === e)
        if (hardware) {
            // console.log(hardware);
            if (added) {
                this.state.hardwarePrice += hardware.hardware_price
                this.state.hardwares.push(hardware)

            } else {
                this.state.hardwares.splice(this.state.hardwares.findIndex((item) => item.id === hardware.id), 1)
                this.state.hardwarePrice -= hardware.hardware_price
            }
            this.setState({
                hardwarePrice: this.state.hardwarePrice,
                hardwares: this.state.hardwares
            })
        }
    }

    handlePaidUser = (e) => {
        // console.log(e);
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

    validateICCID = (rule, value, callback, simField) => {
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
        RestService.activateICCID(value).then((response) => {
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

    renderDataLimitOptions = () => {
        // this.state.parent_packages
        return checkIsArray(this.props.parent_packages).map((packageItem) => {
            // console.log(packageItem.pkg_term, this.state.term + ' month', packageItem.pkg_term == (this.state.term + ' month'))
            if (packageItem.package_type === 'data_plan' && packageItem.pkg_term == (this.state.term + ' month')) {
                return <Select.Option key={packageItem.id} value={packageItem.id} >{packageItem.pkg_name + " (" + packageItem.pkg_price + " Credits)"}</Select.Option>
            }
        })
    }


    changeDataLimit = (type, value) => {
        let data_plan = this.props.parent_packages.find(item => item.id == value)
        // console.log(data_plan)
        if (type === 'data_limit_1') {
            this.data_plan_1_added = false
        } else {
            this.data_plan_2_added = false
        }
        this.setState({
            [type]: data_plan ? data_plan : ''
        })
    }


    render() {
        // console.log(this.props);
        // console.log('id is', this.state.products, this.state.packages);
        // console.log("form props: ", this.props.form);
        // console.log(this.props.user);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        let allSelectedOpt = false
        if (this.props.parent_hardwares.length === this.state.selectedHardwareValues.length) {
            allSelectedOpt = true;
        } else { allSelectedOpt = false }
        // console.log(users_list[0]);

        return (
            <div>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h3>
                            {convertToLang(this.props.translation[Button_Add_Device], "Add Device")}
                        </h3>
                    </Col>
                    <Col xs={10} sm={10} md={10} lg={10} xl={10} className="text-right">
                        <p>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    </Col>
                </Row>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    {(this.props.preActive) ?
                        <Radio.Group className="width_100 text-center" onChange={this.handleChange} ref='option' defaultValue="0" buttonStyle="solid">
                            <Radio.Button className="dev_radio_btn" value="0">{convertToLang(this.props.translation[SINGLE_DEVICE], "Single Device")}</Radio.Button>
                            <Radio.Button className="dev_radio_btn" value="1" disabled>
                                {/* <a> */}
                                {convertToLang(this.props.translation[DUPLICATE_DEVICES], "Multiple Devices")}
                                {/* </a> */}
                                {/* <Popover placement="bottomRight" content={(
                                    <Markup content={convertToLang(this.props.translation[DUPLICATE_DEVICES_HELPING_TEXT],
                                        `<p>Generate multiple activation <br /> codes with same settings</p>`)} />
                                )}>
                                    <span className="helping_txt"><Icon type="info-circle" /></span>
                                </Popover> */}
                            </Radio.Button>
                        </Radio.Group>
                        :
                        null
                    }

                    <Row>
                        {/* Section 1 */}
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="p-0">

                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    // label={convertToLang(this.props.translation[""], `ADD USER`)}
                                    // labelCol={{ span: 8 }}
                                    // wrapperCol={{ span: 16 }}

                                    // @author Usman Hafeez
                                    // label={convertToLang(this.props.translation[""], `ADD USER`)}
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Button
                                        className="add_user_btn mb-6"
                                        type="primary"
                                        style={{ width: "100%" }}
                                        onClick={() => this.handleUserModal()}
                                        style={{ width: "100%" }}
                                    >
                                        {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                    </Button>
                                </Form.Item>
                            </Col>

                            {/**
                             * @section User Selector
                             */}
                            {(isloading ?
                                <div className="addUserSpin">
                                    <Spin />
                                </div>
                                :
                                <Fragment>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('user_id', {
                                                initialValue: this.props.new ? "" : this.state.addNewUserModal ? lastObject.user_id : addNewUserValue,
                                                rules: [{
                                                    required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], 'User ID is Required !'),
                                                }]
                                            })(
                                                <Select
                                                    className="pos_rel"
                                                    setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                                    showSearch
                                                    placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                                    optionFilterProp="children"
                                                    onChange={this.handleUserChange}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                                    {checkIsArray(users_list).map((item, index) => {
                                                        return (<Select.Option key={index} value={item.user_id}>{item.user_id} ( {item.user_name} )</Select.Option>)
                                                    })}
                                                </Select>
                                            )}

                                        </Form.Item>
                                    </Col>
                                </Fragment>
                            )}


                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    className="l_h_20"

                                    // label={convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICES")}
                                    // labelCol={{ span: 8 }}
                                    // wrapperCol={{ span: 16 }}

                                    // @author Usman Hafeez
                                    // label={convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICES")}
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    {this.props.form.getFieldDecorator('service', {
                                        initialValue: '',
                                    })(
                                        <Fragment>
                                            <Button
                                                type="primary"
                                                onClick={() => this.handleServicesModal()}
                                                style={{ width: '100%' }}
                                                className="add_user_btn"
                                            >
                                                {convertToLang(this.props.translation[DUMY_TRANS_ID], "SELECT SERVICES")}
                                            </Button>
                                            <span style={this.state.checkServices}>You need to select a service before submit form.</span>
                                        </Fragment>
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Hardware Selection */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    // className="select_hardware"
                                    label={convertToLang(this.props.translation[""], `HARDWARE`)}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('hardwares')(
                                        <Select
                                            mode="multiple"
                                            showSearch
                                            style={{ width: '100%' }}
                                            placeholder="Select Hardwares"
                                            mode="multiple"
                                            onChange={(e) => this.setState({ hardware: e })}
                                            onSelect={(e) => {
                                                this.handleHardwareChange(e, true)
                                            }
                                            }
                                            onDeselect={(e) => {
                                                this.handleHardwareChange(e, false)
                                            }
                                            }
                                        >
                                            {checkIsArray(this.props.parent_hardwares).map((hardware) => {
                                                return (<Select.Option key={hardware.id} value={hardware.id}>{hardware.hardware_name + " ( PRICE: " + hardware.hardware_price + " Credits ) "}</Select.Option>)
                                            })}
                                        </Select>
                                        // <Input />
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Expiry Date Input */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[Expire_Date], "Expiry Date")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('expiry_date', {
                                        initialValue: this.state.expiry_date,
                                    })(

                                        <Input disabled />
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Policy Selection */}
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Form.Item
                                    label={convertToLang(this.props.translation[POLICY], "Policy")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('policy_id', {
                                        initialValue: '',
                                    })(
                                        <Select
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[SELECT_POLICY], "Select Policy")}
                                            optionFilterProp="children"
                                            // onChange={handleChange}
                                            // onFocus={handleFocus}
                                            // onBlur={handleBlur}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option value="">{convertToLang(this.props.translation[SELECT_POLICY], "Select Policy")}</Select.Option>
                                            {checkIsArray(this.props.policies).map((policy, index) => {
                                                return (<Select.Option key={index} value={policy.id}>{policy.policy_name}</Select.Option>)
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>

                            {/* Device ID Input */}
                            {(this.props.preActive) ?
                                null
                                :
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[DEVICE_ID], "Device ID")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('device_id', {
                                            initialValue: this.props.new ? "" : this.props.device.device_id,
                                        })(
                                            <Input disabled />
                                        )}
                                    </Form.Item>
                                </Col>
                            }

                            {/* Note Input */}
                            {(this.props.preActive) ?
                                <Fragment>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[Device_Note], "NOTE")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('note', {
                                                initialValue: '',
                                            })(
                                                // <Input />
                                                <TextArea
                                                    // value={value}
                                                    // onChange={this.onChange}
                                                    // placeholder="Controlled autosize"
                                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Fragment>
                                :
                                null
                            }

                            {/* Valid For Input */}
                            {(this.props.preActive) ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS)")}
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        className="val_days"
                                    >
                                        {this.props.form.getFieldDecorator('validity', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required"),
                                                },
                                                {
                                                    validator: this.validateValidDays,
                                                }
                                            ],
                                        })(
                                            <InputNumber min={1} />
                                        )}

                                    </Form.Item>
                                </Col>
                                :
                                null
                            }

                            {(this.props.preActive === false) ?
                                <Fragment>

                                    {/* Dealer Pin Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DEALER_PIN], "Dealer Pin")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            <Input value={this.props.new ? '' : this.props.device.link_code} disabled />

                                        </Form.Item>
                                    </Col>

                                    {/* IMEI 1 Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI 1")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >

                                            <Input type='text' value={this.props.new ? '' : this.props.device.imei} disabled />

                                        </Form.Item>
                                    </Col>

                                    {/* Sim 1 Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DEVICE_SIM_1], "SIM 1")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            <Input value={this.props.new ? '' : this.props.device.simno} disabled />

                                        </Form.Item>
                                    </Col>
                                </Fragment>
                                :
                                null
                            }
                        </Col>

                        {/* Section 2 */}
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="p-0">

                            {/* <Form.Item
                                    label={convertToLang(this.props.translation[Start_Date], "Start Date")}
                                    labelCol={{ span: 8}}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {this.props.form.getFieldDecorator('start_date', {
                                        initialValue: this.props.new ? this.createdDate() : this.props.device.start_date,
                                    })(

                                        <Input disabled />
                                    )}
                                </Form.Item> 
                            */}

                            {/* {(this.state.type == 0 && lastObject) ? */}
                                <Fragment>

                                    {/**
                                     * @author Usman Hafeez
                                     * @description Add PGP Email button
                                     */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            //    label={<span></span>}
                                            labelCol={{ span: 0 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Button
                                                className="add_user_btn mb-6"
                                                type="primary"
                                                onClick={() => this.handlePGPModal()}
                                                style={{ width: "100%" }}
                                                disabled={this.state.disablePgp}
                                            >
                                                {convertToLang(this.props.translation[''], "Add PGP Email")}
                                            </Button>
                                        </Form.Item>
                                    </Col>

                                    {/* PGP Email Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('pgp_email', {
                                                initialValue: this.state.pgp_email,
                                                rules: [

                                                    {
                                                        type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder={convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}
                                                    optionFilterProp="children"
                                                    onChange={(e) => this.setState({ pgp_email: e })}
                                                    // onFocus={handleFocus}
                                                    // onBlur={handleBlur}
                                                    // defaultValue={this.state.pgp_email}
                                                    autoComplete="new-password"
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    disabled={this.state.disablePgp}
                                                >
                                                    {checkIsArray(this.props.pgp_emails).map((pgp_email) => {
                                                        return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                                    })}
                                                </Select>
                                                // <Input />
                                            )}
                                        </Form.Item>
                                    </Col>

                                    {/**
                                     * @author Usman Hafeez
                                     * @description Add Chat ID button
                                     */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            // label={''}
                                            labelCol={{ span: 0 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Button
                                                className="add_user_btn mb-6"
                                                type="primary"
                                                style={{ width: "100%" }}
                                                onClick={this.handleChatID}
                                                style={{ width: "100%" }}
                                                disabled={this.state.disableChat}
                                            >
                                                {convertToLang(this.props.translation[''], "Generate Chat ID")}
                                            </Button>
                                        </Form.Item>
                                    </Col>

                                    {/* Chat ID Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "Chat ID")}
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
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    disabled={this.state.disableChat}
                                                >
                                                    {checkIsArray(this.props.chat_ids).map((chat_id, index) => {
                                                        return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                                    })}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>



                                    {/* Sim ID Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "Sim ID")}
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
                                                //     placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select Sim ID")}
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
                                                    className="add_user_btn mb-6"
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
                                        {(this.state.disableSim) ? null :
                                            <div style={{ color: 'red', textAlign: "center" }}>Basic Data Limit for SIM ID is 2 GB</div>
                                        }
                                        <Form.Item
                                            label={<Markup content={convertToLang(this.props.translation[''], "ADD DATA <br /> (Sim ID 1)")} />}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                            className="apply_services"
                                        >
                                            {this.props.form.getFieldDecorator('data_limit_1', {
                                                initialValue: "",
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
                                                    placeholder="SELECT SIM DATA PLAN FOR SIM 1"

                                                    disabled={this.state.disableSim}
                                                    onChange={(value) => {
                                                        this.changeDataLimit('data_limit_1', value)
                                                    }}
                                                // dropdownStyle={
                                                //     {
                                                //         whiteSpace: 'nowrap',
                                                //     }
                                                // }
                                                >
                                                    <Select.Option key={""} value="" >SELECT DATA PLAN</Select.Option>
                                                    {this.renderDataLimitOptions()}

                                                </Select>


                                            )}
                                        </Form.Item>
                                    </Col>

                                    {/* Sim ID 2 Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Sim ID 2")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('sim_id2', {
                                                initialValue: this.state.sim_id2,
                                                rules: [
                                                    // {
                                                    //     required: true, message: "SIM ID 2 is required"
                                                    // },
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
                                                    className="add_user_btn mb-6"
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
                                        {(this.state.disableSim2) ? null :
                                            <div style={{ color: 'red', textAlign: "center" }}>Basic Data Limit for SIM ID 2 is 2 GB</div>
                                        }
                                        <Form.Item
                                            label={<Markup content={convertToLang(this.props.translation[''], "ADD DATA <br /> (Sim ID 2)")} />}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                            className="apply_services"

                                        >
                                            {this.props.form.getFieldDecorator('data_limit_2', {
                                                initialValue: "",
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
                                                    placeholder="SELECT SIM DATA PLAN FOR SIM 2"
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
                                    </Col>

                                    {/* VPN Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DUMY_TRANS_ID], "VPN")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('vpn', {
                                                initialValue: this.state.vpn
                                            })(
                                                <Select
                                                    showSearch
                                                    placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN")}
                                                    optionFilterProp="children"
                                                    onChange={(value) => this.setState({ vpn: value })}

                                                    disabled={this.state.disableVpn}
                                                >
                                                    <Select.Option value="">{convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN")}</Select.Option>
                                                    <Select.Option value="1">{convertToLang(this.props.translation[DUMY_TRANS_ID], "YES")}</Select.Option>
                                                    <Select.Option value="0">{convertToLang(this.props.translation[DUMY_TRANS_ID], "NO")}</Select.Option>
                                                </Select>,
                                            )}
                                        </Form.Item>
                                    </Col>

                                    {/* Client ID Input */}
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Client ID")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            {this.props.form.getFieldDecorator('client_id', {
                                                // initialValue: this.state.client_id,

                                            })(
                                                <Input
                                                    onChange={e => {
                                                        this.setState({ client_id: e.target.value });
                                                    }} />
                                            )}
                                        </Form.Item>
                                    </Col>

                                    {/* Model Input */}
                                    {(this.props.preActive) ? null :
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item
                                                label={convertToLang(this.props.translation[DEVICE_MODEL], "Model")}
                                                labelCol={{ span: 8 }}
                                                wrapperCol={{ span: 16 }}
                                            >
                                                {this.props.form.getFieldDecorator('model', {
                                                    initialValue: this.props.new ? "" : this.props.device.model,
                                                })(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    }
                                </Fragment>
                                {/* :
                                null
                            } */}



                            {(this.state.type == 1) ?
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Form.Item
                                        label={convertToLang(this.props.translation[DUPLICATE_DEVICES], "MULTIPLE")}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                    >
                                        {this.props.form.getFieldDecorator('duplicate', {
                                            initialValue: this.state.duplicate,
                                            rules: [{
                                                required: true, message: convertToLang(this.props.translation[DUPLICATE_DEVICES_REQUIRED], 'Number of Duplicate devices required'),
                                            }
                                            ],
                                        })(
                                            <Fragment>
                                                <InputNumber
                                                    className="width_100"
                                                    min={2} max={10}
                                                    onChange={this.handleDuplicate} />
                                                <span style={{ color: "red", padding: 0, fontSize: 13, }} >Maximum Multiple devices : 10</span>
                                            </Fragment>

                                        )}
                                    </Form.Item>
                                </Col>
                                :
                                null
                            }

                            {/* IMEI 2 & SIM 2 Input */}
                            {(this.props.preActive === false) ?
                                (<Fragment>

                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI 2")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >

                                            <Input value={this.props.new ? '' : this.props.device.imei2} disabled />

                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            label={convertToLang(this.props.translation[DEVICE_SIM_2], "SIM 2")}
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            <Input value={this.props.new ? '' : this.props.device.simno2} disabled />

                                        </Form.Item>
                                    </Col>
                                </Fragment>
                                )
                                :
                                null
                            }
                        </Col>

                        {/* section 3 */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="text-right">
                            <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "CANCEL")}</Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={((this.state.disableSim === false && this.state.valid_sim_id_1 === false) || (this.state.disableSim2 === false && this.state.valid_sim_id_2 === false)) ? true : false}
                            >
                                {convertToLang(this.props.translation[Button_submit], "SUBMIT")}
                            </Button>
                        </Col>

                        {/* hidden inputs */}
                        <Form.Item className="edit_ftr_btn"
                            wrapperCol={{
                                xs: { span: 34, offset: 0 },
                                sm: { span: 34, offset: 0 },
                            }}
                        >
                            {/* Dealer ID Input */}
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('dealer_id', {
                                    initialValue: this.props.new ? "" : this.props.device.dealer_id,
                                })(
                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>

                            {/* User Device ID Input */}
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_device_id', {
                                    initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                                })(
                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>

                            {/* User Account ID input */}
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_acc_id', {
                                    initialValue: this.props.new ? "" : this.props.device.id,
                                })(
                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>

                            {/* Connected Dealer Input */}
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('connected_dealer', {
                                    initialValue: this.props.new ? "" : this.props.device.connected_dealer,
                                })(
                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>

                        </Form.Item>
                    </Row>
                </Form>

                {/* AddUserModal */}
                <AddUser
                    ref="add_user"
                    translation={this.props.translation}
                />

                {/**
                 * @author Usman Hafeez
                 * @description from here pgp email will be generated
                 */}

                <AddPGPEmailModal
                    ref="addPGPEmailModal"
                    translation={this.props.translation}
                    wrappedComponentRef={(form) => this.addPGPEmailModal = form}

                    // actions
                    getDomains={this.props.getDomains}
                    addProduct={this.props.addProduct}

                    // data
                    domainList={this.props.domainList}
                    device={this.props.device}

                />

                {/* <AddSimPermission ref="add_sim_permission" /> */}
                <Modal
                    width={750}
                    visible={this.state.servicesModal}
                    title={convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICES")}
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
                        handleChangeTab={this.handleChangetab}
                        translation={this.props.translation}
                        handleServicesSubmit={this.handleServicesSubmit}
                        user_credit={this.props.user_credit}
                        history={this.props.history}
                    />
                </Modal>

                {/* Confirmation Modal */}
                <Modal
                    width={900}
                    visible={this.state.showConfirmCredit}
                    title={<span style={{ fontWeight: "bold" }}> {convertToLang(this.props.translation[DUMY_TRANS_ID], "Do You Really want to apply selected services on device ?")} </span>}
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
                        <div style={{ marginTop: 20 }}>
                            <Table
                                id='packages'
                                className={"devices mb-20"}
                                // rowSelection={packageRowSelection}
                                size="middle"
                                bordered
                                columns={this.state.invoiceColumns}
                                dataSource={this.confirmRenderList(this.state.PkgSelectedRows, this.state.proSelectedRows, this.state.hardwares)}
                                pagination={
                                    false
                                }
                            />
                        </div >
                        <div>
                            <h5 style={{ textAlign: "right" }}><b>Sub Total :  {this.state.serviceData.total_price + this.state.serviceData.hardwarePrice} Credits</b></h5>
                            <h4 style={{ textAlign: "center" }}><b>There will be a charge of {this.state.serviceData.total_price + this.state.serviceData.hardwarePrice} Credits</b></h4>
                        </div>
                        {/* {(this.state.term !== '0') ?
                            <div>
                                <h4 style={{ textAlign: "center", color: 'red' }}>If you PAY NOW you will get 3% discount.</h4>
                            </div>
                            : null
                            } */}

                        <div className="edit_ftr_btn" >
                            <Button onClick={() => { this.setState({ showConfirmCredit: false }) }}>CANCEL</Button>
                            {this.state.serviceData.term == 0 ? <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PROCEED</Button> :
                                <Fragment>
                                    {(this.props.user_credit < (this.state.serviceData.total_price + this.state.serviceData.hardwarePrice) && this.props.user.account_balance_status === 'active') ?
                                        <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PAY LATER</Button>
                                        : null}
                                    <Button style={{ backgroundColor: "green", color: "white" }} onClick={() => { this.submitServicesConfirm(true) }}>PAY NOW (-3%)</Button>
                                </Fragment>
                            }
                        </div >
                    </Fragment>
                </Modal>

                {/* Invoices Modal */}
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
                        // ref="invoice_modal"
                        PkgSelectedRows={this.state.PkgSelectedRows}
                        proSelectedRows={this.state.proSelectedRows}
                        renderInvoiceList={this.confirmRenderList}
                        subTotal={this.state.serviceData.total_price + this.state.serviceData.hardwarePrice}
                        invoiceType={this.state.invoiceType}
                        term={this.state.term}
                        duplicate={this.state.duplicate}
                        deviceAction={"Add"}
                        hardwarePrice={this.state.hardwarePrice}
                        hardwares={this.state.hardwares}
                        user_id={this.state.addNewUserValue}
                        invoiceID={this.state.invoiceID}
                        translation={this.props.translation}
                    />
                    <div style={{ float: "right" }}><b>PAID BY USER: </b> <Switch size="small" defaultChecked onChange={this.handlePaidUser} /></div>
                </Modal>
            </div >
        )

    }
}

const WrappedAddDeviceForm = Form.create({ name: 'register' })(AddDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        // getProfiles: getProfiles,
        getPolicies: getPolicies,
        addUser: addUser,
        getUserList: getUserList,
        getInvoiceId: getInvoiceId,
        getParentPackages: getParentPackages,
        getProductPrices: getProductPrices,
        getHardwaresPrices: getHardwaresPrices,
        addSimPermission: null,
        getDomains: getDomains,
        addProduct: addProduct,
        resetIds: resetIds,
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details, users, settings, sidebar, auth, account }) => {
    // console.log(devices.parent_packages, "PARENT PACLKAGES")
    return {
        invoiceID: users.invoiceID,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        policies: device_details.policies,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation,
        parent_packages: devices.parent_packages,
        product_prices: devices.product_prices,
        parent_hardwares: devices.parent_hardwares,
        user_credit: sidebar.user_credit,
        credits_limit: sidebar.credits_limit,
        user: auth.authUser,
        domainList: account.domainList
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAddDeviceForm));
function showConfirm(_this, values) {
    confirm({
        title: "Do You Really want to multiple " + values.duplicate + " devices with same settings.",
        onOk() {
            _this.props.AddDeviceHandler(values);
            _this.props.hideModal();
            _this.handleReset();
        },
        onCancel() { },
    });
}

function showCreditPurchase(_this, msg) {
    confirm({
        title: msg,
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}
