import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import URLSearchParams from 'url-search-params'
import { Redirect, Route, Switch } from "react-router-dom";
import MainApp from "./MainApp";

import Login from "../Login";

import VerifyAuthCode from "../VerifyAuthCode";

import Sidebar from "../Sidebar/index";
import RightSidebar from "../RightSidebar";

import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";
import Topbar from "../Topbar/index";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import { Layout } from "antd";
import { HOST_NAME } from "../../constants/Application";
import {
  setInitUrl,
  checkComponent,
  onLayoutTypeChange,
  onNavStyleChange,
  setThemeType,
  // getLanguage, 
  // getAll_Languages 
} from '../../appRedux/actions'

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";
import RestrictedRoute from "./RestrictedRoute";
import { APP_TITLE } from "../../constants/Application";
import SessionTimeOut from "../Session_timeout";
import Customizer from "./Customizer";

import { footerText } from "../../util/config";

const { Content, Footer } = Layout;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      re_render: true,
      online: window.navigator.onLine
    }
  }

  setLayoutType = (layoutType) => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('full-layout');
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove('full-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('boxed-layout');
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('full-layout');
      document.body.classList.add('framed-layout');
    }
  };

  setNavStyle = (navStyle) => {
    if (navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
      navStyle === NAV_STYLE_DARK_HORIZONTAL ||
      navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
      navStyle === NAV_STYLE_ABOVE_HEADER ||
      navStyle === NAV_STYLE_BELOW_HEADER) {
      document.body.classList.add('full-scroll');
      document.body.classList.add('horizontal-layout');
    } else {
      document.body.classList.remove('full-scroll');
      document.body.classList.remove('horizontal-layout');
    }
  };

  componentWillMount() {

    if (this.props.initURL === '') {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
    const params = new URLSearchParams(this.props.location.search);

    if (params.has("theme")) {
      this.props.setThemeType(params.get('theme'));
    }
    if (params.has("nav-style")) {
      this.props.onNavStyleChange(params.get('nav-style'));
    }
    if (params.has("layout-type")) {
      this.props.onLayoutTypeChange(params.get('layout-type'));
    }
  }

  componentDidMount() {
    document.title = APP_TITLE + ' - Admin Dashboard';
    this.checkInternetConnection();
    // this.props.getAll_Languages();

  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {

  }
  checkInternetConnection() {
    let _this = this
    setInterval(function () {
      _this.setState({
        online: window.navigator.onLine
      })
    }, 5000);

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
        // return <Topbar />;
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
      case NAV_STYLE_DRAWER:
      case NAV_STYLE_MINI_SIDEBAR:
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <Sidebar />;
      // 				return <Sidebar />;
      // 			return <Sidebar />;
      // 		return <Sidebar />;
      // return <Sidebar />;
      default:
        return null;
    }
  };
  render() {

    const { match, location, layoutType, navStyle, locale, authUser, initURL, width } = this.props;

    if (location.pathname === '/') {
      if (!authUser.id || !authUser.email || !authUser.token || !authUser.type) {
        return (<Redirect to={'/login'} />);
      } else if ((initURL === '' || initURL === '/' || initURL === '/login' || initURL === '/session_timeout' || initURL === '/verify-auth')) {
        return (<Redirect to={'/dashboard'} />);
      } else {
        // this condition will not match anymore #usman
        return (<Redirect to={initURL} />);
      }
    }

    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    return (
      <Fragment>
        {this.state.online ? null :
          <div style={{ background: 'red', width: '100%', height: '30px', textAlign: 'center' }}>
            <h3 style={{
              color: 'white', paddingTop: '3px'
            }}>You are currently offline, Please check your internet connection.</h3>
          </div>
        }
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path="/verify-auth" component={VerifyAuthCode} />
          <Route exact path="/session_timeout" component={SessionTimeOut} />
          {/* {(location.pathname != '/login' && location.pathname != '/verify-auth' && location.pathname != '/session_timeout')
            ? */}
            <Layout className="gx-app-layout">
              {/* sidebar */}
              {this.getSidebar(navStyle, width)}
              <Layout>
                {/* topbar */}
                {this.getNavStyles(navStyle)}
                {/* <h1>hello</h1> */}

                {/* Application content */}
                <Content className={`gx-layout-content ${this.getContainerClass(navStyle)} `}>
                  <RestrictedRoute
                    authUser={authUser}
                    path={`${match.url}`}
                    re_render={this.state.re_render}
                    component={MainApp}
                  />
                  {(HOST_NAME === 'localhost') ? <RightSidebar /> : null}

                  <Footer>
                    <div className="gx-layout-footer-content">
                      {footerText}
                    </div>
                  </Footer>
                </Content>
              </Layout>
              <Customizer />

            </Layout>
            {/* : null */}
          }

        </Switch>
      </Fragment>

    )
  }

  newMethod(location) {
    return location.pathname;
  }
}

const mapStateToProps = ({ settings, auth }) => {

  const { locale, navStyle, layoutType, isSwitched } = settings;
  const { authUser, initURL, isAllowed } = auth;
  return { locale, navStyle, layoutType, authUser, initURL, isAllowed, isSwitched }
};
export default connect(mapStateToProps, { setInitUrl, setThemeType, onNavStyleChange, onLayoutTypeChange, checkComponent })(App);
