import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs } from "antd";
import CircularProgress from "components/CircularProgress/index";
import DeviceSettings from './components/DeviceSettings';
import { convertToLang } from '../../routes/utils/commonUtils';
import DeviceNotFound from '../InvalidPage/deviceNotFound';
import BackBtn from './back';
import {
  getDeviceDetails,
  getDeviceApps,
  getProfiles,
  getPolicies,
  getDeviceHistories,
  loadDeviceProfile,
  pushApps,
  undoApps,
  redoApps,
  applySetting,
  startLoading,
  endLoading,
  // showMessage,
  unlinkDevice,
  changePage,
  activateDevice2,
  suspendDevice2,
  getAccIdFromDvcId,
  unflagged,
  flagged,
  wipe,
  checkPass,
  undoExtensions,
  redoExtensions,
  undoControls,
  redoControls,
  getImeiHistory,
  handleMainSettingCheck,
  handleControlCheck,
  handleCheckAllExtension,
  reSyncDevice,
  getDealerApps,
  getActivities,
  clearApplications,
  clearState,
  clearResyncFlag,
  changeSchatPinStatus,
  closeChatIdSettingsEnable,
  resetDevice,
  deviceNotFound, resetChatPin,
  resetPgpLimit
} from "../../appRedux/actions/ConnectDevice";

import { getDevicesList, editDevice } from '../../appRedux/actions/Devices';
import {
  connectSocket,
  ackFinishedPushApps,
  ackFinishedPullApps,
  ackFinishedPolicy,
  ackFinishedWipe,
  actionInProcess,
  ackImeiChanged,
  getAppJobQueue,
  ackSinglePushApp,
  ackSinglePullApp,
  ackFinishedPolicyStep,
  receiveSim,
  hello_web,
  closeConnectPageSocketEvents,
  ackInstalledApps,
  ackUninstalledApps,
  ackSettingApplied,
  sendOnlineOfflineStatus,
  deviceSynced,

} from "../../appRedux/actions/Socket";

import imgUrl from '../../assets/images/mobile.png';
// import { BASE_URL } from '../../constants/Application';
import {
  DEVICE_ACTIVATED, GUEST_PASSWORD, ENCRYPTED_PASSWORD, DURESS_PASSWORD, ADMIN_PASSWORD,
  SECURE_SETTING, SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
  // APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS,
  Main_SETTINGS,
  DEVICE_TRIAL,
  DEVICE_SUSPENDED
} from '../../constants/Constants';

import DeviceActions from './components/DeviceActions';
import DeviceSidebar from './components/DeviceSidebar';
import SideActions from './components/SideActions';
import ListSpaceApp from './components/ListSpaceApps';
import Password from "./components/Password"
import { getColor, isBase64 } from "../utils/commonUtils"
import SettingAppPermissions from "./components/SettingAppPermissions";
import SystemControls from "./components/SystemControls";
import styles from './ConnectDevice.css';
import ProgressBar from "../../components/ProgressBar";
import { Button_Apply, Button_Cancel, Button_Back } from "../../constants/ButtonConstants";
import {
  DEVICE_NOT_FOUND,
  SETTINGS_TO_BE_SENT_TO_DEVICE,
  DEVICE_NOT_SYNCED,
  DEVICE_IS,
  Suspended_TEXT,
  GUEST,
  ENCRYPTED
} from "../../constants/DeviceConstants";

import { mobileMainMenu, mobileManagePasswords } from '../utils/columnsUtils';

const success = Modal.success
const error = Modal.error
const TabPane = Tabs.TabPane;
class ConnectDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {

      // removed these states from component did mount so I wrote in constructor
      // pageName: MAIN_MENU,
      pageName: props.pageName,
      device_id: isBase64(props.match.params.device_id),
      controls: props.controls,
      changedCtrls: props.changedCtrls,
      // changedCtrls: {},

      showChangesModal: false,
      // controls: [],
      imei_list: [],
      showMessage: false,
      messageText: '',
      messageType: '',
      dynamicBackButton: false,
      apk_list: props.apk_list
    }
    // console.log("hello every body", this.props);
    this.mainMenu = mobileMainMenu(props.translation);
    this.subMenu = mobileManagePasswords(props.translation);
  }

  changePage = (pageName) => {
    if (this.props.device_details.finalStatus === DEVICE_ACTIVATED || this.props.device_details.finalStatus === DEVICE_TRIAL) {
      this.props.changePage(pageName);
      this.setState({ dynamicBackButton: true })
    }
  }
  onBackHandler = () => {
    if (this.props.device_details.finalStatus === DEVICE_ACTIVATED || this.props.device_details.finalStatus === DEVICE_TRIAL) {
      if (this.props.pageName === GUEST_PASSWORD || this.props.pageName === ENCRYPTED_PASSWORD || this.props.pageName === DURESS_PASSWORD || this.props.pageName === ADMIN_PASSWORD) {
        this.props.changePage(MANAGE_PASSWORD);
      }
      // else if (this.props.pageName === MANAGE_PASSWORD) {
      //   this.setState({ dynamicBackButton: false })
      //   this.props.changePage(MAIN_MENU);
      // }

      else {
        this.setState({ dynamicBackButton: false })
        this.props.changePage(MAIN_MENU);
      }
    }
  }

  componentDidMount() {

    const device_id = isBase64(this.props.match.params.device_id);
    // console.log(device_id);
    if (device_id && device_id !== '') {

      // this.setState({
      //   pageName: this.props.pageName,
      //   device_id: isBase64(this.props.match.params.device_id),
      //   controls: this.props.controls,
      //   changedCtrls: this.props.changedCtrls
      // });

      this.props.startLoading();


      // this.props.connectSocket()

      this.props.getDeviceDetails(device_id);
      this.props.getAppJobQueue(device_id);
      this.props.getDeviceApps(device_id);
      this.props.getProfiles(device_id);
      this.props.getPolicies();
      this.props.getDeviceHistories(device_id);
      this.props.getImeiHistory(device_id);
      this.props.getDealerApps();
      this.props.getActivities(device_id)
    } else {
      this.props.deviceNotFound();
    }


    // this.props.endLoading();
    setTimeout(() => {
      this.props.endLoading();
    }, 2000);
    // window.addEventListener('hashchange', this.componentGracefulUnmount);
  }


  componentDidUpdate(prevProps) {
    // console.log('hi')
    const device_id = isBase64(this.props.match.params.device_id);
    if (this.props.forceUpdate !== prevProps.forceUpdate || this.props.controls !== prevProps.controls || this.props.imei_list !== prevProps.imei_list || this.props.showMessage !== prevProps.showMessage) {
      // console.log('this.props.controls componentDidUpdate ', this.props.controls)
      this.setState({
        controls: this.props.controls,
        changedCtrls: this.props.changedCtrls,
        imei_list: this.props.imei_list,
        showMessage: this.props.showMessage,
        messageText: this.props.messageText,
        messageType: this.props.messageType
      })
    }

    if (this.props.translation != prevProps.translation) {
      this.mainMenu = mobileMainMenu(this.props.translation);
      this.subMenu = mobileManagePasswords(this.props.translation);
    }

    if (this.props.getHistory != prevProps.getHistory) {
      const device_id = isBase64(this.props.match.params.device_id);
      this.props.getDeviceDetails(device_id);
    }


  }

  componentWillReceiveProps(nextProps) {
    const device_id = isBase64(nextProps.match.params.device_id);
    // console.log(device_id);
    if (device_id) {
      if (this.props.translation != nextProps.translation) {
        this.mainMenu = mobileMainMenu(nextProps.translation);
        this.subMenu = mobileManagePasswords(nextProps.translation);
      }

      if (this.props.apk_list !== nextProps.apk_list) {
        this.setState({
          apk_list: nextProps.apk_list
        })
      }


      // there is no use of pathname under device id section
      // if(this.props.history.location.pathname !== nextProps.history.location.pathname){
      // if(this.props.pathName !== nextProps.pathName){
      if (nextProps.socket) {
        // if (this.props.socket === null && nextProps.socket !== null) {

        console.log("socket connected component: ", nextProps.socket.connected)
        if (nextProps.socket.connected) {
          nextProps.sendOnlineOfflineStatus(nextProps.socket, device_id);
          nextProps.actionInProcess(nextProps.socket, device_id);
          nextProps.ackFinishedPushApps(nextProps.socket, device_id);
          nextProps.ackFinishedPullApps(nextProps.socket, device_id);
          nextProps.ackFinishedPolicy(nextProps.socket, device_id);
          nextProps.ackFinishedWipe(nextProps.socket, device_id);
          nextProps.ackImeiChanged(nextProps.socket, device_id);
          nextProps.ackSinglePushApp(nextProps.socket, device_id);
          nextProps.ackSinglePullApp(nextProps.socket, device_id);
          nextProps.ackFinishedPolicyStep(nextProps.socket, device_id);
          nextProps.ackInstalledApps(nextProps.socket, device_id);
          nextProps.ackUninstalledApps(nextProps.socket, device_id);
          nextProps.ackSettingApplied(nextProps.socket, device_id);
          nextProps.receiveSim(nextProps.socket, device_id);
          nextProps.deviceSynced(nextProps.socket, device_id);
        }
      }
      // }
    } else {
      this.props.deviceNotFound();
    }
    if (this.props !== nextProps) {
      // console.log('object, ', nextProps.showMessage)
      if (nextProps.reSync) {

        // let deviceId = isBase64(nextProps.match.params.device_id);
        // this.props.clearResyncFlag();
        // this.props.getDeviceDetails(deviceId);
        // this.props.getAppJobQueue(deviceId);
        // this.props.getDeviceApps(deviceId);
        // this.props.getProfiles(deviceId);
        // this.props.getPolicies(deviceId);
        // this.props.getDeviceHistories(deviceId);
        // this.props.getImeiHistory(deviceId);
        // this.props.getDealerApps();
        // this.props.getActivities(deviceId)
        // this.onBackHandler();
        // this.props.endLoading();
      }
    }


  }


  renderScreen = () => {
    const isSync = (this.props.isSync === 1 || this.props.isSync === true) ? true : false;
    let finalStatusIs = this.props.device_details.finalStatus;

    if (finalStatusIs === "Active" || finalStatusIs === "Trial") {
      if (isSync) {
        if (this.props.pageName === MAIN_MENU) {
          return (
            <div>
              <div style={{ color: 'orange', width: '50%', float: 'left' }}></div>
              <List
                className="dev_main_menu"
                size="small"
                dataSource={this.mainMenu}
                renderItem={item => {
                  return (<List.Item
                    onClick={() => {
                      this.changePage(item.pageName)
                    }}
                  ><a>{item.value}</a></List.Item>)
                }}
              />
            </div>
          );
        }
        else if (this.props.pageName === APPS) {
          return (
            <div className="guest_encrypt">
              <Tabs type="line" className="text-center" size="small">
                <TabPane tab={<span className="green">{convertToLang(this.props.translation[GUEST], "GUEST")}</span>} key="1" >
                  <ListSpaceApp
                    type="guest"
                  />
                </TabPane>
                <TabPane tab={<span className="green">{convertToLang(this.props.translation[ENCRYPTED], "ENCRYPTED")}</span>} key="2" forceRender={true}>
                  <ListSpaceApp
                    type="encrypted"
                  />
                </TabPane>
              </Tabs>
            </div>
          );
        } else if (this.props.pageName === GUEST_PASSWORD) {
          return (<Password pwdType={this.props.pageName} device_details={this.props.device_details} />);
        } else if (this.props.pageName === ENCRYPTED_PASSWORD) {
          return (<Password pwdType={this.props.pageName} device_details={this.props.device_details} />);
        } else if (this.props.pageName === DURESS_PASSWORD) {
          return (<Password pwdType={this.props.pageName} device_details={this.props.device_details} />);
        } else if (this.props.pageName === ADMIN_PASSWORD) {
          return (<Password pwdType={this.props.pageName} device_details={this.props.device_details} />);
        } else if (this.props.pageName === SECURE_SETTING) {
          return (
            <SettingAppPermissions
              pageName={this.props.pageName}
              translation={this.props.translation}
            />

          );
        } else if (this.props.pageName === SYSTEM_CONTROLS) {
          return (
            <SystemControls
              auth={this.props.auth}
              controls={this.state.controls}
              app_list={this.props.app_list}
              handleCheckAllExtension={this.props.handleCheckAllExtension}
              handleControlCheck={this.props.handleControlCheck}
              handleMainSettingCheck={this.props.handleMainSettingCheck}
              guestAllExt={this.props.guestAllExt}
              encryptedAllExt={this.props.encryptedAllExt}
              checked_app_id={this.props.checked_app_id}
              secureSettingsMain={this.props.secureSettingsMain}
              translation={this.props.translation}
            />
          );
        } else if (this.props.pageName === MANAGE_PASSWORD) {
          return (
            <List
              className="dev_main_menu"
              size="small"
              dataSource={this.subMenu}
              renderItem={item => {
                return (<List.Item
                  onClick={() => {

                    this.changePage(item.pageName)
                  }}
                ><a>{item.value}</a></List.Item>)
              }}
            />
          )

        } else {
          // if (this.props.pageName === MAIN_MENU) {
          return (
            <div>
              <div style={{ color: 'orange', width: '50%', float: 'left' }}></div>
              <List
                className="dev_main_menu"
                size="small"
                dataSource={this.mainMenu}
                renderItem={item => {
                  return (<List.Item
                    onClick={() => {
                      this.changePage(item.pageName)
                    }}
                  ><a>{item.value}</a></List.Item>)
                }}
              />
            </div>
          );
          // }
        }
      } else {
        return (<div><h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[DEVICE_NOT_SYNCED], "Device is not Synced")}</a></h1></div>)
      }

    } else {
      // if (this.props.pageName === NOT_AVAILABLE) {
      return (<div><h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[DEVICE_IS], "Device is ")}
        {(finalStatusIs == DEVICE_SUSPENDED) ? convertToLang(this.props.translation[Suspended_TEXT], DEVICE_SUSPENDED) : finalStatusIs}</a></h1></div>);
      // }
    }

  }

  applyActionButton = (visible = true) => {
    this.setState({
      showChangesModal: visible,
    })
  }

  applyActions = () => {
    let obData;
    let objIndex = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING);
    let app_list = this.props.app_list;

    if (objIndex >= 0) {

      obData = {
        enable: this.props.extensions[objIndex].enable,
        encrypted: this.props.extensions[objIndex].encrypted,
        guest: this.props.extensions[objIndex].guest,
        label: this.props.extensions[objIndex].label,
        uniqueName: this.props.extensions[objIndex].uniqueName
      }
    }


    // if (this.props.controls && this.props.controls.settings) {
    //   if (this.props.controls.settings.length) {
    //     let index = this.props.controls.settings.findIndex(item => item.uniqueName === Main_SETTINGS)
    //     if (index >= 0) {
    //       app_list.push(this.props.controls.settings[index])
    //     }
    //   }
    // }

    // if (this.props.extensions) {
    //   if (this.props.extensions.length) {
    //     let index = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING)
    //     if (index >= 0) {
    //       app_list.push(this.props.extensions[index])
    //     }
    //   }
    // }
    console.log(app_list, this.state.controls, this.props.extensions);

    this.props.applySetting(
      app_list, {
      adminPwd: this.props.adminPwd,
      guestPwd: this.props.guestPwd,
      encryptedPwd: this.props.encryptedPwd,
      duressPwd: this.props.duressPwd,
    },
      this.props.extensions,
      this.state.controls,
      this.state.device_id,
      this.props.user_acc_id,
      null, null,
    );

    this.onCancel();
    let deviceId = atob(this.props.match.params.device_id);


    this.props.getDeviceApps(deviceId);
    // if (!this.props.device_details.online) {

    // }
    this.props.getActivities(deviceId);
  }

  componentWillUnmount() {
    const device_id = isBase64(this.props.match.params.device_id);
    this.props.closeConnectPageSocketEvents(this.props.socket, device_id);
    this.props.resetDevice();
    this.onBackHandler();
  }

  refreshDevice = (deviceId, reSync = false) => {

    this.props.startLoading();

    if (!deviceId || deviceId == '') {
      deviceId = isBase64(this.props.match.params.device_id);
    }

    if (reSync) {
      this.props.reSyncDevice(deviceId);
      setTimeout(() => {
        this.props.getDeviceDetails(deviceId);
        this.props.getAppJobQueue(deviceId);
        this.props.getDeviceApps(deviceId);
        this.props.getProfiles(deviceId);
        this.props.getPolicies();
        this.props.getDeviceHistories(deviceId);
        this.props.getImeiHistory(deviceId);
        this.props.getDealerApps();
        this.props.getActivities(deviceId)
        this.onBackHandler();
        this.props.endLoading();
      }, 10000);
    } else {
      this.props.getDeviceDetails(deviceId);
      this.props.getAppJobQueue(deviceId);
      this.props.getDeviceApps(deviceId);
      this.props.getProfiles(deviceId);
      this.props.getPolicies();
      this.props.getDeviceHistories(deviceId);
      this.props.getImeiHistory(deviceId);
      this.props.getDealerApps();
      this.props.getActivities(deviceId)
      this.onBackHandler();
      setTimeout(() => {
        this.props.endLoading();
      }, 3000);
    }
  }

  undoAction = () => {
    let pageName = this.props.pageName;

    if (pageName === APPS) {
      this.props.undoApplications()
    } else if (pageName === SECURE_SETTING) {
      this.props.undoExtensions()
    } else if (pageName === SYSTEM_CONTROLS) {
      this.props.undoControls()
    }
  }

  redoAction = () => {

    let pageName = this.props.pageName;
    // console.log('redo', pageName)
    if (pageName === APPS) {
      this.props.redoApplications()
    } else if (pageName === SECURE_SETTING) {
      this.props.redoExtensions()
    } else if (pageName === SYSTEM_CONTROLS) {
      this.props.redoControls()
    }
  }

  onCancel = () => {
    this.setState({
      showChangesModal: false,
    });
  }


  capitalizeFirstLetter = (string) => {
    if (string && string !== '' && string !== null && string !== 'N/A') {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string
    }

  }

  render() {
    let finalStatus = (this.props.device_details.finalStatus === 'Activated' || this.props.device_details.finalStatus === '' || this.props.device_details.finalStatus === null || this.props.device_details.finalStatus === undefined) ? 'Active' : this.props.device_details.finalStatus;
    let color = getColor(finalStatus)
    let onlineStatus = this.props.device_details.online
    let onlineColor = (onlineStatus === 'offline') ? { color: 'red' } : { color: 'green' }

    // Policy Loading

    // let totalApps = (this.props.noOfApp_push_pull === undefined || this.props.noOfApp_push_pull === 0) ? this.props.noOfApp_push_pull_device : this.props.noOfApp_push_pull
    // let completeApps = (this.props.noOfApp_pushed_pulled === undefined) ? 0 : this.props.noOfApp_pushed_pulled
    // let completeStep = this.props.complete_policy_step;
    // let policy_loading = (this.props.is_policy_applying === 1) ? (this.props.is_policy_finish === false) ? 1 : this.props.is_policy_process : this.props.is_policy_process

    // let BackBtnstyle;
    // if (this.state.dynamicBackButton) {
    //   BackBtnstyle = "pt-42 status_bar"
    // } else {
    //   BackBtnstyle = "pt-60 status_bar"
    // }
    return (
      (this.props.device_found) ?
        <div className="gutter-example">

          {this.props.isLoading ?
            <div className="gx-loader-view">
              <CircularProgress />
            </div> :
            <div>
              <Row gutter={16} type="flex" align="top">
                <Col className="gutter-row left_bar" xs={24} sm={24} md={24} lg={24} xl={8} span={8}>
                  <DeviceSidebar
                    device_details={this.props.device_details}
                    resetChatPin={this.props.resetChatPin}
                    changeSchatPinStatus={this.props.changeSchatPinStatus}
                    refreshDevice={this.refreshDevice}
                    startLoading={this.props.startLoading}
                    endLoading={this.props.endLoading}
                    auth={this.props.auth}
                    translation={this.props.translation}
                    history={this.props.history}
                    checkPass={this.props.checkPass}
                    chatIdSettingsEnable={this.props.chatIdSettingsEnable}
                    closeChatIdSettingsEnable={this.props.closeChatIdSettingsEnable}
                    resetPgpLimit={this.props.resetPgpLimit}

                  />
                </Col>
                <Col className="gutter-row action_group" span={8} xs={24} sm={24} md={24} lg={24} xl={8}>
                  <Card>
                    <div className="gutter-box bordered deviceImg" alt="Mobile Image" style={{ backgroundImage: 'url(' + imgUrl + ')' }}>
                      <a className="dev_back_btn" onClick={() => {
                        this.onBackHandler();
                      }}>
                        {(this.state.dynamicBackButton && this.props.pageName !== MAIN_MENU) ? (<span><Icon type="left" />{convertToLang(this.props.translation[Button_Back], "Back")}</span>) : null}

                      </a>
                      <div className="pt-60 status_bar">
                        <div className="col-md-6 col-xs-6 col-sm-6 active_st">
                          <h5><span style={color}>{this.capitalizeFirstLetter(finalStatus)}</span></h5>
                        </div>
                        <div className="col-md-6 col-xs-6 col-sm-6 offline_st">
                          <h5><span style={onlineColor}>{this.capitalizeFirstLetter(onlineStatus)}</span></h5>
                        </div>
                      </div>
                      {this.renderScreen()}
                      <DeviceActions
                        undoApplications={this.undoAction}
                        redoApplications={this.redoAction}
                        applyActionButton={this.applyActionButton}
                        clearApplications={this.props.clearApplications}
                        applyBtn={this.props.applyBtn}
                        undoBtn={this.props.undoBtn}
                        redoBtn={this.props.redoBtn}
                        clearBtn={this.props.clearBtn}
                        translation={this.props.translation}
                        resetPgpLimit={this.props.resetPgpLimit}
                      />
                      <Button.Group className="nav_btn_grp">

                        <Button type="default" className="nav_btn" onClick={() => {
                          this.onBackHandler();
                        }} >
                          <Icon className="back_btn" component={BackBtn} />
                        </Button>
                        <Button type="default" className="nav_btn" onClick={() => {
                          this.changePage("main_menu")
                        }} />

                      </Button.Group>
                    </div>
                  </Card>
                </Col>
                <Col className="gutter-row right_bar" xs={24} sm={24} md={24} lg={24} xl={8}>
                  <SideActions
                    translation={this.props.translation}
                    device={this.props.device_details}
                    profiles={this.props.profiles}
                    policies={this.props.policies}
                    histories={this.props.histories}
                    activateDevice={this.props.activateDevice2}
                    suspendDevice={this.props.suspendDevice2}
                    editDevice={this.props.editDevice}
                    unlinkDevice={this.props.unlinkDevice}
                    flagged={this.props.flagged}
                    unflagged={this.props.unflagged}
                    wipe={this.props.wipe}
                    checkPass={this.props.checkPass}
                    history={this.props.history}
                    getDevicesList={this.props.getDevicesList}
                    refreshDevice={this.refreshDevice}
                    imei_list={this.props.imei_list}
                    apk_list={this.state.apk_list}
                  // applySetting = {this.applyActions}
                  />

                </Col>
              </Row>

              <Modal
                maskClosable={false}
                title={convertToLang(this.props.translation[SETTINGS_TO_BE_SENT_TO_DEVICE], "Confirm new Settings to be sent to Device ")}
                visible={this.state.showChangesModal}
                onOk={this.applyActions}
                onCancel={this.onCancel}
                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                okText={convertToLang(this.props.translation[Button_Apply], "Apply")}
              >
                <DeviceSettings
                  app_list={this.props.app_list}
                  extensions={this.props.extensions}
                  extensionUniqueName={SECURE_SETTING}
                  isAdminPwd={this.props.isAdminPwd}
                  isDuressPwd={this.props.isDuressPwd}
                  isEncryptedPwd={this.props.isEncryptedPwd}
                  isGuestPwd={this.props.isGuestPwd}
                  controls={this.props.controls}
                  showChangedControls={true}
                  translation={this.props.translation}
                  auth={this.props.auth}
                  pageName={this.props.pageName}
                  controlsExists={this.props.pageName === SYSTEM_CONTROLS ? true : false}

                />
              </Modal>
            </div>}

          {/* {this.props.isLoading ?
          <div className="gx-loader-view">
            <CircularProgress />
          </div> : null} */}

          {this.state.showMessage === true ?
            (this.state.messageType === "error") ?
              error({
                title: this.state.messageText,
              })
              :
              (this.state.messageType === "success") ?
                success({
                  title: this.state.messageText,
                })
                : null : null}


        </div>
        :
        // <h1>{convertToLang(this.props.translation[DEVICE_NOT_FOUND], "Device Not Found")} </h1>
        <DeviceNotFound />
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDeviceDetails: getDeviceDetails,
    getDeviceApps: getDeviceApps,
    getProfiles: getProfiles,
    getPolicies: getPolicies,
    getDeviceHistories: getDeviceHistories,
    loadDeviceProfile: loadDeviceProfile,
    pushApps: pushApps,
    startLoading: startLoading,
    endLoading: endLoading,
    undoApplications: undoApps,
    redoApplications: redoApps,
    undoExtensions: undoExtensions,
    redoExtensions: redoExtensions,
    undoControls: undoControls,
    redoControls: redoControls,
    applySetting: applySetting,
    changePage: changePage,
    suspendDevice2: suspendDevice2,
    activateDevice2: activateDevice2,
    editDevice: editDevice,
    getDevicesList: getDevicesList,
    getAccIdFromDvcId: getAccIdFromDvcId,
    unlinkDevice: unlinkDevice,
    flagged: flagged,
    unflagged: unflagged,
    wipe: wipe,
    checkPass: checkPass,
    getImeiHistory: getImeiHistory,
    handleControlCheck: handleControlCheck,
    handleCheckAllExtension: handleCheckAllExtension,
    handleMainSettingCheck: handleMainSettingCheck,
    reSyncDevice: reSyncDevice,
    getDealerApps: getDealerApps,
    ackFinishedPullApps: ackFinishedPullApps,
    ackFinishedPushApps: ackFinishedPushApps,
    ackFinishedPolicy: ackFinishedPolicy,
    ackFinishedWipe: ackFinishedWipe,
    ackImeiChanged: ackImeiChanged,
    actionInProcess: actionInProcess,
    getActivities: getActivities,
    clearApplications: clearApplications,
    getAppJobQueue: getAppJobQueue,
    ackSinglePushApp: ackSinglePushApp,
    ackSinglePullApp: ackSinglePullApp,
    ackFinishedPolicyStep: ackFinishedPolicyStep,
    receiveSim: receiveSim,
    clearState: clearState,
    clearResyncFlag: clearResyncFlag,
    closeConnectPageSocketEvents: closeConnectPageSocketEvents,
    connectSocket: connectSocket,
    ackInstalledApps: ackInstalledApps,
    ackUninstalledApps: ackUninstalledApps,
    ackSettingApplied: ackSettingApplied,
    sendOnlineOfflineStatus: sendOnlineOfflineStatus,
    deviceSynced: deviceSynced,
    resetDevice: resetDevice,
    deviceNotFound: deviceNotFound,
    resetChatPin: resetChatPin,
    changeSchatPinStatus: changeSchatPinStatus,
    closeChatIdSettingsEnable: closeChatIdSettingsEnable,
    resetPgpLimit: resetPgpLimit
  }, dispatch);
}
var mapStateToProps = ({ routing, device_details, auth, socket, settings }, ownProps) => {

  // console.log("device_details.extensions ", device_details.extensions)
  // console.log("device_details.controls ", device_details.controls)
  // console.log("device_details.Apps ", device_details.app_list)

  return {
    getHistory: device_details.getHistory,
    translation: settings.translation,
    auth: auth,
    socket: socket.socket,
    routing: routing,
    pathName: routing.location.pathname,
    device_details: device_details.device,
    app_list: device_details.app_list,
    undoApps: device_details.undoApps,
    profiles: device_details.profiles,
    policies: device_details.policies,
    histories: device_details.device_histories,
    isLoading: device_details.isLoading,
    showMessage: device_details.showMessage,
    messageType: device_details.messageType,
    messageText: device_details.messageText,
    pageName: device_details.pageName,
    isSync: device_details.device.is_sync,
    guestPwd: device_details.guestPwd,
    guestCPwd: device_details.guestCPwd,
    encryptedPwd: device_details.encryptedPwd,
    encryptedCPwd: device_details.encryptedCPwd,
    duressPwd: device_details.duressPwd,
    duressCPwd: device_details.duressCPwd,
    adminPwd: device_details.adminPwd,
    adminCPwd: device_details.adminCPwd,
    status: device_details.status,
    user_acc_id: device_details.device.id,
    extensions: device_details.extensions,
    applyBtn: device_details.applyBtn,
    redoBtn: device_details.redoBtn,
    undoBtn: device_details.undoBtn,
    clearBtn: device_details.clearBtn,
    isAdminPwd: device_details.isAdminPwd,
    isGuestPwd: device_details.isGuestPwd,
    isEncryptedPwd: device_details.isEncryptedPwd,
    isDuressPwd: device_details.isDuressPwd,
    controls: device_details.controls,
    chatIdSettingsEnable: device_details.chatIdSettingsEnable,

    imei_list: device_details.imei_list,
    guestAllExt: device_details.guestAllExt,
    encryptedAllExt: device_details.encryptedAllExt,
    checked_app_id: device_details.checked_app_id,
    secureSettingsMain: device_details.secureSettingsMain,
    forceUpdate: device_details.forceUpdate,
    apk_list: device_details.apk_list,
    is_in_process: socket.is_in_process,
    is_push_apps: socket.is_push_apps,
    device_found: device_details.device_found,
    noOfApp_push_pull: socket.noOfApp_push_pull,
    noOfApp_pushed_pulled: socket.noOfApp_pushed_pulled,
    noOfApp_push_pull_device: device_details.noOfApp_push_pull,
    is_policy_process: socket.is_policy_process,
    complete_policy_step: socket.complete_policy_step,
    is_policy_applying: device_details.is_policy_process,
    is_policy_finish: socket.is_policy_finish,
    reSync: device_details.reSync
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDevice);
