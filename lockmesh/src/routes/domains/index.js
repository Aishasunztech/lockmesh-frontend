import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Avatar, Row, Col } from "antd";
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import CircularProgress from "components/CircularProgress";
import { getDomains, domainPermission } from "../../appRedux/actions/Account";
import AppFilter from "../../components/AppFilter";
import { convertToLang, checkIsArray } from '../utils/commonUtils'
import { BASE_URL } from '../../constants/Application';
import ListDomain from './components/ListDomain';
import {
    APK_SHOW_ON_DEVICE,
    APK,
    APK_APP_NAME,
    APK_APP_LOGO,
    APK_PERMISSION,
    APK_ACTION,
    APK_SEARCH,
    APK_UPLOAD,
    APK_SIZE,
    SHOW_APK
} from '../../constants/ApkConstants';

import { componentSearch, titleCase } from "../utils/commonUtils";
import { ACTION, Alert_Delete_APK, SEARCH } from "../../constants/Constants";
import { Button_Save, Button_Yes, Button_No } from "../../constants/ButtonConstants";
import { domainColumns } from "../utils/columnsUtils";
import { Tab_Active, Tab_All, Tab_Disabled } from "../../constants/TabConstants";

var status = true;
var coppyApks = [];
var domainStatus = true;
var copyDomainList = [];

class Domains extends Component {

    constructor(props) {
        super(props);
        var columns = domainColumns(props.translation, this.handleSearch);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            apk_list: [],
            domainList: [],
            uploadApkModal: false,
            showUploadModal: false,
            showUploadData: {},
            columns: columns,
        }
        this.confirm = Modal.confirm;
    }

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        checkIsArray(columns).forEach(column => {
            // if (column.children) {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
            // }
        })
        this.setState({
            columns: columns
        });
    }

    // delete
    handleConfirmDelete = (appId, appObject) => {
        this.confirm({
            title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk ?"),
            content: <Fragment>
                <Avatar size="small" src={BASE_URL + "users/getFile/" + appObject.logo} />
                {` ${appObject.apk_name} - ${appObject.size}`}
            </Fragment>,
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
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
        if (this.props.domainList !== nextProps.domainList) {
            this.setState({
                domainList: nextProps.domainList,
            })
        }
    }

    handlePagination = (value) => {
        this.refs.list_domain.handlePagination(value);
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyApks = this.state.domainList;
                    status = false;
                }
                let foundApks = componentSearch(coppyApks, value);
                if (foundApks.length) {
                    this.setState({
                        domainList: foundApks,
                    })
                } else {
                    this.setState({
                        domainList: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    domainList: coppyApks,
                })
            }
        } catch (error) {
            alert("hello");
        }
    }


    filterList = (type, dealers) => {
        let dumyDealers = [];
        checkIsArray(dealers).filter(function (apk) {
            let dealerStatus = apk.apk_status;
            if (dealerStatus === type) {
                dumyDealers.push(apk);
            }
        });
        return dumyDealers;
    }


    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                domainList: this.props.domainList
            })
        }
    }
    componentDidMount() {
        this.props.getDomains();
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
        // console.log("this.state.dealerList:: render func ", this.state.domainList)
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <div>
                            <AppFilter
                                translation={this.props.translation}
                                defaultPagingValue={this.props.DisplayPages}
                                handlePagination={this.handlePagination}
                                pageHeading={convertToLang(this.props.translation[""], "Manage Domains")}
                            />

                            <ListDomain
                                totalDealers={this.props.dealerList.length}
                                savePermission={this.props.domainPermission}
                                onChangeTableSorting={this.handleTableChange}
                                handleStatusChange={this.handleStatusChange}
                                domainList={this.state.domainList}
                                handleConfirmDelete={this.handleConfirmDelete}
                                editApk={this.props.editApk}
                                columns={this.state.columns}
                                getApkList={this.props.getApkList}
                                pagination={this.props.DisplayPages}
                                user={this.props.user}
                                ref="list_domain"
                                translation={this.props.translation}
                            />
                        </div>
                }
            </div>
        )
    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (domainStatus) {
            copyDomainList = this.props.domainList
            domainStatus = false;
        }

        // console.log("copyDomainList ", copyDomainList)
        let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
        // console.log("searchedData ", searchedData)
        this.setState({
            domainList: searchedData
        });

    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
}


const mapStateToProps = ({ account, auth, settings, dealers }) => {
    // console.log("account.domainList ", account.domainList);
    return {
        dealerList: dealers.dealers,
        domainList: account.domainList,
        isloading: account.isloading,
        user: auth.authUser,
        translation: settings.translation,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDomains: getDomains,
        domainPermission: domainPermission
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Domains);