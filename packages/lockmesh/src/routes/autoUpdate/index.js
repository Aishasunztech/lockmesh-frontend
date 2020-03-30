// Libraries
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, Redirect } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Avatar } from "antd";

// Actions
import { getApkList, changeAppStatus, deleteApk, editApk, addApk, resetUploadForm, getPagination, getDropdown, postDropdown, postPagination } from "../../appRedux/actions/index";

import CircularProgress from "components/CircularProgress/index";
import AppFilter from "../../components/AppFilter";
import AddApk from '../addApk/index'
import ListApk from './components/ListApk';

// Constants
import {
    APK_SHOW_ON_DEVICE,
    APK,
    APK_APP_NAME,
    APK_APP_LOGO,
    APK_PERMISSION,
    APK_ACTION,
    APK_SEARCH,
    SHOW_APK
} from '../../constants/ApkConstants';

import { componentSearch, titleCase, convertToLang } from "../utils/commonUtils";
import { ADMIN, AUTO_UPDATE_ADMIN, Alert_Delete_APK } from "../../constants/Constants";
import { Button_Yes, Button_No, Button_UploadApk } from "../../constants/ButtonConstants";
import { Tab_All, Tab_Active, Tab_Disabled } from "../../constants/TabConstants";

var status = true;
var copyApks = [];

class AutoUpdate extends React.Component {

    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            apk_list: [],
            uploadApkModal: false,
            showUploadModal: false,
            showUploadData: {},
            columns: [
                {
                    title: "#",
                    dataIndex: 'counter',
                    align: 'center',
                    className: 'row',
                    render: (text, record, index) => ++index,
                },
                {
                    title: convertToLang(this.props.translation[APK_ACTION], "ACTION"),
                    dataIndex: 'action',
                    key: 'action',
                    className: 'row'
                },

                {
                    title: convertToLang(this.props.translation[APK_APP_NAME], "APP NAME"),
                    dataIndex: 'apk_name',
                    width: "100",
                    key: 'apk_name',
                    sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
                    sortDirections: ['ascend', 'descend'],
                    defaultSortOrder: "ascend",
                    // className: ''
                },
                {
                    title: convertToLang(this.props.translation[APK_APP_LOGO], "APP LOGO"),
                    dataIndex: 'apk_logo',
                    key: 'apk_logo',
                    // className: ''
                },

                {
                    title: convertToLang(this.props.translation[''], "APP SIZE"),
                    dataIndex: 'apk_size',
                    key: 'apk_size',
                    // className: ''
                },
                {
                    title: convertToLang(this.props.translation[""], "LABEL"),
                    dataIndex: 'label',
                    key: 'label',
                },
                {
                    title: convertToLang(this.props.translation[""], "PACKAGE NAME"),
                    dataIndex: 'package_name',
                    key: 'package_name',
                },
                {
                    title: convertToLang(this.props.translation[""], "VERSION"),
                    dataIndex: 'version',
                    key: 'version',
                },

                {
                    title: convertToLang(this.props.translation[APK], "APK"),
                    dataIndex: 'apk',
                    key: 'apk',
                    // className: ''
                },

                {
                    title: convertToLang(this.props.translation[""], "LAST UPLOADED"),
                    dataIndex: 'created_at',
                    key: 'created_at',
                },
                {
                    title: convertToLang(this.props.translation[""], "LAST UPDATED"),
                    dataIndex: 'updated_at',
                    key: 'updated_at',
                },


            ],
        }

        // this.columns = ;
        this.confirm = Modal.confirm;

    }

    // delete
    handleConfirmDelete = (appId) => {
        this.confirm({
            title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk?"),
            content: '',
            okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(this.props.translation[Button_No], 'No'),
            onOk: () => {
                this.props.deleteApk(appId);
                return new Promise((resolve, reject) => {
                    setTimeout((5 > 0.5 ? resolve : reject));
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    // toggleStatus
    handleStatusChange = (checked, appId) => {
        this.props.changeAppStatus(appId, checked);
    }

    componentWillReceiveProps(nextProps) {
        //  console.log('will receive props');

        if (this.props.apk_list !== nextProps.apk_list) {
            this.setState({
                apk_list: nextProps.apk_list,
            })
        }
    }

    handlePagination = (value) => {
        this.refs.listApk.handlePagination(value);
        this.props.postPagination(value, 'apk');
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    copyApks = this.state.apk_list;
                    status = false;
                }
                let foundApks = componentSearch(copyApks, value);
                if (foundApks.length) {
                    this.setState({
                        apk_list: foundApks,
                    })
                } else {
                    this.setState({
                        apk_list: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    apk_list: copyApks,
                })
            }
        } catch (error) {
            alert("hello");
        }
    }

    handleChange = (value) => {
        // alert(value);
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                apk_list: this.props.apk_list
            })
        }
    }

    componentWillMount() {
        // alert("componentWillMount");
        this.props.getApkList();
        // this.props.getDevicesList();
        //  console.log('apk did mount', this.props.getDropdown('apk'));
        this.props.getDropdown('apk');
        this.props.getPagination('apk')
    }

    componentDidMount() {
        // alert("hello213");
        // this.props.getApkList();
        // this.props.getDropdown('apk');
    }

    handleUploadApkModal = (visible) => {
        this.setState({
            uploadApkModal: visible
        });
        this.props.resetUploadForm(false)
    }
    hideUploadApkModal = () => {
        this.setState({
            uploadApkModal: false
        });
        this.props.resetUploadForm(true)
    }

    render() {
        if (this.props.user.type === 'dealer') {
            this.state.columns[0].className = 'hide';
        } else {
            this.state.columns[0].className = 'row';
        }
        // console.log(this.props.location);
        if (this.props.location.state || this.props.user.type === AUTO_UPDATE_ADMIN) {

            return (
                <div>
                    {
                        this.props.isloading ?
                            <CircularProgress />
                            :

                            <div>
                                <AppFilter
                                    translation={this.props.translation}
                                    
                                    // handleCheckChange={this.handleCheckChange}

                                    searchPlaceholder={convertToLang(this.props.translation[APK_SEARCH], "Search APK")}
                                    addButtonText={convertToLang(this.props.translation[Button_UploadApk], "Upload Apk")}
                                    isAddButton={this.props.user.type === ADMIN || this.props.user.type === AUTO_UPDATE_ADMIN}
                                    defaultPagingValue={this.props.DisplayPages}
                                    // toLink="/upload-apk"
                                    handleUploadApkModal={this.handleUploadApkModal}
                                    handlePagination={this.handlePagination}
                                    handleComponentSearch={this.handleComponentSearch}
                                />


                                {
                                    (this.props.user.type === 'admin') ?
                                        <div style={{ textAlign: "center" }}>
                                            {/* <Button
                                                type="primary"
                                                // disabled={(this.props.disableAddButton === true) ? true : false}
                                                style={{ width: '12%', marginBottom:16 }}
                                            >
                                                <Link to='/upload-apk'>Upload apk</Link>
                                            </Button> */}
                                        </div> : false
                                }
                                <ListApk
                                    handleStatusChange={this.handleStatusChange}
                                    apk_list={this.state.apk_list}
                                    // tableChangeHandler={this.tableChangeHandler}
                                    handleConfirmDelete={this.handleConfirmDelete}
                                    editApk={this.props.editApk}
                                    columns={this.state.columns}
                                    getApkList={this.props.getApkList}
                                    pagination={this.props.DisplayPages}
                                    user={this.props.user}
                                    ref="listApk"
                                    link='autoUpdate'
                                    translation={this.props.translation}
                                />

                                <Modal
                                    maskClosable={false}
                                    width="620px"
                                    className="upload_apk_popup"
                                    visible={this.state.uploadApkModal}
                                    title="Upload APK"
                                    onOk={() => { }}
                                    onCancel={() => {
                                        this.hideUploadApkModal()
                                    }}
                                    okText="Save"
                                    footer={null}
                                >
                                    <AddApk
                                        translation={this.props.translation}
                                        autoUpdate={true}
                                        hideUploadApkModal={this.hideUploadApkModal}
                                        ref='uploadApk'
                                    />
                                </Modal>
                            </div>
                    }
                </div>
            )
        } else {
            return (
                <Redirect to={{
                    pathname: '/app',
                }} />
            )
        }
    }


    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    {/* <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                        <Button
                            onClick={() => this.handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                    </Button>

                    */}
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
}

// const Extensions = ({match}) => (
//   <Switch>
//     <Route path={`${match.url}/map`} component={Maps}/>
//     <Route path={`${match.url}/chart`} component={Charts}/>
//     <Route path={`${match.url}/calendar`} component={Calendar}/>
//   </Switch>
// );

// export default Apk;
const mapStateToProps = ({ apk_list, auth, settings }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        DisplayPages: apk_list.DisplayPages,
        user: auth.authUser,
        translation: settings.translation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getApkList: getApkList,
        changeAppStatus: changeAppStatus,
        deleteApk: deleteApk,
        editApk: editApk,
        getDropdown: getDropdown,
        postDropdown: postDropdown,
        postPagination: postPagination,
        getPagination: getPagination,
        addApk: addApk,
        resetUploadForm: resetUploadForm
        //  getDevicesList: getDevicesList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoUpdate);