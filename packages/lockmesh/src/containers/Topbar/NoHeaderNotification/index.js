import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import Auxiliary from "../../../util/Auxiliary";

import { toggleCollapsedSideNav } from "../../../appRedux/actions/Setting";
import { APP_TITLE } from "../../../constants/Application";

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE
} from "../../../constants/ThemeSetting";

const { Header } = Layout;

class NoHeaderNotification extends Component {

  render() {
    const { navCollapsed } = this.props;
    const { locale, width, navStyle } = this.props;
    // (width < TAB_SIZE)
    return (
      <Auxiliary>
        {/* replaced this class by new one */}
        <div className="gx-no-header-horizontal hidden-md">
        {/* <div className="gx-no-header-horizontal"> */}

          {/* replaced this class by new one */}
          <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
          {/* <div className="gx-d-block  gx-linebar gx-mr-xs-3"> */}
            {
              (width < TAB_SIZE) ?
                <i className="gx-icon-btn icon icon-menu"
                  onClick={() => {
                    this.props.toggleCollapsedSideNav(!navCollapsed);
                  }}
                />
                :
                null
            }

            {/**
             * @author Usman Hafeez
             * @description 
             *  
             * */ }
            {/* <a to="/" className="gx-site-logo">
              <p className="mb-0" style={{ fontSize: 18 }}>
                {APP_TITLE}
              </p>
            </a> */}

          </div>

        </div>
        {/* <h1>hello</h1> */}
      </Auxiliary>
    )


  }
}

const mapStateToProps = ({ settings }) => {
  const { locale, navStyle, navCollapsed, width } = settings;
  return { locale, navStyle, navCollapsed, width };
};
export default connect(mapStateToProps, { toggleCollapsedSideNav })(NoHeaderNotification);
