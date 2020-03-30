// Libraries
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon, Row, Col, Spin, Tabs, Card, Table } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Markup } from 'interweave';

import AddUser from '../../users/components/AddUser';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import CustomScrollbars from "../../../util/CustomScrollbars";
import { Button_Cancel, Button_submit, Button_Add_User } from '../../../constants/ButtonConstants';
import { SINGLE_DEVICE, DUPLICATE_DEVICES, Required_Fields, USER_ID, DEVICE_ID, USER_ID_IS_REQUIRED, SELECT_PGP_EMAILS, DEVICE_Select_CHAT_ID, SELECT_USER_ID, DEVICE_CLIENT_ID, DEVICE_Select_SIM_ID, DEVICE_MODE, DEVICE_MODEL, Device_Note, Device_Valid_For, Device_Valid_days_Required, DUPLICATE_DEVICES_REQUIRED, DEVICE_IMEI_1, DEVICE_SIM_1, DEVICE_IMEI_2, DEVICE_SIM_2 } from '../../../constants/DeviceConstants';
import { LABEL_DATA_PGP_EMAIL, LABEL_DATA_SIM_ID, LABEL_DATA_CHAT_ID, DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { Not_valid_Email, POLICY, Start_Date, Expire_Date, Expire_Date_Require, DEVICE_PRE_ACTIVATION, DEVICE_TRIAL } from '../../../constants/Constants';
import {
    PACKAGE_NAME,
    PACKAGE_TERM,
    PACKAGE_SERVICES,
    PACKAGE_PRICE,
    PACKAGE_EXPIRY,
    PACKAGE_SEARCH,
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
    UNIT_PRICE,
} from "../../../constants/AccountConstants";

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const error = Modal.error;


class ServicesList extends Component {

    constructor(props) {
        super(props);
        // this.confirm = Modal.confirm;

        const packagesColumns = [
            {
                title: convertToLang(this.props.translation[PACKAGE_NAME], "PACKAGE NAME"),
                align: "center",
                className: 'white_normal',
                dataIndex: 'pkg_name',
                key: 'pkg_name',
                sorter: (a, b) => { return a.pkg_name.localeCompare(b.pkg_name) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["SIM ID"], "SIM ID")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'sim_id',
                key: 'sim_id',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["SIM ID"], "SIM ID 2")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'sim_id2',
                key: 'sim_id2',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["chat"], "CHAT ID")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'chat_id',
                key: 'chat_id',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["pgp"], "PGP EMAIL")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'pgp_email',
                key: 'pgp_email',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["vpn"], "VPN")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'vpn',
                key: 'vpn',
                className: 'row '
            },
            {
                title: <Markup content={convertToLang(this.props.translation[DUMY_TRANS_ID], "PACKAGE PRICE <br>(CREDITS)")}></Markup>,
                align: "center",
                className: 'white_normal',
                dataIndex: 'pkg_price',
                key: 'pkg_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.pkg_price - b.pkg_price },

                sortDirections: ['ascend', 'descend'],
            },
        ];

        const pricesColumns = [
            {
                dataIndex: 'price_for',
                className: '',
                title: convertToLang(this.props.translation["ITEM"], "ITEM"),
                align: "center",
                key: 'price_for',
                sorter: (a, b) => { return a.price_for.localeCompare(b.price_for) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "UNIT PRICE (CREDITS)"),
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.unit_price - b.unit_price },

                sortDirections: ['ascend', 'descend'],
            }
        ];

        this.state = {
            searchText: '',
            showMsg: false,
            editing: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: this.props.pagination,
            selectedRows: [],
            selectedRowKeys: [],
            self: this,
            redirect: false,
            user_id: '',
            expandedRowKeys: [],
            dealer_id: '',
            goToPage: '/dealer/dealer',
            pricesColumns: pricesColumns,
            packagesColumns: packagesColumns,
            PkgSelectedRows: [],
            pkgSelectedRowKeys: [],
            proSelectedRows: [],
            proSelectedRowKeys: []

        };
        
        this.sideScroll = this.sideScroll.bind(this);
    }


    renderList = (type, list) => {
        // console.log(list, type, this.props.current_services);
        if (type === 'package') {
            let packageIds = []
            let packagesDataList = []
            // console.log(this.props.current_services);
            if (this.props.current_services) {
                let current_services_packages = JSON.parse(this.props.current_services.packages)
                checkIsArray(current_services_packages).map(item => {
                    packageIds.push(item.id)
                })

            }
            checkIsArray(list).map((item, index) => {
                if (!packageIds.includes(item.id)) {
                    if(item.package_type==='services'){

                        let services = JSON.parse(item.pkg_features)
                        
                        packagesDataList.push({
                            key: index,
                            id: item.id,
                            rowKey: item.id,
                            pkg_name: `${item.pkg_name}`,
                            dealer_type: `${item.dealer_type}`,
                            sim_id: (services.sim_id) ? <span style={{ color: "#008000" }}> YES</span > : <span style={{ color: "Red" }}>NO</span >,
                            sim_id2: (services.sim_id2) ? <span style={{ color: "#008000" }}> YES</span > : <span style={{ color: "Red" }}>NO</span >,
                            chat_id: (services.chat_id) ? <span style={{ color: "#008000" }}> YES</span > : <span style={{ color: "Red" }}>NO</span >,
                            pgp_email: (services.pgp_email) ? <span style={{ color: "#008000" }}> YES</span > : <span style={{ color: "Red" }}>NO</span >,
                            vpn: (services.vpn) ? <span style={{ color: "#008000" }}> YES</span > : <span style={{ color: "Red" }}>NO</span >,
                            pkg_price: item.pkg_price,
                            pkg_features: services,
                            pkg_term: item.pkg_term,
                            retail_price: item.retail_price,
                        })
                    }
                }
            });
            return packagesDataList
        } else if (type === 'product') {
            let productsIds = []
            let productsDataList = []
            
            
            checkIsArray(list).map((item, index) => {
                if (!productsIds.includes(item.id)) {
                    let price_for = ''
                    switch (item.price_for) {
                        case 'sim_id':
                            price_for = "SIM ID"
                            break;
                        case 'pgp_email':
                            price_for = "PGP EMAIL"
                            break;
                        case 'chat_id':
                            price_for = "CHAT ID"
                            break;
                        case 'vpn':
                            price_for = "VPN"
                            break;

                        default:
                            break;
                    }

                    productsDataList.push({
                        key: index,
                        id: item.id,
                        rowKey: item.id,
                        price_for: `${price_for}`,
                        unit_price: item.unit_price,
                        item: item.price_for,
                        price_term: item.price_term
                    })
                }
            });
            return productsDataList
        } else {
            let trialList = [
                {
                    price_for: 'SIM ID',
                    unit_price: 0,
                    item: "sim_id"
                },
                {
                    price_for: 'CHAT ID',
                    unit_price: 0,
                    item: "chat_id"
                },
                {
                    price_for: 'PGP EMAIL',
                    unit_price: 0,
                    item: "pgp_email"
                },
                {
                    price_for: 'VPN',
                    unit_price: 0,
                    item: "vpn"
                },
            ];
            return trialList
        }
    }

    componentDidUpdate(prevProps) {
    }


    resetSeletedRows = () => {
        // console.log('table ref')
        this.setState({
            proSelectedRowKeys: [],
            pkgSelectedRowKeys: [],
            proSelectedRows: [],
            PkgSelectedRows: [],
        })
    }

    scrollBack = () => {
        let element = document.getElementById('scrolltablelist');
        // console.log(element.scrollLeft)
        element.scrollLeft += 100;
        // console.log(element.scrollLeft)
        // var element = this.refs.tablelist; //document.getElementsByClassName("scrolltablelist");
        // console.log(element)
        // this.sideScroll(element, 'left', 25, 100, 10);
    }

    scrollNext = () => {
        // console.log('hi scroll next')
        var element = this.refs.tablelist; // document.getElementsByClassName("scrolltablelist");  // ant-table-body   scrolltablelist  ant-table-scroll
        this.sideScroll(element, 'right', 25, 100, 10);
    }

    sideScroll(element, direction, speed, distance, step) {
        // console.log('hi sideScroll function')
        // element.props.scroll.x=15;
        // element.props.style.scrollMargin="100px";
        // console.log('element is: ', element.props);
        // console.log('direction is: ', direction);
        // console.log('speed is: ', speed);
        // console.log('distance is: ', distance);
        // console.log('step is: ', step)

        var scrollAmount = 0;
        // var slideTimer = setInterval(function () {
        //     if (direction === 'left') {
        //         element.scrollLeft -= step;
        //     } else {
        //         element.scrollLeft += step;
        //     }
        //     scrollAmount += step;
        //     if (scrollAmount >= distance) {
        //         window.clearInterval(slideTimer);
        //     }
        // }, speed);
    }

    handlePackageSelect = (selectedRowKeys, selectedRows) => {
        // console.0log(selectedRowKeys, selectedRows);
        this.setState({ PkgSelectedRows: selectedRows, pkgSelectedRowKeys: selectedRowKeys })

    }
    handleProSelect = (selectedRowKeys, selectedRows) => {
        this.setState({ proSelectedRows: selectedRows, proSelectedRowKeys: selectedRowKeys })
    }
    handleCancel = () => {
        this.resetSeletedRows();
        this.props.handleCancel()

        // this.setState({ proSelectedRows: selectedRows, proSelectedRowKeys: selectedRowKeys })
    }
    selectAll = () => {
        this.resetSeletedRows()
    }
    handleSubmit = () => {
        if (this.state.proSelectedRowKeys.length || this.state.pkgSelectedRowKeys.length) {
            let total_price = 0
            // console.log(products, packages);
            if (this.state.proSelectedRows.length) {
                checkIsArray(this.state.proSelectedRows).map((item) => {
                    total_price = total_price + Number(item.unit_price)
                })
            }
            if (this.state.PkgSelectedRows.length) {
                checkIsArray(this.state.PkgSelectedRows).map((item) => {
                    total_price = total_price + Number(item.pkg_price)
                })
            }



            // console.log(total_price, this.props.user_credit);
            // if (this.props.creditsToRefund) {
            //     total_price -= this.props.creditsToRefund
            // }
            // if (total_price < this.props.user_credit || this.props.tabselect === '0') {
            this.props.handleServicesSubmit(this.state.proSelectedRows, this.state.PkgSelectedRows, this.props.serviceTerm);
            this.resetSeletedRows();
            // this.handleCancel()
            // }
            // else {
            //     showConfirm(this);
            // }
        }
    }


    render() {
        // console.log(this.props.history);
        let packageRowSelection = {
            // hideDefaultSelections: false,
            onSelectAll: this.selectAll,
            selectedRowKeys: this.state.pkgSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.handlePackageSelect(selectedRowKeys, selectedRows)
            },
            // getCheckboxProps: record => {
            //     let disabled = false
            //     // console.log(this.state.proSelectedRows, this.state.PkgSelectedRows);
            //     if (this.state.proSelectedRows.length) {
            //         this.state.proSelectedRows.map((item) => {
            //             // console.log(record.pkg_features[item.item]);
            //             if (record.pkg_features[item.item] === true) {
            //                 disabled = true
            //             }
            //         })
            //     }
            //     if (this.state.PkgSelectedRows.length) {
            //         this.state.PkgSelectedRows.map((item) => {
            //             // console.log(item, record);
            //             if (item.id !== record.id) {
            //                 if (item.pkg_features.sim_id === true && record.pkg_features.sim_id === true) {
            //                     disabled = true
            //                 }
            //                 if (item.pkg_features.chat_id === true && record.pkg_features.chat_id === true) {
            //                     disabled = true
            //                 }
            //                 if (item.pkg_features.pgp_email === true && record.pkg_features.pgp_email === true) {
            //                     disabled = true
            //                 }
            //                 if (item.pkg_features.vpn === true && record.pkg_features.vpn === true) {
            //                     disabled = true
            //                 }
            //             }

            //         })
            //     }
            //     return ({
            //         disabled: disabled, // Column configuration not to be checked
            //         name: record.name,
            //     })
            // },
            type: 'radio'
            //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        };

        let productRowSelection = {
            selectedRowKeys: this.state.proSelectedRowKeys,
            onSelectAll: this.selectAll,
            onChange: (selectedRowKeys, selectedRows) => {
                this.handleProSelect(selectedRowKeys, selectedRows)

                // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => {
                let disabled = false
                if (this.state.PkgSelectedRows.length) {
                    checkIsArray( this.state.PkgSelectedRows).map((item) => {
                        // console.log(item[record.price_for], record.price_for);
                        if (item.pkg_features[record.item] === true) {
                            disabled = true
                        }
                    })
                }

                return ({
                    disabled: disabled, // Column configuration not to be checked
                    name: record.name,
                })
            },
            //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        };
        let trialRowSelection = {
            selectedRowKeys: this.state.proSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.handleProSelect(selectedRowKeys, selectedRows)

                // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => {
                let disabled = false
                return ({
                    disabled: disabled, // Column configuration not to be checked
                    name: record.name,
                })
            },
            type: 'radio'
            //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        };


        return (
            <Fragment>

                <h2 className="text-center"><strong>PACKAGES</strong></h2>
                <div className="prd_table">
                    <Table
                        id='packages'
                        className={"devices"}
                        rowSelection={packageRowSelection}
                        size="middle"
                        bordered
                        columns={this.state.packagesColumns}
                        dataSource={this.renderList("package", this.props.parent_packages)}
                        pagination={
                            false
                        }
                    // scroll={{ y: "142px" }}
                    // scroll={{ x: true }}
                    />
                </div >
                {/* <div style={{}} >
                            <h2 style={{ textAlign: "center" }}><strong>PRODUCTS</strong></h2>
                            <Table
                                id='products'
                                className={"devices"}
                                rowSelection={productRowSelection}
                                size="middle"
                                bordered
                                columns={this.state.pricesColumns}
                                dataSource={this.renderList("product", this.props.product_prices)}
                                pagination={
                                    false
                                }
                            />

                        </div > */}
                {/* </Fragment>} */}
                <div className="edit_ftr_btn_serv">
                    <Button key="back" type="button" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                    <Button type="primary" onClick={this.handleSubmit} >{convertToLang(this.props.translation[DUMY_TRANS_ID], "SELECT")}</Button>
                </div>
            </Fragment>

        )
    }

}

class Services extends Component {

    constructor(props) {
        super(props);
        this.state = {
            client_id: '',
            pgp_email: '',
            chat_id: '',
            sim_id: '',
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            servicesModal: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values);
            if (!err) {
            }
        });
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {

    }

    handleReset = () => {
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false
        });
    }
    handleChange = (e) => {
        // console.log(e);
        // this.setState({ pgp_email: e }); 
        this.setState({ type: e.target.value });
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
    //                 title: "All Seleced Services are not found. Please Contact your ADMIN or click CONTINUE ANYWAYS to add later.",
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
    //             disableChat: false,
    //             disablePgp: false,
    //             disableVpn: false,
    //         })

    //     }
    // }

    callback = (key) => {
        // console.log(this.refs.services.resetSeletedRows);
        this.refs.services.resetSeletedRows();
        this.props.handleChangeTab(key);
    }

    render() {


        return (
            <Fragment>
                <div>
                    {(this.props.applyServicesValue === 'extend' && this.props.device.finalStatus !== DEVICE_TRIAL) ?
                        <Button
                            type="primary"
                            onClick={() => this.props.handleRenewService()}
                            style={{ float: "right" }}
                        >
                            {convertToLang(this.props.translation[DUMY_TRANS_ID], "RENEW CURRENT SERVICES")}
                        </Button>
                        : null
                    }
                    <Tabs type="card" className="services_tabs " activeKey={this.props.tabselect} onChange={this.callback}>
                        {(this.props.type !== 'edit' || (this.props.type === 'edit' && this.props.device.finalStatus === DEVICE_PRE_ACTIVATION)) ?
                            <TabPane tab={<span className="green">TRIAL</span>} key="0" >
                            </TabPane>
                            : null}
                        <TabPane tab={<span className="green">1 MONTH</span>} key="1" >
                        </TabPane>
                        <TabPane tab={<span className="green">3 MONTH</span>} key="3" >
                        </TabPane>
                        <TabPane tab={<span className="green">6 MONTH</span>} key="6" >
                        </TabPane>
                        <TabPane tab={<span className="green">12 MONTH</span>} key="12" >
                        </TabPane>
                    </Tabs>
                    <ServicesList
                        parent_packages={this.props.parent_packages}
                        product_prices={this.props.product_prices}
                        ref="services"
                        tabselect={this.props.tabselect}
                        // resetTabSelected={this.resetTabSelected}
                        user={this.props.user}
                        history={this.props.history}
                        translation={this.props.translation}
                        handleCancel={this.props.handleCancel}
                        handleServicesSubmit={this.props.handleServicesSubmit}
                        serviceTerm={this.props.tabselect}
                        user_credit={this.props.user_credit}
                        history={this.props.history}
                        current_services={this.props.current_services}
                        creditsToRefund={this.props.creditsToRefund}
                        applyServicesValue={this.props.applyServicesValue}
                        type={this.props.type}
                    />
                </div>
            </Fragment >
        )

    }
}

const WrappedAddDeviceForm = Form.create({ name: 'register' })(Services);

export default WrappedAddDeviceForm;



function showConfirm(_this) {
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