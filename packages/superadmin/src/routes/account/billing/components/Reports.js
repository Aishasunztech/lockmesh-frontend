import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import { checkValue } from '../../../utils/commonUtils';
import styles from '../billing.css'

class SalesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            isLabel: false,
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let fromDate = values.from._d;
            let toDate = values.from._d;
            console.log('form', fromDate, toDate);
            if (!err) {

            }
        });
    }
    componentDidMount() {
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    handleChange = (e) => {
    }
    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    }

    componentDidUpdate(prevProps) {


    }
    handleLabelChange = (e) => {
        // console.log(e);
        if (e == '') {
            this.setState({
                isLabel: false
            })

        } else {
            this.props.getDealerList(e)
            this.setState({
                isLabel: true
            })
        }
    }


    render() {
        // console.log(this.props.dealerList, "Dealer List");
        return (
            <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Card style={{ height: '500px', paddingTop: '50px' }}>
                        <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                            <Form.Item
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                            </Form.Item>
                            <Form.Item
                                label="Label"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('label', {
                                    initialValue: ' ',
                                    rules: [{
                                        required: true, message: 'label is Required !',
                                    }],
                                })(
                                    <Select
                                        onChange={(e) => this.handleLabelChange(e)}
                                        style={{ width: '100%' }}
                                    >

                                        <Select.Option value=''>SELECT LABEL</Select.Option>
                                        {this.props.whiteLabels.map((label, index) => {
                                            return (<Select.Option key={index} value={label.id}>{label.name}</Select.Option>)
                                        })}
                                    </Select>
                                )}

                            </Form.Item>
                            {(this.state.isLabel)
                                ?
                                <Fragment>

                                    <Form.Item

                                        label="Dealer/Sdealer"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 14 }}
                                        width='100%'
                                    >
                                        {this.props.form.getFieldDecorator('dealer', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true, message: 'Dealer is Required !',
                                                },
                                            ],
                                        })(
                                            <Select

                                                style={{ width: '100%' }}
                                            >

                                                <Select.Option value=''>SELECT DEALER</Select.Option>
                                                <Select.Option value='admin'>Generate Admin report</Select.Option>
                                                {this.props.dealerList.map((dealer, index) => {
                                                    return (<Select.Option key={dealer.link_code} value={dealer.link_code}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item

                                        label="FROM (DATE) "
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        {this.props.form.getFieldDecorator('from', {
                                            rules: [
                                                {
                                                    required: true, message: 'Date is Required !',
                                                }],
                                        })(
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                disabledDate={this.disabledDate}
                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item

                                        label="TO (DATE)"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 14 }}
                                    >
                                        {this.props.form.getFieldDecorator('to', {
                                            rules: [
                                                {
                                                    required: true, message: 'Date is Required !',
                                                }],
                                        })(
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                onChange={this.saveExpiryDate}
                                                disabledDate={this.disabledDate}

                                            />
                                        )}
                                    </Form.Item>
                                    <Form.Item className="edit_ftr_btn"
                                        wrapperCol={{
                                            xs: { span: 24, offset: 0 },
                                            sm: { span: 24, offset: 0 },
                                        }}
                                    >
                                        <Button key="back" type="button" onClick={this.handleReset}>CANCEL</Button>
                                        <Button type="primary" htmlType="submit">GENERATE</Button>
                                    </Form.Item>
                                </Fragment>
                                : null
                            }
                        </Form>

                    </Card>

                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Card style={{ height: '500px' }}>

                    </Card>
                </Col>
            </Row>
        )
    }
}

const WrappedAddDeviceForm = Form.create()(SalesList);
export default WrappedAddDeviceForm;