import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Modal, message, Input, Table, Switch, Avatar, Button, Card, Row, Col, Select, Spin, Form } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue, checkIsArray } from '../../../utils/commonUtils';
import {
  addUser,
  getUserList,
  getDeaerUsers
} from "../../../../appRedux/actions/Users";
import { getNewDevicesList } from "../../../../appRedux/actions/Common";
import moment from 'moment';
import ServicesHistory from './servicesHistory';
import {
  transferUser,
  transferHistory,
  getServicesHistory,
  cancelExtendedServices
} from "../../../../appRedux/actions/ConnectDevice";
import AddUser from '../../../users/components/AddUser';
const confirm = Modal.confirm

var copyTransfer = [];
var status = true;
class Services extends Component {

  constructor(props) {
    super(props);
    var columns = [
      {
        title: "#",
        dataIndex: 'counter',
        align: 'center',
        className: 'row',
        render: (text, record, index) => ++index,
      },
      {
        title: "TYPE",
        align: "center",
        dataIndex: 'type',
        key: "type",
        className: '',
      },
      {
        title: "NAME",
        align: "center",
        dataIndex: 'name',
        key: "name",
        className: '',
      },
      {
        title: "TERM",
        align: "center",
        dataIndex: 'term',
        key: "term",
        className: '',
      },
      {
        title: convertToLang(this.props.translation["START DATE"], "START DATE"),
        align: "center",
        dataIndex: 'start_date',
        key: "start_date",
        className: '',
        // sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
        // sortDirections: ['ascend', 'descend'],
        // defaultSortOrder: 'descend'
      },
      {
        title: convertToLang(this.props.translation["EXPIRY DATE"], "EXPIRY DATE"),
        align: "center",
        dataIndex: 'expiry_date',
        key: "expiry_date",
        className: '',
        sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
        sortDirections: ['ascend', 'descend'],
        defaultSortOrder: 'descend'
      },
    ]

    this.state = {
      visible: props.visible,
      visibleUser: false,
      HistoryList: props.transferHistoryList,
      expandedRowKeys: [],
      columns: columns,
      addNewUserModal: false,
      addNewUserValue: "",
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.isloading) {
      this.setState({ addNewUserModal: true })
    }
    this.setState({ isloading: nextProps.isloading })
    if (this.props !== nextProps) {
      // nextProps.getSimIDs();
    }
    if (this.props.visible != nextProps.visible) {
      this.setState({ visible: nextProps.visible })
    }
  }

  handleCancel = () => {
    this.setState({ visible: false });
    this.props.handleServicesModal(false)
  }

  // handleComponentSearch = (e) => {
  //     try {
  //         let value = e.target.value;
  //         if (value.length) {
  //             if (status) {
  //                 copyTransfer = this.state.HistoryList;
  //                 status = false;
  //             }
  //             let foundRecords = componentSearch(copyTransfer, value);
  //             if (foundRecords.length) {
  //                 this.setState({
  //                     HistoryList: foundRecords,
  //                 })
  //             } else {
  //                 this.setState({
  //                     HistoryList: [],
  //                 })
  //             }
  //         } else {
  //             status = true;
  //             this.setState({
  //                 HistoryList: copyTransfer,
  //             })
  //         }

  //     } catch (error) {
  //         console.log('error')
  //     }
  // }

  renderList = (data) => {
    // console.log
    // if (data && data.length) {
      return checkIsArray(data).map((row, index) => {
        // console.log(row);

        // if (row.type === "PACKAGE") {
        return {
          key: index,
          type: checkValue(row.type),
          name: checkValue(row.pkg_name),
          term: checkValue(row.pkg_term),
          start_date: checkValue(moment(row.start_date).format("YYYY/MM/DD")),
          expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
        }
        // }
        // else if (row.type === "PRODUCT") {
        //     return {
        //         key: index,
        //         type: checkValue(row.type),
        //         name: checkValue(row.price_for),
        //         term: checkValue(row.price_term),
        //         start_date: checkValue(moment(row.start_date).format("YYYY/MM/DD")),
        //         expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
        //     }
        // }

      })
    // } else {
    //   return []
    // }
  }


  filterServices = (services) => {
    let packages = [];
    let products = [];

    if (services && services.packages) {
      packages = checkIsArray(JSON.parse(services.packages)).map((item) => {
        item.type = "PACKAGE";
        item.status = services.status;
        item.start_date = services.start_date;
        item.service_expiry_date = services.service_expiry_date;
        return item;
      });
    }
    if (services && services.products) {
      products = checkIsArray(JSON.parse(services.products)).map((item) => {
        item.type = "PRODUCT";
        item.status = services.status;
        item.start_date = services.start_date;
        item.service_expiry_date = services.service_expiry_date;
        return item;
      });
    }

    let allServices = [...packages, ...products];
    return allServices; // active and extended
  }

  servicesHistory = (e) => {
    e.preventDefault();

    this.refs.history_services.showModal();
    console.log('hi');
    this.props.getServicesHistory(this.props.user_acc_id);

  }
  cancelExtendedServices = () => {
    if (this.props.extended_services) {
      showCancelExtendedConfirm(this)

    }
  }

  render() {
    const { visible } = this.state;
    let { services, extended_services } = this.props;
    let serviceData = services
    let currentServices = this.filterServices(services);
    let extendedServices = this.filterServices(extended_services);
    console.log(serviceData);
    return (
      <div>
        {/* <Modal
          width='850px'
          maskClosable={false}
          visible={visible}
          title={<div>Services <Button
            style={{ float: 'right', marginRight: '20px' }}
            type="primary"
            size="small"
            onClick={this.servicesHistory}
          >Services History</Button></div>}
          onCancel={this.handleCancel}
          footer={null}
        > */}
        <div>
          <Row>
            <Col span={5}>
            </Col>
            <Col span={15}>
              <h2 style={{ textAlign: 'center' }}>CURRENT SERVICES</h2>
            </Col>
            <Col span={4}>
              <Button
                style={{ float: 'right', marginRight: '20px' }}
                type="primary"
                size="small"
                onClick={this.servicesHistory}
              >Services History</Button>
            </Col>
          </Row>
        </div>

        <Table
          columns={this.state.columns}
          bordered
          dataSource={this.renderList(currentServices)}
          pagination={false}
        />
        {(serviceData && serviceData.grace_days) ? <h4 style={{ float: "right", marginTop: 15 }}>
          Total Grace Days Applied : {serviceData.grace_days}
        </h4> : null}
        <br /> <br /> <br /> <br />
        {(this.props.extended_services) ?
          <Fragment>
            {/* <Row>
                <Col xs={24} sm={24} md={15} lg={15} xl={15}></Col> */}
            <h2 style={{ textAlign: 'center' }}>EXTENDED SERVICES</h2>

            {(this.props.user.type !== 'admin') ?
              // <Col xs={24} sm={24} md={9} lg={9} xl={9}>
              <Button disabled={(this.props.extended_services) ? false : true}
                style={{ float: 'right' }} type="danger" onClick={() => {
                  this.cancelExtendedServices()
                }}>Cancel Extended Services</Button>
              // </Col>
              : ""
            }
            {/* </Row> */}
            <br />

            <Table
              columns={this.state.columns}
              bordered
              dataSource={this.renderList(extendedServices)}
              pagination={false}
            />
            <br /> <br /> <br />
          </Fragment>
          : null}
        {/* </Modal> */}

        <ServicesHistory
          ref="history_services"
          translation={this.props.translation}
          servicesHistoryList={this.props.servicesHistoryList}
        // deviceId={this.props.device.device_id}
        />
      </div>
    )
  }
}

const WrappedUserList = Form.create({ name: 'transfer-user' })(Services);

var mapStateToProps = ({ users, settings, device_details }) => {
  // console.log('servicesHistoryList component ', device_details.servicesHistoryList)

  return {
    servicesHistoryList: device_details.servicesHistoryList,
    // transferHistoryList: device_details.transferHistoryList,
    // getHistory: device_details.getHistory,
    // users_list: users.dealer_users,
    // isloading: users.addUserFlag,
    translation: settings.translation
  };
}

export default connect(mapStateToProps, { getServicesHistory, cancelExtendedServices }, null, { withRef: true })(WrappedUserList);

function showCancelExtendedConfirm(_this) {
  confirm({
    title: "Are you sure you want to cancel extended services from this device ? ",
    okText: "PROCEED WITH CANCELLATION",
    onOk() {
      let service_data = {
        service_id: _this.props.extended_services.id,
        user_acc_id: _this.props.extended_services.user_acc_id
      }
      _this.props.cancelExtendedServices(service_data)
    },
    onCancel() {

    },

  })
}
