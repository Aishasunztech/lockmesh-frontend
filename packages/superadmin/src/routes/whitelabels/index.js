import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SECURE_LAUNCHER, SC, BYOD, LAUNCHER_TYPE, SCS_TYPE, BYOD_TYPE, BYOD7_TYPE } from '../../constants/Constants';
import { checkValue } from '../utils/commonUtils'
import { Link } from 'react-router-dom';
import {
    Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Divider
} from "antd";

import style from "./whitelabels.css"

import {
    getWhiteLabelInfo, editWhiteLabelInfo,
    getWhitelabelBackups, getFile, saveIDPrices, setPackage,
    getPrices, setPrice, resetPrice, saveBackup
} from '../../appRedux/actions';

import EditWhiteLabel from "./components/EditWhiteLabel";
import EditByodApk from "./components/EditByodApk"
import LoadIDsModal from "./components/LoadIDsModal";
// import WhiteLabelPricing from './components/WhiteLabelPricing';
import { USER_URL } from '../../constants/Application'

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error
let copiedData = [];


class WhiteLabels extends Component {
    constructor(props) {
        super(props);
        this.whitelabelBackupColumns = [
            {
                title: '#',
                dataIndex: '#',
                key: '#',
                textAlign: 'center'
            },
            {
                // title: (
                //     <Input.Search
                //         name="db_file"
                //         key="db_file"
                //         id="db_file"
                //         className="search_heading"
                //         onKeyUp={this.handleSearch}
                //         autoComplete="new-password"
                //         placeholder='BACKUP FILE'
                //     />
                // ),
                // dataIndex: 'db_file',
                // className: '',
                // children: [
                //     {
                title: 'BACKUP FILE',
                align: "center",
                className: '',
                dataIndex: 'db_file',
                key: 'db_file',
                // sorter: (a, b) => { return a.db_file.localeCompare(b.db_file) },

                // sortDirections: ['ascend', 'descend'],
                //     }
                // ]
            },
            {
                // title: (
                //     <Input.Search
                //         name="created_at"
                //         key="created_at"
                //         id="created_at"
                //         className="search_heading"
                //         onKeyUp={this.handleSearch}
                //         autoComplete="new-password"
                //         placeholder='CREATED AT'
                //     />
                // ),
                // dataIndex: 'created_at',
                // className: '',
                // children: [
                //     {
                title: 'CREATED AT',
                align: "center",
                className: '',
                dataIndex: 'created_at',
                key: 'created_at',
                //         sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },

                //         sortDirections: ['ascend', 'descend'],
                //     }
                // ]
            },
        ]
        this.state = {
            info_modal: false,
            edit_modal: false,
            secureLouncer: {},
            scApk: {},
            loadIdsModal: false,
            selectedRowKeys: [],
            backupDatabaseModal: false,
            copy_status: true,
            pricing_modal: false,
            byod_model: false,
            byod_apk: {},
            edit_byod_modal: false,
            byod_type: 'BYOD',
            is_byod7: false,
        }
    }

    showInfoModal = (e, visible) => {
        if (this.props.whiteLabelInfo.apks.length && visible) {
            let index = this.props.whiteLabelInfo.apks.findIndex(apk => apk.apk_type === LAUNCHER_TYPE)
            if (index > -1) {
                this.setState({
                    secureLouncer: this.props.whiteLabelInfo.apks[index],
                    info_modal: visible
                })
            }

            let index2 = this.props.whiteLabelInfo.apks.findIndex(apk => apk.apk_type === SCS_TYPE)
            if (index2 > -1) {
                this.setState({
                    scApk: this.props.whiteLabelInfo.apks[index2],
                    info_modal: visible
                })
            }
            else {
                this.setState({
                    info_modal: visible
                })
            }
        } else {
            this.setState({
                info_modal: visible,

            })
        }

    }
    showBYODModal = (e, visible, type) => {
        // console.log(this.props.whiteLabelInfo, 'white label info');
        let index2 = -1
        if (type) {
            index2 = this.props.whiteLabelInfo.apks.findIndex(apk => apk.apk_type == type)
        }
        console.log(index2);
        if (index2 > -1) {
            this.setState({
                byod_apk: this.props.whiteLabelInfo.apks[index2],
                byod_model: visible,
                byod_type: type,

            })
        } else {
            this.setState({
                byod_model: visible,
                byod_type: type,
                byod_apk: {}
            })
        }
    }
    editInfoModal = (e, visible) => {
        this.setState({
            edit_modal: visible
        })
    }
    editBYODModal = (e, visible) => {
        this.setState({
            edit_byod_modal: visible,
            // byod_type: byod_type
        })
    }

    getWhiteLabelInfo = (id) => {
        // console.log(id, 'ds');
        let _this = this;

        setTimeout(function () {
            _this.props.getWhiteLabelInfo(id)
        }, 1000);
    }

    handleSearch = (e) => {
        let demoData = [];
        if (this.state.copy_status) {
            copiedData = this.state.whitelabelBackups;
            this.state.copy_status = false;
        }
        // console.log(e.target.value, e.target.name, 'value', copiedData)
        if (e.target.value.length) {
            copiedData.forEach((item) => {
                if (item[e.target.name] !== undefined) {
                    // console.log((typeof item[e.target.name]), 'type')
                    if ((typeof item[e.target.name]) === 'string') {
                        if (item[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoData.push(item);
                        }
                    } else if (item[e.target.name] != null) {
                        if (item[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoData.push(item);
                        }
                    } else {
                    }
                } else {
                }
            });
            this.setState({
                devices: demoData
            })
        } else {
            this.setState({
                devices: copiedData
            })
        }
    }

    componentDidMount() {
        this.props.getWhiteLabelInfo(this.props.id);
        this.props.getWhitelabelBackups(this.props.id);
        // this.props.getPrices(this.props.id);

        this.setState({
            whitelabelBackups: this.props.whitelabelBackups
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                whitelabelBackups: this.props.whitelabelBackups,
            })
        }
    }

    handleCancel = () => {
        this.setState({
            backupDatabaseModal: false
        })
    }

    renderWhitelabelBackups = (data) => {
        if (data && data.length) {
            return data.map((item, index) => {
                return {
                    rowKey: item.id,
                    '#': ++index,
                    whitelabel_id: item.whitelabel_id,
                    db_file: <a href={`${USER_URL}getBackupFile/` + item.db_file}><Button type='primary' size='small'  >Download</Button></a>,
                    created_at: item.created_at
                }
            })
        }
    }

    showPricingModal = (visible) => {
        this.setState({
            pricing_modal: visible
        });
    }

    saveBackup = () => {
        this.props.saveBackup(this.props.whiteLabelInfo.id)
    }


    render() {
        // console.log('prices are', this.props.isPriceChanged)
        // load ids modal
        if (this.props.showMsg) {
            if (this.props.msg === "imported successfully") {
                success({
                    title: this.props.msg,
                });
            } else {
                error({
                    title: this.props.msg,
                });
            }

        }


        const { file, selectedRowKeys, } = this.state
        // console.log(this.state.used_chat_ids_page);
        let self = this;
        const props = {
            name: 'file',
            multiple: false,
            accept: [".xls", ".csv", ".xlsx"],
            // accept: ".xls; *.csv; *.xlsx;",
            // accept: ".xls",
            // processData: false,
            beforeUpload: (file) => {
                // console.log(file);
                this.setState({
                    file: file
                });
                return false;
            },
            // action: '//jsonplaceholder.typicode.com/posts/',
            onChange(info) {
                // console.log(info);
                if (info.fileList.length === 0) {
                    self.uploadFile(null);
                }
            },
            fileList: (file === null) ? null : [file]
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };


        const duplicateModalColumns = [
            {
                title: 'SIM ID',
                align: "center",
                dataIndex: 'sim_id',
                key: "sim_id",
                className: this.state.duplicate_data_type == 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'START DATE',
                align: "center",
                dataIndex: 'start_date',
                key: "start_date",
                className: this.state.duplicate_data_type == 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'EXPIRY DATE',
                align: "center",
                dataIndex: 'expiry_date',
                key: "expiry_date",
                className: this.state.duplicate_data_type == 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'CHAT IDS',
                align: "center",
                dataIndex: 'chat_id',
                key: "chat_id",
                className: this.state.duplicate_data_type == 'chat_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'PGP EMAILS',
                align: "center",
                dataIndex: 'pgp_email',
                key: "pgp_email",
                className: this.state.duplicate_data_type == 'pgp_email' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            }
        ]
        // end load ids modal
        // console.log(this.props.whitelabelBackups, 'whitelables', this.state.secureLouncer)
        // console.log(this.props.whiteLabelInfo, 'whitelables', this.state.secureLouncer)
        // console.log('label id is: ', this.props.whiteLabelInfo.id)
        // let label_id = this.props.whiteLabelInfo.id;
        // console.log('ref func ', this.refs.loadidsofModal)
        return (
            <div>

                <Row
                    justify='center'
                    style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}
                >
                    <h1 style={{ color: 'white' }} className="ml-16">{this.props.whiteLabelInfo.name}</h1>
                </Row>
                <div style={{ marginTop: -40 }}>
                    <Row>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div className="contenar">
                                    <Link to="#" onClick={(e) => { this.showInfoModal(e, true) }} >
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Model ID</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </Link>
                                    <Modal
                                        maskClosable={false}
                                        destroyOnClose={true}
                                        title={
                                            <div>
                                                <span>WhiteLabel Info</span>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    style={{ float: "right", marginRight: 32 }}
                                                    onClick={(e) => {
                                                        this.editInfoModal(e, true)
                                                    }}
                                                >Edit</Button>
                                            </div>
                                        }
                                        visible={this.state.info_modal}
                                        onOk={(e) => {
                                            this.showInfoModal(e, false);
                                        }}
                                        onCancel={(e) => {
                                            this.showInfoModal(e, false);
                                        }}
                                    // okText='Submit'
                                    // okText="OK"
                                    // okButtonProps={{
                                    //     disabled: this.state.newData.length ? false : true
                                    // }}
                                    >
                                        <Table
                                            bordered
                                            showHeader={false}
                                            size='small'
                                            className="model_id_table"
                                            columns={[
                                                {
                                                    // title: 'Name',
                                                    dataIndex: 'name',
                                                    key: 'name',
                                                },
                                                {
                                                    // title: 'Value',
                                                    dataIndex: 'value',
                                                    key: 'value',
                                                },
                                                // {
                                                //     dataIndex: 'action',
                                                //     key: 'action'
                                                // }
                                            ]}
                                            pagination={false}
                                            dataSource={[
                                                {
                                                    key: 1,
                                                    name: (<b>Model ID</b>),
                                                    // value: '',
                                                    value: checkValue(this.props.whiteLabelInfo.model_id),
                                                },
                                                {
                                                    key: 2,
                                                    name: (<b>Command</b>),
                                                    // value: '',
                                                    value: checkValue(this.props.whiteLabelInfo.command_name),
                                                },
                                                {
                                                    key: 3,
                                                    name: (<b>Launcher (APK)</b>),
                                                    value: checkValue(this.state.secureLouncer.apk_file),
                                                },
                                                {
                                                    key: 4,
                                                    name: (<b>Version Name</b>),
                                                    // value: '',
                                                    value: checkValue(this.state.secureLouncer.version_name),
                                                },
                                                {
                                                    key: 5,
                                                    name: (<b>Size</b>),
                                                    // value: '',
                                                    value: checkValue(this.state.secureLouncer.apk_size),
                                                },
                                                {
                                                    key: 6,
                                                    name: (<b>SC (APK)</b>),
                                                    value: checkValue(this.state.scApk.apk_file),
                                                },
                                                {
                                                    key: 7,
                                                    name: (<b>Version Name</b>),
                                                    // value: '',
                                                    value: checkValue(this.state.scApk.version_name),
                                                },
                                                {
                                                    key: 8,
                                                    name: (<b>Size</b>),
                                                    // value: '',
                                                    value: checkValue(this.state.scApk.apk_size),
                                                },
                                            ]}
                                        />

                                    </Modal>
                                    <EditWhiteLabel
                                        whiteLabelInfo={this.props.whiteLabelInfo}
                                        editInfoModal={this.editInfoModal}
                                        edit_modal={this.state.edit_modal}
                                        editWhiteLabelInfo={this.props.editWhiteLabelInfo}
                                        getWhiteLabelInfo={this.getWhiteLabelInfo}
                                        showInfoModal={this.showInfoModal}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div>
                                    <Link to="#" onClick={(e) => this.showBYODModal(e, true, 'BYOD')} >
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>BYOD APK</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </Link>
                                </div>
                                <Modal
                                    maskClosable={false}
                                    destroyOnClose={true}
                                    title={
                                        <div>
                                            <span>WhiteLabel {this.state.byod_type} Info</span>
                                            <Button
                                                type="primary"
                                                size="small"
                                                style={{ float: "right", marginRight: 32 }}
                                                onClick={(e) => {
                                                    this.editBYODModal(e, true)
                                                }}
                                            >Edit</Button>
                                        </div>
                                    }
                                    visible={this.state.byod_model}
                                    onOk={(e) => {
                                        this.showBYODModal(e, false);
                                    }}
                                    onCancel={(e) => {
                                        this.showBYODModal(e, false);
                                    }}
                                // okText='Submit'
                                // okText="OK"
                                // okButtonProps={{
                                //     disabled: this.state.newData.length ? false : true
                                // }}
                                >
                                    <Table
                                        bordered
                                        showHeader={false}
                                        size='small'
                                        className="model_id_table"
                                        columns={[
                                            {
                                                // title: 'Name',
                                                dataIndex: 'name',
                                                key: 'name',
                                            },
                                            {
                                                // title: 'Value',
                                                dataIndex: 'value',
                                                key: 'value',
                                            },
                                            // {
                                            //     dataIndex: 'action',
                                            //     key: 'action'
                                            // }
                                        ]}
                                        pagination={false}
                                        dataSource={[
                                            {
                                                key: 1,
                                                name: (<b>Model ID</b>),
                                                // value: '',
                                                value: checkValue(this.props.whiteLabelInfo.model_id),
                                            },
                                            {
                                                key: 2,
                                                name: (<b>Command</b>),
                                                // value: '',
                                                value: checkValue(this.props.whiteLabelInfo.command_name),
                                            },
                                            {
                                                key: 3,
                                                name: (<b>BYOD (APK)</b>),
                                                value: checkValue(this.state.byod_apk.apk_file),
                                            },
                                            {
                                                key: 4,
                                                name: (<b>Version Name</b>),
                                                // value: '',
                                                value: checkValue(this.state.byod_apk.version_name),
                                            },
                                            {
                                                key: 5,
                                                name: (<b>Size</b>),
                                                // value: '',
                                                value: checkValue(this.state.byod_apk.apk_size),
                                            },
                                        ]}
                                    />

                                </Modal>

                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div>
                                    <Link to="#" onClick={(e) => this.showBYODModal(e, true, 'BYOD7')} >
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>BYOD7 APK</h2>
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
                                <div className="contenar">
                                    <a href="javascript:void(0)">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>FailSafe APK</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </a>
                                    <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div className="contenar">
                                    <a href="javascript:void(0)" onClick={() => this.setState({ backupDatabaseModal: true })} >
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Database Backups</h2>
                                                <Divider className="mb-0" />
                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </a>
                                    {/* <WhiteLabelBackups /> */}
                                    <Modal
                                        title={
                                            <div>
                                                <Button type="primary" loading={this.props.backupLoading} size="small" className="mng_d_btn" onClick={this.saveBackup} >SAVE BACKUP NOW</Button>
                                                <span>Database Backups</span>
                                            </div>
                                        }
                                        visible={this.state.backupDatabaseModal}
                                        onOk={this.handleCancel}
                                        onCancel={this.handleCancel}
                                        maskClosable={false}
                                    >
                                        <Table
                                            bordered
                                            pagination={false}
                                            dataSource={this.renderWhitelabelBackups(this.state.whitelabelBackups)}
                                            columns={this.whitelabelBackupColumns}>
                                        </Table>
                                    </Modal>

                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div className="contenar">
                                    <a href="javascript:void(0)" >
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Promo</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </a>
                                    <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div className="contenar">
                                    {/* <a href="javascript:void(0)" onClick={(e) => { this.showPricingModal(true) }} > */}
                                    <Link to={"/set-prices" + this.props.whiteLabelInfo.route_uri}>
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Set Prices</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </Link>
                                    {/* </a> */}
                                    <div className="middle">
                                        {/* <WhiteLabelPricing
                                            showPricingModal={this.showPricingModal}
                                            pricing_modal={this.state.pricing_modal}
                                            LabelName={this.props.whiteLabelInfo.name}
                                            saveIDPrices={this.props.saveIDPrices}
                                            whitelabel_id={this.props.whiteLabelInfo.id}
                                            setPackage={this.props.setPackage}
                                            prices={this.props.prices}
                                            setPrice={this.props.setPrice}
                                            isPriceChanged={this.props.isPriceChanged}
                                            resetPrice={this.props.resetPrice}

                                        /> */}
                                    </div>
                                </div>
                            </div>

                        </Col>
                        {/* <Col xs={24} sm={24} md={6} lg={6} xl={6} onClick={() => this.refs.loadidsofModal.getWrappedInstance().showModal(this.props.whiteLabelInfo)}>
                            <div>
                                <div>
                                    <a href="javascript:void(0)">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Load ID's</h2>
                                                <Divider className="mb-0" />
                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </a>
                                </div>
                            </div>
                        </Col> */}
                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                            <div>
                                <div className="contenar">
                                    {/* <a href="javascript:void(0)" onClick={(e) => { this.showPricingModal(true) }} > */}
                                    <Link to={"/manage-domains" + this.props.whiteLabelInfo.route_uri}>
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Manage Domains</h2>
                                                <Divider className="mb-0" />

                                            </div>
                                            <Button type="primary" size="small" className="open_btn1">Open</Button>
                                        </Card>
                                    </Link>
                                </div>
                            </div>

                        </Col>
                    </Row>
                    <LoadIDsModal ref="loadidsofModal" />
                    <EditByodApk
                        whiteLabelInfo={this.props.whiteLabelInfo}

                        editBYODModal={this.editBYODModal}
                        edit_modal={this.state.edit_byod_modal}
                        editWhiteLabelInfo={this.props.editWhiteLabelInfo}
                        getWhiteLabelInfo={this.getWhiteLabelInfo}
                        showBYODModal={this.showBYODModal}
                        type={this.state.byod_type}
                    />
                </div>

            </div>

        );

    }
}

// export default Account;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWhiteLabelInfo: getWhiteLabelInfo,
        editWhiteLabelInfo: editWhiteLabelInfo,
        getWhitelabelBackups: getWhitelabelBackups,
        getFile: getFile,
        saveIDPrices: saveIDPrices,
        setPackage: setPackage,
        getPrices: getPrices,
        setPrice: setPrice,
        resetPrice: resetPrice,
        saveBackup: saveBackup
    }, dispatch);
}

var mapStateToProps = ({ whiteLabels }, otherProps) => {
    // console.log(whiteLabels.whiteLabel);
    return {
        whiteLabelInfo: whiteLabels.whiteLabel,
        whitelabelBackups: whiteLabels.whitelabelBackups,
        prices: whiteLabels.prices,
        isPriceChanged: whiteLabels.isPriceChanged,
        backupLoading: whiteLabels.backupLoading,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(WhiteLabels);