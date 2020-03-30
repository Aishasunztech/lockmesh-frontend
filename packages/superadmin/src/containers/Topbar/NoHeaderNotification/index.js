import React, {Component} from "react";
import {connect} from "react-redux";

import {toggleCollapsedSideNav} from "../../../appRedux/actions/Setting";

class NoHeaderNotification extends Component {

  render() {
    const {navCollapsed} = this.props;
    return (
      <div className="gx-no-header-horizontal">
        <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
          <i className="gx-icon-btn icon icon-menu"
             onClick={() => {
               this.props.toggleCollapsedSideNav(!navCollapsed);
             }}
          />
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = ({settings}) => {
  const {navCollapsed} = settings;
  return {navCollapsed}
};
export default connect(mapStateToProps, {toggleCollapsedSideNav})(NoHeaderNotification);
