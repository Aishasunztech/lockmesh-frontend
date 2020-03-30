import React, { Component, Fragment } from 'react';
import { Modal, message, Button, Table, Input, Select, Row, Col, Form, InputNumber } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkIsArray } from '../../utils/commonUtils';
import WriteImeiFrom from './WriteImeiForm'
import Moment from 'react-moment'
import { MANAGE_IMEI, DEVICE_ID, DEVICE_IMEI_1, IMEI_1_NUMBER, SR_NO, CHANGED_DATE, DEVICE_IMEI_2, IMEI_2_NUMBER, GENERATE_IMEI_NUMBER, WRITE_IMEI_2_TEXT, WRITE_IMEI_1, WRITE_IMEI_2, ORIGNAL, CURRENT } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';

// import EditForm from './editForm';
let editDevice;
var coppyImeis = [];
var status = true;
export default class ImeiView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            dataVisible: false,
            dataFieldName: '',
            imei1List: [],
            imei2List: [],
        }
    }

    getImeiLists() {

        let dumyImei1List = []
        let dumyImei2List = []
        let imei1List = checkIsArray(this.props.imei_list).filter(item => {
            if (dumyImei1List.includes(item.imei1) === false) {
                dumyImei1List.push(item.imei1)
                return item
            }
        })
        let imei2List = checkIsArray(this.props.imei_list).filter(item => {
            if (dumyImei2List.includes(item.imei2) === false) {
                dumyImei2List.push(item.imei2)
                return item
            }
        })
        // console.log(imei2List);
        this.setState({
            imei2List: imei2List,
            imei1List: imei1List,
        })
    }

    showModal = (device, func) => {
        this.getImeiLists()
        editDevice = func;
        this.setState({
            visible: true,
            func: func,

        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.imei_list !== nextProps.imei_list) {
            // console.log('actoin done successfuly')
            this.getImeiLists()
        }
    }

    // showViewmodal = (dataVisible, dataFieldName = "") => {
    //     // console.log(dataVisible);
    //     this.setState({
    //         dataVisible: dataVisible,
    //         dataFieldName: dataFieldName,
    //     });
    // }

    handleCancel = () => {
        this.refs.form1.resetFields();
        this.refs.form2.resetFields();
        this.setState({ visible: false });
    }
    // handlePagination = (value) => {
    //     this.setState({
    //         pagination: value
    //     })
    // }
    handleSearch = (e, dataName) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        let searchData = (fieldName === 'imei1') ? this.state.imei1List : this.state.imei2List
        let searchedData = this.searchField(searchData, fieldName, fieldValue);
        this.setState({
            imei1List: searchedData
        });
    }
    handleComponentSearch = (e, type) => {
        try {
            let value = e.target.value;
            // console.log(status,'searched value', e.target.value)
            if (value.length) {
                // console.log(status,'searched value', value)
                if (status) {
                    // console.log('status')
                    if (type === "imei1") {
                        coppyImeis = this.state.imei1List;
                    } else {
                        coppyImeis = this.state.imei2List;
                    }

                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundImeis = componentSearch(coppyImeis, value);
                //  console.log('found devics', foundImeis)
                if (foundImeis.length) {
                    if (type === "imei1") {
                        this.setState({
                            imei1List: foundImeis,
                        })
                    } else {
                        this.setState({
                            imei2List: foundImeis,
                        })
                    }
                } else {
                    if (type === "imei1") {
                        this.setState({
                            imei1List: [],
                        })
                    } else {
                        this.setState({
                            imei2List: [],
                        })
                    }
                }
            } else {
                status = true;

                if (type === "imei1") {
                    this.setState({
                        imei1List: coppyImeis,
                    })
                } else {
                    this.setState({
                        imei2List: coppyImeis,
                    })
                }
            }

        } catch (error) {
            // console.log('error')
            // alert("hello");
        }
    }
    renderList = (imei_list, type) => {
        var i = 0;
        let imeiLength = imei_list.length
        let data = (type === 'IMEI 1') ? checkIsArray(imei_list).map((device, index) => {
            let imei = (device.imei1 !== 'null') ? device.imei1 : 'N/A'
            if (device.orignal_imei1 === device.imei1) {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: imei + ` (${convertToLang(this.props.translation[ORIGNAL], "ORIGNAL")})`,
                    changed_time: getFormattedDate(device.created_at)
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: (imeiLength === i) ? imei + ` (${convertToLang(this.props.translation[CURRENT], "CURRENT")})` : imei,
                    changed_time: getFormattedDate(device.created_at)
                }
            }
        }) : checkIsArray(imei_list).map((device, index) => {
            let imei = (device.imei2 !== 'null') ? device.imei2 : 'N/A'
            // console.log("original", device, "imei2", device.imei2);
            if (device.orignal_imei2 === device.imei2) {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: imei + ` (${convertToLang(this.props.translation[ORIGNAL], "ORIGNAL")})`,
                    changed_time: getFormattedDate(device.created_at)
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: (imeiLength === i) ? imei + ` (${convertToLang(this.props.translation[CURRENT], "CURRENT")})` : imei,
                    changed_time: getFormattedDate(device.created_at)
                }
            }
        })
        return data;
    }
    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    width='850px'
                    visible={visible}
                    title={
                        <div>
                            <span style={{ position: "absolute", lineHeight: "36px" }}>
                                {convertToLang(this.props.translation[MANAGE_IMEI], "MANAGE IMEI")}</span>
                            <div className="text-center">
                                <Button>
                                    <a href='https://dyrk.org/tools/imei/' target='blank'>
                                        {convertToLang(this.props.translation[GENERATE_IMEI_NUMBER], "Generate IMEI number")}
                                    </a>
                                </Button></div>
                            <span>
                                {`${convertToLang(this.props.translation[DEVICE_ID], "Device ID")}:`}
                                {(this.props.device.id) ? this.props.device.device_id : ''}
                            </span>
                        </div>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    footer={null}
                    className="edit_form"
                    bodyStyle={{ height: 500, overflow: "overlay" }}
                >
                    <Row>
                        <Col span={11} md={11} sm={23} xs={23} className="p-16 imei_col_11" >
                            <WriteImeiFrom
                                ref='form1'
                                buttonText={convertToLang(this.props.translation[WRITE_IMEI_1], "WRITE IMEI 1")}
                                type='IMEI1'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                                getActivities={this.props.getActivities}
                                translation={this.props.translation}

                            />
                            <Fragment>
                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">{convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI 1")}</h4>
                                    </div>
                                    <div className="col-md-9">
                                        <Input.Search
                                            name="imei1"
                                            key="imei1"
                                            id="imei1"
                                            className="search_heading1"
                                            onKeyUp={
                                                (e) => {
                                                    this.handleComponentSearch(e, 'imei1')
                                                }
                                            }
                                            autoComplete="new-password"
                                            placeholder={convertToLang(this.props.translation[IMEI_1_NUMBER], "IMEI 1 NUMBER")}
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={[
                                        {
                                            title: convertToLang(this.props.translation[SR_NO], "No."),
                                            align: "center",
                                            dataIndex: 'tableIndex',
                                            key: "tableIndex",
                                            className: '',
                                            // sorter: (a, b) => { return a.tableIndex.toString().localeCompare(b.tableIndex.toString()) },
                                            // sortDirections: ['ascend', 'descend'],
                                            render: (text, record, index) => ++index,
                                        },
                                        {
                                            title: convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI 1"),
                                            align: "center",
                                            dataIndex: 'imei',
                                            key: "imei",
                                            className: '',
                                            sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: convertToLang(this.props.translation[CHANGED_DATE], "Changed Date"),
                                            align: "center",
                                            dataIndex: 'changed_time',
                                            key: "changed_time",
                                            className: '',
                                            sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                    ]}
                                    bordered
                                    pagination={false}
                                    dataSource={this.renderList(this.state.imei1List, 'IMEI 1')}
                                    scroll={{}}
                                />
                            </Fragment>

                        </Col>
                        <Col span={11} md={11} sm={23} xs={23} className="p-16 imei_col_11 mt-16">
                            <WriteImeiFrom
                                ref='form2'
                                buttonText={convertToLang(this.props.translation[WRITE_IMEI_2], "WRITE IMEI 2")}
                                type='IMEI2'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                                getActivities={this.props.getActivities}
                                translation={this.props.translation}
                            />
                            <Fragment>

                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">{convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI 2")}</h4>
                                    </div>
                                    <div className="col-md-9">
                                        <Input.Search
                                            name="imei2"
                                            key="imei2"
                                            id="imei2"
                                            className="search_heading1"
                                            onKeyUp={
                                                (e) => {
                                                    this.handleComponentSearch(e, 'imei2')
                                                }
                                            }
                                            autoComplete="new-password"
                                            placeholder={convertToLang(this.props.translation[IMEI_2_NUMBER], "IMEI 2 NUMBER")}
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={[
                                        {
                                            title: convertToLang(this.props.translation[SR_NO], "No."),
                                            align: "center",
                                            dataIndex: 'tableIndex',
                                            key: "tableIndex",
                                            className: '',
                                            // sorter: (a, b) => { return a.tableIndex.toString().localeCompare(b.tableIndex.toString()) },
                                            // sortDirections: ['ascend', 'descend'],
                                            render: (text, record, index) => ++index,
                                        },
                                        {
                                            title: convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI 2"),
                                            align: "center",
                                            dataIndex: 'imei',
                                            key: "imei",
                                            className: '',
                                            sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: convertToLang(this.props.translation[CHANGED_DATE], "Changed Date"),
                                            align: "center",
                                            dataIndex: 'changed_time',
                                            key: "changed_time",
                                            className: '',
                                            sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                            sortDirections: ['ascend', 'descend'],
                                        },
                                    ]}
                                    bordered
                                    pagination={false}
                                    dataSource={this.renderList(this.state.imei2List, 'IMEI 2')}
                                    scroll={{}}
                                />
                            </Fragment>
                        </Col>
                    </Row>
                </Modal>

            </div>
        )
    }
}
