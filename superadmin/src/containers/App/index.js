import React, { Component } from "react";
import { connect } from "react-redux";
import URLSearchParams from 'url-search-params'
import { Redirect, Route, Switch } from "react-router-dom";

import MainApp from "./MainApp";

import Login from "../Login";

import VerifyAuthCode from "../VerifyAuthCode";

// import SignUp from "../SignUp";
import { setInitUrl } from "appRedux/actions/Auth";
import { onLayoutTypeChange, onNavStyleChange, setThemeType } from "appRedux/actions/Setting";

import { APP_TITLE } from "../../constants/Application";

import SessionTimeOut from "../Session_timeout";

import {
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




class App extends Component {

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

  componentDidMount() {
    document.title = APP_TITLE + ' - Admin Dashboard'
  }

  componentWillMount() {
    // console.log("componentWillMount");
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

  render() {

    const { match, location, layoutType, navStyle, locale, authUser, initURL } = this.props;

    if (location.pathname === '/') {
      if (
        authUser.id === null ||
        authUser.email === null ||
        authUser.token === null
        // || authUser.type === null
      ) {
        return (<Redirect to={'/login'} />);
      } else if ((initURL === '' || initURL === '/' || initURL === '/login')) {
        return (<Redirect to={'/devices'} />);

      } else {
        return (<Redirect to={initURL} />);
      }
    }


    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    return (

      <Switch>
        <Route
          exact
          path="/session_timeout"
          component={SessionTimeOut}
        />

        <Route
          exact
          path='/login'
          component={Login}
        />

        <Route
          exact
          path="/verify-auth"
          component={VerifyAuthCode}
        />

        <RestrictedRoute
          authUser={authUser}
          path={`${match.url}`}
          // authUser={authUser}
          component={MainApp}
        />

      </Switch>
    )
  }

  newMethod(location) {
    return location.pathname;
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { locale, navStyle, layoutType } = settings;
  const { authUser, initURL, isAllowed } = auth;
  return { locale, navStyle, layoutType, authUser, initURL, isAllowed }
};
export default connect(mapStateToProps, { setInitUrl, setThemeType, onNavStyleChange, onLayoutTypeChange })(App);
