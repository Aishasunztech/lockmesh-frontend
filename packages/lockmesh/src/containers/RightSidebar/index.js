import React, { Component } from "react";
import { Button, Drawer, Form, Tag, Tabs, Collapse, } from "antd";
import { connect } from "react-redux";
import Auxiliary from "../../util/Auxiliary";
import CustomScrollbars from "../../util/CustomScrollbars";
import {getSocketProcesses, getNotification } from '../../appRedux/actions';
import styles from './rightSidebar.css'
import { checkIsArray } from "../../routes/utils/commonUtils";
const { TabPane } = Tabs;
const { Panel } = Collapse;

// const customPanelStyle = {
//   background: '#f7f7f7',
//   borderRadius: 4,
//   marginBottom: 16,
//   border: 0,
//   overflow: 'hidden',
// };

class RightSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRightSidebarOpened: false,
      offSetValue: 0
    };
    this.datalist = []
  }

  callback = (key) => {
    console.log(key);
  }

  genExtra = (type) => {
    return (<div style={{ lineHeight: 1 }}>
      <i class="fa fa-check" aria-hidden="true"></i>
      <i class="fa fa-check" aria-hidden="true"></i>
      <br></br>
      {type === 'completed' ? <i class="fa fa-times" aria-hidden="true" onClick={() => { }}></i> : null}
    </div>)
  }

  queueOnload = (e) => {
    console.log("queueOnload");
    e.preventDefault();
    let offSet = this.state.offSetValue + 10;
    this.props.getSocketProcesses(false, false, offSet, 10);
    this.setState({ offSetValue: offSet })
  }


  getCustomizerContent = () => {

    return (
      // <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item">

        <br />
        <br />
        <CustomScrollbars className="gx-customizer">

          <Collapse
            // defaultActiveKey={['1']}
            bordered={false}
            expandIconPosition='right'
            onChange={() => this.callback()}
          // style={{ height: 400 }}
          >
            {this.props.tasks && this.props.tasks.length ?
              this.renderList(this.props.tasks, 'pending')
              :
              <div style={{ height: 50 }}>You don't have any queue job yet</div>
            }
          </Collapse>

        </CustomScrollbars>
        <br />
        {/* {this.props.tasks && this.props.tasks.length > 10
          ? */}
        <Button disabled={this.props.tasks && this.props.tasks.length > 10 ? false : true} type="primary" style={{ width: "100%" }} onClick={this.queueOnload}>Load More</Button>
        {/* : null
        } */}
      </div>

    )
  };



  toggleRightSidebar = () => {
    if (!this.state.isRightSidebarOpened) {
      this.props.getSocketProcesses();
    }
    this.setState(previousState => (
      {
        isRightSidebarOpened: !previousState.isRightSidebarOpened
      }));
  };

  renderList = (data, title) => {
    let taskList = [];

    if (data.length) {
      checkIsArray(data).map((item, index) => {
        // if (item.status === type) {
        taskList.push(item);
        // }
      })
    }
    return checkIsArray(taskList).map((task) => {
      let color = '';
      let status = '';
      switch (task.status) {
        case 'pending':
          color = 'blue'
          status = 'Pendding'
          break;
        case 'completed_successfully':
          color = 'green'
          status = 'Completed Successfully'
          break;
        default:
          color = 'red'
          status = 'Red'
      }
      return (
        <Panel
          header={task.type + ' (' + task.device_id + ')'}
          // style={customPanelStyle}
          key={task.id}
          className="r_bar_cont"
          extra={this.genExtra(title)}
        >
          <div>
            <p className="mb-4">status: <Tag color={color}>{status}</Tag></p>
            <p className="mb-4">{task.created_at}</p>
          </div>
        </Panel>
      )
    })
  }

  componentDidMount() {
    // this.props.getSocketProcesses();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.socket && nextProps.socket.connected) {
      nextProps.getNotification(nextProps.socket)
    }
  }
  render() {
    // console.log(this.props)
    return (
      <Auxiliary>
        <Drawer
          width='200'
          placement="right"
          // closable={true}
          onClose={this.toggleRightSidebar}
          visible={this.state.isRightSidebarOpened}>
          {
            this.getCustomizerContent()
          }

        </Drawer>
        <div
          // className="gx-customizer-option"
          className='container-notification-icon'
        >
          <Button className="right_bell_icon" type="primary" onClick={() => this.toggleRightSidebar()}>
            <i className="icon icon-notification bell-icon" />
          </Button>
        </div>

      </Auxiliary>
    );
  }
}

// export default RightSidebar;
const mapStateToProps = ({ rightSidebar, auth, socket }) => {
  // console.log("right sidebar:", rightSidebar, auth)
  // console.log("rightSidebar.tasks ", rightSidebar.tasks)
  return {
    tasks: rightSidebar.tasks,
    socket: socket.socket
  }
};

RightSidebar = Form.create()(RightSidebar);

export default connect(mapStateToProps, { getSocketProcesses, getNotification })(RightSidebar);
