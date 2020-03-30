import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover, Badge } from "antd";

class UserProfile extends Component {

  render() {
    // console.log("header devices count", this.props.devices);

    const userMenuOptions = (
      <ul className="gx-user-popover">
        {/* <Link to="/profile"><li>My Account</li></Link> */}
        {/* <li>Connections</li> */}
        <li onClick={() => this.props.logout()}>Logout
        </li>
      </ul>
    );

    return (

      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row side_bar_main">
        <Popover placement="bottomRight" trigger="lskdjsl">
          <Avatar
            src={require("../../assets/images/profile-image.png")}
            className="gx-size-40 gx-pointer gx-mr-3"
            alt=""
          />
          <span className="gx-avatar-name">
            {(localStorage.getItem('name') === '' || localStorage.getItem('name') === null || localStorage.getItem('name') === undefined) ? localStorage.getItem('dealerName') : localStorage.getItem('name')}
          </span>
        </Popover>
      </div>

    )

  }
}

var mapStateToProps = ({ settings, devices, auth }) => {
  // console.log("auth.authUser ", auth.authUser);
  return {
    devices: devices.newDevices,
    pathname: settings.pathname,
    auth: auth.authUser
  };
}


export default connect(mapStateToProps)(UserProfile);
