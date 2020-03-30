import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon, Modal } from 'antd';
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import styles from './app.css'
import { connect } from "react-redux";
import ConfirmAutoUpdate from './ConfirmAutoUpdate'
import { authenticateUpdateUser, resetAuthUpdate, resetBulkFlag } from "../../../appRedux/actions/Apk";
import { Markup } from 'interweave';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants/Application.js';


import {
    APP_MANAGE_APKs,
    APP_MANAGE_POLICY,
    APP_SECURE_MARKET,
    APP_DOWNLOAD_TOOLS,
    APP_SECURE_PANEL_APK,

    APP_MD_01,
    APP_MD_02,
    APP_MD_03,
    APP_MD_04,
    APP_MP_01,
    APP_MP_02,
    APP_SM_01,
    APP_SM_02,
    APP_SM_03,
    APP_DT_01,
    APP_SPA_01,
    APP_SPA_02,

    APP_ADD_MORE,

    DT_MODAL_HEADING,
    DT_MODAL_BODY,
    DT_MODAL_BODY_7
} from '../../../constants/AppConstants';
import {
    Button_Open,
    Button_DOWNLOAD,
    Button_Ok,
    Button_Cancel
} from '../../../constants/ButtonConstants'


import {
    convertToLang
} from '../../utils/commonUtils'

import {
    checkPass,
} from "../../../appRedux/actions/Apk";




import PasswordForm from '../../ConnectDevice/components/PasswordForm'

class PasswordModal extends Component {
    // console.log('object,', props.actionType)
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showPwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    actionType='back_up'
                    handleCancel={this.props.showPwdConfirmModal}
                    ref='pswdForm'
                    translation={this.props.translation}
                />
            </Modal >
        )
    }
}










class Apk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pwdConfirmModal: false,
            tools_modal: false,
        }
    }
    showToolsModal = () => {
        this.setState({
            tools_modal: true,
        });
    };

    handleOk = e => {
        this.setState({
            tools_modal: false,
        });
    };

    handleCancel = e => {
        this.setState({
            tools_modal: false,
        });
    };


    showPwdConfirmModal = (visible) => {
        this.setState({
            pwdConfirmModal: visible,
        })
    }

    render() {
        if (this.props.authUpdateUser) {
            this.props.resetAuthUpdate()
            return (
                <Redirect to={{
                    pathname: '/apk-list/autoupdate',
                    state: { id: this.props.user.id }
                }} />
            )
        } else {
            if (this.props.isBulkActivity) {
                { this.props.resetBulkFlag() }
                return (
                    <Redirect to={{
                        pathname: '/bulk-activities',
                        state: { id: this.props.user.id }
                    }} />
                )
            } else {
                return (
                    <div>
                        <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <p className="hidden-xs" style={{ color: '#fff', lineHeight: '30px' }}>Download latest version of the App here</p>
                            <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.75.apk">
                                <Button type="primary" size="default" style={{ margin: '0 16px', height: 30, lineHeight: '30px' }}> ScreenLocker apk (v4.75)</Button>
                            </a> */}
                        </Row>
                        <div style={{ marginTop: -60 }}>
                            <Row>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <Link to="/apk-list">
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_MANAGE_APKs], "Manage APK's")} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0 0px' }}>
                                                        <Col span={8} className="" style={{ textAlign: "center" }}>
                                                            <Icon type="android" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_01], "Manage apk's")} </h5>
                                                            <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_02], "Add permssion")} </h5>
                                                            {(this.props.user.type === 'admin') ?
                                                                (<Fragment>
                                                                    <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_03], "Activate apk push")} </h5>
                                                                    <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_04], "Set apk Dealer permissions")} </h5>
                                                                    <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                                </Fragment>
                                                                )
                                                                :
                                                                (
                                                                    <Fragment>
                                                                        <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </Link>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <Link to="/policy">
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_MANAGE_POLICY], "Manage Policy")} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0px 0px' }}>
                                                        <Col span={8} style={{ textAlign: "center" }}>
                                                            <Icon type="file-text" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_MP_01], "Create/Edit Policies")}</h5>
                                                            <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_MP_02], "Set Policy  Permission")}</h5>
                                                            <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </Link>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <div>
                                            <Link to="/app-market">
                                                <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                    <div className="image_1">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_SECURE_MARKET], "Secure Market")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0px 0px' }}>
                                                            <Col span={8} style={{ textAlign: "center" }}>
                                                                <Icon type="appstore" className="policy_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ padding: 0 }}>
                                                                <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_SM_01], "Add/remove apps in Secure Market")}</h5>
                                                                <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_SM_03], "Set permissions")}</h5>
                                                                <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                            </Col>
                                                        </Row>

                                                    </div>
                                                </Card>
                                                <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Col>
                                {/* never ever delete this commented code :P */}
                                {/* <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <div>
                                            <Link to="#" onClick={() => {
                                                this.showPwdConfirmModal(true)
                                            }}>
                                                <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                    <div className="image_1">
                                                        <h2 style={{ textAlign: "center" }}>AUTO UPDATE APPS</h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0px 0px' }}>
                                                            <Col span={8} style={{ textAlign: "center" }}>
                                                                <Icon type="android" className="policy_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ padding: 0 }}>
                                                                <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Add/remove apps </h5>
                                                                <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span> Edit Apps </h5>
                                                                <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                            </Col>
                                                        </Row>
    
                                                    </div>
                                                </Card>
                                                <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Col> */}
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <a href="#" onClick={() => this.showToolsModal()}>
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_DOWNLOAD_TOOLS], "Download Tools")} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0 0px' }}>
                                                        <Col span={8} className="" style={{ textAlign: "center" }}>
                                                            <Icon type="tool" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                <Markup content={convertToLang(this.props.translation[APP_DT_01], "BYOD Launcher Apk, Tools, etc... can be found here")} />
                                                            </h5>
                                                            <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </a>
                                    </div>
                                    <Modal
                                        title={convertToLang(this.props.translation[DT_MODAL_HEADING], "Download Tools")} //"Download Tools"
                                        visible={this.state.tools_modal}
                                        onOk={this.handleOk}
                                        okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                        onCancel={this.handleCancel}
                                        className="d_tool_pup"

                                    >
                                        <Row className="d_t_m">
                                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}><Markup content={convertToLang(this.props.translation[DT_MODAL_BODY], "Neutral Launcher (BYOD) <b>(Android v8+)</b>")} ></Markup></h4>
                                            <a href={`${BASE_URL}users/getFile/nlbyod8.apk`}>
                                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                                    {convertToLang(this.props.translation[Button_DOWNLOAD], "Download")}
                                                </Button>
                                            </a>
                                        </Row>
                                        {/* <Row className="d_t_m">
                                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}><Markup content={convertToLang(this.props.translation[DT_MODAL_BODY_7], "Neutral Launcher (BYOD7) <b>(Android v7)</b>")} ></Markup></h4>
                                            <a href={`${BASE_URL}users/getFile/nlbyod7.apk`}>
                                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                                    {convertToLang(this.props.translation[Button_DOWNLOAD], "Download")}
                                                </Button>
                                            </a>
                                        </Row> */}
                                    </Modal>

                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                    <div>
                                        <Link
                                            to="/dealer-agents"
                                        >
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <h2 className="text-center">{convertToLang(this.props.translation[APP_SECURE_PANEL_APK], "Secure Panel APK")} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0 0px' }}>
                                                        <Col span={8} className="text-center">
                                                            <Icon type="idcard" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: '0' }}>
                                                            <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                <Markup content={convertToLang(this.props.translation[APP_SPA_01], "Edit/Create Users and add permissions for the Secure Panel Apk")} />
                                                            </h5>
                                                            <h5 style={{ marginBottom: 0, display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                <Markup content={convertToLang(this.props.translation[APP_SPA_02], "Very useful tool for your Customer Support staff")} />
                                                            </h5>
                                                            <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], "and more...")} </h5>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </Link>
                                    </div>

                                </Col>
                                {((this.props.user.type === 'admin')) ?
                                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                        <div>
                                            <Link
                                                to="#" onClick={() => this.showPwdConfirmModal(true)}
                                            >
                                                <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                    <div>
                                                        <h2 style={{ textAlign: "center", width: "80%", margin: "0 auto" }}>
                                                            <Icon type="lock" className="lock_icon2" />

                                                            {convertToLang(this.props.translation[""], "Bulk Device Activities")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="text-center">
                                                                <Icon type="mobile" className="policy_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ padding: '0' }}>
                                                                <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                    <Markup content={convertToLang(this.props.translation[""], "PUSH/PULL Apks To All OR Selected Devices")} />
                                                                </h5>
                                                                {/* <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                    <Markup content={convertToLang(this.props.translation[""], "Make Permission Changes To All OR Selected Devices")} />
                                                                </h5> */}
                                                                <h5 style={{ marginBottom: 0, display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                    <Markup content={convertToLang(this.props.translation[""], "Push Policy, Acitvate, Suspend to ALL OR Selected Devices")} />
                                                                </h5>
                                                                <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                                    <Markup content={convertToLang(this.props.translation[""], "Unlink, Wipe To All OR Selected Devices")} />
                                                                </h5>
                                                                <h5 className="" > {convertToLang(this.props.translation[""], "and more...")} </h5>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Card>
                                                <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                            </Link>
                                        </div>
                                    </Col>
                                    :
                                    <Col />
                                }
                                <PasswordModal
                                    translation={this.props.translation}
                                    pwdConfirmModal={this.state.pwdConfirmModal}
                                    showPwdConfirmModal={this.showPwdConfirmModal}
                                    checkPass={this.props.checkPass}
                                    translation={this.props.translation}
                                />
                            </Row>
                        </div>

                    </div>
                )

            }

        }
    }
}

const mapStateToProps = ({ apk_list, auth, settings }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        authUpdateUser: apk_list.authenticateUpdateUser,
        user: auth.authUser,
        translation: settings.translation,
        isBulkActivity: apk_list.isBulkActivity
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getApkList: getApkList,
        authenticateUpdateUser: authenticateUpdateUser,
        resetAuthUpdate: resetAuthUpdate,
        checkPass: checkPass,
        resetBulkFlag: resetBulkFlag

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Apk)