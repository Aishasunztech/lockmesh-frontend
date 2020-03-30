import React, { Component } from 'react'
import { Row, Col, Card, Table, Button, Divider } from 'antd';

export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {

        const dataSource = [
            {
                key: 1,
                name: 'Dealer ID',
                value: this.props.profile.id,
            },
            {
                key: 2,
                name: 'Dealer Name',
                value: this.props.profile.name

            },
            {
                key: 3,
                name: 'Login Email',
                value: this.props.profile.email,
            },

            {
                key: 4,
                name: 'Dealer Pin',
                value: (this.props.profile.dealer_pin) ? this.props.profile.dealer_pin : 'N/A',
            }
        ];

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
        }];


        return (
            <div style={{ marginTop: -60 }}>
                <Row>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                        <div>
                            <Card style={{ borderRadius: 12 }}>
                                <div className="profile_table">
                                    <Row>
                                        <Col span={20}>
                                            <h1>Your Profile</h1>
                                        </Col>
                                        <Col span={4} style={{ textAlign: "center" }}>
                                            <a onClick={() => this.props.ChangeProfile()} >Edit</a>
                                        </Col>
                                    </Row>

                                    <Divider />
                                    <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}   >

                                    </Table>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div>
                            <Card style={{ borderRadius: 12 }}>
                                <div>
                                    <h1>Your Profile</h1>
                                    <Divider className="mb-0" />
                                    <Row style={{ padding: 16 }}>
                                        <Col span={9} style={{ padding: 0, textAlign: "center" }}>
                                            <img src={require("../../../assets/images/profile-image.png")} style={{ height: 'auto', width: '100%', borderRadius: 50 }} />
                                        </Col>
                                        <Col span={15}>
                                            <h1>{this.props.profile.name}</h1>

                                            <p>({this.props.profile.type})</p>
                                        </Col>
                                    </Row>
                                    <Row justify='center'>
                                        <Col span={12} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                            <Button type="primary" style={{ width: "100%" }}
                                                onClick={() => this.refs.change_password.showModal()}
                                                icon="unlock">Change Password</Button>
                                        </Col>
                                        <Col span={12} style={{ padding: "0px 16px 0px 8px" }} className="change_email">
                                            <Button disabled type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>
                                        </Col>
                                    </Row>

                                </div>
                            </Card>
                        </div>
                    </Col>

                </Row>
            </div>
        )
    }
}