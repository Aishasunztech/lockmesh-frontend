import React, { Component } from 'react';
import TimezonePicker from 'react-timezone';

import { Modal, Button, Form, Input, message, Select } from 'antd';
import { Button_submit, Button_Cancel, Button_Ok } from '../../../constants/ButtonConstants';
import { convertToLang, getTimezonesList, checkIsArray } from '../../utils/commonUtils';
import { ENTER_NEW_PASSWORD, ENTER_CURRENT_PASSWORD, CONFIRM_NEW_PASSWORD, CURRENT_PASSWORD, CONFIRM_PASSWORD, NEW_PASSWORD } from '../../../constants/Constants';
import { CHANGE_PASSWORD } from '../../../constants/ActionTypes';
// import { BASE_URL } from "../../../constants/Application";
import moment from 'moment';
const confirm = Modal.confirm;

export default class ChangeTimeZone extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            selected_tz: '',
            handleSubmitBtn: true
        }
    }

    componentDidMount() {
        this.state.selected_tz = this.props.profile.timezone;
    }

    componentDidUpdate(prevProps) {
        if (this.props.profile.timezone !== prevProps.profile.timezone) {
            this.setState({
                selected_tz: this.props.profile.timezone
            })
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleTimezone = (e) => {
        // console.log("handle handleTimezone:: ", e, this.props.profile.timezone, localStorage.getItem("timezone"));

        let submitBtn = true;
        if (e !== this.props.profile.timezone) {
            submitBtn = false;
        }
        this.setState({ selected_tz: e, handleSubmitBtn: submitBtn });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log("handle submit", this.state.selected_tz);
        if (this.state.selected_tz) {

            // const title = convertToLang(this.props.translation[""], "Are you sure, you want to change the timezone ?");
            // let _this = this;
            showConfirm(this);

        }
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            handleSubmitBtn: true
        });
    }

    render() {
        const { visible } = this.state;
        let tz_data = getTimezonesList();
        return (
            <div>
                <Modal
                    visible={visible}
                    title={convertToLang(this.props.translation[""], "Change Timezone")}
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>,
                        <Button key="submit" type="primary" onClick={this.handleSubmit} disabled={this.state.handleSubmitBtn}>
                            {convertToLang(this.props.translation[Button_submit], "Submit")}
                        </Button>,
                    ]}
                >
                    <Select
                        value={this.state.selected_tz ? this.state.selected_tz : moment.tz.guess()}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: '100%' }}
                        placeholder={convertToLang(this.props.translation[""], "Select Timezone...")}
                        onChange={this.handleTimezone}
                    >
                        {checkIsArray(tz_data).map(item => <Select.Option key={item.zoneName} value={item.zoneName} >{`${item.tzOffset} ${item.zoneName}`}</Select.Option>)}
                    </Select>
                </Modal>
            </div>
        )
    }
}

function showConfirm(_this) {
    confirm({
        title: convertToLang(_this.props.translation[""], "Are you sure, you want to change the timezone ?"),
        content: '',
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onOk: (() => {
            _this.props.changeTimeZone(_this.state.selected_tz);
            _this.handleCancel();
        }),
        onCancel() { },
    });
}