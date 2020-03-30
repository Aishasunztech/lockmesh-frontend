import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Input, Card } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import FilterDevicesList from "./filterDevicesList";
import CircularProgress from "components/CircularProgress";
import { checkValue, convertToLang, getColor, checkIsArray } from '../../utils/commonUtils'

import { userDevicesListColumns } from '../../utils/columnsUtils';
import CustomScrollbars from '../../../util/CustomScrollbars';

import {
  DEVICE_PENDING_ACTIVATION,
  DEVICE_PRE_ACTIVATION,
  DEVICE_UNLINKED,
  ADMIN,
  DEVICE_SUSPENDED,
  DEVICE_ACTIVATED,
  DEVICE_TRIAL,
  DEVICE_EXPIRED,
  DEVICE_TRANSFERED
} from '../../../constants/Constants'

import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No, Button_Edit } from '../../../constants/ButtonConstants';
const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error


var copyDevices = [];
var status = true;

class FilterDevices extends Component {
  constructor(props) {
    super(props);
    let columns = userDevicesListColumns(props.translation, this.handleSearchInModal);
    let selectedDevicesColumns = userDevicesListColumns(props.translation, this.handleSearch);

    this.state = {
      columns: checkIsArray(columns).filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
      selectedDevicesColumns: checkIsArray(selectedDevicesColumns).filter(e => e.dataIndex != "activation_code"),
      sorterKey: '',
      sortOrder: 'ascend',
      showDealersModal: false,
      device_ids: [],
      dealerList: [],
      dealerListForModal: [],
      permissions: [],
      hideDefaultSelections: false,
      removeSelectedDealersModal: false,
      addSelectedDealersModal: false,
      dealer_id: '',
      selectedDevices: props.selectedDevices ? props.selectedDevices : [],
      copySelectedDevices: [],
      callSelectedDeviceAction: true,
      allBulkDevices: [],
      searchRemoveModal: []
    }
  }


  handleTableChange = (pagination, query, sorter) => {
    let columns = this.state.columns;

    checkIsArray(columns).forEach(column => {
      if (column.children) {
        if (Object.keys(sorter).length > 0) {
          if (column.dataIndex == sorter.field) {
            if (this.state.sorterKey == sorter.field) {
              column.children[0]['sortOrder'] = sorter.order;
            } else {
              column.children[0]['sortOrder'] = "ascend";
            }
          } else {
            column.children[0]['sortOrder'] = "";
          }
          this.setState({ sorterKey: sorter.field });
        } else {
          if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
        }
      }
    })
    this.setState({
      columns: columns
    });
  }

  handleDealerTableChange = (pagination, query, sorter) => {
    let columns = this.state.columns;

    checkIsArray(columns).forEach(column => {
      if (Object.keys(sorter).length > 0) {
        if (column.dataIndex == sorter.field) {
          if (this.state.sorterKey == sorter.field) {
            column['sortOrder'] = sorter.order;
          } else {
            column['sortOrder'] = "ascend";
          }
        } else {
          column['sortOrder'] = "";
        }
        this.setState({ sorterKey: sorter.field });
      } else {
        if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
      }
    })
    this.setState({
      columns: columns
    });
  }


  componentDidMount() {
    this.props.getAllDealers()
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.devices !== nextProps.devices) {
      this.setState({ allBulkDevices: nextProps.devices })
    }
    if (this.props.translation !== nextProps.translation) {
      let columns = userDevicesListColumns(nextProps.translation, this.handleSearchInModal);
      let selectedDevicesColumns = userDevicesListColumns(nextProps.translation, this.handleSearch);

      this.setState({
        columns: checkIsArray(columns).filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
        selectedDevicesColumns: checkIsArray(selectedDevicesColumns).filter(e => e.dataIndex != "activation_code"),
      })
    }

    if (nextProps.selectedDealers.length == 0 && nextProps.selectedUsers.length == 0) {

      if (this.state.callSelectedDeviceAction) {
        this.props.setSelectedBulkDevices([]);
        this.state.callSelectedDeviceAction = false;
      } else {
        this.setState({
          selectedDevices: [],
          copySelectedDevices: [],
          searchRemoveModal: []
        })
      }
    } else {
      this.setState({
        selectedDevices: nextProps.selectedDevices,
        copySelectedDevices: nextProps.selectedDevices,
        searchRemoveModal: nextProps.selectedDevices
      })
    }
  }


  devicesNotFoundErrorMsg = () => {
    let response = false;
    let devices = this.props.devices;
    let dealers = this.props.selectedDealers;
    let users = this.props.selectedUsers;

    if (dealers.length || users.length) {
      if (devices.length) {
        response = true;
      } else {
        error({
          title: `Devices not found against selected dealers/users!`,
        });
      }
    } else {
      error({
        title: `Please select dealers/users to get their devices then perform this action`,
      });
    }

    return response;
  }

  showPermissionedDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        removeSelectedDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
  }

  showDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        showDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
  }

  addSelectedDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        addSelectedDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
  }

  addSelectedDealers = () => {
    let selectedDevices = this.state.selectedDevices;
    let unSelectedDevices = this.getUnSelectedDevices(this.props.devices);

    if (this.state.selectedRowKeys.length) {
      unSelectedDevices.map((device) => {
        if (!this.state.selectedRowKeys.includes(device.id)) {
          selectedDevices.push(device);
        }
      })

    } else {
      selectedDevices = [...selectedDevices, ...unSelectedDevices];
    }

    this.setState({
      selectedDevices,
      addSelectedDealersModal: false,
      selectedRowKeys: []
    })
  }

  saveAllDealersConfirm = () => {
    let done = this.devicesNotFoundErrorMsg();
    let _this = this;
    if (done) {
      confirm({
        title: convertToLang(_this.props.translation["Do you really Want to add all Devices?"], "Do you really Want to add all Devices?"),
        okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
        cancelText: convertToLang(_this.props.translation[Button_No], "No"),
        onOk() {
          _this.saveAllDealers()
        },
        onCancel() {
          // console.log('Cancel');
        },
      });
    }
  }

  saveAllDealers = () => {
    this.props.setSelectedBulkDevices(this.props.devices);
    this.setState({
      // selectedDevices: this.props.devices,
      copySelectedDevices: this.props.devices,
    })
  }

  savePermission = () => {
    let selectedDevices = this.state.selectedDevices;
    if (this.state.selectedRowKeys.length) {
      this.props.devices.map((device) => {
        if (this.state.selectedRowKeys.includes(device.id)) {
          selectedDevices.push(device);
        }
      })
      this.props.setSelectedBulkDevices(selectedDevices);
      this.setState({
        selectedRowKeys: [],
        // selectedDevices: selectedDevices,
        copySelectedDevices: selectedDevices
      })

      this.showDealersModal(false);
    }
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    let device_ids = []
    checkIsArray(selectedRows).forEach(row => {
      device_ids.push(row.id);
    });
    this.setState({
      device_ids: device_ids,
      selectedRowKeys: selectedRowKeys
    });
  }

  searchField = (originalData, fieldName, value) => {
    let demoData = [];

    if (value.length) {
      checkIsArray(originalData).forEach((data) => {
        if (data[fieldName] !== undefined) {
          if ((typeof data[fieldName]) === 'string') {

            if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
              demoData.push(data);
            }
          } else if (data[fieldName] !== null) {
            if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
              demoData.push(data);
            }
          }
        } else {
          demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }

  searchAllFields = (originalData, value, fieldName) => {
    let demoData = [];

    if (value.length) {
      checkIsArray(originalData).forEach((data) => {
        if (data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }


  handleSearchInModal = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    let searchedData = this.searchField(this.props.devices, fieldName, fieldValue);
    let searcheSelectedDevicedData = this.searchField(this.state.selectedDevices, fieldName, fieldValue);
    this.setState({
      allBulkDevices: searchedData,
      searchRemoveModal: searcheSelectedDevicedData
    });
  }


  handleSearch = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    let demoDevices = [];
    if (status) {
      copyDevices = this.state.selectedDevices;
      status = false;
    }

    if (e.target.value.length) {
      checkIsArray(copyDevices).forEach((device) => {
        if (e.target.name === 'all') {
          Object.keys(device).map(key => {

            if (device[key] !== undefined && key != 'status' && key != 'account_status') {
              if ((typeof device[key]) === 'string') {
                if (device[key].toUpperCase().includes(e.target.value.toUpperCase())) {
                  if (!demoDevices.includes(device)) {
                    demoDevices.push(device);
                  }
                }
              } else if (device[key] !== null && key != 'status' && key != 'account_status') {
                if (device[key].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                  if (!demoDevices.includes(device)) {
                    demoDevices.push(device);
                  }
                }
              } else {
                // demoDevices.push(device);
              }
            } else {
              // demoDevices.push(device);
            }
          })
        } else {
          if (device[e.target.name] !== undefined) {
            if ((typeof device[e.target.name]) === 'string') {
              if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                demoDevices.push(device);
              }
            } else if (device[e.target.name] !== null) {
              if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                demoDevices.push(device);
              }
            } else {
              // demoDevices.push(device);
            }
          } else {
            demoDevices.push(device);
          }
        }

      });
      this.setState({
        selectedDevices: demoDevices
      })
    } else {
      this.setState({
        selectedDevices: copyDevices
      })
    }
  }

  removeSingleDevice = (device_id) => {

    let permittedDevices = this.state.selectedDevices;
    let selectedRows = [device_id];
    var selectedDevices = checkIsArray(permittedDevices).filter(e => !selectedRows.includes(e.id));

    this.props.setSelectedBulkDevices(selectedDevices);
    this.setState({
      device_ids: [],
      copySelectedDevices: selectedDevices
    })

  }


  rejectPemission = (dealer_id) => {
    let dealers = this.state.permissions;
    var index = dealers.indexOf(dealer_id);
    if (index > -1) {
      dealers.splice(index, 1);
    }
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList
    })

  }

  removeAllDealersConfirm = () => {
    let done = this.devicesNotFoundErrorMsg();
    let _this = this;
    if (done) {
      confirm({
        title: convertToLang(_this.props.translation["Do you really Want to Remove all filtered devices?"], "Do you really Want to Remove all filtered devices?"),
        okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
        cancelText: convertToLang(_this.props.translation[Button_No], "No"),
        onOk() {
          _this.removeAllDealers();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  removeAllDealers = () => {
    this.props.setSelectedBulkDevices([]);
    this.setState({
      // selectedDevices: [],
      copySelectedDevices: []
    })
  }

  removeSelectedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible
    })
  }

  removeSelectedDealers = () => {
    let permittedDevices = this.state.selectedDevices;
    let selectedRows = this.state.selectedRowKeys;
    var selectedDevices = checkIsArray(permittedDevices).filter(e => selectedRows.includes(e.id));

    this.props.setSelectedBulkDevices(selectedDevices);
    this.setState({
      removeSelectedDealersModal: false,
      device_ids: [],
      // selectedDevices: selectedDevices,
      copySelectedDevices: selectedDevices
    })

  }

  goToDealer = (dealer) => {
    if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
      if (dealer.connected_dealer === 0 || dealer.connected_dealer === '' || dealer.connected_dealer === null) {
        this.setState({
          redirect: true,
          dealer_id: dealer.dealer_id,
          goToPage: '/dealer/dealer'
        })
      } else {
        this.setState({
          redirect: true,
          dealer_id: dealer.dealer_id,
          goToPage: '/dealer/sdealer'
        })
      }

    }
  }

  renderDealer(list, permitted = false) {
    let data = [];
    let is_included
    list.map((dealer) => {
      if (this.state.permissions) {
        is_included = this.state.permissions.includes(dealer.dealer_id);
      }
      let common = {
        'key': dealer.dealer_id,
        'row_key': dealer.dealer_id,
        'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
        'dealer_name': (
          // <div data-column="DEALER NAME">
          dealer.dealer_name ? <a onClick={() => { this.goToDealer(dealer) }}>{dealer.dealer_name}</a> : 'N/A'
          // </div>
        ),
        'dealer_email': (
          <div data-column="DEALER EMAIL">
            {dealer.dealer_email ? dealer.dealer_email : 'N/A'}
          </div>
        ),
        'link_code': (
          <div data-column="DEALER PIN">
            {dealer.link_code ? dealer.link_code : 'N/A'}
          </div>
        ),
        'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
        'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
        'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
        'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A',
      }

      if (permitted && is_included) {

        data.push(
          {
            ...common,
            'action':
              (
                <div data-column="ACTION">
                  <Button size="small" type="danger" onClick={() => {
                    this.rejectPemission(dealer.dealer_id)
                  }}>
                    {convertToLang(this.props.translation[Button_Remove], "Remove")}
                  </Button>
                </div>
              )
          }
        )
      } else if (permitted === false && is_included === false) {
        data.push({ ...common })
      }
    });
    return (data);
  }

  renderDevicesList(list) {
    return list.map((device, index) => {
      var status = device.finalStatus;
      let color = getColor(status);

      return {
        rowKey: device.id,
        key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
        action: (
          <Button size="small" type="danger"
            onClick={() => {
              this.removeSingleDevice(device.id)
            }}>
            Remove
                    </Button>
        ),
        status: (<span style={color} > {status}</span>),
        lastOnline: checkValue(device.lastOnline),
        flagged: device.flagged,
        type: checkValue(device.type),
        version: checkValue(device.version),
        device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
        user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
        validity: checkValue(device.validity),
        transfered_to: checkValue((device.finalStatus == "Transfered") ? device.transfered_to : null),
        name: checkValue(device.name),
        activation_code: checkValue(device.activation_code),
        account_email: checkValue(device.account_email),
        pgp_email: checkValue(device.pgp_email),
        chat_id: checkValue(device.chat_id),
        client_id: checkValue(device.client_id),
        dealer_id: checkValue(device.dealer_id),
        dealer_pin: checkValue(device.link_code),
        mac_address: checkValue(device.mac_address),
        sim_id: checkValue(device.sim_id),
        imei_1: checkValue(device.imei),
        sim_1: checkValue(device.simno),
        imei_2: checkValue(device.imei2),
        sim_2: checkValue(device.simno2),
        serial_number: checkValue(device.serial_number),
        model: checkValue(device.model),
        dealer_name: <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a>,
        // dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
        online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
        s_dealer: checkValue(device.s_dealer),
        s_dealer_name: checkValue(device.s_dealer_name),
        remainTermDays: device.remainTermDays,
        start_date: checkValue(device.start_date),
        expiry_date: checkValue(device.expiry_date),
      }
    });
  }

  getUnSelectedDevices = (devices) => {

    if (this.state.selectedDevices.length > 0) {
      let selectedIDs = this.state.selectedDevices.map((item) => item.id);
      let fDevices = checkIsArray(devices).filter(e => !selectedIDs.includes(e.id));
      return fDevices;
    } else {
      return devices
    }
  }

  applyAction = () => {

    let action = this.props.handleActionValue;
    let devices = this.state.selectedDevices;
    let dealers = this.props.selectedDealers;
    let users = this.props.selectedUsers;

    if (action !== "NOT SELECTED") {
      if (devices.length) {
        if (action === "SUSPEND DEVICES") {
          this.refs.bulk_suspend.handleSuspendDevice(devices, dealers, users);
        }
        else if (action === "ACTIVATE DEVICES") {
          this.refs.bulk_activate.handleActivateDevice(devices, dealers, users);
        }
        else if (action === "PUSH APPS") {
          this.refs.bulk_push_apps.handleBulkPushApps(devices, dealers, users);
        }
        else if (action === "PULL APPS") {
          this.refs.bulk_pull_apps.handleBulkPullApps(devices, dealers, users);
        }
        else if (action === "UNLINK DEVICES") {
          this.refs.bulk_unlink.handleBulkUnlink(devices, dealers, users);
        }
        else if (action === "WIPE DEVICES") {
          this.refs.bulk_wipe.handleBulkWipe(devices, dealers, users);
        }
        else if (action === "PUSH POLICY") {
          if (this.props.selectedPolicy) {
            this.refs.bulk_policy.handleBulkPolicy(devices, dealers, users, this.props.selectedPolicy);
          } else {
            error({
              title: `Sorry, Policy not selected. Please try again`,
            });
          }
        }

      } else {
        error({
          title: `Sorry, You have not selected any device to perform an action`,
        });
      }
    } else {
      error({
        title: `Sorry, You have not selected any action`,
      });
    }
  }


  actionRelatedDevice = (devices) => {
    let action = this.props.handleActionValue;
    let updateSelectedDevices = devices;

    if (action === "SUSPEND DEVICES") {
      updateSelectedDevices = checkIsArray(devices).filter((device) => device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED)
    } else if (action === "ACTIVATE DEVICES") {
      updateSelectedDevices = checkIsArray(devices).filter((device) => device.finalStatus == DEVICE_SUSPENDED)
    }
    else if (action === "PUSH APPS" || action === "PULL APPS" || action === "UNLINK DEVICES" || action === "PUSH POLICY") {
      updateSelectedDevices = checkIsArray(devices).filter((device) => device.finalStatus == DEVICE_SUSPENDED || device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED || device.finalStatus == DEVICE_EXPIRED)
    }
    else if (action === "WIPE DEVICES") {
      updateSelectedDevices = checkIsArray(devices).filter((device) => device.finalStatus == DEVICE_SUSPENDED || device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED || device.finalStatus == DEVICE_EXPIRED || device.finalStatus == DEVICE_UNLINKED || device.finalStatus == DEVICE_TRANSFERED)
    }

    this.state.selectedDevices = updateSelectedDevices
    return updateSelectedDevices;
  }



  render() {

    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '8px 0px 2px' }}>
          <h2 className="mr-24 ml-8">{convertToLang(this.props.translation["Select Devices:"], "Select Devices:")}</h2>
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.showDealersModal(true) }}>{convertToLang(this.props.translation[Button_Add], "Add")}</Button>
          </div>
          {/* <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.addSelectedDealersModal(true) }}>{convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}</Button>
          </div> */}
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.saveAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_AddAll], "Add All")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
              onClick={() => { this.removeAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_RemoveAll], "Remove All")}</Button>
          </div>
          {/* <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
              onClick={() => { this.showPermissionedDealersModal(true) }}>{convertToLang(this.props.translation[Button_RemoveExcept], "Remove Except")}</Button>
          </div> */}
          <div className="gutter-box search_heading mr-16">
            <Input.Search
              placeholder="Search"
              style={{ marginBottom: 0 }}
              onKeyUp={
                (e) => {
                  e.target.name = 'all';
                  this.handleSearch(e, true)
                }
              }
            />
          </div>
        </Row>
        <Row gutter={16}>
          {
            this.props.spinloading ? <CircularProgress /> :
              <Col className="gutter-row" span={24}>
                <Card className='fix_card fix_card_bulk_act'>
                  <hr className="fix_header_border" style={{ top: "56px" }} />
                  <CustomScrollbars className="gx-popover-scroll ">
                    <Table
                      id='scrolltablelist'
                      ref='tablelist'
                      className={"devices "}
                      size="middle"
                      bordered
                      columns={this.state.selectedDevicesColumns}
                      onChange={this.props.onChangeTableSorting}
                      dataSource={this.renderDevicesList(this.state.selectedDevices)}
                      pagination={false}
                    // scroll={{ y: true }}
                    />
                  </CustomScrollbars>
                </Card>
              </Col>
          }
        </Row>
        <Modal
          maskClosable={false}
          width='665px'
          title={convertToLang(this.props.translation["Add Device To Filtered Selected Devices"], "Add Device To Filtered Selected Devices")}
          visible={this.state.showDealersModal}
          onOk={() => {
            this.savePermission()
          }}
          okText={convertToLang(this.props.translation[Button_Save], "Save")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onCancel={() => {
            this.showDealersModal(false)
          }}
          bodyStyle={{ height: 450, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.renderDevicesList(this.getUnSelectedDevices(this.state.allBulkDevices))}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Modal>

        {/*  remove except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["Remove Devices Except Selected from Filtered devices"], "Remove Devices Except Selected from Filtered devices")}
          visible={this.state.removeSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_DeleteExceptSelected], "Delete Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.removeSelectedDealers()
          }}
          onCancel={() => {
            this.removeSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.renderDevicesList(this.state.searchRemoveModal)}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Modal>

        {/*  Add Except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["Add Except Selected Devices"], "Add Except Selected Devices")}
          visible={this.state.addSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.addSelectedDealers()
          }}
          onCancel={() => {
            this.addSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.renderDevicesList(this.getUnSelectedDevices(this.state.allBulkDevices))}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Modal>

      </Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
  }, dispatch);
}


const mapStateToProps = ({ dealers, settings, devices, auth }, props) => {

  return {
    user: auth.authUser,
    dealerList: dealers.dealers,
    record: props.record,
    spinloading: dealers.spinloading,
    translation: settings.translation
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterDevices);