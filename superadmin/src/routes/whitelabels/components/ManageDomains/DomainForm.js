import React, { Component, } from 'react'


import {
    Form, Input, Select, Modal, Button, Row
} from "antd";

let error = true
class DomainForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            domain: {},
            title: "",
            action: '',
            visible: false
        }
    }

    componentDidMount() {

    }

    showModal(action, visible, title = "Add Domain", domain = {}) {
        this.setState({
            action: action,
            title: title,
            domain: domain,
            visible: visible
        })
    }


    handleSubmit = (e) => {
        e.preventDefault()
        if (!error) {
            let domain_name = this.props.form.getFieldValue('domain_name');
            if (domain_name != this.state.domain.domain_name) {
                this.state.action({ domain_name, whitelabel_id: this.props.whitelabel_id, id: this.state.domain.id })
            }
            this.setState({
                domain: {},
                title: "",
                action: '',
                visible: false
            })
            this.props.form.resetFields()
        }
    }


    handelCancel = () => {
        this.setState({
            domain: {},
            title: "",
            action: '',
            visible: false
        })
        this.props.form.resetFields()
    }
    validateDomainName(field, value, cb) {
        if (value && value.length > 0) {
            if (!(/^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/.test(value))) {
                cb("Please enter a valid domain name")
                error = true
            } else {
                error = false
            }
        } else {
            cb("Please input Domain Name")
            error = true
        }
    }


    render() {
        let { getFieldDecorator } = this.props.form
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title={this.state.title}
                visible={this.state.visible}
                onCancel={() => {
                    this.handelCancel();
                }}
                footer={null}
                width='450px'
                className="set_price_modal"
            >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item
                        label="DOMAIN"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 15 }}>
                        {getFieldDecorator('domain_name', {
                            initialValue: this.state.domain ? this.state.domain.domain_name : '',
                            rules: [
                                {
                                    validator: this.validateDomainName
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Row className='modal_footer'>
                        <div className='modal_footer'>
                            <Button key="back" style={{ marginBottom: 0, marginTop: 16 }} className='submitButton' onClick={() => this.handelCancel(false)}>CANCEL</Button>
                            <Button className='submitButton' style={{ marginBottom: 0, marginTop: 16 }} type="primary" htmlType="submit" >SAVE</Button>
                        </div>
                    </Row>
                </Form>

            </Modal>
        )
    }
}
let WrappedDomainForm = Form.create({ name: "domainsForm" })(DomainForm);

export default WrappedDomainForm