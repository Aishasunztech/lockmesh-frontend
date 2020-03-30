import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover, Badge, Modal, Table, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { logout, } from "appRedux/actions/Auth";
import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../constants/Application"
import { ADMIN } from "../../constants/Constants";
const confirm = Modal.confirm;
const columns = [
  { title: 'Action', dataIndex: 'action', key: 'action', align: "center" },
  { title: 'DEALER PIN', dataIndex: 'dealer_pin', key: 'dealer_pin', align: "center" },
  { title: 'DEALER NAME', dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
  { title: 'LABEL', dataIndex: 'label', key: 'label', align: "center" },
  { title: 'CREDITS', dataIndex: 'credits', key: 'credits', align: "center" },
];



class AcceptPasswordForm extends Component {

  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.acceptRequest(this.props.request, values.pass, this.props.dealer_pin);
      }
    });
    this.props.resetDealerPinForm();
    this.props.form.resetFields();
  }

  render() {
    // console.log("header devices count", this.props.devices);

    // const userMenuOptions = (
    //   <ul className="">
    //     {/* <Link to="/profile"><li>My Account</li></Link> */}
    //     {/* <li>Connections</li> 
    //     <li onClick={() => this.props.logout()}>Logout
    //     </li>*/}
    //   </ul>
    // );

    return (
      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row side_bar_main">
        <Modal
          // closable={false}
          maskClosable={false}
          style={{ top: 20 }}
          width="330px"
          className="push_app"
          title=""
          visible={this.props.acceptPasswordForm}
          footer={false}
          onOk={() => {
          }}
          onCancel={() => {
            let _this = this
            confirm({
              title: "Are you sure to leave this process ?",
              content: '',
              okText: "Confirm",
              onOk() {
                _this.props.resetAcceptPasswordForm()
                _this.setState({
                  request: {}
                })
                _this.props.form.resetFields()
                _this.props.resetDealerPinForm()

              },
              onCancel() { },
            })
          }
          }
          okText="Push Apps"
        >
          <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              <h4>VERIFICATION PASS <br /> HAS BEEN SENT <br />TO YOUR EMAIL</h4>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              {
                this.props.form.getFieldDecorator('pass', {
                  initialValue: '',
                  rules: [
                    {
                      required: true, message: 'password is required!',
                    }
                  ],
                })(
                  <Input.Password className="password_field" type='password' placeholder="Enter Password" autoComplete='password' />
                )
              }
            </Form.Item>
            <Form.Item className="edit_ftr_btn1"
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedAcceptPasswordForm = Form.create()(AcceptPasswordForm)

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      NewRequests: [],
      confirmDealerPin: false,
      request: {},
      dealer_pin: ''
    }

  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.checkDealerPin({ dealer_pin: values.pin, requestData: this.state.request });
        this.props.form.resetFields()
        this.setState({
          dealer_pin: values.pin
        })
      }
    });
  }

  componentDidMount() {
    this.setState({
      NewRequests: this.props.requests
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.requests.length !== nextProps.requests.length) {
      this.setState({
        NewRequests: nextProps.requests
      });
    }
  }

  rejectRequest(request) {
    showConfirm(this, "Are you sure you want to decline this request ?", 'decline', request)

    // this.setState({ visible: false })
  }
  acceptRequest(request) {
    showConfirm(this, "Are you sure you want to accept this request ?", 'accept', request)
    // this.props.rejectRequest(request);
    // this.setState({ visible: false })
  }
  resetDealerPinForm = () => {
    this.setState({
      confirmDealerPin: false,
      dealer_pin: ''
    })
    this.props.form.resetFields()
  }


  renderList(list) {
    // console.log(list);
    return list.map((request) => {

      return {
        key: request.id ? `${request.id}` : "N/A",
        action: <div>  <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectRequest(request); }}>DECLINE</Button>
          <Button
            type="primary"
            size="small"
            style={{ margin: '0 8px 0 8px' }}
            onClick={() => { this.acceptRequest(request) }}>
            ACCEPT
                </Button></div>,
        dealer_pin: (request.dealer_pin !== '' && request.dealer_name !== ADMIN) ? request.dealer_pin : "N/A",
        dealer_name: request.dealer_name ? `${request.dealer_name}` : "N/A",
        label: request.label ? `${request.label}` : "N/A",
        credits: request.credits ? `${request.credits}` : "N/A",
      }
    });

  }

  render() {
    // console.log("header devices count", this.props.devices);

    // const userMenuOptions = (
    //   <ul className="">
    //     {/* <Link to="/profile"><li>My Account</li></Link> */}
    //     {/* <li>Connections</li> 
    //     <li onClick={() => this.props.logout()}>Logout
    //     </li>*/}
    //   </ul>
    // );

    return (

      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row side_bar_main">
        <Popover placement="bottomRight" trigger="lskdjsl">
          <Avatar
            src={require("../../assets/images/profile-image.png")}
            className="gx-size-40 gx-pointer gx-mr-3"
            alt=""
          />
          <span className="gx-avatar-name">{(localStorage.getItem('name') === '' || localStorage.getItem('name') === null || localStorage.getItem('name') === undefined) ? localStorage.getItem('dealerName') : localStorage.getItem('name')}
            {/* <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /> */}
          </span>
        </Popover>

        <ul className="gx-app-nav bell_icon">
          {/* <li><i className="icon icon-search-new" /></li> */}
          {/* <li><i className="icon icon-chat-new" /></li> */}
          <li>
            <a className="head-example">
              <Badge count={this.props.requests.length}>
                <i
                  className="icon icon-notification notification_icn"
                  onClick={() => this.showModal()}
                />
              </Badge>
            </a>
          </li>
        </ul>
        <Modal
          width={1000}
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >
          <h1>CREDITS CASH REQUESTS</h1>
          <Table
            bordered
            columns={columns}
            style={{ marginTop: 20 }}
            dataSource={this.renderList(this.state.NewRequests)}
          />
        </Modal>
        <Modal
          // closable={false}
          maskClosable={false}
          style={{ top: 20 }}
          width="330px"
          className="push_app"
          title=""
          visible={this.state.confirmDealerPin}
          footer={false}
          onOk={() => {
          }}
          onCancel={() => {
            // this.props.showPwdConfirmModal(false, this.props.actionType)
            this.resetDealerPinForm()
          }
          }
          okText="Push Apps"
        >
          <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              <h4>PLEASE ENTER YOUR <br />DEALER PIN TO DO <br />THIS ACTION</h4>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              {
                this.props.form.getFieldDecorator('pin', {
                  initialValue: '',
                  rules: [
                    {
                      required: true, message: 'Dealer PIN is required!',
                    }
                  ],
                })(
                  <Input.Password className="password_field" type='password' placeholder="Enter Dealer PIN" autoComplete='password' />
                )
              }
            </Form.Item>
            <Form.Item className="edit_ftr_btn1"
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
              }}
            >
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
        <WrappedAcceptPasswordForm
          acceptPasswordForm={this.props.acceptPasswordForm}
          request={this.state.request}
          resetAcceptPasswordForm={this.props.resetAcceptPasswordForm}
          acceptRequest={this.props.acceptRequest}
          resetDealerPinForm={this.resetDealerPinForm}
          dealer_pin={this.state.dealer_pin}
        />
      </div>
    )

  }
}

const WrappedForm = Form.create()(UserProfile)

export default WrappedForm;

function showConfirm(_this, msg, type, request) {
  confirm({
    title: 'WARNNING!',
    content: msg,
    okText: "Confirm",
    onOk() {
      if (type === 'decline') {
        _this.props.rejectRequest(request)
      } else {
        _this.setState({
          confirmDealerPin: true,
          request: request
        })
      }
    },
    onCancel() { },
  });
}
