import React, { Component } from "react";
import { Menu, Icon, Badge, Modal, Popover, Avatar } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SidebarLogo from "./SidebarLogo";
import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";
import NewDevice from '../../components/NewDevices';
import CreditsModal from '../../components/CreditsModal';
import {
  setSupportPage,
  resetSupportPage,
  setCurrentSupportTicketId,
  resetCurrentSupportTicketId,
  setCurrentTicketId,
  resetCurrentTicketId,
  setCurrentSystemMessageId,
  resetCurrentSystemMessageId,
  getSupportLiveChatNotifications,
  resetCurrentConversation,
  setCurrentConversation,
  updateTicketNotifications,
  markMessagesRead,
  updateSupportSystemMessageNotification
} from "../../appRedux/actions";
import { getNewDevicesList, } from "../../appRedux/actions/Common";
import {
  getNewCashRequests,
  getUserCredit,
  rejectRequest,
  acceptRequest,
  rejectServiceRequest,
  acceptServiceRequest,
  getCancelServiceRequests,
  getTicketsNotifications,

} from "../../appRedux/actions/SideBar";
import {
  getLatestPaymentHistory, getOverdueDetails,
} from "../../appRedux/actions/Account";

import { getSupportSystemMessagesNotifications } from "../../appRedux/actions";

import { transferDeviceProfile } from "../../appRedux/actions/ConnectDevice";

import { convertToLang, checkIsArray } from '../../routes/utils/commonUtils';

import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

import {
  Sidebar_dealers,
  Sidebar_sdealers,
  Sidebar_app,
  Sidebar_account,
  Sidebar_settings,
  Sidebar_logout,
  Alert_Change_Language,
  ARE_YOU_SURE_YOU_WANT_TO_LOGOUT,
  Sidebar_users_devices,
  Sidebar_clients,
} from '../../constants/SidebarConstants'

import { logout } from "appRedux/actions/Auth";

import { rejectDevice, addDevice, getDevicesList, relinkDevice } from '../../appRedux/actions/Devices';

import { switchLanguage, getLanguage, getAll_Languages, toggleCollapsedSideNav } from "../../appRedux/actions/Setting";
import { getAllToAllDealers } from "../../appRedux/actions/Dealers";

import { ADMIN, DEALER, SDEALER, AUTO_UPDATE_ADMIN } from "../../constants/Constants";
import { Button_Yes, Button_No } from "../../constants/ButtonConstants";
import { cloneableGenerator } from "redux-saga/utils";
import CustomScrollbars from "../../util/CustomScrollbars";

let status = true;
class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: [],
      clicked: false
    }
  }

  handleClickChange = visible => {
    this.setState({ clicked: visible });
  }

  languageMenu = () => (
    <ul className="gx-sub-popover">
      {checkIsArray(this.state.languageData).map(language =>
        <li className={`gx-media gx-pointer ${(language.id == this.props.lng_id) ? "noClick" : ""}`} key={JSON.stringify(language)} onClick={(e) => this.changeLng(language)}>
          <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
          <span className="gx-language-text">{language.name}</span>
        </li>
      )}
    </ul>
  );

  getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  showNotification = () => {
    if (this.props.authUser.type !== ADMIN) {
      this.props.getNewCashRequests();
      this.props.getNewDevicesList();
      this.props.getUserCredit();
      this.refs.new_device.showModal();
      // this.props.getDevicesList();
    } else {
      this.props.getCancelServiceRequests()
      this.refs.new_device.showModal();
    }
    if (this.props.microServiceRunning) {
      this.props.getTicketsNotifications();
      this.props.getSupportSystemMessagesNotifications();
    }
    // alert('its working');
  }

  componentDidMount() {
    this.props.getLanguage();
    this.props.getAll_Languages();
    this.setState({
      languageData: this.props.languageData
    })
    this.props.getNewDevicesList();
    this.props.getNewCashRequests();
    if (this.props.microServiceRunning) {
      this.props.getTicketsNotifications()
      this.props.getSupportSystemMessagesNotifications()
      this.props.getSupportLiveChatNotifications();
    }
    this.props.getAllToAllDealers()


    this.props.getUserCredit();
    if (this.props.allDevices.length === 0) {
      this.props.getDevicesList();
    }
    if (this.props.authUser.type == ADMIN) {
      this.props.getCancelServiceRequests()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        languageData: this.props.languageData
      })

      // console.log("this.props.pathname", this.props.pathname, "nextProps.pathname ", nextProps.pathname)
      if (prevProps.pathname !== this.props.pathname) {
        this.props.getNewDevicesList();
        this.props.getNewCashRequests();
        this.props.getUserCredit();
        if (this.props.authUser.type == ADMIN) {
          this.props.getCancelServiceRequests()
        }
      }

      if (this.props.isSwitched !== prevProps.isSwitched) {
        this.props.getLanguage();
      }

      if (this.props.microServiceRunning !== prevProps.microServiceRunning) {
        this.props.getTicketsNotifications();
        this.props.getSupportSystemMessagesNotifications();
        this.props.getSupportLiveChatNotifications();
      }
    }
  }

  logout = () => {
    let _this = this;
    Modal.confirm({
      title: convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_LOGOUT], "Are you sure you want to logout?"),
      okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
      cancelText: convertToLang(_this.props.translation[Button_No], "No"),

      onOk() {
        _this.props.logout()
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  changeLng = (language) => {
    let _this = this;

    _this.setState({ clicked: false });

    Modal.confirm({
      title: convertToLang(_this.props.translation[Alert_Change_Language], "Are you sure you want to change the language?"),
      okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
      cancelText: convertToLang(_this.props.translation[Button_No], "No"),

      onOk() {
        _this.props.switchLanguage(language)
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  // transferDeviceProfile = (obj) => {
  //   // console.log('at req transferDeviceProfile', obj)
  //   let _this = this;
  //   Modal.confirm({
  //     content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
  //     onOk() {
  //       // console.log('OK');
  //       _this.props.transferDeviceProfile(obj);
  //     },
  //     onCancel() { },
  //     okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
  //     cancelText: convertToLang(this.props.translation[Button_No], 'No'),
  //   });
  // }

  render() {
    // console.log(addDevice)
    const { themeType, navStyle, pathname, authUser, translation } = this.props;

    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    // console.log(this.props.ticketNotifications);
    return (
      <div className="side_bar_content">
        <CustomScrollbars className="gx-popover-scroll">
          <Auxiliary>
            <SidebarLogo />
            <div className="gx-sidebar-content ">
              <div className={`gx-sidebar-notifications text-center ${this.getNoHeaderClass(navStyle)} `}>
                <UserProfile />

                <NewDevice
                  history={this.props.history}
                  showSupport={true}
                  ref='new_device'
                  devices={this.props.devices}
                  addDevice={this.props.addDevice}
                  rejectDevice={this.props.rejectDevice}
                  authUser={this.props.authUser}
                  requests={this.props.requests}
                  acceptRequest={this.props.acceptRequest}
                  rejectRequest={this.props.rejectRequest}
                  updateSupportSystemMessageNotification={this.props.updateSupportSystemMessageNotification}
                  translation={this.props.translation}
                  allDevices={this.props.allDevices}
                  transferDeviceProfile={this.props.transferDeviceProfile}
                  cancel_service_requests={this.props.cancel_service_requests}
                  rejectServiceRequest={this.props.rejectServiceRequest}
                  acceptServiceRequest={this.props.acceptServiceRequest}
                  ticketNotifications={this.props.ticketNotifications}
                  allDealers={this.props.allDealers}
                  supportPage={this.props.supportPage}
                  currentMessageId={this.props.currentMessageId}
                  currentTicketId={this.props.currentTicketId}
                  supportSystemMessagesNotifications={this.props.supportSystemMessagesNotifications}
                  updateTicketNotifications={this.props.updateTicketNotifications}
                  setSupportPage={this.props.setSupportPage}
                  resetSupportPage={this.props.resetSupportPage}
                  setCurrentSystemMessageId={this.props.setCurrentSystemMessageId}
                  resetCurrentSystemMessageId={this.props.setCurrentSystemMessageId}
                  setCurrentSupportTicketId={this.props.setCurrentSupportTicketId}
                  setCurrentTicketId={this.props.setCurrentTicketId}
                  supportChatNotifications={this.props.supportChatNotifications}
                  setCurrentConversation={this.props.setCurrentConversation}
                  resetCurrentConversation={this.props.resetCurrentConversation}
                  markMessagesRead={this.props.markMessagesRead}
                  relinkDevice={this.props.relinkDevice}
                />
                <span className="font_14">
                  {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? 'PIN :' : null}
                  {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? (localStorage.getItem('dealer_pin') === '' || localStorage.getItem('dealer_pin') === null || localStorage.getItem('dealer_pin') === undefined) ? null : localStorage.getItem('dealer_pin') : null}
                </span>
                <ul className="gx-app-nav mt-12 " style={{ justifyContent: "center" }}>
                  {/* Price */}
                  <li>
                    <Link to='/account/balance_info' className="head-example">
                      <div className="cred_badge" >
                        <i className="icon icon-dollar notification_icn" >
                          <Icon type="dollar" className="mb-10" >
                          </Icon>
                          <span className="badge badge-pill doller-icon" >{this.props.user_credit}</span>
                        </i>
                      </div>
                    </Link>
                  </li>
                  {/* {/* Chat Icon */}
                  <li>
                    <i className="icon icon-chat-new" />
                  </li>

                  {/* Notifications */}
                  <li>
                    <a className="head-example">
                      <Badge count={(localStorage.getItem('type') !== ADMIN) ? this.props.supportSystemMessagesNotifications.length + this.props.devices.length + this.props.requests.length + this.props.ticketNotifications.length + this.props.supportChatNotifications.length : this.props.cancel_service_requests.length + this.props.supportSystemMessagesNotifications.length + this.props.ticketNotifications.length + this.props.supportChatNotifications.length}>
                        <i className="icon icon-notification notification_icn" onClick={() => this.showNotification()} />
                      </Badge>
                    </a>
                  </li>

                  {/* Language Dropdown */}
                  <li>
                    <Popover
                      overlayClassName="gx-popover-horizantal lang_icon"
                      placement="bottomRight"
                      content={this.languageMenu()}
                      trigger="click"
                      visible={this.state.clicked}
                      onVisibleChange={this.handleClickChange}
                    >
                      <i className="icon icon-global" >
                        <Icon type="global" className="mb-10" />
                      </i>
                    </Popover>
                  </li>
                </ul>
              </div>
              {(authUser.type === AUTO_UPDATE_ADMIN)
                ?
                <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
                  <Menu.Item key="app">
                    <Link to="/apk-list/autoupdate"><i className="icon icon-apps" />
                      {/* <IntlMessages id="sidebar.app" /> */}
                      {convertToLang(translation[Sidebar_app], "App")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={(e) => {
                    // this.props.logout()
                    this.logout()
                  }}>
                    {/* <Link to="/logout"> */}
                    <i className="icon">
                      <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                    </i>
                    {convertToLang(translation[Sidebar_logout], "Logout")}
                    {/* </Link> */}
                  </Menu.Item>
                </Menu>
                :
                <Menu className="pt-12" defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
                  <Menu.Item key="dashboard">
                    <Link to="/dashboard">
                      <i className="icon icon-dasbhoard" >
                        <i className="fa fa-dasbhoard" aria-hidden="true"></i>
                      </i>
                      {/* <IntlMessages id="sidebar.devices" /> */}
                      {convertToLang(translation[''], "Dashboard")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="devices">
                    <Link to="/devices">
                      <i className="icon icon-mobile" >
                        <i className="fa fa-mobile" aria-hidden="true"></i>
                      </i>
                      {/* <IntlMessages id="sidebar.devices" /> */}
                      {convertToLang(translation[Sidebar_users_devices], "Users & Devices")}
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="users">
                    <Link to="/users">
                      <i className="icon icon-user" />
                      {/* <IntlMessages id="sidebar.users" /> */}
                      {convertToLang(translation[Sidebar_clients], "Clients")}
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="sims">
                    <Link to="/sims">
                      <i className="icon icon-mobile" >
                        <i className="fa fa-file" aria-hidden="true"></i>
                        {/* <i className="fa fa-mobile" aria-hidden="true"></i> */}
                      </i>
                      {/* <IntlMessages id="sidebar.devices" /> */}
                      {convertToLang(translation[""], "Sims")}
                    </Link>
                  </Menu.Item>

                  {(authUser.type === ADMIN) ? <Menu.Item key="dealer/dealer">
                    <Link to="/dealer/dealer"><i className="icon icon-avatar" />
                      {/* <IntlMessages id="sidebar.dealers" /> */}
                      {convertToLang(translation[Sidebar_dealers], "Dealers")}
                    </Link>
                  </Menu.Item> : null}
                  {(authUser.type === ADMIN || authUser.type === DEALER) ? <Menu.Item key="dealer/sdealer">
                    <Link to="/dealer/sdealer"><i className="icon icon-avatar" />
                      {/* <IntlMessages id="sidebar.sdealers" /> */}
                      {convertToLang(translation[Sidebar_sdealers], "S-dealers")}
                    </Link>
                  </Menu.Item> : null}
                  {(authUser.type === "admin" || authUser.type === "dealer") ? <Menu.Item key="app">
                    <Link to="/app"><i className="icon icon-apps" />
                      {/* <IntlMessages id="sidebar.app" /> */}
                      {convertToLang(translation[Sidebar_app], "App")}
                    </Link>
                  </Menu.Item> : null}
                  <Menu.Item key="account">
                    <Link to="/account"><i className="icon icon-profile2" />
                      {/* <IntlMessages id="sidebar.account" /> */}
                      {convertToLang(translation[Sidebar_account], "Account")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="support">
                    <Link to="/support"><i className="icon icon-team" />
                      {convertToLang(translation[''], "Support")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="settings">
                    <Link to="/settings"><i className="icon icon-setting" />
                      {/* <IntlMessages id="sidebar.settings" /> */}
                      {convertToLang(translation[Sidebar_settings], "Settings")}
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={(e) => {
                    this.logout()
                  }}>
                    <i className="icon">
                      <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                    </i>
                    {convertToLang(translation[Sidebar_logout], "Logout")}
                  </Menu.Item>
                </Menu>
              }
            </div>
          </Auxiliary >
        </CustomScrollbars>
      </div>
    );
  }
}

// SidebarContent.propTypes = {};

const mapStateToProps = ({ settings, devices, sidebar, account, auth, dealers, SupportSystemMessages, socket }) => {
  const { navStyle, themeType, locale, pathname, languages, translation, isSwitched } = settings;

  return {
    navStyle,
    themeType,
    locale,
    pathname,
    allDevices: devices.devices,
    devices: devices.newDevices,
    requests: sidebar.newRequests,
    user_credit: sidebar.user_credit,
    cancel_service_requests: sidebar.cancel_service_requests,
    ticketNotifications: sidebar.ticketNotifications,
    due_credit: sidebar.due_credit,
    latestPaymentTransaction: account.paymentHistory,
    overdueDetails: account.overdueDetails,
    languageData: languages,
    translation: translation,
    lng_id: translation["lng_id"],
    isSwitched: isSwitched,
    account_balance_status: auth.authUser.account_balance_status,
    account_balance_status_by: auth.authUser.account_balance_status_by,
    allDealers: dealers.allDealers,
    supportSystemMessagesNotifications: SupportSystemMessages.supportSystemMessagesNotifications,
    socket: socket.socket,
    supportPage: sidebar.supportPage,
    currentTicketId: sidebar.currentTicketId,
    currentMessageId: sidebar.currentMessageId,
    supportChatNotifications: sidebar.supportChatNotifications,
    microServiceRunning: sidebar.microServiceRunning
  }
};
export default connect(mapStateToProps, {
  getLatestPaymentHistory,
  getOverdueDetails,
  getDevicesList,
  rejectDevice,
  addDevice,
  logout,
  getNewDevicesList,
  toggleCollapsedSideNav,
  switchLanguage,
  getLanguage,
  getAll_Languages,
  getNewCashRequests,
  getUserCredit,
  acceptRequest,
  rejectRequest,
  transferDeviceProfile,
  getCancelServiceRequests,
  acceptServiceRequest,
  rejectServiceRequest,
  getTicketsNotifications,
  getSupportSystemMessagesNotifications,
  getAllToAllDealers,
  updateSupportSystemMessageNotification,
  updateTicketNotifications,
  setSupportPage,
  resetSupportPage,
  setCurrentSystemMessageId,
  resetCurrentSystemMessageId,
  setCurrentSupportTicketId,
  resetCurrentSupportTicketId,
  getSupportLiveChatNotifications,
  setCurrentConversation,
  resetCurrentConversation,
  markMessagesRead,
  relinkDevice,
  setCurrentTicketId,
  resetCurrentTicketId
}
)(SidebarContent);

