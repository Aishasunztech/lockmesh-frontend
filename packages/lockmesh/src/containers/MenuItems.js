import React, { Component } from 'react'
import {Menu} from "antd";
import Auxiliary from "../util/Auxiliary";
import {Link} from "react-router-dom";

export default class MenuItems extends Component {
    constructor(props){
        super(props);
        this.state = {
          userType: localStorage.getItem("type")
        }
        // console.log("userType", this.state);
      }
    render() {
        return (
            <Auxiliary>
                <Menu.Item key="devices">
                    <Link to="/devices"><i className="icon icon-widgets" /> 
                    {/* <IntlMessages id="sidebar.devices" /> */}
                    </Link>
                </Menu.Item>

                {(this.state.userType === "admin") ? <Menu.Item key="dealer/dealer">
                    <Link to="/dealer/dealer"><i className="icon icon-profile2" /> 
                    {/* <IntlMessages id="sidebar.dealers" /> */}
                    </Link>
                </Menu.Item> : null}

                {(this.state.userType === "admin" || this.state.userType === "dealer") ? <Menu.Item key="dealer/sdealer">
                    <Link to="/dealer/sdealer"><i className="icon icon-avatar" /> 
                    {/* <IntlMessages id="sidebar.sdealers" /> */}
                    </Link>
                </Menu.Item> : null}

                {(this.state.userType === "admin") ? <Menu.Item key="apk-list">
                    <Link to="/apk-list"><i className="icon icon-apps" /> 
                    {/* <IntlMessages id="sidebar.app" /> */}
                    </Link>
                </Menu.Item> : null}
            </Auxiliary>
        )
    }
}
