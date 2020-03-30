import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal, Alert } from 'antd';
import { convertToLang, checkTimezoneValue, convertTimezoneValue, getWeekDays, getMonthNames, getDaysOfMonth, checkIsArray } from '../../utils/commonUtils'
import { Button_Cancel } from '../../../constants/ButtonConstants';
import FilterDevices from './filterDevices'
import BulkSendMsgConfirmation from './bulkSendMsgConfirmation';
import moment from 'moment';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error
const { TextArea } = Input;


class SendMsgForm extends Component {

    constructor(props) {
        super(props);

        this.durationList = [
            { key: 'DAILY', value: "Daily" },
            { key: 'WEEKLY', value: "Weekly" },
            { key: 'MONTHLY', value: "Monthly" },
            { key: '3 MONTHS', value: "3 Months" },
            { key: '6 MONTHS', value: "6 Months" },
            { key: '12 MONTHS', value: "12 Months" },
        ];

        let dealerTZ = checkTimezoneValue(this.props.user.timezone, false); // withGMT = false

        this.state = {
            weekDays: getWeekDays(),
            monthNames: getMonthNames(),
            monthDays: getDaysOfMonth(),
            visible: false,
            filteredDevices: [],
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            allUsers: [],
            allDealers: [],
            selectedAction: 'NONE',
            selected_dateTime: null,
            selected_Time: '',
            isNowSet: false,
            repeat_duration: 'NONE',
            timer: '',
            monthDate: 0,
            dealerTZ: dealerTZ,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                let monthDate = values.monthDate ? values.monthDate : 0;
                let weekDay = values.weekDay ? values.weekDay : 0;
                let monthName = values.monthName ? values.monthName : 0;

                if (this.state.selectedDealers.length || this.state.selectedUsers.length) {
                    if (this.props.selectedDevices && this.props.selectedDevices.length) {

                        let dealerTZ = this.state.dealerTZ;
                        let repeatVal = 'NONE';
                        let dateTimeVal = '';

                        if (this.state.timer === "DATE/TIME") {
                            dateTimeVal = this.state.selected_dateTime;
                        } else if (this.state.timer === "REPEAT") {
                            repeatVal = this.state.repeat_duration;

                            let currentDateIs = moment().tz(dealerTZ).format(TIMESTAMP_FORMAT);
                            // covert time to dateTime value
                            if (this.state.selected_Time) {
                                const [hours, minutes] = this.state.selected_Time.split(':');

                                if (repeatVal === "DAILY") { // set minutes, hrs
                                    dateTimeVal = moment().tz(dealerTZ).set({ hours, minutes }).format(TIMESTAMP_FORMAT);

                                    if (dateTimeVal < currentDateIs) {
                                        // next same week day if current date passed
                                        dateTimeVal = moment().tz(dealerTZ).add(1, 'days').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                    }
                                }
                                else if (repeatVal === "WEEKLY") { // set minutes, hrs and day name of week 
                                    dateTimeVal = moment().tz(dealerTZ).day(weekDay).set({ hours, minutes }).format(TIMESTAMP_FORMAT);

                                    if (dateTimeVal < currentDateIs) {
                                        // next same week day if current date passed
                                        dateTimeVal = moment().tz(dealerTZ).day(weekDay + 7).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                    }
                                }
                                else if (repeatVal === "MONTHLY" || repeatVal === "3 MONTHS" || repeatVal === "6 MONTHS") { // set minutes, hrs and day of month 
                                    dateTimeVal = moment().tz(dealerTZ).set({ "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT)

                                    if (dateTimeVal < currentDateIs) {
                                        // set next months with same date if current date passed
                                        if (repeatVal === "MONTHLY") {
                                            dateTimeVal = moment().tz(dealerTZ).add(1, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                        }
                                        else if (repeatVal === "3 MONTHS") {
                                            dateTimeVal = moment().tz(dealerTZ).add(3, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                        }
                                        else if (repeatVal === "6 MONTHS") {
                                            dateTimeVal = moment().tz(dealerTZ).add(6, 'months').set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                        }
                                    }
                                }
                                else if (repeatVal === "12 MONTHS") { // set minutes, hrs, day of month and name of month
                                    dateTimeVal = moment().tz(dealerTZ).set({ "month": monthName - 1, "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT);

                                    if (dateTimeVal < currentDateIs) {
                                        // set next year with same date if current date passed 
                                        dateTimeVal = moment().tz(dealerTZ).add(1, 'years').set({ "date": monthDate, hours, minutes }).format(TIMESTAMP_FORMAT);
                                    }

                                } else {
                                    dateTimeVal = moment().tz(dealerTZ).set({ hours, minutes }).format(TIMESTAMP_FORMAT);
                                }
                            }
                        }

                        let data = {
                            devices: this.props.selectedDevices,
                            dealers: this.state.selectedDealers,
                            users: this.state.selectedUsers,
                            msg: values.msg_txt,
                            timer: values.timer,
                            repeat: repeatVal,
                            dateTime: convertTimezoneValue(this.props.user.timezone, dateTimeVal, true),
                            weekDay,
                            monthDate,
                            monthName,
                            time: this.state.selected_Time,
                        }
                        this.refs.bulk_msg.handleBulkSendMsg(data, dealerTZ);
                    } else {
                        error({
                            title: `You have not selected any device against selected dealers/users!`,
                        });
                    }
                } else {
                    error({
                        title: `Sorry, You have not selected any device to perform an action, to add devices please select dealers/users`,
                    });
                }
            }

        });
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
            this.setState({
                filteredDevices: nextProps.devices,
                dealerList: this.props.dealerList
            })
        }

        if (nextProps.users_list && nextProps.dealerList) {
            let allDealers = nextProps.dealerList.map((item) => {
                return ({ key: item.dealer_id, label: `${item.dealer_name} (${item.link_code})` })
            });

            let allUsers = nextProps.users_list.map((item) => {
                return ({ key: item.user_id, label: `${item.user_name} (${item.user_id})` })
            });
            this.setState({ allUsers, allDealers })
        }
    }

    componentDidMount() {
        let allDealers = [];
        let allUsers = [];

        if (this.props.users_list || this.props.dealerList) {
            allDealers = this.props.dealerList.map((item) => {
                return ({ key: item.dealer_id, label: `${item.dealer_name} (${item.link_code})` })
            });

            allUsers = this.props.users_list.map((item) => {
                return ({ key: item.user_id, label: `${item.user_name} (${item.user_id})` })
            });
        }

        this.setState({
            filteredDevices: this.props.devices,
            dealerList: this.props.dealerList,
            allDealers,
            allUsers
        })
    }

    handleMultipleSelect = () => {
        let data = {}

        if (this.state.selectedDealers.length || this.state.selectedUsers.length) {
            data = {
                dealers: this.state.selectedDealers,
                users: this.state.selectedUsers
            }

            this.props.getBulkDevicesList(data);
            this.props.getAllDealers();

        } else {
            this.setState({ filteredDevices: [] });
        }
    }

    handleDeselect = (e, dealerOrUser = '') => {

        if (dealerOrUser == "dealers") {
            let updateDealers = checkIsArray(this.state.selectedDealers).filter(item => item.key != e.key);
            this.state.selectedDealers = updateDealers;
            this.state.checkAllSelectedDealers = false;
        } else if (dealerOrUser == "users") {
            let updateUsers = checkIsArray(this.state.selectedUsers).filter(item => item.key != e.key);
            this.state.selectedUsers = updateUsers;
            this.state.checkAllSelectedUsers = false;
        }

    }
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({ repeat_duration: 'NONE' })
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleCancelSendMsg(false);
        this.setState({
            selectedDealers: [],
            selectedUsers: []
        })
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    handleChangeUser = (values) => {
        let checkAllUsers = this.state.checkAllSelectedUsers
        let selectAll = checkIsArray(values).filter(e => e.key === "all");
        let selectedUsers = checkIsArray(values).filter(e => e.key !== "all");

        if (selectAll.length > 0) {
            checkAllUsers = !this.state.checkAllSelectedUsers;
            if (this.state.checkAllSelectedUsers) {
                selectedUsers = [];
            } else {
                selectedUsers = this.state.allUsers;
            }
        }
        else if (values.length === this.props.users_list.length) {
            selectedUsers = this.state.allUsers
            checkAllUsers = true;
        }

        let data = {
            dealers: this.state.selectedDealers,
            users: selectedUsers
        }
        this.props.getBulkDevicesList(data);
        this.setState({ selectedUsers, checkAllSelectedUsers: checkAllUsers })
    }

    handleChangeDealer = (values) => {
        let checkAllDealers = this.state.checkAllSelectedDealers
        let selectAll = checkIsArray(values).filter(e => e.key === "all");
        let selectedDealers = [];

        if (selectAll.length > 0) {
            checkAllDealers = !this.state.checkAllSelectedDealers;
            if (this.state.checkAllSelectedDealers) {
                selectedDealers = [];
            } else {
                selectedDealers = this.state.allDealers
            }
        }
        else if (values.length === this.props.dealerList.length) {
            selectedDealers = this.state.allDealers
            checkAllDealers = true;
        }
        else {
            selectedDealers = checkIsArray(values).filter(e => e.key !== "all");
        }


        let data = {
            dealers: selectedDealers,
            users: this.state.selectedUsers
        }

        this.props.getBulkDevicesList(data);
        this.setState({
            selectedDealers,
            selectedUsers: [],
            checkAllSelectedDealers: checkAllDealers,
        });

    }

    dateTimeOnChange = (value, dateString) => {
        this.setState({ selected_dateTime: dateString });
    }

    timeOnChange = (value, dateString) => {
        this.setState({ selected_Time: dateString });
    }

    repeatHandler = (e) => {
        this.setState({ repeat_duration: e });
    }

    handleTimer = (e) => {
        this.setState({ timer: e });
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    handleDaysOfMonth = (monthName) => {
        let getDays = getDaysOfMonth(monthName);
        this.props.form.setFieldsValue({ ["monthDate"]: '' }); // reset days of month
        this.setState({ monthDays: getDays, monthDate: 0 });
    }

    disabledDateTime = () => {
        // return {
        //     disabledHours: () => this.range(0, 24).splice(4, 20),
        //     disabledMinutes: () => this.range(30, 60),
        //     disabledSeconds: () => [55, 56],
        // };
    }
    handleMonthDate = (e) => {
        this.setState({ monthDate: e });
    }
    // validateRepeater = async (rule, value, callback) => {
    //     // console.log("values: ", value)
    //     if (value === 'NONE') {
    //         callback("Timer value should not be NONE")
    //     }
    // }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="">
                    <Row gutter={16} className="mt-4">
                        <Col className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select
                                    value={this.state.selectedDealers}
                                    mode="multiple"
                                    labelInValue
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    maxTagCount={this.state.checkAllSelectedDealers ? 0 : 2}
                                    maxTagTextLength={10}
                                    maxTagPlaceholder={this.state.checkAllSelectedDealers ? "All Selected" : `${this.state.selectedDealers.length - 2} more`}
                                    style={{ width: '100%' }}
                                    placeholder={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                                    onChange={this.handleChangeDealer}
                                    onDeselect={(e) => this.handleDeselect(e, "dealers")}
                                >
                                    {(this.state.allDealers && this.state.allDealers.length > 0) ?
                                        <Select.Option key="allDealers" value="all">Select All</Select.Option>
                                        : null
                                    }
                                    {this.state.allDealers.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            {(this.state.selectedDealers && this.state.selectedDealers.length && !this.state.checkAllSelectedDealers) ?
                                <p>Dealers/S-Dealers Selected: <span className="font_26">{this.state.selectedDealers.map((item, index) => <Tag key={index}>{item.label}</Tag>)}</span></p>
                                : null}
                        </Col>

                        <Col className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select Users")}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Select
                                    value={this.state.selectedUsers}
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}// showSearch={false}
                                    mode="multiple"
                                    labelInValue
                                    maxTagCount={this.state.checkAllSelectedUsers ? 0 : 2}
                                    maxTagTextLength={10}
                                    maxTagPlaceholder={this.state.checkAllSelectedUsers ? "All Selected" : `${this.state.selectedUsers.length - 2} more`}
                                    style={{ width: '100%' }}
                                    onDeselect={(e) => this.handleDeselect(e, "users")}
                                    placeholder={convertToLang(this.props.translation[""], "Select Users")}
                                    onChange={this.handleChangeUser}
                                >
                                    {(this.state.allUsers && this.state.allUsers.length > 0) ?
                                        <Select.Option key="allUsers" value="all">Select All</Select.Option>
                                        : null
                                    }
                                    {this.state.allUsers.map(item => <Select.Option key={item.key} value={item.key} >{item.label}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            {(this.state.selectedUsers && this.state.selectedUsers.length && !this.state.checkAllSelectedUsers) ?
                                <p>Users Selected: <span className="font_26">{this.state.selectedUsers.map(item => <Tag>{item.label}</Tag>)}</span></p>
                                : null}
                        </Col>

                    </Row>
                    <Row gutter={16} className="mt-4">
                        <Col className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Select Message Timer")}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {this.props.form.getFieldDecorator('timer', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true, message: convertToLang(this.props.translation[""], "Timer field is required"),
                                        }
                                    ],
                                })(
                                    <Select
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        placeholder={convertToLang(this.props.translation[""], "Select Message Timer")}
                                        onChange={this.handleTimer}
                                    >
                                        <Select.Option key={"NOW"} value={"NOW"}>{"NOW"}</Select.Option>
                                        <Select.Option key={"DATE/TIME"} value={"DATE/TIME"}>{"Date/Time"}</Select.Option>
                                        <Select.Option key={"REPEAT"} value={"REPEAT"}>{"Repeat"}</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col className="col-md-6 col-sm-6 col-xs-12">
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "Message")}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {this.props.form.getFieldDecorator('msg_txt', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            required: true, message: convertToLang(this.props.translation[""], "Message field is required"),
                                        }
                                    ],
                                })(
                                    <TextArea
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16} className="mt-4">
                        {this.state.timer === "REPEAT" ?
                            <Col className="col-md-6 col-sm-6 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Select when to send Message")}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    {this.props.form.getFieldDecorator('repeat', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[""], "Repeat Message field is required"),
                                            },
                                            // {
                                            //     validator: this.validateRepeater,
                                            // },
                                        ],
                                    })(
                                        <Select
                                            showSearch={false}
                                            style={{ width: '100%' }}
                                            placeholder={convertToLang(this.props.translation[""], "Select when to send Message")}
                                            onChange={this.repeatHandler}
                                        >
                                            {this.durationList.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            : null}
                        {this.state.repeat_duration !== "NONE" && this.state.timer === "REPEAT" ?
                            <Fragment>
                                {this.state.repeat_duration === "WEEKLY" ?
                                    <Col className="col-md-6 col-sm-6 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select Day")}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            {this.props.form.getFieldDecorator('weekDay', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Day is Required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch={false}
                                                    style={{ width: '100%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select Day")}
                                                >
                                                    {this.state.weekDays.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    : null}
                                {this.state.repeat_duration === "12 MONTHS" ?
                                    <Col className="col-md-6 col-sm-6 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select Month")}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            {this.props.form.getFieldDecorator('monthName', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Month is Required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    showSearch={false}
                                                    style={{ width: '100%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select Month")}
                                                    onChange={(e) => this.handleDaysOfMonth(e)}
                                                >
                                                    {this.state.monthNames.map((item) => <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    : null}
                                {this.state.repeat_duration !== "DAILY" && this.state.repeat_duration !== "WEEKLY" ?
                                    <Col className="col-md-6 col-sm-6 col-xs-12">
                                        <Form.Item
                                            label={convertToLang(this.props.translation[""], "Select date of month")}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            {this.props.form.getFieldDecorator('monthDate', {
                                                initialValue: "",
                                                rules: [
                                                    {
                                                        required: true, message: convertToLang(this.props.translation[""], "Date of month is required"),
                                                    }
                                                ],
                                            })(
                                                <Select
                                                    setFieldsValue={this.state.monthDate}
                                                    showSearch={false}
                                                    style={{ width: '100%' }}
                                                    placeholder={convertToLang(this.props.translation[""], "Select date of month")}
                                                    onChange={this.handleMonthDate}
                                                >
                                                    {this.state.monthDays.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    : null}

                                <Col className="col-md-6 col-sm-6 col-xs-12">
                                    <Form.Item
                                        label={convertToLang(this.props.translation[""], "Select Time")}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        {this.props.form.getFieldDecorator('time', {
                                            initialValue: '',
                                            rules: [
                                                {
                                                    required: true, message: convertToLang(this.props.translation[""], "Time field is required"),
                                                }
                                            ],
                                        })(
                                            <TimePicker
                                                onChange={this.timeOnChange}
                                                placeholder={"Select time"}
                                                format="HH:mm"
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Fragment>
                            : null}
                    </Row>
                    {this.state.timer === "DATE/TIME" ?
                        <Row gutter={16} className="mt-4">
                            <Col className="col-md-6 col-sm-6 col-xs-12">
                                <Form.Item
                                    label={convertToLang(this.props.translation[""], "Choose Data/Time")}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    {this.props.form.getFieldDecorator('date/time', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[""], "Date/Time field is required"),
                                            }
                                        ],
                                    })(
                                        <DatePicker
                                            onChange={this.dateTimeOnChange}
                                            placeholder="Choose data/time"
                                            style={{ width: '100%' }}
                                            format="YYYY-MM-DD HH:mm"
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledDateTime}
                                            showTime={{ defaultValue: moment('00:00'), format: 'HH:mm' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        : null}

                    <FilterDevices
                        devices={this.state.filteredDevices}
                        selectedDealers={this.state.selectedDealers}
                        selectedUsers={this.state.selectedUsers}
                        handleActionValue={this.state.selectedAction}
                        bulkSuspendDevice={this.props.bulkSuspendDevice}
                        bulkActivateDevice={this.props.bulkActivateDevice}
                        selectedPushAppsList={this.props.selectedPushAppsList}
                        selectedPullAppsList={this.props.selectedPullAppsList}
                        applyPushApps={this.props.applyPushApps}
                        applyPullApps={this.props.applyPullApps}
                        translation={this.props.translation}
                        onChangeTableSorting={this.handleTableChange}
                        selectedDevices={this.props.selectedDevices}
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        unlinkBulkDevices={this.props.unlinkBulkDevices}
                        wipeBulkDevices={this.props.wipeBulkDevices}
                        bulkApplyPolicy={this.props.applyBulkPolicy}
                        selectedPolicy={this.state.selectedPolicy}
                        renderList={this.props.renderList}
                    />
                    <Form.Item className="s_m_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[""], "SEND")} </Button>
                    </Form.Item>

                </Form>
                <BulkSendMsgConfirmation
                    ref="bulk_msg"
                    sendMsgOnDevices={this.props.sendMsgOnDevices}
                    handleCancel={this.handleCancel}
                    translation={this.props.translation}
                />
            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(SendMsgForm);
export default WrappedAddDeviceForm;