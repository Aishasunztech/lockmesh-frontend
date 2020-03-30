import React from "react";
import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from "antd";
import Moment from "moment";
import categories from "../../data/categories";
import priorities from "../../data/priorities";
const {TextArea} = Input;

class ComposeTicket extends React.Component {
  constructor() {
    super();
  }

  handleSubmit = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err){
        values.user       = this.props.user;
        values.ticket_id  = this.props.supportTicket._id;

        this.props.supportTicketReply(values);
        this.props.onClose();
        this.props.form.resetFields()
      }

    });
  };

  render() {
    const {onClose} = this.props;
    return (
      <Modal onCancel={onClose} visible={this.props.open}
             title='Support Ticket Reply'
             closable={false}
             onOk={() => {
               this.handleSubmit()
             }}
             style={{zIndex: 2600}}>
        <Form autoComplete="new-password">
          <Form.Item
            label="Description"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {this.props.form.getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  message: 'Description is required',
                }],
            })(
              <TextArea
                placeholder='Description'
                autosize={{ minRows: 5, maxRows: 5 }}
              />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ComposeTicket);
