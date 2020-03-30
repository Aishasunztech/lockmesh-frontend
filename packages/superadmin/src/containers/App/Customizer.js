import React, { Component } from "react";
import { Button, Drawer, Form, message, Radio, Row, Col, Card, Divider } from "antd";
import { connect } from "react-redux";
import Auxiliary from "util/Auxiliary";
import CustomScrollbars from "util/CustomScrollbars";
import { onLayoutTypeChange, onNavStyleChange, setThemeColorSelection, setThemeType } from "appRedux/actions/Setting";

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
    // if (window.less.modifyVars) {
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
    // } else {
    //   error({
    //     title: `Internet Problem`,
    //   });
    // }
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
      // if (window.less.modifyVars) {
        window.less
          .modifyVars(vars)
          .then(() => {
          })
          .catch(error => {
            message.error(`Failed to update theme`);
          });
      // } else {
      //   error({
      //     title: `Internet Problem`,
      //   });
      // }
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
