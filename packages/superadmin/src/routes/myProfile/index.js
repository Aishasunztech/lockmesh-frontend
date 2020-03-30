
import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { updatePassword } from "../../appRedux/actions/Dealers";
import { updateUserProfile, twoFactorAuth } from "../../appRedux/actions/Auth";
import { Row, Col, Card, Table, Button, Divider, Icon, Modal, Switch } from 'antd';
import ChangePassword from './components/changePassword';
import ChangeProfile from './components/change_profile';
import BASE_URL from '../../constants/Application';
import Customizer1 from './components/Customizer';
import styles from './components/profile.css';
import {
    SDEALER
} from "../../constants/Constants";

// import {Link} from 'react-router-dom';

class Profile extends Component {

    state = { visible: false }
    showModal1 = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    callChild = () => {
        this.refs.Customize33.toggleCustomizer();
    }
    twoFactorAuth = (e) => {
        this.props.twoFactorAuth(e);
    }
    render() {
        let columnData = null
        let commonColumns = [
            {
                key: 1,
                name: <a>Dealer ID</a>,
                value: this.props.profile.id,
            }, {
                key: 2,
                name: <a>Dealer Pin</a>,
                value: (this.props.profile.dealer_pin) ? this.props.profile.dealer_pin : 'N/A',
            },
            {
                key: 3,
                name: <a>Dealer Name</a>,
                value: this.props.profile.name,
            },
            {
                key: 4,
                name: <a>Login Email</a>,
                value: this.props.profile.email,
            },
            {
                key: 5,
                name: <a>Devices</a>,
                value: this.props.profile.type == 'admin' ? 'All' : this.props.profile.connected_devices,
            }
        ]

        if (this.props.profile.type === SDEALER) {
            columnData = {
                key: 6,
                name: <a>Parent Dealer</a>,
                value: (this.props.profile.connected_dealer == 0) ? "N/A" : this.props.profile.connected_dealer,
            }
        }
        let dataSource = [];
        if (columnData != null) {

            dataSource = commonColumns;
            dataSource.push(columnData);
            dataSource.push({
                key: 7,
                name: <a>Token</a>,
                value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
            });

        } else {
            dataSource = [
                ...commonColumns,
                {
                    key: 7,
                    name: <a>Token</a>,
                    value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
                }
            ];
        }
        // console.log('datasource', dataSource);

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: 'dealer_info'
        }, {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            className: 'dealer_value'
        }];

        // console.log('uio', this.refs.Customizer.toggleCustomizer)
        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}>
                </Row>
                <div style={{ marginTop: -40 }}>
                    <Row>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={24}>
                                                <h2 style={{ textAlign: "center" }}>Profile info</h2>
                                            </Col>
                                        </Row>
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}></Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <a onClick={this.showModal1}>
                                    <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>Edit Profile</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={8} className="text-center ">
                                                    {/* <Icon type="file-text" className="policy_icon" /> */}
                                                    <img src={require("assets/images/profile-image.png")} className="mb-8"></img>
                                                    <h1 className="mb-0">{this.props.profile.name}</h1>
                                                    <p>({this.props.profile.type})</p>
                                                </Col>
                                                <Col span={16} style={{ padding: 0, marginTop: 12 }}>
                                                    <h5><span className="diamond_icon">&#9670;</span>Change password</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>Change Email</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>Enable Dual Authentication  </h5>
                                                    {/* <h5 className="more_txt">and more...</h5> */}
                                                </Col>
                                            </Row>
                                            {/* <Row justify='center'>
                                                <Col span={6}>
                                                </Col>
                                                <Col span={12} style={{ padding: "", marginTop: 0 }}>
                                                </Col>
                                            </Row> */}

                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn">Open</Button>
                                </a>
                            </div>
                            <Modal
                                maskClosable={false}
                                title={<div>Edit Profile <a className="edit_a_tag" onClick={() => this.refs.change_profile.showModal()} >Edit</a></div>}
                                visible={this.state.visible}
                                onOk={this.handleOk1}
                                onCancel={this.handleCancel1}
                                footer={false}
                            >
                                <Row justify='center' style={{}}>
                                    <Col span={12} style={{ padding: "0 16px 0" }} className="change_pass">
                                        <Button type="primary" size="small" style={{ width: "100%" }}
                                            onClick={() => this.refs.change_password.showModal()} icon="unlock">Change Password</Button>
                                    </Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12} style={{ padding: "16px 16px 0 " }} className="change_email">
                                        <Button disabled size="small" type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>
                                    </Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12} style={{ padding: "16px 16px 0 " }}>
                                        <h3>Login Email Authentication</h3>
                                    </Col>
                                    <Col span={6} style={{ padding: "16px 16px 0 " }}>
                                        <Switch
                                            checkedChildren="ON"
                                            unCheckedChildren="OFF"
                                            defaultChecked={(this.props.profile.two_factor_auth === 1 || this.props.profile.two_factor_auth === true) ? true : false}
                                            onChange={(e) => {
                                                this.twoFactorAuth(e);
                                            }} />
                                    </Col>
                                </Row>
                            </Modal>
                        </Col>
                        <Customizer1 ref="Customize33" />
                    </Row>
                </div>
                <ChangePassword ref="change_password" profile={this.props.profile} func={this.props.updatePassword} />
                <ChangeProfile
                    ref="change_profile"
                    profile={this.props.profile}
                    func={this.props.updatePassword}
                    updateUserProfile={this.props.updateUserProfile}
                />

            </div>
        )
    }
}

var matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        twoFactorAuth: twoFactorAuth,
        updatePassword, updateUserProfile
    }, dispatch);
}

var mapStateToProps = ({ auth }) => {
    // console.log("mapStateToProps");
    // console.log('ooo', state.auth);
    // console.log(auth.authUser);
    return {
        profile: auth.authUser

    };
}


export default connect(mapStateToProps, matchDispatchToProps)(Profile)