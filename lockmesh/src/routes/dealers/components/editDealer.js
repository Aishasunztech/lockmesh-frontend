import React, { Component } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { Only_alpha_numeric, Not_valid_Email, Insert_Valid_Dealer_Name, Name } from '../../../constants/Constants';
// import { convertToLang } from '../../utils/commonUtils';
import { Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import { DEALER_PIN, EDIT_DEALER_Text, Account_Email } from '../../../constants/DealerConstants';
import { convertToLang } from '../../utils/commonUtils';
import { EDIT_DEALER } from '../../../constants/ActionTypes';

let func;
let actionType;
export default class EditDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            validateStatus: 'success'
        }
    }


    showModal = (dealer, edit_func, actionTypeParam = EDIT_DEALER) => {
        func = edit_func;
        actionType = actionTypeParam
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
            dealer_name: dealer.dealer_name,
            dealer_email: dealer.dealer_email,
            link_code: dealer.link_code
        });
    }

    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)


        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help2: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers"),
                dealer_name: fieldvalue,
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help2: null,
                dealer_name: fieldvalue,
            })
        }
    }


    handleEmailValidation = (event) => {
        var fieldvalue = event.target.value;
        
        if (/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/.test(fieldvalue)) {
            this.setState({
                status: 'success',
                help: null,
                dealer_email: fieldvalue,
            })
        }
        else {
            this.setState({
                status: 'error',
                help: convertToLang(this.props.translation[Not_valid_Email], "The input is not valid E-mail!"),
                dealer_email: fieldvalue,
            })
            
        }
    }

    handleSubmit = (e) => {
        let formData = { 'dealer_id': this.state.dealer_id, 'name': this.state.dealer_name, 'email': this.state.dealer_email }
        e.preventDefault();

        let error = false;

        let chcek = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
        if (chcek.test(this.state.dealer_email) === false) {
            // message.error('Invalid data');
            this.setState({
            status: 'error',
            help: convertToLang(this.props.translation[Not_valid_Email], "The input is not valid E-mail!")
            })
            error= true;
        }
        if (/[^A-Za-z \d]/.test(this.state.dealer_name) ) {
            this.setState({
                validateStatus: 'error',
                help2: convertToLang(this.props.translation[Only_alpha_numeric],  "Please insert only alphabets and numbers")
            })

            error= true;
        }

        if (this.state.dealer_name === '') {
            this.setState({
                validateStatus: 'error',
                help2: convertToLang(this.props.translation[Insert_Valid_Dealer_Name], "Please Insert Dealer Name")
            })

            error= true;
        }



        if(!error) {

            func(formData, actionType);
            this.handleCancel();
        }
    }

    componentDidMount() {
        // console.log("editdealer", this.props);
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Modal
                    visible={visible}
                    title={convertToLang(this.props.translation[EDIT_DEALER_Text], "Edit Dealer")}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                            {convertToLang(this.props.translation[Button_submit], "Submit")}
                        </Button>,
                    ]}
                >

                    <Form >
                        <p>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>
                        <Form.Item
                            label={`${convertToLang(this.props.translation[Name], "Name")} * `}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            validateStatus={this.state.validateStatus}
                            help={this.state.help2}
                        >
                            <Input autoComplete="new-password" type='text' value={this.state.dealer_name} onChange={(event) => this.handleNameValidation(event)} />

                        </Form.Item>
                        <Form.Item
                            label={`${convertToLang(this.props.translation[Account_Email], "Account Email")}* `}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            validateStatus={this.state.status}
                            help={this.state.help}
                        >
                            <Input type='email' autoComplete="new-password" value={this.state.dealer_email} onChange={(event) => this.handleEmailValidation(event)} />

                        </Form.Item>
                        <Form.Item
                            label={convertToLang(this.props.translation[DEALER_PIN], "DEALER PIN")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            <Input value={this.state.link_code} disabled />

                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}
