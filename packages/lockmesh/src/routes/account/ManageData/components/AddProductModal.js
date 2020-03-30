import React, { Component, Fragment } from 'react'
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Input, Form, Select } from "antd";
import { convertToLang } from '../../../utils/commonUtils';

class AddProductModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selectedTab: '1'
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
    handleChangeTab = (e) => {
        console.log('handleChangeTab:', e);
        this.setState({
            selectedTab: e
        })
    }
    renderFormInputs = () => {
        let content = [];
        let { selectedTab } = this.state;
        if (selectedTab === '1') {
            content.push(
                [
                    <Form.Item label="Domain">
                        {this.props.form.getFieldDecorator('domain', {
                            rules: [
                                {
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ],
                        })(
                            // <Select >
                            //     <Select.Option key=''>
                            //         Select Domain
                            //     </Select.Option>
                            // </Select>
                            <Input />
                        )}
                    </Form.Item>,
                    <Form.Item label="Username">
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
                    </Form.Item>,
                ]
            )
        }
        if(!content.length){
            return null;
        }
        return content
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
                    <Tabs defaultActiveKey="all" type='card' className="dev_tabs dev_tabs1" activeKey={this.state.selectedTab} onChange={this.handleChangeTab}>

                        <Tabs.TabPane tab={'PGP Email'} key="1" forceRender={true} > </Tabs.TabPane>

                        <Tabs.TabPane tab={'Chat ID'} key="2" forceRender={true} > </Tabs.TabPane>

                        <Tabs.TabPane tab={'SIM ID'} key="3" forceRender={true} > </Tabs.TabPane>

                        {/* VPN */}
                        {/* <Tabs.TabPane tab={'SIM ID'} key="0" forceRender={true} > </Tabs.TabPane> */}

                    </Tabs>

                    <Form style={{
                        marginLeft: '10px'
                    }}>
                        {this.renderFormInputs()}
                    </Form>

                </Modal>
            </Fragment>
        )
    }
}

export default Form.create({ name: 'addProductModal' })(AddProductModal);