import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select, InputNumber, Spin, Modal, Table } from 'antd';

class EditHardware extends Component {

    constructor(props) {
        super(props);

    }


    handleSubmit = (e) => {
        // console.log('submit', this.props.editHardwareObj);
        e.preventDefault();

        let OldHardWare = this.props.editHardwareObj;

        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('error ', err, "values ", values)
            if (!err) {
                OldHardWare.new_name = values.name;
                OldHardWare.new_price = Number(values.price);

                // console.log('updated object ', OldHardWare);
                this.props.editHardwareFunc(OldHardWare);
                this.props.handleCancel()
            }
        })
    }

    render() {
        // console.log("editHardwareObj ", this.props.editHardwareObj);
        const { editHardwareObj } = this.props;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <Form.Item
                        label={"Hardware Name"}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('name', {
                            initialValue: editHardwareObj.name,
                            rules: [{
                                required: true, message: 'Hardware name is required',
                            }],
                        })(

                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item
                        label={"Hardware Price"}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('price', {
                            initialValue: editHardwareObj.price,
                            rules: [{
                                required: true, message: 'Hardware price is required',
                            }],
                        })(

                            <Input />
                        )}
                    </Form.Item>

                    {/* Footer */}
                    <Form.Item className="edit_ftr_btn11"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={() => this.props.handleCancel()} > {"CANCEL"}</Button>
                        <Button type="primary" htmlType="submit">{"UPDATE"}</Button>
                    </Form.Item>

                </Form>
            </div>
        )
    }
}

export default Form.create({ name: 'editHardware' })(EditHardware);

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({

//     }, dispatch);
// }
// var mapStateToProps = ({ auth }) => {
//     // console.log("sdfsaf", devices);

//     return {

//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(WrappedEditHardwareForm);