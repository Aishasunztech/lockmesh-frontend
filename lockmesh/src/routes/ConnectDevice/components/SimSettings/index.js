import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar, Button, Icon, Modal } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleSimUpdate,
    simRegister,
    simHistory,
    getSims,
    deleteSim,
    getUnRegisterSims,
    endLoading
} from "../../../../appRedux/actions/ConnectDevice";
import { ENABLE, ENCRYPT, Guest, ENCRYPTED, IN_APP_MENU_DISPLAY } from '../../../../constants/TabConstants';
import { checkValue, convertToLang } from '../../../utils/commonUtils';
import { Button_Add, Button_Cancel, Button_Edit, Button_Yes, Button_No, Button_Delete } from '../../../../constants/ButtonConstants';
import AddRegistrationModal from './AddRegistrationModal';
import EditRegistrationModal from './EditRegistrationModal';
import { ACTION, Enable_ALL } from '../../../../constants/Constants';
import { ICC_ID, SIM_NAME, NOTE, DATA_LIMIT, ALERT_DELETE_REGISTERED_SIM, UNREGISTERED, REGISTERED, REGISTERED_SIM_CARDS, STATUS } from '../../../../constants/DeviceConstants';

let status = true;

class SimSettings extends Component {

    constructor(props) {
        super(props)
        const columns = [
            {
                title: "#",
                dataIndex: 'counter',
                key: 'counter',
                render: (text, record, index) => ++index,
            },
            {
                title: convertToLang(props.translation[ACTION], "Actions"),
                dataIndex: 'actions',
                key: 'actions',
                // render: (text, record, index) => ++index,
            },
            {
                title: convertToLang(props.translation[ICC_ID], "ICC-ID"),
                dataIndex: 'iccid',
                key: 'iccid',
            },
            // {
            //     title: convertToLang(props.translation[SEARCH], "Sim ")"Sim Slot",
            //     dataIndex: 'slot',
            //     key: 'slot',
            // },
            {
                title: convertToLang(props.translation[SIM_NAME], "Sim Name"),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: convertToLang(props.translation[STATUS], "Status"),
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: convertToLang(props.translation[NOTE], "Note"),
                dataIndex: 'note',
                key: 'note',
            }, {
                title: convertToLang(props.translation[Guest], "Guest"),
                dataIndex: 'guest',
                key: 'guest',
            }, {
                title: convertToLang(props.translation[ENCRYPT], "Encrypt"),
                dataIndex: 'encrypt',
                key: 'encrypt',
            }, {
                title: convertToLang(props.translation[DATA_LIMIT], "Data Limit"),
                dataIndex: 'dataLimit',
                key: 'dataLimit',
            }
        ];

        this.state = {
            columns: columns,
            extension: {},
            uniqueName: '',
            addSimRegistrationModal: false,
            historyModal: false,
            sim: {},
            visible: false,
            guestAllExt: 0,
            encryptedAllExt: 0,
            unrGuest: 0,
            unrEncrypt: 0,

            guestSimAll: true,
            encryptSimAll: true,
        }

        this.confirm = Modal.confirm;
        this.handleDeleteSim = this.handleDeleteSim.bind(this);
    }

    componentDidMount() {
        this.props.getSims(this.props.deviceID);
        this.props.simHistory(this.props.deviceID);

        this.setState({
            guestSimAll: this.props.guestSimAll,
            encryptSimAll: this.props.encryptSimAll,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.simUpdated !== nextProps.simUpdated) {
            this.props.getSims(nextProps.deviceID);
            status = true;
        }
        // console.log( "RECEIVER" ,nextProps.sim_list)
        if (this.props.sim_list !== nextProps.sim_list) {
            this.setState({

            })
        }

        if (this.props.guestSimAll !== nextProps.guestSimAll || this.props.encryptSimAll !== nextProps.encryptSimAll) {
            this.setState({
                guestSimAll: nextProps.guestSimAll,
                encryptSimAll: nextProps.encryptSimAll,
            })
        }

    }

    handleSimModal = () => {
        this.refs.add_sim_reg.showModal();
        // this.props.getSims(this.props.deviceID);
        this.props.getUnRegisterSims(this.props.deviceID);
    }

    handleChecked = (e, obj, label, checkAll = false) => {
        obj[label] = e ? 1 : 0;
        // console.log('status ', status);
        if (checkAll) {
            if (label === "guest") {
                this.setState({
                    guestSimAll: e
                })
            } else if (label === "encrypt") {
                this.setState({
                    encryptSimAll: e
                })
            }
        }
        // if (status) {
        this.props.handleSimUpdate({ obj, label, value: e });
        status = false;
        // }
    }

    setDataLimit = () => {
        console.log('set data limit')
    }
    handleDeleteSim = (sim) => {
        this.confirm({
            title: convertToLang(this.props.translation[ALERT_DELETE_REGISTERED_SIM], "Are you sure you want to delete Registered Sim?"),
            content: '',
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk: () => {
                this.props.deleteSim(sim);
            },
            onCancel() { },
        });
    }

    handleEditSim = (sim) => {
        this.refs.edit_sim_reg.showModal(sim);
    }

    renderSimList = () => {

        let sims = this.props.sim_list;
        // console.log("render list sims", sims);
        if (sims !== undefined && sims !== null && sims.length > 0) {

            return sims.map((sim, index) => {
                let EditBtn = <Button type="default" size="small" onClick={() => this.handleEditSim(sim)}> {convertToLang(this.props.translation[Button_Edit], "EDIT")}  </Button>;
                let DeleteBtn = <Button type="danger" size="small" onClick={() => this.handleDeleteSim(sim)}> {convertToLang(this.props.translation[Button_Delete], "DELETE")} </Button>;

                return {
                    key: index,
                    counter: ++index,
                    actions: (<Fragment><Fragment>{EditBtn}</Fragment><Fragment>{DeleteBtn}</Fragment></Fragment>),
                    iccid: checkValue(sim.iccid),
                    name: checkValue(sim.name),
                    status: checkValue(sim.status),
                    note: checkValue(sim.note),
                    guest: <Switch
                        checked={(sim.guest) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "guest")}
                    />,
                    encrypt: <Switch
                        checked={(sim.encrypt) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "encrypt")}
                    />,
                    dataLimit: 'N/A', // ((sim.data_limit == "" || sim.data_limit == 0 || sim.data_limit == '0') ? <Button type="danger" onClick={this.setDataLimit}>Set</Button> : sim.data_limit),
                }
            })
        }
    }
    render() {
        let {
            unrGuest,
            unrEncrypt,
            sim_list,
        } = this.props;

        let {
            guestSimAll,
            encryptSimAll,
        } = this.state;
        // console.log('sim list is ', sim_list);
        return (
            <div>
                <Fragment>
                    <Row className="">

                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>{convertToLang(this.props.translation[Enable_ALL], "Enable All")} <small>({convertToLang(this.props.translation[UNREGISTERED], "Unregistered")})</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "unrAll",
                                    device_id: this.props.deviceID,
                                    unrEncrypt: unrEncrypt ? 1 : 0,
                                    unrGuest: unrGuest ? 1 : 0,  // extra
                                }, "unrGuest");
                            }}
                                checked={unrGuest ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "unrAll",
                                    device_id: this.props.deviceID,
                                    unrGuest: unrGuest ? 1 : 0,
                                    unrEncrypt: unrEncrypt ? 1 : 0, // extra
                                }, "unrEncrypt");
                            }}
                                checked={unrEncrypt ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>{convertToLang(this.props.translation[Enable_ALL], "Enable All")} <small>({convertToLang(this.props.translation[REGISTERED], "Registered")})</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "all",
                                    device_id: this.props.deviceID,
                                }, "guest", true);
                            }}
                                checked={guestSimAll ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "all",
                                    device_id: this.props.deviceID,
                                    // iccid: sim_list ? sim_list[0].iccid : '',
                                }, "encrypt", true);
                            }}
                                checked={encryptSimAll ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                    <br />

                    <Row>
                        <Col span={20}>
                            <h2>{convertToLang(this.props.translation[REGISTERED_SIM_CARDS], "Registered Sim Cards")}</h2>
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                onClick={this.handleSimModal}
                            >
                                <Icon type="folder-add" />
                                {convertToLang(this.props.translation[Button_Add], "Add")}
                            </Button>
                        </Col>

                    </Row>
                    <br />
                    {/* <div className="sec_set_table"> */}
                    <div className="">
                        <Table
                            dataSource={this.renderSimList()}
                            columns={this.state.columns}
                            pagination={false}
                            bordered
                            scroll={{ x: true }}
                        />
                    </div>

                    <AddRegistrationModal
                        ref="add_sim_reg"
                        simRegister={this.props.simRegister}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        unRegSims={this.props.unRegSims}
                        total_dvc={this.props.sim_list}
                        simloading={this.props.simloading}
                        endLoading={this.props.endLoading}
                    />
                    <EditRegistrationModal
                        ref="edit_sim_reg"
                        handleSimUpdate={this.props.handleSimUpdate}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        unRegSims={this.props.unRegSims}
                        total_dvc={this.props.sim_list}
                    />

                </Fragment>
            </div>

        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleSimUpdate: handleSimUpdate,
        simRegister: simRegister,
        simHistory: simHistory,
        deleteSim: deleteSim,
        getSims: getSims,
        getUnRegisterSims: getUnRegisterSims,
        endLoading: endLoading
    }, dispatch);
}


var mapStateToProps = ({ device_details }) => {
    // console.log(device_details.sim_list, ' device_details.unrGuest ')
    return {
        encryptSimAll: device_details.encryptSimAll,
        guestSimAll: device_details.guestSimAll,
        unrGuest: device_details.unrGuest,
        unrEncrypt: device_details.unrEncrypt,
        simUpdated: device_details.simUpdated,
        sim_list: device_details.sim_list,
        device: device_details.device,
        simHistoryList: device_details.simHistoryList,
        unRegSims: device_details.unRegSims,
        simloading: device_details.simloading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimSettings);