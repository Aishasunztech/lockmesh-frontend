import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Divider } from "antd";
import WhitelabelList from "./components/WhitelabelList";
import { Link } from 'react-router-dom';
import { getAllWhiteLabels, restartWhiteLabel, checkPass, resetConfirmReboot } from "../../appRedux/actions";
import { checkValue } from '../utils/commonUtils';
import styles from './tools.css'
import { FIRMWARE_URL } from '../../constants/Application';

class Tools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            fileName: '',
            visible: false,
            VSP200: false,
            rebootModal: false,
            tools_modal: false
        }
    }

    componentDidMount() {
        this.props.getWhiteLabels();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.whiteLabels.length) {
            this.setState({
                whiteLables: nextProps.whiteLabels
            })
        }
    }
    // handleCancel = () => {
    //     this.setState({
    //         visible: false
    //     });
    // }

    handleCancel = () => {
        this.setState({
            VSP200: false
        });
    }

    handleVisible = () => {
        this.setState({
            visible: false
        });
    }

    handleModalOpen = (title, content, file) => {
        this.setState({
            visible: true,
            title,
            content,
            fileName: file
        });
    }



    render() {
        return (
            <div>

                <Card >
                    <Row gutter={16} className="filter_top">
                        <Col className="col-md-3 col-sm-6 col-xs-12">
                            <div className="gutter-box">
                                <h1 style={{ lineHeight: "35px", marginBottom: 0 }}>DOWNLOAD TOOLS</h1>
                            </div>
                        </Col>
                    </Row>
                </Card>
                {/* <Card> */}
                {/* <WhitelabelList
                        whiteLabels={this.props.whiteLabels}
                        checkPass={this.props.checkPass}
                        confirmRebootModal={this.props.confirmRebootModal}
                        restartWhiteLabel={this.props.restartWhiteLabel}
                        resetConfirmReboot = {this.props.resetConfirmReboot}
                    /> */}


                <Row>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <div>
                            <div className="contenar">
                                <Link to="#" onClick={() => this.handleModalOpen("VSP100")} >
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>VSP100</h2>
                                            <Divider className="mb-0" />

                                        </div>
                                        <Button type="primary" size="small" className="open_btn1">Open</Button>
                                    </Card>
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                        <div>
                            <div>
                                <Link to="#" onClick={() => this.setState({ VSP200: true })} >
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>VSP200</h2>
                                            <Divider className="mb-0" />

                                        </div>
                                        <Button type="primary" size="small" className="open_btn1">Open</Button>
                                    </Card>
                                </Link>
                            </div>
                        </div>
                    </Col>


                    <Modal
                        title={this.state.title}
                        visible={this.state.visible}
                        onOk={this.handleVisible}
                        okText={"Ok"}
                        cancelText={"Cancel"}
                        onCancel={this.handleVisible}
                        className="d_tool_pup"
                        width="42%"
                    >
                        
                        {/* <Row className="d_t_m">
                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}>Firmware VSP100 (NO ADB)</h4>
                            <a href={`${FIRMWARE_URL}Firmware_VSP100_no_ADB.zip`}>
                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                    {"Download"}
                                </Button>
                            </a>
                        </Row> */}
                        <Row className="d_t_m">
                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}>Firmware VSP100 Final</h4>
                            <a href={`${FIRMWARE_URL}Firmware_VSP100_Final_20190928.gz`}>
                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                    {"Download"}
                                </Button>
                            </a>
                        </Row>
                        <Row className="d_t_m">
                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}>Firmware VSP100 (DEV)</h4>
                            <a href={`${FIRMWARE_URL}Firmware_VSP100_DEV_20190926.gz`}>
                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                    {"Download"}
                                </Button>
                            </a>
                        </Row>
                    </Modal>

                    <Modal
                        title={"VSP200"}
                        visible={this.state.VSP200}
                        onOk={this.handleCancel}
                        okText={"Ok"}
                        cancelText={"Cancel"}
                        onCancel={this.handleCancel}
                        className="d_tool_pup"
                        width="42%"
                    >
                        <Row className="d_t_m">
                            <h4 style={{ lineHeight: '30px', marginBottom: 0 }}>Firmware VSP200 Final</h4>
                            <a href={`${FIRMWARE_URL}Firmware_VSP200_Final.gz`}>
                                <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                    {"Download"}
                                </Button>
                            </a>
                        </Row>
                    </Modal>
                </Row>
                {/* </Card> */}
            </div>
        );
    }
}

var mapStateToProps = ({ auth, whiteLabels }) => {
    // console.log(whiteLabels);
    return {
        whiteLabels: whiteLabels.whiteLabels,
        confirmRebootModal: auth.confirmRebootModal,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWhiteLabels: getAllWhiteLabels,
        restartWhiteLabel: restartWhiteLabel,
        checkPass: checkPass,
        resetConfirmReboot: resetConfirmReboot,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tools);