// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select, Form, Input } from "antd";

// Components
import EditDealer from '../../dealers/components/editDealer';
import DealerPaymentHistory from './DealerPaymentHistory';

// Helpers
import { convertToLang } from '../../utils/commonUtils'
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
import {
    Button_Delete,
    Button_Activate,
    Button_Connect,
    Button_Suspend,
    Button_Undo,
    Button_passwordreset,
    Button_Ok,
    Button_Cancel,
    Button_submit,
    Button_Save,

} from '../../../constants/ButtonConstants';
import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
import {
    DEALER_TEXT
} from '../../../constants/DealerConstants';

// user defined
const confirm = Modal.confirm;


function showConfirm(_this, data, dealer_name) {
    confirm({
        title: `Are you sure you want to change the credits limit of dealer ( ${dealer_name} ) to ${Math.abs(data.credits_limit)} Credits ?`,
        onOk() {
            _this.props.setCreditLimit(data)
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() { },
    });
}

class CreditsLimits extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.credits_limit = -values.credits_limit
                console.log(values.credits_limit);
                if (values.credits_limit != this.props.dealer.credits_limit) {
                    values.dealer_id = this.props.dealer.dealer_id
                    showConfirm(this, values, this.props.dealer.dealer_name)
                }
                this.handleCancel()
            }
        })
    }

    componentDidMount() {
        // console.log("editdealer", this.props);
    }

    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({ visible: false });
    }

    validateNumber = async (rule, value, callback) => {
        // console.log("Value" , value);
        var isnum = Number.isInteger(Number(value));
        // console.log("Value", value, isnum);
        if (isnum && value >= 0) {
            callback()
        } else {
            callback(" Value must be a integer and greater than or equal to zero")
        }
    }



    render() {
        return (
            <Modal
                width={'300px'}
                title="Credit Limit"
                maskClosable={false}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                footer={false}
                style={{
                    height: '300px'
                }}
            >
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "Credits Limit")}
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('credits_limit', {
                            initialValue: Math.abs(this.props.credits_limit),
                            rules: [
                                {
                                    required: true,
                                    message: "Credit Limit Value is required."
                                },
                                {
                                    validator: this.validateNumber
                                }]
                        })(
                            <Input type='number' />
                        )}
                    </Form.Item>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="text-right">
                        <Form.Item className="edit_ftr_btn11"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={() => { this.handleCancel() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                            <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_Save], "SAVE")}</Button>
                        </Form.Item>
                    </Col>

                </Form>
            </Modal>

        )
    }

}
const WrappedForm = Form.create()(CreditsLimits)
export default WrappedForm