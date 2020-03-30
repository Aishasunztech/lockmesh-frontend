import React, { Component, Fragment, Typography } from 'react';
import { List, Switch, Col, Row } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SYSTEM_PERMISSION } from '../../../constants/Constants';
import {
  handleControlCheck,
  handleCheckAllExtension,
  handleMainSettingCheck

} from "../../../appRedux/actions/ConnectDevice";

import { Main_SETTINGS } from '../../../constants/Constants';

export default class SystemControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      controls: {},
      settings: [],
    }
  }


  componentDidMount() {
    if (this.props.controls) {
      this.setState({
        controls: this.props.controls.controls,
        settings: this.props.controls.settings,
        pageName: this.props.pageName,
        // secureSettingsMain: this.props.secureSettingsMain
      })
    }
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps.controls, 'testig sdf')
    if (this.props !== prevProps) {
      this.setState({
        controls: this.props.controls.controls,
        settings: this.props.controls.settings,
      })
    }
  }

  componentWillReceiveProps(nextprops) {
    // console.log('new props', nextprops)
    if (this.props.controls && (this.props.controls !== nextprops.controls)) {
      // alert("hello");
      // console.log(nextprops.secureSettingsMain, 'secureSettingsMain')
      this.setState({
        controls: nextprops.controls.controls,
        settings: nextprops.controls.settings,
        // secureSettingsMain: nextprops.secureSettingsMain
        // encryptedAllExt: nextprops.encryptedAllExt,
        // guestAllExt: nextprops.guestAllExt
      })
    }
  }

  handleChecked = (value, controlName, main = null) => {
    this.props.handleControlCheck(value, controlName, main)
  }

  handleMainSettingCheck = (value, controlName) => {
    this.props.handleMainSettingCheck(value, controlName, Main_SETTINGS)

  }

  render() {
    // console.log('consroslss sdfsd fsd ', this.state.controls);
    let objindex = -1;
    // console.log('object settings', this.state.settings)
    // if(this.state.settings !== undefined && this.state.settings && this.state.controls.length){
    if (this.state.settings !== undefined && this.state.settings && this.state.settings !== []) {
      objindex = this.state.settings.findIndex(item => item.uniqueName == Main_SETTINGS)
    }
    // console.log('object settings', objindex)
    if (this.state.controls) {

      return (
        Object.entries(this.state.controls).length > 0 && this.state.controls.constructor === Object ?
          <Fragment>
            <div>
              <List>
                {
                  (this.state.settings !== undefined && this.state.settings && this.state.settings !== [] && objindex>=0) ?
                    <div className="row width_100 m-0 sec_head1">
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Guest</span>
                        <Switch onClick={(e) => {
                          //  console.log("guest", e , this.state.settings[objindex]);
                          this.handleMainSettingCheck(e, "guest");
                        }} checked={this.state.settings[objindex].guest === 1 || this.state.settings[objindex].guest === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Encrypt</span>
                        <Switch onClick={(e) => {
                          // console.log("guest", e);
                          this.handleMainSettingCheck(e, "encrypted");
                        }} checked={this.state.settings[objindex].encrypted === 1 || this.state.settings[objindex].encrypted === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Enable</span>
                        <Switch onClick={(e) => {
                          // console.log("guest", e);
                          this.handleMainSettingCheck(e, "enable");
                        }} checked={this.state.settings[objindex].enable === 1 || this.state.settings[objindex].enable === true ? true : false} size="small" />
                      </div>
                    </div>
                    : false
                }

                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>Wifi</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch disabled checked={this.state.controls.wifi_status == 1 || this.state.controls.wifi_status == true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "wifi_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>Bluetooth</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.bluetooth_status == 1 || this.state.controls.bluetooth_status == true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "bluetooth_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>Hotspot</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.hotspot_status == 1 || this.state.controls.hotspot_status == true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "hotspot_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>Screenshots</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.screenshot_status == 1 || this.state.controls.screenshot_status == true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "screenshot_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>Block Calls</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.call_status == 1 || this.state.controls.call_status == true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "call_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
              </List>
            </div>
          </Fragment> :
          <Fragment>
            <h1 className="not_syn_txt"><a>{SYSTEM_PERMISSION} <br></br> Not Available</a></h1>
          </Fragment>
      )
    }
    else {
      return (
        <Fragment>
          <h1 className="not_syn_txt"><a>{SYSTEM_PERMISSION} <br></br> Not Available</a></h1>
        </Fragment>
      )
    }
    // }
    // else{
    //   return(
    //     <Fragment>
    //         <h1 className="not_syn_txt"><a>{SYSTEM_PERMISSION} <br></br> Not Available</a></h1>
    //       </Fragment>
    //   )
    // }

  }
}


// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     // showHistoryModal: showHistoryModal
//     handleControlCheck: handleControlCheck,
//     handleCheckAllExtension: handleCheckAllExtension,
//     handleMainSettingCheck: handleMainSettingCheck,
//     // handleCheckAll: handleCheckAll
//   }, dispatch);
// }


// var mapStateToProps = ({ device_details }, ownProps) => {
//   // console.log(device_details, "applist ownprops", ownProps);
//   const pageName = ownProps.pageName;

//   let controls = device_details.controls;
//   console.log("controls are", controls);

//     return {
//       controls: controls,
//       guestAllExt: device_details.guestAllExt,
//       encryptedAllExt: device_details.encryptedAllExt,
//       checked_app_id: device_details.checked_app_id,
//       secureSettingsMain: device_details.secureSettingsMain,
//     }

// }

// export default connect(mapStateToProps, mapDispatchToProps)(SystemControls);
