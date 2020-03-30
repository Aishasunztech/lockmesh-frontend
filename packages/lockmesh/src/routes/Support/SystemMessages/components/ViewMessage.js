import React, { Component } from 'react';
import { Form,  Modal } from 'antd';
import { convertToLang } from '../../../utils/commonUtils'


class ViewMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    }
  }

  render() {
    return (
      <div>
        {this.props.messageObject !== null ? this.props.messageObject.message : ''}
      </div>
    )

  }
}

const WrappedAddDeviceForm = Form.create()(ViewMessage);
export default WrappedAddDeviceForm;
