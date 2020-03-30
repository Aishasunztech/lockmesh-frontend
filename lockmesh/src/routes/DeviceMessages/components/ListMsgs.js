import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col, Tag, Modal } from "antd";
import { convertToLang, checkValue, checkTimezoneValue, checkIsArray, checkDate } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import moment from 'moment';
import ReadMoreAndLess from 'react-read-more-less';
import CustomScrollbars from "../../../util/CustomScrollbars";
import { userDevicesListColumns } from '../../utils/columnsUtils';
import { TIMESTAMP_FORMAT_NOT_SEC, TIME_FORMAT_HM, SERVER_TIMEZONE, HOST_NAME, TIMESTAMP_FORMAT } from '../../../constants/Application';
import EditMsgModal from './EditMsgForm';
import styles from './deviceMsg.css'

export default class ListMsgs extends Component {

    constructor(props) {
        super(props);
        let selectedDevicesColumns = userDevicesListColumns(props.translation, this.handleSearch);
        let dealerTZ = checkTimezoneValue(props.user.timezone, false);
        this.state = {
            selectedDevicesColumns: selectedDevicesColumns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
            searchText: '',
            columns: [],
            expandedRowKeys: [],
            visible: false,
            editRecord: null,
            editModal: false,
            dealerTZ: dealerTZ
        };
        this.renderList = this.renderList.bind(this);
        this.confirm = Modal.confirm;
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns
            })
        }
    }

    deleteMsg = id => {

        this.confirm({
            title: "Do you want to delete this message ?",
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.deleteBulkMsg(id);
            }),
            onCancel() { },
        });

    }

    handleEditModal = (data) => {
        let editDateTime = data.date_time;
        let currentDateTime = moment().tz(this.state.dealerTZ).format(TIMESTAMP_FORMAT);
        if (currentDateTime > editDateTime && data.timer_status === "DATE/TIME") {
            Modal.warning({
                title: 'This message time is passed',
                content: 'You are not allowed to change this message settings.'
            });
        } else {
            this.setState({ editModal: true, editRecord: data })
        }
    }

    renderList(list) {
        let bulkMsgs = [];
        list.map((item) => {
            let parseDevices = item.devices ? JSON.parse(item.devices) : [];

            // set default dateTime format
            let dateTimeFormat = TIMESTAMP_FORMAT_NOT_SEC;
            if (item.timer_status === "REPEAT") {
                // set dateTime format
                dateTimeFormat = TIME_FORMAT_HM; // Display only hours and minutes
            }

            let data = {
                rowKey: item.id,
                id: item.id,
                action: (
                    <div data-column="ACTION" style={{ display: "inline-flex" }}>
                        <Fragment>
                            {(!item.timer_status || item.timer_status === "NOW") ? null : // edit button hide if timer_status is NOW or not defined
                                <Fragment>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => this.handleEditModal(JSON.parse(JSON.stringify(item)))}
                                    >EDIT</Button>
                                </Fragment>}
                            <Fragment><Button type="danger" size="small" onClick={() => this.deleteMsg(item.id)}>DELETE</Button></Fragment>
                        </Fragment>
                    </div>
                ),
                send_to: parseDevices.length,
                msg: (
                    <ReadMoreAndLess
                        ref={this.ReadMore}
                        className="read-more-content"
                        charLimit={250}
                        readMoreText=" Read more"
                        readLessText=" Read less"
                    >
                        {checkValue(item.msg)}
                    </ReadMoreAndLess>
                ),
                timer_status: item.timer_status ? item.timer_status : "N/A",
                repeat: item.repeat_duration ? item.repeat_duration : "NONE",
                date_time: checkDate(item.date_time) ? moment(item.date_time).format(dateTimeFormat) : "N/A",
                interval_description: item.interval_description,
                devices: parseDevices,
            }
            bulkMsgs.push(data)
        });
        return bulkMsgs
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    onExpandRow = (expanded, record) => {
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.rowKey)) {
                this.state.expandedRowKeys.push(record.rowKey);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.rowKey)) {
                let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.rowKey)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    handleEditMsgModal = (visible) => {
        this.setState({ editModal: visible })
    }

    render() {
        return (
            <Fragment>
                <Card className='fix_card fix_msgList_card'>
                    <hr className="fix_header_border" style={{ top: "77px" }} />
                    <CustomScrollbars className="gx-popover-scroll ">
                        <Table
                            className="gx-table-responsive msgList"
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                            expandIcon={(props) => this.customExpandIcon(props)}
                            expandedRowRender={(record) => {
                                return (
                                    <Fragment>
                                        <Table
                                            style={{ margin: 10 }}
                                            size="middle"
                                            bordered
                                            columns={this.state.selectedDevicesColumns}
                                            // onChange={this.props.onChangeTableSorting}
                                            dataSource={this.props.renderDevicesList(record.devices)}
                                            pagination={false}
                                            scroll={{ x: true }}
                                        />
                                    </Fragment>
                                );
                            }}
                            onExpand={this.onExpandRow}
                            expandIconColumnIndex={2}
                            expandIconAsCell={false}
                            size="midddle"
                            bordered
                            columns={this.state.columns}
                            dataSource={this.renderList(this.props.bulkMsgs ? this.props.bulkMsgs : [])}
                            // onChange={this.props.onChangeTableSorting}
                            pagination={false
                            }
                            // scroll={{ x: true }}
                            rowKey="domain_id"
                        />
                    </CustomScrollbars>
                </Card>
                <EditMsgModal
                    editModal={this.state.editModal}
                    handleEditMsgModal={this.handleEditMsgModal}
                    updateBulkMsgAction={this.props.updateBulkMsgAction}
                    user={this.props.user}
                    editRecord={this.state.editRecord}
                    // ref='edit_msg_form'
                    translation={this.props.translation}
                />
            </Fragment>
        )
    }
}
