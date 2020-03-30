import React, { Component } from "react";
import { Menu, Icon, Modal } from "antd";
import { Link } from "react-router-dom";

import { bindActionCreators } from "redux";

import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";

import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import { connect } from "react-redux";
import {
  logout,
  getWhiteLabels,
  getNewCashRequests,
  rejectRequest,
  acceptRequest,
  checkDealerPin,
  syncWhiteLabelsIDs,
  resetAcceptPasswordForm

} from '../../appRedux/actions/';


import styles from './styles.css';


class SidebarContent extends Component {

  constructor(props) {
    super(props);

  }
  logout = () => {
    let _this = this;
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',

      onOk() {
        _this.props.logout()
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }
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
  handleClick = (e) => {

  }


  componentDidMount() {
    this.props.getNewCashRequests();
    // console.log(this.props.pathname);
    if (this.props.pathname === "/account/managedata") {
      this.props.syncWhiteLabelsIDs();
    }
  }
  componentWillReceiveProps(nextprops) {
    if (this.props.pathname !== nextprops.pathname) {
      this.props.getNewCashRequests();
    }
  }


  render() {
    // console.log(addDevice)
    const { themeType, navStyle, pathname } = this.props;

    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];

    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content ">
          <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)} `}>
            <UserProfile
              logout={this.props.logout}
              requests={this.props.requests}
              acceptRequest={this.props.acceptRequest}
              rejectRequest={this.props.rejectRequest}
              checkDealerPin={this.props.checkDealerPin}
              acceptPasswordForm={this.props.acceptPasswordForm}
              resetAcceptPasswordForm={this.props.resetAcceptPasswordForm}
            />
            {/* <AppsNavigation/> */}
          </div>
          <Menu
            defaultOpenKeys={['labelsMenu']}
            onClick={this.handleClick}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline"
          >

            <Menu.Item key="devices">
              <Link to="/devices">
                <i className="icon icon-mobile" >
                  <i className="fa fa-mobile" aria-hidden="true"></i>
                </i>
                Devices
              </Link>
            </Menu.Item>

            <Menu.Item key="labels" disabled style={{ cursor: "auto" }}>
              <Link to="#">
                <span>
                  <i className="icon" />
                  Labels
                </span>
              </Link>
            </Menu.Item>
            <Menu.SubMenu
              key="labelsMenu"
              disabled
              className={this.getNavStyleSubMenuClass(navStyle)}
            >
              {
                this.props.whiteLabels.map((whiteLabel) => {
                  return (
                    <Menu.Item key={whiteLabel.name}>
                      <Link to={whiteLabel.route_uri}>
                        {whiteLabel.name}
                      </Link>
                    </Menu.Item>
                  );

                })
              }

            </Menu.SubMenu>

            <Menu.Item key="account">
              <Link to="/account">
                <i className="icon icon-profile2" />
                Account
              </Link>
            </Menu.Item>


            <Menu.Item key="tools">
              <Link to="/tools">
                <i className="icon icon-components" />
                {/* <i className="icon" >
                  <Icon type="tool" className="mb-10" />
                </i> */}
                Tools
              </Link>
            </Menu.Item>

            <Menu.Item key="logout"
              onClick={
                (e) => { this.logout() }
              }
            >
              <i className="icon">
                <i className="fa fa-sign-out ml-6" aria-hidden="true"></i>
              </i>
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Auxiliary>
    );
  }
}
;

const mapStateToProps = ({ settings, sidebarMenu }) => {
  const { navStyle, themeType, locale, pathname } = settings;

  return {
    navStyle,
    themeType,
    locale,
    pathname,
    whiteLabels: sidebarMenu.whiteLabels,
    requests: sidebarMenu.newRequests,
    acceptPasswordForm: sidebarMenu.acceptPasswordForm,
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getWhiteLabels: getWhiteLabels,
    getNewCashRequests: getNewCashRequests,
    rejectRequest: rejectRequest,
    acceptRequest: acceptRequest,
    logout: logout,
    checkDealerPin: checkDealerPin,
    syncWhiteLabelsIDs: syncWhiteLabelsIDs,
    resetAcceptPasswordForm: resetAcceptPasswordForm
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);

