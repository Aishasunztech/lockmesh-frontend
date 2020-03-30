
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Layout } from "antd";


import Sidebar from "../Sidebar/index";

import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";
import Topbar from "../Topbar/index";
import Customizer from "./Customizer";
import { getWhiteLabels } from "../../appRedux/actions";

import { footerText } from "util/config";
import AppRoutes from "../../routes/index";


import IdleTimer from 'react-idle-timer'

import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE
} from "../../constants/ThemeSetting";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";

const { Content, Footer } = Layout;

export class MainApp extends Component {

  constructor(props) {
    super(props)

    this.idleTimer = null
    this.onAction = this._onAction.bind(this)
    this.onActive = this._onActive.bind(this)
    this.onIdle = this._onIdle.bind(this)

    this.state = {
      seconds: 0,
      interval: null
    };
  }


  componentDidMount() {
    this.props.getWhiteLabels()
  }
  getContainerClass = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DARK_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return "gx-container-wrap";
      case NAV_STYLE_BELOW_HEADER:
        return "gx-container-wrap";
      case NAV_STYLE_ABOVE_HEADER:
        return "gx-container-wrap";
      default:
        return '';
    }
  };
  getNavStyles = (navStyle) => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return <HorizontalDefault />;
      case NAV_STYLE_DARK_HORIZONTAL:
        return <HorizontalDark />;
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return <InsideHeader />;
      case NAV_STYLE_ABOVE_HEADER:
        return <AboveHeader />;
      case NAV_STYLE_BELOW_HEADER:
        return <BelowHeader />;
      case NAV_STYLE_FIXED:
        return <Topbar />;
      case NAV_STYLE_DRAWER:
        return <Topbar />;
      case NAV_STYLE_MINI_SIDEBAR:
        return <Topbar />;
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <NoHeaderNotification />;
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <NoHeaderNotification />;
      default:
        return null;
    }
  };

  getSidebar = (navStyle, width) => {
    if (width < TAB_SIZE) {
      return <Sidebar />;
    }
    switch (navStyle) {
      case NAV_STYLE_FIXED:
        return <Sidebar />;
      case NAV_STYLE_DRAWER:
        return <Sidebar />;
      case NAV_STYLE_MINI_SIDEBAR:
        return <Sidebar />;
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <Sidebar />;
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <Sidebar />;
      default:
        return null;
    }
  };

  _onAction(e) {
  }

  _onActive(e) {

  }

  _onIdle(e) {

    localStorage.removeItem('email');
    localStorage.removeItem('id');
    localStorage.removeItem('type');
    localStorage.removeItem('name');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('token');
    localStorage.removeItem('dealer_pin');

    setTimeout(() => {
      this.props.history.push('/session_timeout')
    }, 1000);
  }


  render() {
    const { match, width, navStyle } = this.props;

    return (
      <div>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={3600000} />
        <Layout className="gx-app-layout">
          {this.getSidebar(navStyle, width)}
          <Layout>
            {this.getNavStyles(navStyle)}
            <Content className={`gx-layout-content ${this.getContainerClass(navStyle)} `}>
              <AppRoutes
                match={match}
                whiteLabels={this.props.whiteLabels}
              />
              <Footer>
                <div className="gx-layout-footer-content">
                  {footerText}
                </div>
              </Footer>
            </Content>
          </Layout>
          <Customizer />
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = ({ settings, sidebarMenu }) => {

  const { width, navStyle } = settings;
  return { width, navStyle, whiteLabels: sidebarMenu.whiteLabels }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getWhiteLabels: getWhiteLabels
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(MainApp);

