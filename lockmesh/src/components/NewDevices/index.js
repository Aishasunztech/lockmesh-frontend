import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, Form, Row, Col, Icon, Checkbox, Tabs, Badge } from 'antd';
import { withRouter, Link, Redirect } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import { ADMIN, ACTION, CREDITS, CREDITS_CASH_REQUESTS, ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST, ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST, WARNING, DEVICE_UNLINKED } from '../../constants/Constants';
import {
  checkValue, convertToLang, getDateFromTimestamp,
  getOnlyTimeFromTimestamp,
  checkIsArray
} from '../../routes/utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm, Button_Decline, Button_ACCEPT, Button_Transfer, Button_Yes, Button_No } from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME, DEALER_ID, DEALER_PIN } from '../../constants/DealerConstants';
const moment = require('moment')
const confirm = Modal.confirm;
const { TabPane } = Tabs;

export default class NewDevices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: "#", dataIndex: 'counter', key: 'counter', align: "center", render: (text, record, index) => ++index },
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEVICE_ID], "DEVICE ID"), dataIndex: 'device_id', key: 'device_id', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"), dataIndex: 'serial_number', key: 'serial_number', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_1], "SIM 1"), dataIndex: 'sim_1', key: 'sim_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI 1"), dataIndex: 'imei_1', key: 'imei_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_2], "SIM 2"), dataIndex: 'sim_2', key: 'sim_2', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI 2"), dataIndex: 'imei_2', key: 'imei_2', align: "center" },
        ];
        const columns1 = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEALER_NAME], "DEALER NAME"), dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
            { title: convertToLang(props.translation[CREDITS], "CREDITS"), dataIndex: 'credits', key: 'credits', align: "center" },
        ];

        const cancelServiceColumns = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEVICE_ID], "DEVICE ID"), dataIndex: 'device_id', key: 'device_id', align: "center" },
            { title: convertToLang(props.translation[DEALER_PIN], "DEALER PIN"), dataIndex: 'dealer_pin', key: 'dealer_pin', align: "center" },
            { title: convertToLang(props.translation[""], "SERVICE TERM"), dataIndex: 'service_term', key: 'service_term', align: "center" },
            { title: convertToLang(props.translation[""], "SERVICE REMAINING DAYS"), dataIndex: 'service_remaining_days', key: 'service_remaining_days', align: "center" },
            { title: convertToLang(props.translation[""], "CREDITS TO REFUND"), dataIndex: 'credits_to_refund', key: 'credits_to_refund', align: "center" },
        ];
        const ticketNotificationColumns = [
            { title: <Button size="small" type="primary" onClick={() => {
              let tickets = this.state.selectedTicketNotifications;
              this.setState({selectedTicketNotifications: []});
              this.props.updateTicketNotifications({ticketIds: tickets});
            }}><Icon type="eye" /></Button>, dataIndex: 'selection', key: 'action', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET SUBJECT"), dataIndex: 'subject', width: 200, key: 'ticket_subject', align: "center" },
            { title: convertToLang(props.translation[""], "DEALER NAME"), dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
            { title: convertToLang(props.translation[""], "DEALER PIN"), dataIndex: 'dealer_pin', key: 'dealer_pin', align: "center" },
            { title: convertToLang(props.translation[""], "TYPE"), dataIndex: 'type', key: 'type', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET PRIORITY"), dataIndex: 'priority', key: 'priority', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET CATEGORY"), dataIndex: 'category', key: 'category', align: "center" },
            { title: convertToLang(props.translation[""], "CREATED AT"), dataIndex: 'created_at', key: 'created_at', align: "center" },
        ];

        const supportSystemMessages = [
            {
                title: <Button size="small" type="primary" onClick={() => {
                    let selectedMessage = this.state.selectedSystemMessages;
                    this.setState({ selectedSystemMessages: [] });
                    this.props.updateSupportSystemMessageNotification({ systemMessageId: selectedMessage });
                }}><Icon type="eye" /></Button>, dataIndex: 'selection', key: 'action', align: "center"
            },
            { title: convertToLang(props.translation[""], "SUBJECT"), dataIndex: 'subject', key: 'subject', align: "center" },
            { title: convertToLang(props.translation[""], "SENDER"), dataIndex: 'sender', key: 'sender', align: "center" },
            { title: convertToLang(props.translation[""], "CREATED AT"), dataIndex: 'created_at', key: 'created_at', align: "center" },
        ];

        const supportChatColumns = [
          { title: <Button size="small" type="primary" onClick={() => {
            let selectedChat = this.state.selectedChat;
            this.props.markMessagesRead({conversations: selectedChat});
            this.setState({ selectedChat: [] });
            }}><Icon type="eye" /></Button>, dataIndex: 'action', key: 'action',  align: 'center'},
          { title: convertToLang(props.translation[""], "User"), dataIndex: 'conversation', key: 'conversation', align: 'center'},
          { title: convertToLang(props.translation[""], "No Of Unread Messages"), dataIndex: 'noOfUnreadMessages', key: 'noOfUnreadMessages', align: 'center'}
        ];

        this.state = {
            columns: columns,
            columns1: columns1,
            cancelServiceColumns: cancelServiceColumns,
            ticketNotificationColumns: ticketNotificationColumns,
            supportSystemMessages: supportSystemMessages,
            supportChatColumns: supportChatColumns,
            visible: false,
            NewDevices: [],
            NewRequests: [],
            sectionVisible: true,
            flaggedDevicesModal: false,
            reqDevice: '',
            dealers: [],
            redirect: false,
            showLInkRequest: false,
            selectedSystemMessages: [],
            systemMessagesNotifications: [],
            selectedTicketNotifications: [],
            ticketNotifications: [],
            supportChat: [],
            selectedChat: []
        }
    }

    updateSystemMessagesSelection = (e, val) => {
        let selectedMessages = this.state.selectedSystemMessages;
        if (e.target.checked) {
            this.setState({ selectedSystemMessages: [...selectedMessages, val] });
        } else {
            this.setState({ selectedSystemMessages: checkIsArray(selectedMessages).filter(message => message !== val) });
        }
    }

    updateTicketsSelection = (e, val) => {
        let selectedTickets = this.state.selectedTicketNotifications;
        if (e.target.checked) {
            this.setState({ selectedTicketNotifications: [...selectedTickets, val] });
        } else {
            this.setState({ selectedTicketNotifications: checkIsArray(selectedTickets).filter(ticket => ticket !== val) });
        }
    }

    updateChatSelection = (e, val) => {
      let selectedChat = this.state.selectedChat;
      if (e.target.checked) {
        this.setState({ selectedChat: [...selectedChat, val] });
      } else {
        this.setState({ selectedChat: checkIsArray(selectedChat).filter(chat => chat !== val) });
      }
    }



    showModal = (sectionVisible = true, showLInkRequest = false) => {
        this.setState({
            visible: true,
            sectionVisible,
            showLInkRequest: showLInkRequest
        });
    }

    setPageState(data) {
        this.setState({ redirect: data, visible: false });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    componentDidMount() {
        this.setState({
            NewDevices: this.props.devices,
            NewRequests: this.props.requests
        });

        if(this.props.allDealers){
          this.setState({dealers: this.props.allDealers});
        }
    }

    componentDidUpdate(prevProps){
      if(prevProps !== this.props){
        this.setState({systemMessagesNotifications: this.props.supportSystemMessagesNotifications});
        this.setState({ticketNotifications: this.props.ticketNotifications});
        this.setState({supportChat: this.props.supportChatNotifications});

        if(this.props.allDealers){
          this.setState({dealers: this.props.allDealers});
        }
      }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.devices.length !== nextProps.devices.length || this.props.requests.length !== nextProps.requests.length) {
            this.setState({
                NewDevices: nextProps.devices,
                NewRequests: nextProps.requests
            });
        }

        if (nextProps.supportSystemMessagesNotifications) {
            this.setState({ systemMessagesNotifications: nextProps.supportSystemMessagesNotifications });
        }

        if (nextProps.ticketNotifications) {
            this.setState({ ticketNotifications: nextProps.ticketNotifications });
        }

        if(nextProps.supportChatNotifications){
          this.setState({supportChat: nextProps.supportChatNotifications});
        }

        if(nextProps.allDealers){
          this.setState({dealers: nextProps.allDealers});
        }
    }

    handleTransferDeviceProfile = (obj) => {
        // console.log('at req transferDeviceProfile', obj)
        let _this = this;
        Modal.confirm({
            content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
            onOk() {
                // console.log('OK');
                _this.props.transferDeviceProfile(obj);
                _this.setState({ flaggedDevicesModal: false, visible: false });
            },
            onCancel() { },
            okText: convertToLang(_this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(_this.props.translation[Button_No], 'No'),
        });
    }

    rejectDevice(device) {
        this.props.rejectDevice(device);
    }

    flaggedDevices = (reqDevice) => {
        this.setState({
            flaggedDevicesModal: true,
            reqDevice,
        })
    }

    transferDevice = (device, requestedDevice = false) => {
        let DEVICE_REQUEST_IS = (requestedDevice) ? requestedDevice : this.state.reqDevice;
        this.handleTransferDeviceProfile({ flagged_device: device, reqDevice: DEVICE_REQUEST_IS });
        // this.setState({ flaggedDevicesModal: false, visible: false })
    }
    rejectRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectRequest, request)
    }

    rejectServiceRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectServiceRequest, request)
    }

    acceptServiceRequest(request) {
        // console.log(this.props.acceptServiceRequest);
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptServiceRequest, request)
    }

    acceptRequest(request) {

        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptRequest, request)
    }

    acceptDevice(device) {
        if (this.props.authUser.account_balance_status === 'suspended') {
            showSupendAccountWarning(this)
        } else {
            this.refs.add_device_modal.showModal(device, this.props.addDevice);
            this.setState({ visible: false })
        }
    }

    relinkDevice(device) {
        showConfirm(this, convertToLang(this.props.translation[""], "Are you sure you want to relink device with existing services on device ?"), this.props.relinkDevice, device.id)
    }
    rejectRelinkDevice(device) {
        showConfirm(this, convertToLang(this.props.translation[""], "Are you sure you want to reject relink request ? This device will not get previous services if rejected."), this.props.rejectDevice, device)
    }


    filterList = (devices) => {
        let dumyDevices = [];
        if (devices !== undefined) {
            checkIsArray(devices).filter(function (device) {
                if (device.finalStatus !== DEVICE_UNLINKED) {
                    let deviceStatus = device.flagged;
                    if ((deviceStatus === 'Defective' || deviceStatus === 'Lost' || deviceStatus === 'Stolen' || deviceStatus === 'Other') && (device.finalStatus === "Flagged")) {
                        dumyDevices.push(device);
                    }
                }
            });
        }
        return dumyDevices;
    }

    renderList1(list) {
        if (list && Array.isArray(list) && list.length > 0) {
            return checkIsArray(list).map((request) => {
                return {
                    key: request.id ? `${request.id}` : "N/A",
                    action: <div>  <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectRequest(request); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>
                        <Button
                            type="primary"
                            size="small"
                            style={{ margin: '0 8px 0 8px' }}
                            onClick={() => { this.acceptRequest(request) }}>
                            {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}
                        </Button>
                    </div>,
                    dealer_name: request.dealer_name ? `${request.dealer_name}` : "N/A",
                    label: request.label ? `${request.label}` : "N/A",
                    credits: request.credits ? `${request.credits}` : "N/A",
                }
            });
        } else {
            return []
        }

    }

    renderTicketNotifications(list) {
      let { setCurrentSupportTicketId, setCurrentTicketId, setSupportPage } = this.props;

        if (list && Array.isArray(list) && list.length > 0) {
          return checkIsArray(list).map((notification) => {
            let dealer_name = 'N/A';
            let dealer_pin = 'N/A';
            let dealer = this.state.dealers.find(dealer => dealer.dealer_id == notification.user_id);
            if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('dealer_name')) {
              dealer_name = dealer.dealer_name;
            }
            if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('type') && dealer.type !== ADMIN && dealer.hasOwnProperty('link_code')) {
              dealer_pin = dealer.link_code;
            }
            return {
                  selection: <Checkbox defaultChecked={false} checked={this.state.selectedTicketNotifications.some(item => item === notification._id)} onChange={(e) => this.updateTicketsSelection(e, notification._id)} />,
                  id: notification.id,
                  key: notification.id,
                  dealer_name: dealer_name,
                  dealer_pin: dealer_pin,
                  type: notification.type,
                  subject: <a href="javascript:void(0);" onClick={() => {
                    setCurrentSupportTicketId(notification.ticket);
                    setCurrentTicketId(notification.ticket._id);
                    setSupportPage('2');
                    this.setPageState(true);
                  }}>{notification.ticket.subject.length > 30 ? notification.ticket.subject.substr(0, 30) + '...' : notification.ticket.subject}</a>,
                  category: notification.ticket.category,
                  priority: notification.ticket.priority,
                  created_at: moment(notification.createdAt).format('YYYY/MM/DD hh:mm:ss'),
              }
          });
        } else {
            return [];
        }

    }

    renderSupportSystemMessagesNotifications(list) {
      let { setCurrentSystemMessageId, setSupportPage } = this.props;
        if (list && Array.isArray(list) && list.length > 0) {
            return checkIsArray(list).map((notification) => {
                return {
                    selection: <Checkbox defaultChecked={false} checked={this.state.selectedSystemMessages.some(item => item === notification.system_message._id)} onChange={(e) => this.updateSystemMessagesSelection(e, notification.system_message._id)} />,
                    id: notification.id,
                    key: notification.id,
                    sender: <span className="text-capitalize">{notification.sender_user_type}</span>,
                    subject: <a href="javascript:void(0);" onClick={() => {
                      let sender = notification.system_message.sender_user_type.charAt(0).toUpperCase() + notification.system_message.sender_user_type.slice(1);
                      let data = {
                        id: notification.system_message._id,
                        key: notification.system_message._id,
                        rowKey: notification.system_message._id,
                        type: 'Received',
                        sender_user_type: notification.sender_user_type,
                        sender: sender,
                        subject: checkValue(notification.system_message.subject),
                        message: checkValue(notification.system_message.message),
                        createdAt: getDateFromTimestamp(notification.system_message.createdAt),
                        createdTime: getOnlyTimeFromTimestamp(notification.system_message.createdAt)
                      }
                      setCurrentSystemMessageId(data);
                      setSupportPage('1');
                      this.setPageState(true);
                  }}>{checkValue(notification.system_message.subject).length > 30 ? checkValue(notification.system_message.subject).substr(0, 30) + "..." : checkValue(notification.system_message.subject)}</a>,
                    created_at: moment(notification.createdAt).format('YYYY/MM/DD hh:mm:ss'),
                }
            });
        } else {
            return [];
        }
    }

    renderSupportChatNotifications(list){
      let { setSupportPage, setCurrentConversation } = this.props;
      if(list && Array.isArray(list) && list.length > 0){
        return checkIsArray(list).map((notification, index) => {
          let dealer_name = 'N/A';
          let dealer_pin = 'N/A';
          let isAdmin = false;
          let dealerObject = {};
          let dealer = this.state.dealers.find(dealer => dealer.dealer_id == notification.sender);
          if(typeof dealer !== 'undefined' && dealer.hasOwnProperty('type') && dealer.type === ADMIN){
            isAdmin = true;
          }

          if(typeof dealer !== 'undefined'){
            dealerObject = dealer;
          }
          if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('dealer_name')) {
            dealer_name = dealer.dealer_name.charAt(0).toLocaleUpperCase() + dealer.dealer_name.substr(1);
          }
          if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('type') && dealer.type !== ADMIN && dealer.hasOwnProperty('link_code')) {
            dealer_pin = dealer.link_code;
          }
          return {
            key: index,
            rowKey: index,
            conversation: <a href="javascript:void(0);" onClick={() => {
              setCurrentConversation(dealerObject, notification.conversation_id);
              setSupportPage('3');
              this.setPageState(true);
            }}>{isAdmin ? `${dealer_name}` : `${dealer_name} (${dealer_pin})`}</a>,
            noOfUnreadMessages: notification.noOfUnreadMessages,
            user: dealerObject,
            id: notification.conversation_id,
            action: <Checkbox defaultChecked={false} checked={this.state.selectedChat.some(item => item === notification.conversation_id)} onChange={(e) => this.updateChatSelection(e, notification.conversation_id)} />
          }
        })
      } else {
        return [];
      }

    }

    renderServiceRequestList(list) {
        if (list && Array.isArray(list) && list.length > 0) {
            return checkIsArray(list).map((request) => {

                return {
                    key: request.id,
                    action: <div>
                        <Button
                            type="danger"
                            size="small"
                            style={{ margin: '0 8px 0 8px' }}
                            onClick={() => { this.rejectServiceRequest({id: request.id}); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            style={{ margin: '0 8px 0 8px' }}
                            onClick={() => { this.acceptServiceRequest({id: request.id, user_acc_id: request.user_acc_id}) }}>
                            {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}
                        </Button>
                    </div>,
                    device_id: request.device_id ? `${request.device_id}` : "PRE-ACTIVATION",
                    dealer_pin: request.dealer_pin ? `${request.dealer_pin}` : "N/A",
                    service_term: request.service_term + " Months",
                    service_remaining_days: request.service_remaining_days,
                    credits_to_refund: request.credits_to_refund,
                }
            });
        } else {
            return []
        }

    }

    renderList(list, flagged = false) {
        if (list && Array.isArray(list) && list.length > 0) {
            return checkIsArray(list).map((device) => {

                let transferButton;
                if (this.state.sectionVisible || this.state.showLInkRequest) {
                    transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={(flagged) ? () => this.transferDevice(device) : () => this.flaggedDevices(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
                }
                else {
                    transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={() => this.transferDevice(this.props.device_details, device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
                }

                let declineButton = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectDevice(device); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>;
                let acceptButton = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.acceptDevice(device) }}> {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}</Button>;

                let relinkDeviceButton = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.relinkDevice(device) }}> {convertToLang(this.props.translation[""], "RELINK WITH SERVICES")}</Button>;
                let rejectRelinkDeviceButton = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectRelinkDevice(device) }}> {convertToLang(this.props.translation[""], "REJECT REQUEST")}</Button>;
                let actionButns;
                if (this.state.sectionVisible) {
                    if (this.props.allDevices !== undefined) {
                        if (flagged) {
                            actionButns = (<Fragment>{transferButton}</Fragment>);
                        } else {
                            actionButns = (device.relink_status === 1) ?
                                <Fragment>
                                    <Fragment>{rejectRelinkDeviceButton}</Fragment>
                                    <Fragment>{relinkDeviceButton}</Fragment>
                                </Fragment>
                                :
                                <Fragment>
                                    <Fragment>{declineButton}</Fragment>
                                    <Fragment>{acceptButton}</Fragment>
                                    <Fragment>{transferButton}</Fragment>
                                </Fragment>;
                        }
                    } else {
                        actionButns = (<Fragment>
                            <Fragment>{declineButton}</Fragment>
                            <Fragment>{acceptButton}</Fragment>
                        </Fragment>);
                    }

                } else {
                    if (this.state.showLInkRequest) {
                        if (flagged) {
                            actionButns = (<Fragment>{transferButton}</Fragment>);
                        }
                        else {
                            actionButns = (device.relink_status === 1) ?
                                <Fragment>
                                    <Fragment>{rejectRelinkDeviceButton}</Fragment>
                                    <Fragment>{relinkDeviceButton}</Fragment>
                                </Fragment>
                                :
                                <Fragment>
                                    <Fragment>{declineButton}</Fragment>
                                    <Fragment>{acceptButton}</Fragment>
                                    <Fragment>{transferButton}</Fragment>
                                </Fragment>;;
                        }
                    } else {
                        actionButns = (<Fragment>{transferButton}</Fragment>);
                    }
                }

                return {
                    key: device.device_id ? `${device.device_id}` : "N/A",
                    action: actionButns,
                    device_id: device.device_id ? `${device.device_id}` : "N/A",
                    imei_1: device.imei ? `${device.imei}` : "N/A",
                    sim_1: device.simno ? `${device.simno}` : "N/A",
                    imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                    sim_2: device.simno2 ? `${device.simno2}` : "N/A",
                    serial_number: device.serial_number ? `${device.serial_number}` : "N/A",

                }
            });
        } else {
            return []
        }

    }



    render() {
        let flaggedDevices = this.filterList(this.props.allDevices)
        // console.log('check flaggedDevices ', flaggedDevices, 'requests', this.props.requests, 'NewDevices', this.props.devices)
        if (this.state.redirect) {
            let page = this.state.supportPage;
            this.setPageState(false);
            window.history.replaceState({}, null);
            return <Redirect to={{ pathname: '/support' }} />
        }
        return (
            <div>
                <Modal
                    width={800}
                    maskClosable={false}
                    visible={this.state.visible}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                // okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Tabs tabPosition={'top'}>
                        {(this.props.authUser.type === ADMIN) ? null :
                            <TabPane tab={
                              <Badge count={this.state && this.state.NewDevices && this.state.NewDevices.length}>
                                {convertToLang(this.props.translation[DEVICE_REQUESTS], "DEVICE REQUESTS")}
                              </Badge>
                            } key="1">
                                <Fragment>
                                    {/* <h1>{convertToLang(this.props.translation[DEVICE_REQUESTS], "DEVICE REQUESTS")}</h1> */}
                                    <Table
                                        bordered
                                        columns={this.state.columns}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderList(this.state.NewDevices)}
                                        pagination={false}
                                        scroll={{x: true}}
                                    />
                                </Fragment>
                            </TabPane>
                        }
                        {(this.state.sectionVisible && this.props.authUser.type === ADMIN) ?
                            <TabPane tab={
                              <Badge count={this.props && this.props.cancel_service_requests && this.props.cancel_service_requests.length}>
                                {convertToLang(this.props.translation[""], "CANCEL SERVICES REQUESTS")}
                              </Badge>
                            } key="2">
                                <Fragment>
                                    {/* <h1>{convertToLang(this.props.translation[""], "CANCEL SERVICES REQUESTS")}</h1> */}
                                    <Table
                                        bordered
                                        columns={this.state.cancelServiceColumns}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderServiceRequestList(this.props.cancel_service_requests)}
                                        pagination={false}
                                        scroll={{x: true}}
                                    />
                                </Fragment>
                            </TabPane>
                            : null}
                        {this.props.showSupport && <TabPane tab={
                          <Badge count={this.state && this.state.supportChat && this.state.supportChat.length}>
                            {convertToLang(this.props.translation[""], "Support Chat")}
                          </Badge>
                        } key="3">
                          <Fragment>
                            <Row className="width_100" style={{ display: "block", marginLeft: 0 }}>
                              {/* <h1 style={{ display: "inline" }}>{convertToLang(this.props.translation[""], "Ticket Notifications")} */}
                              <Button type="primary" size="small" style={{ float: "right", marginTop: '6px' }} onClick={() => {
                                this.props.setSupportPage('3');
                                if (window.location.pathname !== '/support') {
                                  this.setPageState(true);
                                } else {
                                  this.setState({
                                    visible: false
                                  });
                                }
                              }}>View Messages</Button>
                              {/* </h1> */}

                            </Row>
                            <Table
                              bordered
                              columns={this.state.supportChatColumns}
                              style={{ marginTop: 20 }}
                              dataSource={this.renderSupportChatNotifications(this.state.supportChat)}
                              pagination={false}
                              scroll={{x: true}}
                            />
                          </Fragment>
                        </TabPane>}
                        {this.props.showSupport && <TabPane tab={
                          <Badge count={this.state && this.state.ticketNotifications && this.state.ticketNotifications.length}>
                            {convertToLang(this.props.translation[""], "Ticket Notifications")}
                          </Badge>
                        } key="4">
                            <Fragment>
                                <Row className="width_100" style={{ display: "block", marginLeft: 0 }}>
                                    {/* <h1 style={{ display: "inline" }}>{convertToLang(this.props.translation[""], "Ticket Notifications")} */}
                                    <Button type="primary" size="small" style={{ float: "right", marginTop: '6px' }} onClick={() => {
                                        this.props.setSupportPage('2');
                                        if (window.location.pathname !== '/support') {
                                            this.setPageState(true);
                                        } else {
                                            this.setState({
                                                visible: false
                                            });
                                        }
                                    }}>View Tickets</Button>
                                    {/* </h1> */}
                                </Row>
                                <Table
                                    bordered
                                    columns={this.state.ticketNotificationColumns}
                                    style={{ marginTop: 20 }}
                                    dataSource={this.renderTicketNotifications(this.state.ticketNotifications)}
                                    pagination={false}
                                    scroll={{x: true}}
                                />
                            </Fragment>
                        </TabPane>}
                        {this.props.showSupport && this.props.authUser.type !== ADMIN ?
                            <TabPane tab={
                              <Badge count={this.state && this.state.systemMessagesNotifications && this.state.systemMessagesNotifications.length}>
                                {convertToLang(this.props.translation[""], "System Message Notifications")}
                              </Badge>
                                } key="5">
                                <Fragment>
                                    <Row className="width_100" style={{ display: "block", marginLeft: 0 }}>
                                        {/* <h1>{convertToLang(this.props.translation[""], "System Message Notifications")} */}

                                        <Button type="primary" size="small" style={{ float: "right", marginTop: '6px' }} onClick={() => {
                                            this.props.setSupportPage('1');
                                            if (window.location.pathname !== '/support') {
                                                this.setPageState(true);
                                            } else {
                                                this.setState({
                                                    visible: false
                                                });
                                            }
                                        }}>View System Messages</Button>
                                        {/* </h1> */}

                                    </Row>
                                    <Table
                                        bordered
                                        columns={this.state.supportSystemMessages}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderSupportSystemMessagesNotifications(this.state.systemMessagesNotifications)}
                                        pagination={false}
                                        scroll={{x: true}}
                                    />
                                </Fragment>
                            </TabPane>
                            : ''}
                    </Tabs>
                </Modal>
                <AddDeviceModal ref='add_device_modal' translation={this.props.translation} />

                {
                    (this.state.sectionVisible || this.state.showLInkRequest) ?
                        <Modal
                            width={1000}
                            maskClosable={false}
                            visible={this.state.flaggedDevicesModal}
                            // onOk={this.handleOk}
                            footer={null}
                            onCancel={() => this.setState({ flaggedDevicesModal: false })}
                        // okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                        // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                        >
                            <Fragment>
                                <h1>{convertToLang(this.props.translation["FLAGGED DEVICES"], "FLAGGED DEVICES")}</h1>
                                <Table
                                    bordered
                                    columns={this.state.columns}
                                    style={{ marginTop: 20 }}
                                    dataSource={this.renderList(flaggedDevices, true)}
                                    pagination={false}
                                    scroll={{ x: true }}
                                />
                            </Fragment>

                        </Modal>
                        : null
                }
            </div >
        )
    }
}


function showConfirm(_this, msg, action, request) {
    confirm({
        title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
        content: msg,
        okText: convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            action(request);
        },
        onCancel() {


        },
    });
}
function showSupendAccountWarning(_this) {
    confirm({
        title: "Your account is past due, please make a payment of past due to bring your account up to date to use the ADD DEVICE feature.",
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}
