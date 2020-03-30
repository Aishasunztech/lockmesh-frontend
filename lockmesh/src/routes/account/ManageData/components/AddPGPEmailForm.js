import React, { Component, Fragment } from 'react'
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Input, Form } from "antd";
import { convertToLang } from '../../../utils/commonUtils';

class AddProductModal extends Component {
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
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const { visible } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title="Create Data"
                    maskClosable={false}
                    destroyOnClose
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                        </Button>,

                    ]}
                >
                    <Tabs defaultActiveKey="all" type='card' className="dev_tabs dev_tabs1" activeKey={this.state.tabselect} onChange={this.callback}>

                        <Tabs.TabPane tab={'PGP Email'} key="1" forceRender={true} > </Tabs.TabPane>
                        
                        <Tabs.TabPane tab={'Chat ID'} key="2" > </Tabs.TabPane>
                        
                        <Tabs.TabPane tab={'SIM ID'} key="3"  > </Tabs.TabPane>
                        
                        {/* VPN */}
                        {/* <Tabs.TabPane tab={'SIM ID'} key="0" forceRender={true} > </Tabs.TabPane> */}

                    </Tabs>

                    {/* <AddPGPEmailForm /> */}

                    {/* <AddChatID /> */}

                    {/* <AddSimID /> */}

                    <Form >
                        <Form.Item label="E-mail">
                            {this.props.form.getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {this.props.form.getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {this.props.form.getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item
                            label={
                                <span>
                                    Nickname
                                </span>
                            }
                        >
                            {this.props.form.getFieldDecorator('nickname', {
                                rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                            })(<Input />)}
                        </Form.Item>
                        
                    
                        <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                            <Row gutter={8}>
                                <Col span={12}>
                                    {this.props.form.getFieldDecorator('captcha', {
                                        rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                    })(<Input />)}
                                </Col>
                                <Col span={12}>
                                    <Button>Get captcha</Button>
                                </Col>
                            </Row>
                        </Form.Item>
                       
                        
                    </Form>

                </Modal>
            </Fragment>
        )
    }
}

export default Form.create({ name: 'addProductModal' })(AddProductModal);