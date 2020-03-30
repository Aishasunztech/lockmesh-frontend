import React, { Component } from "react";
import { Button, Drawer, Form, message, Radio, Row, Col, Card, Divider } from "antd";
import { connect } from "react-redux";
import Auxiliary from "util/Auxiliary";
import CustomScrollbars from "util/CustomScrollbars";
import { onLayoutTypeChange, onNavStyleChange, setThemeColorSelection, setThemeType } from "appRedux/actions/Setting";

import {
  BLUE,
  BLUE_DARK_TEXT_COLOR,
  BLUE_NAV_DARK_BG,
  BLUE_SEC,
  DARK_BLUE,
  DARK_BLUE_DARK_TEXT_COLOR,
  DARK_BLUE_NAV_DARK_BG,
  DARK_BLUE_SEC,
  DEEP_ORANGE,
  DEEP_ORANGE_DARK_TEXT_COLOR,
  DEEP_ORANGE_NAV_DARK_BG,
  DEEP_ORANGE_SEC,
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  LIGHT_BLUE,
  LIGHT_BLUE_DARK_TEXT_COLOR,
  LIGHT_BLUE_NAV_DARK_BG,
  LIGHT_BLUE_SEC,
  LIGHT_PURPLE,
  LIGHT_PURPLE_1,
  LIGHT_PURPLE_1_DARK_TEXT_COLOR,
  LIGHT_PURPLE_1_NAV_DARK_BG,
  LIGHT_PURPLE_1_SEC,
  LIGHT_PURPLE_2,
  LIGHT_PURPLE_2_DARK_TEXT_COLOR,
  LIGHT_PURPLE_2_NAV_DARK_BG,
  LIGHT_PURPLE_2_SEC,
  LIGHT_PURPLE_DARK_TEXT_COLOR,
  LIGHT_PURPLE_NAV_DARK_BG,
  LIGHT_PURPLE_SEC,
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
  ORANGE,
  ORANGE_DARK_TEXT_COLOR,
  ORANGE_NAV_DARK_BG,
  ORANGE_SEC,
  RED,
  RED_DARK_TEXT_COLOR,
  RED_NAV_DARK_BG,
  RED_SEC,
  THEME_COLOR_SELECTION_CUSTOMIZE,
  THEME_COLOR_SELECTION_PRESET,
  THEME_TYPE_DARK,
  THEME_TYPE_LITE,
  THEME_TYPE_SEMI_DARK
} from "../../constants/ThemeSetting";

import { Modal } from 'antd';

const success = Modal.success
const error = Modal.error

class Customizer extends Component {


  onChangeComplete = (varName, color) => {
    const { vars } = this.state;
    vars[varName] = color;
    this.setState({ vars });
  };
  handleColorChange = (varname, color) => {
    const { vars } = this.state;
    if (varname) vars[varname] = color;
    // console.log("vars: ", vars)
    if (window.less.modifyVars) {
      window.less
        .modifyVars(vars)
        .then(() => {
          success({
            title: `Theme updated successfully`,
          });
          this.setState({ vars });
          localStorage.setItem("app-theme", JSON.stringify(vars));
        })
        .catch(err => {
          error({
            title: `Failed to update theme`,
          });
        });
    } else {
      message.error(`Check Please your internet connection is poor`);
    }
  };

  toggleCustomizer = () => {
    this.setState(previousState => (
      {
        isCustomizerOpened: !previousState.isCustomizerOpened
      }));
  };


  onThemeTypeChange = (e) => {
    this.props.setThemeType(e.target.value);
  };
  onColorSelectionTypeChange = (e) => {
    this.props.setThemeColorSelection(e.target.value);
  };

  onNavStyleChange = (navStyle) => {
    this.props.onNavStyleChange(navStyle);
  };

  handleThemeColor = (primaryColor, secondaryColor, navDarkTextColor, navDarkBg) => {
    let modifiedVars = this.state.vars;
    modifiedVars['@primary-color'] = primaryColor;
    modifiedVars['@secondary-color'] = secondaryColor;
    modifiedVars['@nav-dark-bg'] = navDarkBg;
    modifiedVars['@nav-dark-text-color'] = navDarkTextColor;
    this.setState({ vars: modifiedVars });
    this.handleColorChange();
  };

  handleLayoutTypes = (layoutType) => {
    this.props.onLayoutTypeChange(layoutType);
  };



  constructor(props) {
    super(props);
    let initialValue = {
      '@primary-color': '#038fde',
      '@secondary-color': '#fa8c16',
      '@text-color': '#545454',
      '@heading-color': '#535353',
      '@nav-dark-bg': '#003366',
      '@nav-dark-text-color': '#038fdd',
      '@header-text-color': '#262626',
      '@layout-header-background': '#fefefe',
      '@layout-footer-background': '#fffffd',
      '@body-background': '#f5f5f5',
      '@hor-nav-text-color': '#fffffd'
    };
    let vars = {};

    try {
      vars = Object.assign({}, initialValue, JSON.parse(localStorage.getItem('app-theme')));
    } finally {
      this.state = { vars, initialValue, isCustomizerOpened: false };
      if (window.less.modifyVars) {
        window.less
          .modifyVars(vars)
          .then(() => {
          })
          .catch(error => {
            message.error(`Failed to update theme`);
          });
      } else {
        message.error(`Check Please your internet connection is poor`);
      }
    }
  }

  render() {

    return (
      <div></div>
    );
  }
}

Customizer = Form.create()(Customizer);

const mapStateToProps = ({ settings }) => {
  const { themeType, width, colorSelection, navStyle, layoutType } = settings;
  return { themeType, width, colorSelection, navStyle, layoutType }
};
export default connect(mapStateToProps, {
  setThemeType,
  onLayoutTypeChange,
  setThemeColorSelection,
  onNavStyleChange
})(Customizer);
