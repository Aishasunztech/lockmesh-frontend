import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";


const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HorizontalNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userType: localStorage.getItem("type")
    }
    // console.log("userType", this.state);
  }

  getNavStyleSubMenuClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve";
      default:
        return "gx-menu-horizontal";

    }
  };

  render() {
    const { pathname, navStyle } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (

      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal">

        <Menu.Item key="devices">
          <Link to="/devices"><i className="icon icon-widgets" /> 
          {/* <IntlMessages id="sidebar.devices" /> */}
          </Link>
        </Menu.Item>

        {(this.state.userType === "admin") ? <Menu.Item key="account">
          <Link to="/account"><i className="icon icon-profile2" /> 
          {/* <IntlMessages id="sidebar.account" /> */}
          </Link>
        </Menu.Item> : null}

        {(this.state.userType === "admin") ? <Menu.Item key="dealer/dealer">
          <Link to="/dealer/dealer"><i className="icon icon-profile2" /> 
          {/* <IntlMessages id="sidebar.dealers" /> */}
          </Link>
        </Menu.Item> : null}

        {(this.state.userType === "admin" || this.state.userType === "dealer") ? <Menu.Item key="dealer/sdealer">
          <Link to="/dealer/sdealer"><i className="icon icon-avatar" /> 
          {/* <IntlMessages id="sidebar.sdealers" / */}
          ></Link>
        </Menu.Item> : null}

        {(this.state.userType === "admin") ? <Menu.Item key="apk-list">
          <Link to="/apk-list"><i className="icon icon-apps" /> 
          {/* <IntlMessages id="sidebar.app" /> */}
          </Link>
        </Menu.Item> : null}
        <Menu.Item key="profile">
          <Link to="/profile"><i className="icon icon-widgets" /> 
          {/* <IntlMessages id="sidebar.profile" /> */}
          </Link>
        </Menu.Item>
      </Menu >

    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({ settings }) => {
  const { themeType, navStyle, pathname, locale } = settings;
  return { themeType, navStyle, pathname, locale }
};
export default connect(mapStateToProps)(HorizontalNav);

