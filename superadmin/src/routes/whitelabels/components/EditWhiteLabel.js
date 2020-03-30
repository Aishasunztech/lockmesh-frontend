import React, { Component } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider } from "antd";
import { SECURE_LAUNCHER, SC, BYOD, LAUNCHER_TYPE, SCS_TYPE, BYOD_TYPE, BYOD7_TYPE } from '../../../constants/Constants';
import { USER_URL } from "../../../constants/Application";
import styles from '../whitelabels.css';

const success = Modal.success;
const error = Modal.error;
let apk = '';
let ScApk = '';
// var EditWhiteLabel = (props) => {
class EditWhiteLabel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            disableApk: false,
            disableScApk: false,
            command_name: this.props.whiteLabelInfo.command_name,
        }
    }
    apk = this.props.whiteLabelInfo.apk_file;

    makeCommand = (value) => {

        this.props.form.setFieldsValue({ ['command_name']: '#' + value.replace(/ /g, '_') })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('values', values, apk)
                let apk_files = [];
                if (apk !== '') {
                    apk_files.push({ apk: apk, apk_type: LAUNCHER_TYPE })
                }

                if (ScApk !== '') {
                    apk_files.push({ apk: ScApk, apk_type: SCS_TYPE })
                }

                let form_data = {
                    'id': this.props.whiteLabelInfo.id,
                    'model_id': values.model_id,
                    'command_name': values.command_name,
                    'apk_files': apk_files,
                    // 'apk_type': this.props.type
                    // 'apk': apk,
                    // 'sc_apk': ScApk
                }

                console.log(form_data, 'form data', this.props.whiteLabelInfo)
                // console.log(form_data);
                // this.props.editApk(form_data);
                this.props.editWhiteLabelInfo(form_data);
                this.props.getWhiteLabelInfo(this.props.whiteLabelInfo.id);
                this.props.editInfoModal(false);
                this.props.showInfoModal(false);

                this.setState({
                    disableApk: false,
                    disableScApk: false
                })
                //  console.log(values);
            }
            else {
                console.log('error', err, values)
            }
        });
    }

    render() {

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
                md: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 12 },
            },
        };

        let token = localStorage.getItem('token');

        let _this = this;
        const uploadApkProps = {
            name: 'launcher_apk',
            multiple: false,
            action: USER_URL + 'upload/launcher_apk',
            headers: { 'authorization': token },
            accept: '.apk',
            disabled: this.state.disableApk,
            // fileList: this.state.fileList2,
            className: 'upload-list-inline',
            listType: 'picture',
            onRemove(info) {
                // document.getElementById('apkSize').style.display = 'none'
                _this.setState({ disableApk: false });
                apk = '';
            },
            beforeUpload(file) {
                _this.setState({ disableApk: true });
            },
            onChange(info) {
                const status = info.file.status;
                let fileList2 = [...info.fileList];
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response.status !== false) {
                        // console.log(info.file.response);

                        if (info.file.response.fileName !== '') {
                            apk = info.file.response.fileName;
                            console.log(info, 'apk name', apk);
                            // packageName = info.file.response.packageName;
                            // size = info.file.response.size
                            // versionCode = info.file.response.versionCode;
                            // versionName = info.file.response.versionName;
                            // details = info.file.response.details;

                        }
                        success({
                            title: info.file.response.msg,
                        });
                        _this.setState({ disableApk: true });
                        // document.getElementById('apkSize').style.display = 'block'
                    }
                    else {
                        error({
                            title: info.file.response.msg,
                        });
                        fileList2 = []
                        _this.setState({ disableApk: false });
                        // document.getElementById('apkSize').style.display = 'none'
                    }

                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList2 });
            },
        };

        const uploadSCApkProps = {
            name: 'sc_apk',
            multiple: false,
            action: USER_URL + 'upload/sc_apk',
            headers: { 'authorization': token },
            accept: '.apk',
            disabled: this.state.disableScApk,
            // fileList: this.state.fileList2,
            className: 'upload-list-inline',
            listType: 'picture',
            onRemove(info) {
                // document.getElementById('apkSize').style.display = 'none'
                _this.setState({ disableScApk: false });
                ScApk = ''
            },
            beforeUpload(file) {
                _this.setState({ disableScApk: true });
            },
            onChange(info) {
                const status = info.file.status;
                let fileList2 = [...info.fileList];
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response.status !== false) {
                        // console.log(info.file.response);

                        if (info.file.response.fileName !== '') {
                            ScApk = info.file.response.fileName;
                            console.log(info, 'apk name', ScApk);
                            // packageName = info.file.response.packageName;
                            // size = info.file.response.size
                            // versionCode = info.file.response.versionCode;
                            // versionName = info.file.response.versionName;
                            // details = info.file.response.details;

                        }
                        success({
                            title: info.file.response.msg,
                        });
                        _this.setState({ disableScApk: true });
                        // document.getElementById('apkSize').style.display = 'block'
                    }
                    else {
                        error({
                            title: info.file.response.msg,
                        });
                        fileList2 = []
                        _this.setState({ disableScApk: false });
                        // document.getElementById('apkSize').style.display = 'none'
                    }

                } else if (status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList2 });
            },
        };
        // console.log(this.state.command_name, 'apk', this.props.whiteLabelInfo)

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                // title="WhiteLabel Info"
                visible={this.props.edit_modal}
                // onOk={this.InsertNewData}
                onCancel={() => { this.props.editInfoModal(false); this.setState({ disableApk: false, disableScApk: false }) }}
                footer={null}
            // okButtonProps={{
            //     disabled: this.state.newData.length ? false : true
            // }}
            >
                <p>(*)- Required Fields</p>
                <Form
                    onSubmit={this.handleSubmit}
                >

                    <Form.Item
                        {...formItemLayout}
                        label="Model ID"
                        className="upload_file"
                    >
                        {this.props.form.getFieldDecorator('model_id',
                            {
                                initialValue: this.props.whiteLabelInfo.model_id,
                                rules: [
                                    {
                                        required: true, message: 'Model ID is required',
                                    },
                                ],
                            })(
                                <Input onChange={(e) => this.makeCommand(e.target.value)} />
                            )}
                    </Form.Item>

                    <Form.Item
                        {...formItemLayout}
                        label="Command"
                        className="upload_file"
                    >
                        {this.props.form.getFieldDecorator('command_name',
                            {
                                initialValue: this.props.whiteLabelInfo.command_name,

                            })(
                                <Input disabled />
                            )}
                    </Form.Item>

                    <Form.Item
                        label="Apk file"
                        className="upload_file"
                        {...formItemLayout}
                    >
                        <div className="dropbox">
                            {this.props.form.getFieldDecorator('apk', {
                                rules: [
                                    {
                                        required: false, message: 'File is required',
                                    },
                                ],

                            })(
                                <Upload  {...uploadApkProps} >
                                    <Button className="width_100 upload_btn" type="default" >
                                        <Icon type="folder-open" /> UPLOAD APK FILE
                                    </Button>
                                </Upload>
                            )}
                        </div>
                    </Form.Item>


                    <Form.Item
                        label="SC Apk file"
                        className="upload_file"
                        {...formItemLayout}
                    >
                        <div className="dropbox">
                            {this.props.form.getFieldDecorator('sc_apk', {
                                rules: [
                                    {
                                        required: false, message: 'File is required',
                                    },
                                ],

                            })(
                                <Upload  {...uploadSCApkProps} >
                                    <Button className="width_100 upload_btn" type="default" >
                                        <Icon type="folder-open" /> UPLOAD APK FILE
                                    </Button>
                                </Upload>
                            )}
                        </div>
                    </Form.Item>
                    {/* <Form.Item label="Apk size:" className="upload_file" >
                        <div>
                            <h5 className="apk_size">{size}</h5>
                        </div>
                    </Form.Item> */}
                    <Row className='modal_footer'>
                        <div className='modal_footer'>
                            <Button key="back" style={{ marginBottom: 0, marginTop: 16 }} className='submitButton' onClick={() => this.props.editInfoModal(false)}>Cancel</Button>
                            <Button className='submitButton' style={{ marginBottom: 0, marginTop: 16 }} type="primary" htmlType="submit" >Update</Button>
                        </div>
                    </Row>
                </Form>
            </Modal>

        )
    }
}

EditWhiteLabel = Form.create()(EditWhiteLabel);

export default EditWhiteLabel;