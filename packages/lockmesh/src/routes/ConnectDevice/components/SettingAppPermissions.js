import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  handleCheckExtension,
  handleCheckAllExtension,
  handleSecureSettingCheck

} from "../../../appRedux/actions/ConnectDevice";
import { BASE_URL } from '../../../constants/Application';

import ExtensionDropdown from './ExtensionDropdown';
import { ENABLE, ENCRYPT, Guest, ENCRYPTED, IN_APP_MENU_DISPLAY } from '../../../constants/TabConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { SECURE_SETTING_PERMISSION, NOT_AVAILABLE, SECURE_SETTINGS, SECURE_SETTING } from '../../../constants/Constants';


class SettingAppPermissions extends Component {

  constructor(props) {
    super(props)
    const columns = [
      {
        title: convertToLang(props.translation[IN_APP_MENU_DISPLAY], "In-App Menu Display"),
        dataIndex: 'name',
        key: 'name',
      }, {
        title: convertToLang(props.translation[Guest], "Guest"),
        dataIndex: 'guest',
        key: 'guest',
      }, {
        title: convertToLang(props.translation[ENCRYPTED], "Encrypted"),
        dataIndex: 'encrypted',
        key: 'encrypted',
      }
    ];

    this.state = {
      columns: columns,
      extensions: [],
      secureSetting: {},
      uniqueName: '',
      guestAllExt: false,
      encryptedAllExt: false
    }
  }

  componentDidMount() {
    if (this.props.isExtension) {
      this.setState({
        extensions: this.props.extensions,
        secureSetting: this.props.secureSetting,
        pageName: this.props.pageName
      })
    }

  }

  componentWillReceiveProps(nextprops) {

    if (this.props.isExtension) {
      // alert("hello");
      this.setState({
        extensions: nextprops.extensions,
        secureSetting: this.props.secureSetting,
        encryptedAllExt: nextprops.encryptedAllExt,
        guestAllExt: nextprops.guestAllExt
      })
    }

  }


  handleChecked = (e, key, app_id = '000') => {
    this.props.handleCheckExtension(e, key, app_id, this.props.pageName);
  }
  handleSecureSettingCheck = (value, controlName) => {
    this.props.handleSecureSettingCheck(value, controlName, SECURE_SETTING)
  }

  handleCheckedAll = (key, value) => {

    // console.log("handleCheckedAll");
    if (key === "guestAllExt") {
      this.props.handleCheckAllExtension(key, 'guest', value, this.props.pageName);
    } else if (key === "encryptedAllExt") {
      this.props.handleCheckAllExtension(key, 'encrypted', value, this.props.pageName);
    }
  }

  renderApps = () => {
    let extensions = this.state.extensions;
    console.log("render list extension", extensions);

    // if (extensions.length) {
      return checkIsArray(extensions).map((ext, index) => {
        return {
          key: ext.app_id,
          name: (
            <Fragment>
              <Avatar
                className="perm_icons"
                size={"small"}
                src={`${BASE_URL}users/getFile/${ext.icon}`}
              // style={{ width: "30px", height: "30px" }} 
              />
              <div className="line_break"><a className="perm_txt">{ext.label}</a></div>
            </Fragment>),
          // name: ext.label,
          guest: <Switch checked={ext.guest === 1 ? true : false} size="small"
            onClick={(e) => {
              // console.log("guest", e);
              this.handleChecked(e, "guest", ext.app_id);
            }}
          />,
          encrypted: <Switch checked={ext.encrypted === 1 ? true : false} size="small"
            onClick={(e) => {
              // console.log("guest", e);
              this.handleChecked(e, "encrypted", ext.app_id);
            }}
          />
        }
      })

    // }
  }
  render() {
    const { secureSetting, isExtension } = this.props;
    // const { extension } = this.state;
    if (isExtension) {
      return (
        <Fragment>
          <ExtensionDropdown
            checked_app_id={null}
            encryptedAll={this.state.encryptedAllExt}
            guestAll={this.state.guestAllExt}
            handleCheckedAll={this.handleCheckedAll}
            translation={this.props.translation}
          />
          <Row className="first_head">
            <Col span={4} className="pr-0">
              <img src={require("assets/images/secure_setting.png")} />
            </Col>
            <Col span={20} className="pl-4 pr-0">
              <h5>{convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], "Secure Settings Permission")}</h5>
            </Col>
          </Row>
          <Row className="sec_head">
            <Col span={8}>
              <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                // console.log("guest", e);
                this.handleSecureSettingCheck(e, "guest");
              }} checked={secureSetting.guest ? true : false} size="small" />
            </Col>
            <Col span={8}>
              <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                // console.log("guest", e);
                this.handleSecureSettingCheck(e, "encrypted");
              }} checked={secureSetting.encrypted ? true : false} size="small" />
            </Col>
            <Col span={8}>
              <span>{convertToLang(this.props.translation[ENABLE], "Enable")} </span> <Switch onClick={(e) => {
                // console.log("guest", e);
                this.handleSecureSettingCheck(e, "enable");
              }} checked={secureSetting.enable ? true : false} size="small" />
            </Col>
          </Row>

          <div className="sec_set_table">
            <Table dataSource={this.renderApps()} columns={this.state.columns} pagination={false} scroll={{ y: 286 }} />
          </div>

        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[SECURE_SETTINGS], "Secure Settings")} <br></br> {convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</a></h1>
        </Fragment>
      )
    }

  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // showHistoryModal: showHistoryModal
    handleCheckExtension: handleCheckExtension,
    handleCheckAllExtension: handleCheckAllExtension,
    handleSecureSettingCheck: handleSecureSettingCheck
    // handleCheckAll: handleCheckAll
  }, dispatch);
}


var mapStateToProps = ({ device_details }, ownProps) => {
  // console.log(device_details, "applist ownprops", ownProps);
  const pageName = ownProps.pageName;
  let secureSetting = device_details.app_list.find(o => o.uniqueName === pageName);
  // console.log("extensions_", device_details.secureSettingsMain);
  let isExtension = false
  if (secureSetting !== undefined) {
    isExtension = true;
  }

  return {
    isExtension: isExtension,
    secureSetting: secureSetting,
    guestAllExt: device_details.guestAllExt,
    encryptedAllExt: device_details.encryptedAllExt,
    checked_app_id: device_details.checked_app_id,
    extensions: device_details.extensions
  }


}

export default connect(mapStateToProps, mapDispatchToProps)(SettingAppPermissions);