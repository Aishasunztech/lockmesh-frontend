import React, { Component, Fragment } from 'react'
import styles from './AppList';
import { Card, Table, Icon, Button, Modal, Row, Col, Popconfirm, message, Popover } from "antd";
import { getStatus, getColor, checkValue, titleCase, convertToLang, convertTimezoneValue } from '../../../routes/utils/commonUtils'
import { Redirect, Link } from 'react-router-dom';
import ResetPinModal from './ResetPinModal';
import PasswordForm from './PasswordForm';
import {
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_FLAGGED,
    DEVICE_STATUS,
    DEVICE_MODE,
    DEVICE_NAME,
    DEVICE_ACTIVATION_CODE,
    DEVICE_ACCOUNT_EMAIL,
    DEVICE_PGP_EMAIL,
    DEVICE_CHAT_ID,
    DEVICE_CLIENT_ID,
    DEVICE_DEALER_ID,
    DEVICE_DEALER_PIN,
    DEVICE_MAC_ADDRESS,
    DEVICE_SIM_ID,
    DEVICE_IMEI_1,
    DEVICE_SIM_1,
    DEVICE_IMEI_2,
    DEVICE_SIM_2,
    DEVICE_SERIAL_NUMBER,
    DEVICE_MODEL,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
    DEVICE_DEALER_NAME,
    DEVICE_PARENT_ID,
    DEVICE_PARENT_NAME,
    USER_ID,
    IP_ADDRESS,
    OFFLINE,
    REMAINING_TERM_DAYS,
    ONLINE,
    DEVICE_TYPE,
    DEVICE_VERSION,
    DEVICE_FIRMWAREINFO, DO_YOU_WANT_TO_APPLY, POLICY_ON_DEVICE
} from '../../../constants/DeviceConstants';
import { Button_Cancel, Button_Ok, Button_Refresh } from '../../../constants/ButtonConstants';
import { ADMIN } from '../../../constants/Constants';
// import moment from 'moment';
import moment from 'moment-timezone';
import WipeDevice from "./wipeDevice";
import { DATE_FORMAT, TIMESTAMP_FORMAT } from '../../../constants/Application';
import { CHAT_ID_SETTINGS } from '../../../constants/ActionTypes';
const confirm = Modal.confirm;
let make_red = 'captilize';
let chatId = '';

export default class DeviceSidebar extends Component {
    // constructor(props){
    //     super(props);
    // }
    // componentDidMount(){

    // }
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            resetPinModal: false,
            user_id: '',
            dealer_id: '',
            goToPage: '/dealer/dealer',
            confirmChatIdModal: false,
            confirmPgpModal: false,
            pwdConfirmModal: false,
            chatIdSettingsEnable: false,
            chatIdActionType: ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.chatIdSettingsEnable !== prevProps.chatIdSettingsEnable) {
            let pwdConfirmModal = this.state.pwdConfirmModal;

            if (this.props.chatIdSettingsEnable) {
                pwdConfirmModal = false;

                if (this.state.chatIdActionType === 'reset_pin') {
                    this.refs.resetPinModel.showModel();
                } else if (this.state.chatIdActionType === 'disable_pin') {
                    this.showConfirmSChatStatus(this, 'disable', 'Do you want to disable pin verification?');
                } else if (this.state.chatIdActionType === 'enable_pin') {
                    this.showConfirmSChatStatus(this, 'enable', 'Do you want to enable pin verification?');
                }
            }
            this.setState({
                pwdConfirmModal,
                chatIdActionType: '',
                chatIdSettingsEnable: this.props.chatIdSettingsEnable
            });
        }
    }

    handleConfirmBoxChatId = (visible) => {
        this.setState({
            confirmChatIdModal: visible
        })
        // message.info('Clicked on Yes.');
    }
    handleConfirmBoxPgpEmail = (visible) => {
        this.setState({
            confirmPgpModal: visible
        })
        // message.info('Clicked on Yes.');
    }

    resetLimit = (user_acc_id) => {
        if (user_acc_id && this.props.auth.authUser.type === ADMIN) {
            confirmPgpAction(this, user_acc_id, "Are you sure you want to reset pgp emails limit on this device ?", this.props.resetPgpLimit)
        }
    }

    renderDetailsData(device_details) {
        chatId = checkValue(device_details.chat_id);
        // console.log(device_details, 'device is')

        //  let status = getStatus(device_details.status, device_details.account_status, device_details.unlink_status, device_details.device_status, device_details.activation_status);
        let color = getColor(device_details.finalStatus)


        // let device_status = 'Active';

        // if ((device_details.status === 'expired')) {
        //     device_status = 'Expired';
        //     make_red = 'make_red captilize'
        // } else if (device_details.account_status === 'suspended') {
        //     device_status = 'Suspended';
        //     make_red = 'make_red captilize'
        // } else if (device_details.unlink_status === 1) {
        //     device_status = 'Unlinked';
        //     make_red = 'make_red captilize'
        // } else {
        //     device_status = 'Active';
        //     make_red = 'captilize'
        // }
        // console.log(device_details);

        return [
            {
                key: 1,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_STATUS], "STATUS"))}:</a>),
                value: <span style={color}>{checkValue(device_details.finalStatus)}</span>,
            },
            {
                key: 26,
                name: (<a>{titleCase(convertToLang(this.props.translation[REMAINING_TERM_DAYS], 'REMAINING TERM DAYS'))}:</a>),
                value: (device_details.remainTermDays > 0) ? device_details.remainTermDays : 0
            },
            {
                key: 29,
                name: (<a>{titleCase(convertToLang(this.props.translation["Last Online"], "Last Online"))}:</a>),
                value: convertTimezoneValue(this.props.auth.authUser.timezone, device_details.lastOnline),
                // value: (device_details.lastOnline) ? moment(device_details.lastOnline).tz(convertTimezoneValue(this.props.auth.authUser.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                // value: checkValue(device_details.lastOnline)
                // value: moment(device_details.lastOnline).format("MM/DD/YYYY HH:mm:ss")
            },
            {
                key: 2,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MODE], "MODE"))}:</a>),
                value: device_details.online ? (device_details.online === "online") ? (<span style={{ color: "green" }}>{titleCase(convertToLang(this.props.translation[ONLINE], "Online"))}</span>) : (<span style={{ color: "red" }}>{titleCase(convertToLang(this.props.translation[OFFLINE], "Offline"))}</span>) : "N/A"
            },
            {
                key: 4,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_TYPE], "TYPE"))}:</a>),
                value: checkValue(device_details.type)
            },
            {
                key: 533,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_VERSION], "VERSION"))}:</a>),
                value: checkValue(device_details.version)
            },
            {
                key: 5,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_FIRMWAREINFO], "FIRMWARE INFO"))}:</a>),
                value: <span >{checkValue(device_details.firmware_info)}</span>
            },
            {
                key: 3,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_FLAGGED], "FLAGGED"))}:</a>),
                value: (device_details.flagged === '') ? "Not Flagged" : device_details.flagged
            },
            {
                key: 6,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_NAME], "DEVICE NAME"))}:</a>),
                value: (<span className="captilize">{checkValue(device_details.name)}</span>)
            },
            {
                key: 7,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL"))}:</a>),
                value: checkValue(device_details.account_email)
            },
            {
                key: 9,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_ACTIVATION_CODE], "ACTIVATION-CODE"))}:</a>),
                value: checkValue(device_details.activation_code)
            },
            {
                key: 8,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_PGP_EMAIL], "PGP EMAIL"))}:</a>),
                value: (device_details.pgp_email && device_details.pgp_email !== "N/A" ? <Fragment>
                    <div className="gutter-box">{device_details.pgp_email}
                        {(this.props.auth.authUser.type === ADMIN) ?
                            <Popover
                                // placement="rightTop"
                                title={<div>PGP Email Settings <i className="fa fa-window-close" style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.handleConfirmBoxPgpEmail(false)} aria-hidden="true"></i> </div>}
                                trigger="click"
                                visible={this.state.confirmPgpModal}
                                content={
                                    <Fragment>
                                        <Row gutter={16}>
                                            <Col className="gutter-row" span={24}>
                                                <Button
                                                    type="danger"
                                                    size="small"
                                                    style={{ width: '100%' }}
                                                    // className="ml-12"
                                                    onClick={() => {
                                                        this.resetLimit(device_details.id)
                                                    }}>
                                                    {titleCase(convertToLang(this.props.translation[''], 'RESET LIMIT (10+)'))}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Fragment>
                                }
                            >
                                <Button size='small' type='primary' className='edit_btn_cp' onClick={() => this.handleConfirmBoxPgpEmail(!this.state.confirmPgpModal)}>
                                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                </Button>
                            </Popover>
                            : null
                        }
                    </div>
                </Fragment> : "N/A")
            },
            {
                key: 16,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_ID], "SIM ID"))}:</a>),
                value: checkValue(device_details.sim_id)
            },
            {
                key: 1222,
                name: (<a href="javascript:void(0)">{titleCase(convertToLang(this.props.translation[""], "SIM ID 2"))}:</a>),
                value: checkValue(device_details.sim_id2)
            },

            {
                key: 10,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_CHAT_ID], "CHAT ID"))}:</a>),
                value: (chatId && chatId !== "N/A" ? <Fragment>
                    <div className="gutter-box">{chatId}

                        <Popover
                            // placement="rightTop"
                            title={<div>Chat ID Settings <i className="fa fa-window-close" style={{ float: 'right', cursor: 'pointer' }} onClick={() => this.handleConfirmBoxChatId(false)} aria-hidden="true"></i> </div>}
                            trigger="click"
                            visible={this.state.confirmChatIdModal}
                            onVisibleChange={this.handleVisibleChange}
                            content={
                                <Fragment>
                                    <Row gutter={16}>
                                        <Col className="gutter-row" span={8}>
                                            <Button
                                                type="danger"
                                                size="small"
                                                style={{ width: '100%' }}
                                                // className="ml-12"
                                                onClick={() => {
                                                    // this.refs.resetPinModel.showModel();
                                                    this.setState({
                                                        confirmChatIdModal: false,
                                                        pwdConfirmModal: true,
                                                        chatIdActionType: 'reset_pin'
                                                    })
                                                }}>
                                                {titleCase(convertToLang(this.props.translation[''], 'RESET PIN'))}
                                            </Button>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <Button
                                                type="danger"
                                                size="small"
                                                style={{ width: '100%' }}
                                                // className="ml-12"
                                                onClick={() => {
                                                    // this.showConfirmSChatStatus(this, 'disable', 'Do you want to disable pin verification?');
                                                    this.setState({
                                                        confirmChatIdModal: false,
                                                        pwdConfirmModal: true,
                                                        chatIdActionType: 'disable_pin'
                                                    })
                                                }}>
                                                {titleCase(convertToLang(this.props.translation[''], 'Disable Pin'))}
                                            </Button>
                                        </Col>
                                        <Col className="gutter-row" span={8}>
                                            <Button
                                                type="success"
                                                size="small"
                                                style={{ width: '100%' }}
                                                // className="ml-12"
                                                onClick={() => {
                                                    // this.showConfirmSChatStatus(this, 'enable', 'Do you want to enable pin verification?'); 
                                                    this.setState({
                                                        confirmChatIdModal: false,
                                                        pwdConfirmModal: true,
                                                        chatIdActionType: 'enable_pin'
                                                    })
                                                }}>
                                                {titleCase(convertToLang(this.props.translation[''], 'Enable Pin'))}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Fragment>
                            }
                        >
                            <Button size='small' type='primary' className='edit_btn_cp' onClick={() => this.handleConfirmBoxChatId(!this.state.confirmChatIdModal)}>
                                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                            </Button>
                        </Popover>
                        {/* <Button size='small' type='primary' className='ml-16'> <i class="fa fa-pencil-square-o mb-0" aria-hidden="true"></i></Button> */}
                    </div>
                </Fragment> : "N/A")
            },
            {
                key: 12,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_ID], "DEALER-ID"))}:</a>),
                value: checkValue(device_details.dealer_id)
            },
            {
                key: 13,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_NAME], "DEALER NAME"))}:</a>),
                // value: (<span className="captilize">{(this.props.auth.authUser.type === ADMIN) ? <a onClick={() => { this.goToDealer(device_details) }}>{checkValue(device_details.dealer_name)}</a> : <a >{checkValue(device_details.dealer_name)}</a>}</span>)
                value: (<span className="captilize">{(this.props.auth.authUser.type === ADMIN && device_details.dealer_id) ? <Link
                    to={`/connect-dealer/${btoa(device_details.dealer_id.toString())}`.trim()}
                >
                    {checkValue(device_details.dealer_name)}</Link> : <a >{checkValue(device_details.dealer_name)}</a>}</span>)
            },
            {
                key: 14,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_PIN], "DEALER PIN"))}:</a>),
                value: checkValue(device_details.link_code)
            },

            // {
            //     key: 11,
            //     name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_CLIENT_ID], "CLIENT-ID"))}:</a>),
            //     value: checkValue(device_details.client_id)
            // },
            {
                key: 24,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_PARENT_ID], "PARENT DEALER ID"))}:</a>),
                value: device_details.prnt_dlr_id ? device_details.prnt_dlr_id : 'N/A', // checkValue(device_details.prnt_dlr_id) // checkValue(device_details.s_dealer)
            },
            {
                key: 25,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_PARENT_NAME], "PARENT DEALER NAME"))}:</a>),
                value: device_details.prnt_dlr_name ? device_details.prnt_dlr_name : 'N/A', // checkValue(device_details.prnt_dlr_name) // checkValue(device_details.s_dealer_name)
            },

            {
                key: 15,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MAC_ADDRESS], "MAC-ADDRESS"))}:</a>),
                value: checkValue(device_details.mac_address)
            },
            {
                key: 17,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI-1"))}:</a>),
                value: checkValue(device_details.imei)
            },
            {
                key: 18,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_1], "SIM-1"))}:</a>),
                value: checkValue(device_details.simno)
            },
            {
                key: 19,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI-2"))}:</a>),
                value: checkValue(device_details.imei2)
            },
            {
                key: 20,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_2], "SIM-2"))}:</a>),
                value: checkValue(device_details.simno2)
            },

            {
                key: 21,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SERIAL_NUMBER], "SERIAL-NUMBER"))}:</a>),
                value: checkValue(device_details.serial_number)
            },
            {
                key: 22,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MODEL], "MODEL"))}:</a>),
                value: checkValue(device_details.model)
            },
            {
                key: 23,
                name: (<a>{titleCase(convertToLang(this.props.translation[IP_ADDRESS], "IP-ADDRESS"))}:</a>),
                value: checkValue(device_details.ip_address)
            },

            {
                key: 27,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_START_DATE], "START DATE"))}:</a>),
                value: convertTimezoneValue(this.props.auth.authUser.timezone, device_details.start_date, false, DATE_FORMAT),
                // value: (device_details.start_date) ? moment(device_details.start_date).tz(convertTimezoneValue(this.props.auth.authUser.timezone)).format("YYYY/MM/DD") : 'N/A',
                // value: checkValue(device_details.start_date)
            },
            {
                key: 28,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"))}:</a>),
                value: convertTimezoneValue(this.props.auth.authUser.timezone, device_details.expiry_date, false, DATE_FORMAT),
                // value: (device_details.expiry_date) ? moment(device_details.expiry_date).tz(convertTimezoneValue(this.props.auth.authUser.timezone)).format("YYYY/MM/DD") : 'N/A',
                // value: checkValue(device_details.expiry_date)
            },

            {
                key: 30,
                name: (<a>{titleCase(convertToLang(this.props.translation["Note"], "Note"))}:</a>),
                value: checkValue(device_details.note)
            }
        ]
    }
    handleUserId = (user_id) => {
        if (user_id !== 'null' && user_id !== null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    };

    handleResetPinModal = (visible) => {
        this.setState({
            servicesModal: visible,
        })
    };

    showConfirmSChatStatus(_this, type, msg) {
        this.props.closeChatIdSettingsEnable();
        confirm({
            title: convertToLang(_this.props.translation[''], msg),
            onOk() {
                _this.props.changeSchatPinStatus({
                    type: type,
                    chat_id: chatId
                });
            },
            okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
            onCancel() { },
        });
    }

    goToDealer = (dealer) => {
        if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
            if (this.props.auth.authUser.type === ADMIN) {
                this.props.history.push(`/connect-dealer/${btoa(dealer.dealer_id.toString())}`.trim())
            } else {
                if (dealer.connected_dealer === 0 || dealer.connected_dealer === '' || dealer.connected_dealer === null) {
                    this.setState({
                        redirect: true,
                        dealer_id: dealer.dealer_id,
                        goToPage: '/dealer/dealer'
                    })
                } else {
                    this.setState({
                        redirect: true,
                        dealer_id: dealer.dealer_id,
                        goToPage: '/dealer/sdealer'
                    })
                }

            }
        }
    }

    renderDetailsColumns(device_details) {
        return [
            {
                title: <div>
                    <p style={{ margin: "8px 0" }}>{convertToLang(this.props.translation[DEVICE_ID], "ID")}:</p>
                    <p style={{ margin: "8px 0" }}>{convertToLang(this.props.translation[USER_ID], USER_ID)}:</p>
                </div>,
                dataIndex: 'name',
                className: "device_info",
                width: 110,
            },
            {
                key: 0,
                title: (
                    <div>
                        <a className="ref-btn" onClick={() => {
                            this.props.refreshDevice(device_details.device_id, true)
                        }}>
                            <Icon type="sync" spin className="loading_icon" />
                            <Icon type="reload" />
                            {convertToLang(this.props.translation[Button_Refresh], "Refresh")}
                        </a>
                        <div>
                            <p style={{ margin: "8px 0" }}>{device_details.device_id}</p>
                        </div>
                        <p style={{ margin: "8px 0" }}>{<a onClick={() => { this.handleUserId(device_details.user_id) }}>{checkValue(device_details.user_id)}</a>}</p>
                    </div>
                ),
                dataIndex: 'value',
                className: "device_value",
                width: "auto",
            }
        ]
    }

    handlePwdConfirmModal = (visible) => {
        this.setState({
            pwdConfirmModal: visible
        })
    }
    render() {
        const { redirect } = this.state
        if (redirect && this.state.user_id !== '') {
            return <Redirect
                to={{
                    pathname: '/users',
                    state: { id: this.state.user_id }
                }} />
        }

        if (redirect && this.state.dealer_id !== '') {
            return <Redirect
                to={{
                    pathname: this.state.goToPage,
                    state: { id: this.state.dealer_id }
                }} />
        }
        return (
            <Card>
                <Table
                    columns={this.renderDetailsColumns(this.props.device_details)}
                    dataSource={
                        this.renderDetailsData(this.props.device_details)
                    }
                    scroll={{ y: 551 }}
                    pagination={false}
                />
                <ResetPinModal
                    ref='resetPinModel'
                    chatId={chatId}
                    resetChatPin={this.props.resetChatPin}
                    translation={this.props.translation}
                    closeChatIdSettingsEnable={this.props.closeChatIdSettingsEnable}
                />

                <Modal
                    maskClosable={false}
                    style={{ top: 20 }}
                    width="330px"
                    className="push_app"
                    title=""
                    visible={this.state.pwdConfirmModal}
                    footer={false}
                    onOk={() => {
                    }}
                    onCancel={() => {
                        this.handlePwdConfirmModal(false)
                        this.refs.pswdForm.resetFields()
                    }
                    }
                >
                    <PasswordForm
                        checkPass={this.props.checkPass}
                        actionType={CHAT_ID_SETTINGS}
                        handleCancel={this.handlePwdConfirmModal}
                        translation={this.props.translation}
                        ref='pswdForm'
                    />
                </Modal >
            </Card>
        )
    }
}
function confirmPgpAction(_this, user_acc_id, msg, action) {
    confirm({
        title: msg,
        okText: "CONFIRM",
        onOk() {
            action(user_acc_id)
            _this.setState({
                confirmPgpModal: false
            })
        }
    })
}
