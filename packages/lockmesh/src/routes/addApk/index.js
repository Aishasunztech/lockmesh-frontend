import React, { Component } from "react";
// import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
// import Picky from 'react-picky';
import styles from './addapk.css';
import { Link } from 'react-router-dom';
import 'react-picky/dist/picky.css';
import { bindActionCreators } from "redux";
import { BASE_URL } from "../../constants/Application";
import { addApk, getApkList, checkApkName } from "../../appRedux/actions/Apk";

import { Row, Icon, Card, Button, Divider, Form, Input, Upload, Col, message, Modal, Avatar } from 'antd';
import RestService from '../../appRedux/services/RestServices'
import { Button_Save, Button_Cancel } from "../../constants/ButtonConstants";
import { APK_UPLOAD, APK_UPLOAD_FILE, APK_UPLOAD_ICON, APK_NAME, APK_ICON, APK_FILE, APK_SIZE } from "../../constants/ApkConstants";
import { User_Name_require } from "../../constants/Constants";
import { Required_Fields } from "../../constants/DeviceConstants";
import { convertToLang } from '../utils/commonUtils';

// import asyncComponent from "util/asyncComponent";

// console.log('token', token);
const success = Modal.success
const error = Modal.error

let logo = '';
let apk = '';
let size = '';
let packageName = '';

let form_data = '';
let disableLogo = false;
let disableApk = false;
// class AddApk extends Component {
//     render() {

//         return (
//             <div>
//                 <WrappedNormalApkForm
//                     addApk={this.props.addApk}
//                     getApkList={this.props.getApkList}
//                     showUploadModal={this.props.showUploadModal}
//                     ref='uploadForm'
//                 />
//             </div>
//         )
//     }
// }

class AddApk extends Component {

    constructor(props) {

        super(props);
        this.state = {
            canUoload: false,
            fileList: [],
            fileList2: [],
            showUploadModal: false,
            logo: '',
            size: '',
            name: '',
            uploadData: {},
            disableApk: false,
            disableLogo: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {

                form_data = {
                    'logo': logo,
                    'apk': apk,
                    'name': values.name,
                    'size': size
                }

                if (this.props.autoUpdate) {
                    form_data.autoUpdate = true;
                }

                this.props.addApk(form_data)
                this.props.hideUploadApkModal();



                // console.log('hisory',this.props.go_back);
                // this.props.showUploadModal(form_data);
            }
            else {

            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            if (nextProps.resetUploadForm) {
                this.resetUploadForm()
            }
        }
    }

    resetUploadForm = () => {
        this.props.form.resetFields()
        this.setState({
            showUploadModal: false,
            fileList: [],
            fileList2: [],
            disableApk: false,
            disableLogo: false,
            resetUploadForm: false
        })
        size = '';
        // document.getElementById('apkSize').style.display = 'none'
    }


    checkUniqueName = async (rule, value, callback) => {
        const form = this.props.form;
        if (/[^A-Za-z. \d]/.test(value)) {
            callback('Please insert a valid name.');
        } else {

            if (value && value.length) {
                let response = await RestService.checkApkName(value).then((response) => {
                    if (RestService.checkAuth(response.data)) {
                        if (response.data.status) {
                            return true
                        }
                        else {
                            return false
                        }
                    }
                });
                if (response) {
                    callback();
                } else {
                    callback('Please choose a different name');
                }
            }
        }
    };

    validatelogoFile = async (rule, value, callback) => {
        const form = this.props.form;
        if (this.state.fileList.length <= 0) {
            callback('File is required');
        } else {
            callback();
        }
    };

    validateAkpFile = async (rule, value, callback) => {
        const form = this.props.form;
        if (this.state.fileList2.length <= 0) {
            callback('File is required');
        } else {
            callback();
        }
    };


    handleCancel = () => {
        this.setState({
            showUploadModal: false
        })
    }
    showName(e) {
        // console.log(e.target);
    }

    render() {
        // console.log(this.props.translation)
        const { getFieldDecorator } = this.props.form;
        let fileList = [];
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

        // const props changed into logoProps by Usman
        const logoProps = {
            name: 'logo',
            multiple: false,
            action: `${BASE_URL}users/upload?fieldName=logo`,
            headers: { 'authorization': token },
            accept: '.png, .jpg',
            disabled: this.state.disableLogo,
            fileList: this.state.fileList,
            className: 'upload-list-inline',
            listType: 'picture',
            onRemove(info) {
                if (_this.state.fileList.length > 1) {
                    _this.state.fileList.length -= 1;
                } else {
                    _this.setState({ disableLogo: false });
                }
            },
            beforeUpload(file) {
                _this.setState({ disableLogo: true });
            },
            onChange(info) {
                // console.log(info);
                const status = info.file.status;
                let fileList = [...info.fileList];
                // console.log('file list id', fileList)
                if (status !== 'uploading') {
                    // console.log('uploading ..')
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    // console.log(info.file.response);

                    if (info.file.response.status !== false) {
                        disableLogo = true;

                        if (info.file.response.fileName !== '') {
                            logo = info.file.response.fileName;
                        }
                        success({
                            title: info.file.response.msg,
                        });

                        _this.setState({ disableLogo: true });

                    }
                    else {
                        error({
                            title: info.file.response.msg,
                        });
                        fileList = []
                        _this.setState({ disableLogo: false });
                    }
                    //  message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList });
            },
        };

        // const props2 changed into apkProps by Usman
        const apkProps = {
            name: 'apk',
            multiple: false,
            action: `${BASE_URL}users/upload?fieldName=apk&screen=autoUpdate`,
            headers: { 'authorization': token },
            accept: '.apk',
            disabled: this.state.disableApk,
            fileList: this.state.fileList2,
            className: 'upload-list-inline',
            listType: 'picture',
            onRemove(info) {
                _this.setState({ disableApk: false });
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
                            // console.log('apk name', apk);
                            packageName = info.file.response.packageName;
                            size = info.file.response.size
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
                    //  message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList2 });
            },
        };

        return (
            <div>
                <Card bordered={false}>
                    <p>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    <Form onSubmit={this.handleSubmit} >
                        <Form.Item {...formItemLayout} label={convertToLang(this.props.translation[APK_NAME], "Apk name")} className="upload_file">
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is required"),
                                },
                                {
                                    validator: this.checkUniqueName,
                                },
                                ],
                            })(
                                <Input placeholder={convertToLang(this.props.translation[APK_NAME], "Apk name")} />
                            )}
                        </Form.Item>
                        <Form.Item label={convertToLang(this.props.translation[APK_ICON], "Apk Icon")} {...formItemLayout} className="upload_file">
                            <div className="dropbox">
                                {getFieldDecorator('icon',
                                    {
                                        rules: [
                                            {
                                                required: true, message: 'File is required',
                                            },
                                            {
                                                validator: this.validatelogoFile,
                                            },
                                        ],
                                    }
                                )
                                    (
                                        <Upload {...logoProps}>
                                            <Button className="width_100 upload_btn" type="default" >
                                                <Icon type="folder-open" /> {convertToLang(this.props.translation[APK_UPLOAD_ICON], "Upload ICON")}
                                            </Button>
                                            {/* <p className="ant-upload-drag-icon">
                                                    <Icon type="picture" />
                                                </p>
                                                <h2 className="ant-upload-hint">UPLOAD LOGO </h2>
                                                <p className="ant-upload-text">Upload file (.jpg,.png)</p> */}
                                        </Upload>
                                    )
                                }
                            </div>
                        </Form.Item>
                        <Form.Item label={convertToLang(this.props.translation[APK_FILE], "Apk file")} className="upload_file" {...formItemLayout}>
                            <div className="dropbox">
                                {getFieldDecorator('apk', {

                                    rules: [{
                                        required: true, message: 'File is required',
                                    },
                                    {
                                        validator: this.validateAkpFile,
                                    }
                                    ],

                                })(
                                    <Upload  {...apkProps} >
                                        <Button className="width_100 upload_btn" type="default" >
                                            <Icon type="folder-open" /> {convertToLang(this.props.translation[APK_UPLOAD_FILE], "Upload APK FILE")}
                                        </Button>

                                    </Upload>
                                )}
                            </div>
                        </Form.Item>
                        <Form.Item label={convertToLang(this.props.translation[APK_SIZE], "Apk size")} className="upload_file" {...formItemLayout}>
                            <div>
                                <h5 className="apk_size">{size}</h5>
                            </div>
                        </Form.Item>
                        <Row className='modal_footer'>
                            <div>
                                <Button key="back" className='submitButton' onClick={this.props.hideUploadApkModal}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                                <Button className='submitButton' type="primary" htmlType="submit" disabled={(logo && apk && size) ? false : true} >{convertToLang(this.props.translation[Button_Save], "Save")}</Button>
                            </div>
                        </Row>
                    </Form>
                </Card>
            </div >
        )
    }
}



const WrappedNormalApkForm = Form.create('name', 'add_apk')(AddApk);


const mapStateToProps = ({ apk_list, settings }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        resetUploadForm: apk_list.resetUploadForm,
        translation: settings.translation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addApk: addApk,
        getApkList: getApkList,
        checkApkName: checkApkName
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedNormalApkForm);
