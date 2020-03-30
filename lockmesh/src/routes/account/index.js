import React, { Component, Fragment } from "react";
// import {Route, Switch} from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from 'react-router-dom';
import styles from './account.css'
import { Markup } from 'interweave';
import {
    importCSV,
    exportCSV,
    releaseCSV,
    getUsedPGPEmails,
    getUsedChatIds,
    getUsedSimIds,
    insertNewData,
    createBackupDB,
    checkPass,
    showBackupModal,
    // saveIDPrices,
    // setPackage,
    getPackages,
    purchaseCredits,
    purchaseCreditsFromCC
} from "../../appRedux/actions/Account";

import { convertToLang, checkIsArray } from '../utils/commonUtils';


import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider } from "antd";
import { BASE_URL, HOST_NAME } from "../../constants/Application";
import {
    MANAGE_DATA,
    BACKUP_DATABASE,
    PURCHASE_CREDITS,
    PACKAGES_AND_IDS,
    ACCOUNT_MANAGE_DATA_01,
    ACCOUNT_MANAGE_DATA_02,
    ACCOUNT_MANAGE_DATA_03,
    UPLOAD_FILE,
    UPLOAD_FILE_Ext,
    BACKUP_DATABASE_DESCRIPTION,
    PURCHASE_CREDITS_DESCRIPTION,
    PACKAGES_AND_IDS_01,
    PACKAGES_AND_IDS_02,
    PACKAGES_AND_IDS_03,
    BACKUP_NOW,
    BACKUP_DATABASE_DESCRIPTION_OF_MODAL_BODY,
    DUPLICATE_DATA,
    NEW_DATA,
} from "../../constants/AccountConstants";

import {
    Button_Open,
    Button_BUY,
    Button_Ok,
    Button_Cancel,
    Button_submit,
    Button_BackupNow
} from '../../constants/ButtonConstants'
import {
    getSimIDs,
    getChatIDs,
    getPGPEmails,
} from "../../appRedux/actions/Devices";

import PasswordForm from '../ConnectDevice/components/PasswordForm';
import PurchaseCredit from "./components/PurchaseCredit";
import { ADMIN, PUSH_APP_TEXT, DEALER, SDEALER } from "../../constants/Constants";
import { APP_ADD_MORE } from "../../constants/AppConstants";
// import SetPricingModal from './PricesPakages/SetPricingModal';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error

class PasswordModal extends Component {
    // console.log('object,', props.actionType)
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showPwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    actionType='back_up'
                    handleCancel={this.props.showPwdConfirmModal}
                    ref='pswdForm'
                    translation={this.props.translation}
                />
            </Modal >
        )
    }
}

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fieldName: '',
            fieldValue: '',
            file: null,
            dataVisible: false,
            dataFieldName: '',
            dataFieldTitle: '',
            purchase_modal: false,
            selectedRowKeys: [],
            duplicate_ids: [],
            newData: [],
            duplicate_modal_show: false,
            showBackupModal: false,
            pwdConfirmModal: false,
            pricing_modal: false,
        }
    }

    showImportModal = (visible, fieldName = "", fieldValue = "") => {
        // console.log(fieldName);
        this.setState({
            visible: visible,
            fieldName: fieldName,
            fieldValue: fieldValue
        });
    }

    componentDidMount() {
    }
    componentDidUpdate(prevProps, nextProps) {
        if (prevProps !== nextProps) {
            // this.setState({
            //     sim_ids: nextProps.sim_ids,
            //     pgp_emails: nextProps.pgp_emails,
            //     chat_ids: nextProps.chat_ids
            // });
            // this.setState({
            //     sim_ids: this.props.sim_ids,
            //     pgp_emails: this.props.pgp_emails,
            //     chat_ids: this.props.chat_ids,
            // });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.backUpModal !== nextProps.backUpModal) {
            // if (this.props.sim_ids.length !== nextProps.sim_ids.length || this.props.pgp_emails.length !== nextProps.pgp_emails.length || this.props.chat_ids.length !== nextProps.chat_ids.length) {
            this.setState({
                newData: nextProps.newData,
                backUpModal: nextProps.backUpModal
            });
        } else if (this.props.duplicate_modal_show !== nextProps.duplicate_modal_show) {
            this.setState({
                newData: nextProps.newData
            })
        }
    }
    createBackupDB = () => {

        this.props.createBackupDB();
        this.setState({
            backUpModal: false
        })
        this.props.showBackupModal(false)

    }


    uploadFile = (file) => {
        this.setState({
            file: file
        })
    }
    handleSubmit = (e) => {
        if (this.state.file !== null) {
            // console.log(this.state.file);
            const formData = new FormData();
            if (this.state.fieldName === "sim_ids") {
                // console.log(this.state.fieldName);
                formData.append('sim_ids', this.state.file);
            } else if (this.state.fieldName === "chat_ids") {
                // console.log(this.state.fieldName);
                formData.append('chat_ids', this.state.file);
            } else if (this.state.fieldName === "pgp_emails") {
                // console.log(this.state.fieldName);
                formData.append('pgp_emails', this.state.file);
            }
            // formData.append('fieldName', this.state.fieldName);
            // console.log(formData);
            this.state.file = null
            this.props.importCSV(formData, this.state.fieldName);
            this.showImportModal(false);
        }
    }
    exportCSV = (fieldName) => {
        this.props.exportCSV(fieldName);
    }

    showPwdConfirmModal = (visible) => {
        // alert('hello');
        this.setState({
            pwdConfirmModal: visible,
        })
    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] !== null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    showModal = () => {
        this.setState({
            visible1: true,
        });
    }
    showBackupModal = () => {
        this.setState({
            backUpModal: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible1: false,
            selectedRowKeys: []
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.props.showBackupModal(false)
        this.setState({
            visible1: false,
            backUpModal: false,
            selectedRowKeys: [],
        });
    }

    handleCancelDuplicate = () => {
        this.setState({
            duplicate_modal_show: false
        })
        this.props.insertNewData({ newData: [], submit: false });
    }


    InsertNewData = () => {
        let data = {
            newData: this.state.newData,
            type: this.state.duplicate_data_type,
            submit: true
        }
        this.props.insertNewData(data);
        this.handleCancelDuplicate();
    }

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    showConfirm = (msg, _this, pageName, id = 0) => {
        if (_this.state.selectedRowKeys.length > 0 || id !== 0) {
            confirm({
                title: 'WARNING! ' + msg,
                okText: "Confirm",
                onOk() {
                    if (id !== 0) {
                        _this.props.releaseCSV(pageName, [id]);
                    }
                    else if (_this.state.selectedRowKeys.length > 0) {
                        _this.props.releaseCSV(pageName, _this.state.selectedRowKeys)
                    }
                },
                onCancel() {

                },
            });
        }
    }
    showPurchaseModal = (e, visible) => {
        this.setState({
            purchase_modal: visible
        })
    };

    showPricingModal = (visible) => {
        this.setState({
            pricing_modal: visible
        });
    }

    render() {
        let type = this.props.user.type
        let styleType = {};
        if (type === ADMIN) {
            styleType = "manage_ac"
        } else {
            styleType = "manage_ac"
        }
        if (this.props.showMsg) {
            if (this.props.msg === "imported successfully") {
                success({
                    title: this.props.msg,
                });
            } else {
                error({
                    title: this.props.msg,
                });
            }

        }


        const { file, selectedRowKeys, } = this.state
        // console.log(this.state.used_chat_ids_page);
        let self = this;
        const props = {
            name: 'file',
            multiple: false,
            // accept: [".xls", ".csv", ".xlsx"],
            accept: ".xls; *.csv; *.xlsx;",
            // accept: ".xls",
            // processData: false,
            beforeUpload: (file) => {
                // console.log(file);
                this.setState({
                    file: file
                });
                return false;
            },
            // action: '//jsonplaceholder.typicode.com/posts/',
            onChange(info) {
                // console.log(info);
                if (info.fileList.length === 0) {
                    self.uploadFile(null);
                }
            },
            fileList: (file === null) ? null : [file]
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };


        const duplicateModalColumns = [
            {
                title: 'SIM ID',
                align: "center",
                dataIndex: 'sim_id',
                key: "sim_id",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'START DATE',
                align: "center",
                dataIndex: 'start_date',
                key: "start_date",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'EXPIRY DATE',
                align: "center",
                dataIndex: 'expiry_date',
                key: "expiry_date",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'CHAT IDS',
                align: "center",
                dataIndex: 'chat_id',
                key: "chat_id",
                className: this.state.duplicate_data_type === 'chat_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'PGP EMAILS',
                align: "center",
                dataIndex: 'pgp_email',
                key: "pgp_email",
                className: this.state.duplicate_data_type === 'pgp_email' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            }
        ]

        return (

            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}>
                </Row>
                <div style={{ marginTop: -60 }}>
                    <Row>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8} >
                            <Link to="/account/balance_info" onClick={this.showModal}>
                                {/* <Link to="#" > */}
                                <Card className="manage_ac" style={{ borderRadius: 12 }}>
                                    <div>
                                        <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[""], "Account Balance Info")} </h2>
                                        <Divider className="mb-0" />
                                        <Row style={{ padding: '12px 0 0px' }}>
                                            <Col span={7} className="" style={{ textAlign: "center" }}>
                                                <Icon type="form" className="and_icon" />
                                            </Col>
                                            <Col span={16} style={{ padding: 0 }} className="crd_txt">
                                                <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[""], "View Account Balance/ Account balance Status")} />  </h5>
                                                <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[""], "View OverDue Invoices Details")} /> </h5>
                                                <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[""], "View Credits Purchase History")} />  </h5>
                                                <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                                <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                            </Link>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <div>
                                    <a href="javascript:void(0)"
                                        onClick={(e) => {
                                            this.showPurchaseModal(e, true);
                                        }}
                                    >
                                        <Card style={{ borderRadius: 12 }} className="manage_ac">
                                            <div className="profile_table image_1">
                                                <Fragment>
                                                    <div className="ac_card">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[PURCHASE_CREDITS], "Purchase Credits")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="dollar" className="and_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <h5>{convertToLang(this.props.translation[PURCHASE_CREDITS_DESCRIPTION], "Buy more Credits instantly with Bitcoin or Credit card and check out using our secure payment gateway.")}</h5>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Fragment>
                                            </div>
                                        </Card>
                                        <Button type="default" style={{ backgroundColor: "red", color: "#fff" }} size="small" className="open_btn">{convertToLang(this.props.translation[Button_BUY], "Buy")}</Button>
                                    </a>
                                    <PurchaseCredit
                                        showPurchaseModal={this.showPurchaseModal}
                                        purchase_modal={this.state.purchase_modal}
                                        purchaseCredits={this.props.purchaseCredits}
                                        purchaseCreditsFromCC={this.props.purchaseCreditsFromCC}
                                        translation={this.props.translation}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Link to={"/reporting"}>
                                    <Card style={{ borderRadius: 12 }} className="manage_ac">
                                        <div className="profile_table image_1">
                                            <Fragment>
                                                <Row>
                                                    <div className="col-md-12 ac_card">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[''], "Reports")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="file-pdf" className="and_icon" />

                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <div className="crd_txt">
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Run Reports on Sales, Inventory, Profit/loss, Payment history, etc...")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Ability to select date range for each reports")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Run reports on individual Dealers/SDealers")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Export Reports in PDF format")}</h5>
                                                                    <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            </Fragment>
                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                {/* <a href="javascript:void(0)" onClick={() => this.showPricingModal(true)}> */}
                                <Link to={"/set-prices"}>
                                    {/* <Link to={"/set-prices/" + this.props.whiteLabelInfo.name}> */}
                                    <Card style={{ borderRadius: 12 }} className={`${styleType}`}>
                                        <div className="profile_table image_1">
                                            <Fragment>
                                                <Row>
                                                    <div className="col-md-12 ac_card">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[PACKAGES_AND_IDS], "Packages and ID's")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="control" className="and_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <div className="crd_txt">
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_01], "Distribute tokens")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_02], "Set prices and delay for each token")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_03], "Set permissions for Tokens")}</h5>
                                                                    <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            </Fragment>
                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                    {/* </a> */}
                                </Link>
                                {/* <div className="middle">
                                        <SetPricingModal
                                            showPricingModal={this.showPricingModal}
                                            pricing_modal={this.state.pricing_modal}
                                            // LabelName = {this.props.whiteLabelInfo.name}
                                            saveIDPrices={this.props.saveIDPrices}
                                            setPackage={this.props.setPackage}
                                        // whitelabel_id={this.props.whiteLabelInfo.id}

                                        />
                                    </div> */}
                                {/* <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div> */}
                            </div>
                        </Col>
                        {(this.props.user.type === ADMIN) ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to={"/device-messages"}>
                                        <Card style={{ borderRadius: 12 }} className="manage_ac">
                                            <div className="profile_table image_1">
                                                <Fragment>
                                                    <Row>
                                                        <div className="col-md-12 ac_card">
                                                            <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[''], "Device Messages")} </h2>
                                                            <Divider className="mb-0" />
                                                            <Row style={{ padding: '12px 0 0px' }}>
                                                                <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                    <Icon type="notification" className="and_icon" />
                                                                    {/* <Icon type="message" /> */}
                                                                </Col>
                                                                <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                    <div className="crd_txt">
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Send messages to device")}</h5>
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Select multiple or single devices to send your messages")}</h5>
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Repeat messages to devices")}</h5>
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[''], "Set delays or timers for each messages")}</h5>
                                                                        <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Row>
                                                </Fragment>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                    </Link>
                                </div>
                            </Col>
                            : null}
                        {(this.props.user.type === ADMIN || this.props.user.type === DEALER || this.props.user.type === SDEALER) ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8} >
                                <Link to="/account/managedata" onClick={this.showModal}>
                                    {/* <Link to="#" > */}
                                    <Card className="manage_ac" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[MANAGE_DATA], "Manage ID Inventory")} </h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0 0px' }}>
                                                <Col span={7} className="" style={{ textAlign: "center" }}>
                                                    <Icon type="form" className="and_icon" />
                                                </Col>
                                                <Col span={16} style={{ padding: 0 }} className="crd_txt">
                                                    <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_01], "Manage ID Inventory such as SIM ID, <br style={{ marginLeft: 4 }} />CHAT ID, PGP Email, etc..")} />  </h5>
                                                    <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_02], "View/Edit your data")} /> </h5>
                                                    <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_03], "Release previously used data back to system")} />  </h5>
                                                    <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                </Link>
                            </Col>
                            : null}
                        {(this.props.user.type === ADMIN || this.props.user.type === DEALER) ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    {/* <a href="javascript:void(0)" onClick={() => this.showPricingModal(true)}> */}
                                    <Link to={"/domains"}>
                                        {/* <Link to={"/set-prices/" + this.props.whiteLabelInfo.name}> */}
                                        <Card style={{ borderRadius: 12 }} className="manage_ac">
                                            <div className="profile_table image_1">
                                                <Fragment>
                                                    <Row>
                                                        <div className="col-md-12 ac_card">
                                                            <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[""], "Manage Domains")} </h2>
                                                            <Divider className="mb-0" />
                                                            <Row style={{ padding: '12px 0 0px' }}>
                                                                <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                    <Icon type="global" className="and_icon" />
                                                                </Col>
                                                                <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                    <div className="crd_txt">
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation["PACKAGES_AND_IDS_01"], "Admin Permission to Dealers/SDealer on Domain access")}</h5>
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation["PACKAGES_AND_IDS_02"], "Dealer Permissions to SDealer on Domain access")}</h5>
                                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation["PACKAGES_AND_IDS_03"], "Allows for exclusive or certain Domains to be attributed to Dealers/Sdealers")}</h5>
                                                                        <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Row>
                                                </Fragment>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        {/* </a> */}
                                    </Link>
                                    {/* <div className="middle">
                                        <SetPricingModal
                                            showPricingModal={this.showPricingModal}
                                            pricing_modal={this.state.pricing_modal}
                                            // LabelName = {this.props.whiteLabelInfo.name}
                                            saveIDPrices={this.props.saveIDPrices}
                                            setPackage={this.props.setPackage}
                                        // whitelabel_id={this.props.whiteLabelInfo.id}

                                        />
                                    </div> */}
                                    {/* <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div> */}
                                </div>
                            </Col>
                            : null}
                        {(this.props.user.type === ADMIN) ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8} >
                                <Modal
                                    width="400px"
                                    className="back_db"
                                    maskClosable={false}
                                    title={<div>{convertToLang(this.props.translation[BACKUP_DATABASE], "BACKUP DATABASE")}</div>}
                                    visible={this.state.backUpModal}
                                    onOk={this.createBackupDB}
                                    onCancel={this.handleCancel}
                                    okText={convertToLang(this.props.translation[Button_BackupNow], "BACKUP NOW")}
                                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                    okButtonDisabled={true}
                                    centered
                                >
                                    <div>
                                        <p style={{ margin: 13 }}>{convertToLang(this.props.translation[BACKUP_DATABASE_DESCRIPTION_OF_MODAL_BODY], "Hit 'BACKUP NOW' button below to back up your complete system database. To access your database unzip generated Files first and open in Excel.")} </p>
                                    </div>
                                </Modal>
                                <div>
                                    <div>
                                        <Link to="#" onClick={() => this.showPwdConfirmModal(true)}>
                                            <Card className="manage_ac" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <div>
                                                        <h2 style={{ textAlign: "center", width: "80%", margin: "0 auto" }}>
                                                            <Icon type="lock" className="lock_icon2" />
                                                            {convertToLang(this.props.translation[BACKUP_DATABASE], "BACKUP DATABASE")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="database" className="and_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <h5>
                                                                    {convertToLang(this.props.translation[BACKUP_DATABASE_DESCRIPTION], "This feature allows you to keep a backup of the complete system database for offline safekeeping")}
                                                                </h5>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </Link>
                                        {/* <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div> */}
                                    </div>
                                </div>
                            </Col>
                            : null}
                    </Row>
                </div>
                <PasswordModal
                    translation={this.props.translation}
                    pwdConfirmModal={this.state.pwdConfirmModal}
                    showPwdConfirmModal={this.showPwdConfirmModal}
                    checkPass={this.props.checkPass}
                    translation={this.props.translation}
                />
            </div>
        );
    }
}

// export default Account;
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        importCSV: importCSV,
        exportCSV: exportCSV,
        releaseCSV: releaseCSV,
        insertNewData: insertNewData,
        createBackupDB: createBackupDB,
        checkPass: checkPass,
        showBackupModal: showBackupModal,
        // saveIDPrices: saveIDPrices,
        // setPackage: setPackage,
        getPackages: getPackages,
        purchaseCredits: purchaseCredits,
        purchaseCreditsFromCC: purchaseCreditsFromCC
    }, dispatch);
}

var mapStateToProps = ({ account, devices, settings, auth }) => {
    return {
        msg: account.msg,
        showMsg: account.showMsg,
        newData: account.newData,
        backUpModal: account.backUpModal,
        translation: settings.translation,
        user: auth.authUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
