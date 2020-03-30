import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers, getUserDealers } from "../../../appRedux/actions/Dealers";
import DealerList from "./DealerList";
import { Redirect } from 'react-router-dom';
import CircularProgress from "components/CircularProgress";

import { titleCase, convertToLang, checkValue, checkIsArray } from '../commonUtils';
import { dealerColsWithSearch } from '../columnsUtils';
import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No } from '../../../constants/ButtonConstants';
import { Permission_List, PERMISSION_Add_Modal_Title, PERMISSION_Remove_Modal_Title, PERMISSION_Add_Except_Selected_Modal_Title } from '../../../constants/ApkConstants';
import { Alert_Allow_Permission_Delaer, Alert_Remove_Permission_Delaer } from '../../../constants/Constants';

const confirm = Modal.confirm;
var addAllBtn = false;
var removeAllBtn = false;
var addBtn = false;
var updateDealers = true;

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.addDealerCols = dealerColsWithSearch(props.translation, true, this.handleSearch);
    var addDealerColsInModal = dealerColsWithSearch(props.translation, true, this.handleSearchInModal);
    var listDealerCols = dealerColsWithSearch(props.translation);

    this.state = {
      sorterKey: '',
      sortOrder: 'ascend',
      listDealerCols: listDealerCols,
      addDealerColsInModal: addDealerColsInModal,
      showDealersModal: false,
      dealer_ids: [],
      dealerList: [],
      dealerListForModal: [],
      permissions: [],
      hideDefaultSelections: false,
      removeUnSelectedDealersModal: false,
      addSelectedDealersModal: false,
      redirect: false,
      dealer_id: '',
      goToPage: '/dealer/dealer',
      checkChanges: false
    }
    // console.log(" this.addDealerCols ",  this.addDealerCols);
  }


  handleTableChange = (pagination, query, sorter) => {
    // console.log('check sorter func: ', sorter)
    let columns = this.state.addDealerColsInModal;
    // console.log('columns are: ', columns);

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
      addDealerColsInModal: columns
    });
  }

  handleDealerTableChange = (pagination, query, sorter) => {
    // console.log('check sorter func: ', sorter)
    let columns = this.state.listDealerCols;
    // console.log('columns are: ', columns);

    checkIsArray(columns).forEach(column => {
      // if (column.children) {
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
      // }
    })
    this.setState({
      listDealerCols: columns
    });
  }


  componentDidMount() {
    if (this.props.permissionType == 'package') {
      this.props.getUserDealers();
    } else {
      this.props.getAllDealers();
    }
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList,
      permissions: this.props.record.permissions
    })
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.translation !== nextProps.translation) {
      this.addDealerCols = dealerColsWithSearch(nextProps.translation, true, this.handleSearch);
      this.setState({
        addDealerColsInModal: dealerColsWithSearch(nextProps.translation, true, this.handleSearchInModal),
        listDealerCols: dealerColsWithSearch(nextProps.translation)
      })
    }
    // console.log("nextProps.record.statusAll will recv  ", nextProps.record);
    if (this.props.record.id !== nextProps.record.id) {
      if (this.props.permissionType == 'package') {
        this.props.getUserDealers();
      } else {
        this.props.getAllDealers();
      }
    }

    // console.log("nextProps.record.permissions ", nextProps.record.permissions);
    addAllBtn = nextProps.record.statusAll;
    this.setState({
      dealerListForModal: nextProps.dealerList,
      dealerList: nextProps.dealerList,
      permissions: nextProps.record.permissions
    })

  }

  showPermissionedDealersModal = (visible) => {
    this.setState({
      removeUnSelectedDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  addSelectedDealersModal = (visible) => {
    this.setState({
      addSelectedDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  getPermissionIds = (data) => {
    return checkIsArray(data).map((item) => item.dealer_id)
  }

  addSelectedDealers = () => {
    let permissions = this.getPermissionIds(this.state.permissions);
    let selectedRows = this.state.selectedRowKeys;
    // var dList = this.state.dealerList; arfan
    var dList = this.state.dealerListForModal;
    var add_ids = checkIsArray(dList).filter(e => !permissions.includes(e.dealer_id));
    var addUnSelected = checkIsArray(add_ids).filter(e => !selectedRows.includes(e.dealer_id));
    var addUnSelected_IDs = checkIsArray(addUnSelected).map(v => v.dealer_id);
    // permissions = [...permissions, ...addUnSelected_IDs];

    this.setState({
      // permissions,
      addSelectedDealersModal: false
    })
    // console.log("addUnSelected_IDs ", addUnSelected_IDs);
    // console.log('user id:: ', this.props.user.id)
    this.props.savePermissionAction(this.props.record.id, JSON.stringify(addUnSelected_IDs), 'save', false, this.props.user);
  }

  saveAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(_this.props.translation[Alert_Allow_Permission_Delaer], "Do you really Want to allow Permission for all Dealers?"),
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

  saveAllDealers = () => {
    let dealer_ids = []
    checkIsArray(this.props.dealerList).map((dealer) => {
      dealer_ids.push(dealer.dealer_id);
    });
    // this.setState({ permissions: dealer_ids })
    this.setState({ checkChanges: true });
    this.props.savePermissionAction(this.props.record.id, JSON.stringify(dealer_ids), 'save', true, this.props.user); // last param is statusAll to save all permissions
  }
  savePermission = () => {
    // console.log(this.props.dealerList, "dealer ids", this.state.dealer_ids);

    if (this.state.dealer_ids.length) {
      // this.props.dealerList.map((dealer) => {
      //   if (this.state.dealer_ids.includes(dealer.dealer_id)) {
      //     this.state.permissions.push(dealer.dealer_id);
      //   }
      //   else {
      //     if (this.state.permissions.includes(dealer.dealer_id)) {
      //       this.state.dealer_ids.push(dealer.dealer_id);

      //     }
      //   }
      // })
      // this.setState({
      // dealer_ids: [],
      // permissions: this.state.permissions
      // })
      this.props.savePermissionAction(this.props.record.id, JSON.stringify(this.state.selectedRowKeys), 'save', false, this.props.user);
      this.showDealersModal(false);
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, 'selected', selectedRows);
    let dealer_ids = []
    checkIsArray(selectedRows).forEach(row => {
      // console.log("selected row", row)
      dealer_ids.push(row.dealer_id);
    });
    this.setState({
      dealer_ids: dealer_ids,
      selectedRowKeys: selectedRowKeys
    });
    // this.setState({ selectedRowKeys });
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
          // else {
          //     // demoDevices.push(device);
          // }
        } else {
          demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }

  searchAllFields = (originalData, value) => {
    let demoData = [];

    if (value.length) {
      checkIsArray(originalData).forEach((data, index) => {

        // set permission by value only one time
        if (updateDealers) {
          checkIsArray(this.state.permissions).map((prm) => {
            if (prm.dealer_id === data.dealer_id) {
              if (prm.dealer_type === "dealer") {
                data["permission_by"] = this.props.user.name;
              } else {
                data["permission_by"] = prm.dealer_type;
              }
            }
          })
          if (index === originalData.length - 1) {
            updateDealers = false;
          }
        }

        if (data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else if (data['permission_by'] && data['permission_by'].toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else {
          // demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }
  handleSearch = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    if (global) {
      let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
      // console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    } else {

      let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
      // console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    }
  }


  handleSearchInModal = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    if (global) {
      let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
      // console.log("searchedData", searchedData);
      this.setState({
        dealerListForModal: searchedData
      });
    } else {

      let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
      // console.log("searchedData", searchedData);
      this.setState({
        dealerListForModal: searchedData
      });
    }
  }



  rejectPemission = (dealer_id) => {
    let dealers = this.getPermissionIds(this.state.permissions);
    // console.log("permissions",dealers);
    var index = dealers.indexOf(dealer_id);
    // console.log("array index", index);
    if (index > -1) {
      dealers.splice(index, 1);
    }
    // console.log("permissions",dealers);
    this.props.savePermissionAction(this.props.record.id, JSON.stringify([dealer_id]), 'delete', false, this.props.user);
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList
    })

  }

  removeAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(_this.props.translation[Alert_Remove_Permission_Delaer], "Do you really Want to Remove Permission for all Dealers?"),
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

  removeAllDealers = () => {
    let permittedDealers = this.getPermissionIds(this.state.permissions);
    // console.log("permitted dealers", permittedDealers);

    this.setState({
      // permissions: []
    })
    // this.props.savePermissionAction(this.props.record.id, JSON.stringify(permittedDealers), 'delete');
    this.props.savePermissionAction(this.props.record.id, JSON.stringify(permittedDealers), 'delete', true, this.props.user); // last param is statusAll to delete all permissions
    // this.state.dealerList.map((dealer)=>{
    //   console.log(dealer);
    // })
  }

  removeUnSelectedDealersModal = (visible) => {
    this.setState({
      removeUnSelectedDealersModal: visible
    })
  }

  removeUnSelectedDealers = () => {
    let permittedDealers = this.getPermissionIds(this.state.permissions);
    let selectedRows = this.state.selectedRowKeys;
    var remove_ids = checkIsArray(permittedDealers).filter(e => !selectedRows.includes(e));

    this.setState({
      removeUnSelectedDealersModal: false,
      // dealer_ids: [],
      // permissions: selectedRows
    })

    let allPermissionIds = [...selectedRows, ...permittedDealers];
    console.log("allPermissionIds ", allPermissionIds);
    // this.props.savePermissionAction(this.props.record.id, JSON.stringify(allPermissionIds), 'delete_except');
    this.props.savePermissionAction(this.props.record.id, JSON.stringify(remove_ids), 'delete', false, this.props.user);
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
    // console.log(list);
    // console.log("this.state.permissions: ", this.state.permissions);
    checkIsArray(list).map((dealer) => {
      let is_included = false;
      let permitData = {};

      checkIsArray(this.state.permissions).map((prm) => {
        if (prm.dealer_id == dealer.dealer_id) {
          permitData = prm;
          is_included = true;
        }
      })

      // console.log('is_included ', is_included)
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
        permission_by: (checkValue((permitData && permitData.dealer_type == this.props.user.type) ? this.props.user.name : permitData.dealer_type)).toUpperCase(), // (this.props.user.type == app.dealer_type) ? this.props.user.name : "n/a", // app.dealer_type
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
        let removeBtnDisable = false;
        if (this.props.user.id !== permitData.permission_by) {
          removeBtnDisable = true;
        }

        data.push(
          {
            ...common,
            'action':
              (
                <div data-column="ACTION">
                  <Button size="small" type="danger" disabled={removeBtnDisable}
                    onClick={() => {
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
  render() {
    const { redirect } = this.state;
    if (redirect && this.state.dealer_id !== '') {
      return <Redirect to={{
        pathname: this.state.goToPage,
        state: { id: this.state.dealer_id }
      }} />
    }

    // console.log("addAllBtn check 01: ", addAllBtn)

    // console.log('check condition: ', "length: ", this.state.dealerList.length == this.props.record.permissions.length, this.state.checkChanges, this.props.record.statusAll)
    if (this.state.checkChanges) {
      if (this.state.dealerList.length == this.props.record.permissions.length) {
        addAllBtn = true; // disable 
        addBtn = true;
      } else {
        addAllBtn = false; // visible
        addBtn = false;
      }
      this.state.checkChanges = false;
      // this.setState({ checkChanges: false })
    } else {
      if (this.state.dealerList.length == this.props.record.permissions.length) {
        addBtn = true; // disable 
      } else {
        addBtn = false; // visible
      }

    }
    if (this.props.record.permissions.length == 0) {
      removeAllBtn = true;
    } else {
      removeAllBtn = false;
    }

    let checkPermissins = [];
    if (this.props.user.type === "dealer") {
      // console.log("this.props.record.permissions ", this.props.record.permissions)
      let allPermissions = this.props.record.permissions;
      checkPermissins = checkIsArray(allPermissions).filter((item) => item.dealer_type !== "admin");
      if (checkPermissins.length) {
        removeAllBtn = false;
      } else {
        removeAllBtn = true;
      }
    }

    // console.log(checkPermissins, "checkPermissins");

    // console.log("addAllBtn check 02: ", addAllBtn)

    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <h2 className="mr-24 ml-8">{convertToLang(this.props.translation[Permission_List], "Permission List")}</h2>
          <div className="mr-16">
            <Button size="small" style={{ marginBottom: 16 }} type="primary" disabled={addBtn}
              onClick={() => { this.showDealersModal(true) }}>
              {convertToLang(this.props.translation[Button_Add], "Add")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ marginBottom: 16 }} type="primary" disabled={addBtn}
              onClick={() => { this.addSelectedDealersModal(true) }}>
              {convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ marginBottom: 16 }} type="primary"
              onClick={() => { this.saveAllDealersConfirm() }} disabled={addAllBtn}
            >
              {convertToLang(this.props.translation[Button_AddAll], "Add All")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ marginBottom: 16 }} type="danger"
              onClick={() => { this.removeAllDealersConfirm() }} disabled={removeAllBtn}
            >{convertToLang(this.props.translation[Button_RemoveAll], "Remove All")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ marginBottom: 16 }} type="danger" disabled={removeAllBtn}
              onClick={() => { this.showPermissionedDealersModal(true) }}>
              {convertToLang(this.props.translation["Button_RemoveExcept"], "Remove Except Selected")}</Button>
          </div>
          <br />
          <Col className="gutter-row" sm={15} xs={15} md={15}>
            <div className="gutter-box search_heading ">
              <Input.Search
                placeholder="Search"
                className="mb-16"
                style={{ marginBottom: 0 }}
                onKeyUp={
                  (e) => {
                    this.handleSearch(e, true)
                  }
                }
              />
            </div>
          </Col>


        </Row>
        <Row gutter={15} style={{ marginBottom: '12px' }}>
          {
            this.props.spinloading ? <CircularProgress /> :
              <Col className="gutter-row" span={24}>
                <Table
                  className="mb-12 expand_rows"
                  columns={this.state.listDealerCols}
                  onChange={this.handleDealerTableChange}
                  dataSource={this.renderDealer(this.state.dealerList, true)}
                  pagination={false}
                  translation={this.props.translation}
                />
              </Col>
          }
        </Row>
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["PERMISSION_Add_Modal_Title"], `Add Dealer to permissions list for this ${this.props.permissionType}`)}
          visible={this.state.showDealersModal}
          onOk={() => {
            this.savePermission()
          }}
          okText={convertToLang(this.props.translation[Button_Save], "Save")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onCancel={() => {
            this.showDealersModal(false)
          }}
          bodyStyle={{ height: 400, overflow: "overlay" }}
        >
          <DealerList
            columns={this.state.addDealerColsInModal}
            onChangeTableSorting={this.handleTableChange}
            dealers={this.renderDealer(this.state.dealerListForModal)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>

        {/*  remove except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["PERMISSION_Remove_Modal_Title"], `Remove Dealers from permissions list for this ${this.props.permissionType}`)}
          visible={this.state.removeUnSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_DeleteExceptSelected], "Delete Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.removeUnSelectedDealers()
          }}
          onCancel={() => {
            this.removeUnSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 400, overflow: "overlay" }}
        >
          <DealerList
            columns={this.state.addDealerColsInModal}
            onChangeTableSorting={this.handleTableChange}
            dealers={this.renderDealer(this.state.dealerListForModal, true)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>

        {/*  Add Except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["PERMISSION_Add_Except_Selected_Modal_Title"], `Add Except Dealers from permissions list for this ${this.props.permissionType}`)}
          visible={this.state.addSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.addSelectedDealers()
          }}
          // okText="Add Except Selected"
          onCancel={() => {
            this.addSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 400, overflow: "overlay" }}
        >
          <DealerList
            columns={this.state.addDealerColsInModal}
            onChangeTableSorting={this.handleTableChange}
            dealers={this.renderDealer(this.state.dealerListForModal)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>
      </Fragment >
    )
  }
}


const mapStateToProps = ({ dealers, settings, auth }, props) => {
  // console.log('auth ', auth.authUser)
  return {
    user: auth.authUser,
    dealerList: dealers.dealers,
    spinloading: dealers.spinloading,
    translation: settings.translation
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    getUserDealers: getUserDealers,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);