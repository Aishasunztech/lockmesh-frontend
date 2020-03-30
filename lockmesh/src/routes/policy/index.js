import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import PolicyList from "./components/PolicyList";
import AddPolicy from "./components/AddPolicy";
import EditPolicy from "./components/EditPolicy";

import {
    getPolicies, handlePolicyStatus,
    handleEditPolicy, SavePolicyChanges,
    handleCheckAll, defaultPolicyChange,
    getAppPermissions, addAppsToPolicies,
    removeAppsFromPolicies, checktogglebuttons,
    resetPlicies, resetAddPolicyForm,
    handleAppGotted,
    policyPermission
} from "../../appRedux/actions/Policy";

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';
import { Markup } from 'interweave';

import {
    getDealerApps,
} from "../../appRedux/actions/ConnectDevice";

import {
    POLICY_SAVE_CHANGES,
    POLICY_SEARCH,
    POLICY_ADD,
    POLICY_EDIT,
} from "../../constants/PolicyConstants";

import {
    Button_Yes,
    Button_No,
    Button_Update,
    Button_Save
} from '../../constants/ButtonConstants'

import { componentSearch, titleCase, convertToLang, checkIsArray } from '../utils/commonUtils';
import { ADMIN } from '../../constants/Constants';
import { policyColumns } from '../utils/columnsUtils';
import { POLICY_PAGE_HEADING } from '../../constants/AppFilterConstants';
import { APP_MANAGE_POLICY } from '../../constants/AppConstants';

var copyPolicy = [];
var status = true;

class Policy extends Component {
    constructor(props) {
        super(props);

        var columns = policyColumns(props.translation, this.handleSearch);
        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            policyModal: false,
            policies: (props.policies) ? props.policies : [],
            formRefresh: false,
            columns: columns,
            current: 0,
            goToLastTab: false,
            editPolicyModal: false,
            guestAlldealerApps: false,
            enableAlldealerApps: false,
            encryptedAlldealerApps: false,

            guestAllappPermissions: false,
            enableAllappPermissions: false,
            encryptedAllappPermissions: false,
            appsGotted: false,
            policySearchValue: ''
        }

    }

    // handleTableChange = (pagination, query, sorter) => {
    //     const sortOrder = sorter.order || "ascend";
    //     this.columns = policyColumns(sortOrder, this.props.translation, this.handleSearch);
    // };

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        checkIsArray(columns).forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }

    componentDidMount() {
        // console.log(this.props, 'his')
        this.props.getPolicies();
        this.props.getDealerApps();
        this.props.getAppPermissions();
        this.props.getPagination('policies');
        this.setState({
            policies: this.props.policies,
            guestAlldealerApps: this.props.guestAlldealerApps,
            enableAlldealerApps: this.props.enableAlldealerApps,
            encryptedAlldealerApps: this.props.encryptedAlldealerApps,

            guestAllappPermissions: this.props.guestAllappPermissions,
            enableAllappPermissions: this.props.enableAllappPermissions,
            encryptedAllappPermissions: this.props.encryptedAllappPermissions,
            appsGotted: this.props.appsGotted
        })
        if (this.props.user.type === ADMIN) {
            this.state.columns.pop()
        }
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            copyPolicy = this.props.policies;
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                policies: this.props.policies,
                guestAlldealerApps: this.props.guestAlldealerApps,
                enableAlldealerApps: this.props.enableAlldealerApps,
                encryptedAlldealerApps: this.props.encryptedAlldealerApps,

                guestAllappPermissions: this.props.guestAllappPermissions,
                enableAllappPermissions: this.props.enableAllappPermissions,
                encryptedAllappPermissions: this.props.encryptedAllappPermissions,
                appsGotted: this.props.appsGotted
            })
            if (this.state.policySearchValue) {
                this.handleComponentSearch(this.state.policySearchValue);
            }
        }
        if (this.props.translation != prevProps.translation) {
            this.setState({
                columns: policyColumns(this.props.translation, this.handleSearch)
            });
        }
    }

    handlePagination = (value) => {
        this.refs.policyList.handlePagination(value);
        this.props.postPagination(value, 'policies');
    }

    handleComponentSearch = (value) => {
        try {
            let searchValue = value;
            let resultPolicies = [];

            if (status) {
                copyPolicy = this.state.policies;
                status = false;
            }

            if (value.length) {
                let foundPolicies = componentSearch(copyPolicy, value);
                if (foundPolicies.length) {
                    resultPolicies = foundPolicies;
                }
            } else {
                status = true;
                resultPolicies = copyPolicy;
            }

            this.setState({
                policies: resultPolicies,
                policySearchValue: searchValue
            })
        } catch (error) {
            // alert("hello");
        }
    }

    handleSearch = (e) => {

        let demoPolicy = [];
        if (status) {
            copyPolicy = this.state.policies;
            status = false;
        }

        if (e.target.value.length) {
            copyPolicy.forEach((policy) => {

                if (policy[e.target.name] !== undefined) {
                    if ((typeof policy[e.target.name]) === 'string') {
                        if (policy[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoPolicy.push(policy);
                        }
                    } else if (policy[e.target.name] !== null) {
                        if (policy[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoPolicy.push(policy);
                        }
                    } else {
                        // demoUsers.push(policy);
                    }
                } else {
                    demoPolicy.push(policy);
                }
            });
            //  console.log("searched value", demoPolicy);
            this.setState({
                policies: demoPolicy
            })
        } else {
            this.setState({
                policies: copyPolicy
            })
        }
    }

    // Add Policy Modal (I think)
    handlePolicyModal = (visible) => {
        let _this = this;
        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CHANGES], "Save changes to Policy?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {
                _this.setState({
                    goToLastTab: true,
                    formRefresh: false
                })
            },
            onCancel() {
                _this.props.resetAddPolicyForm()
                _this.setState({
                    policyModal: visible,
                    goToLastTab: false,
                    formRefresh: true
                });
            },
        });

    }

    handlePolicyModal2 = (visible) => {
        this.setState({
            policyModal: visible,
            goToLastTab: false,
            formRefresh: true

        });
    }

    // Edit Policy Methods
    editPolicyModal = (policy) => {
        // console.log('object', policy)
        this.setState({
            editPolicyModal: true,
            editAblePolicyId: policy.id
        })
    }

    editPolicyModalHide = () => {

        let _this = this;
        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CHANGES], "Save changes to Policy?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {

                //   console.log('OK');
            },
            onCancel() {

                _this.props.resetPlicies();
                _this.setState({
                    editPolicyModal: false
                })
                _this.form.reset_steps();
                //   console.log('Cancel');
            },
        });

        // console.log('cancel called')


    }

    editPolicyModalHide2 = () => {
        this.setState({
            editPolicyModal: false
        })
        this.form.reset_steps();
    }


    render() {

        return (
            <Fragment>

                {/* AppFilter */}
                <AppFilter
                    handleFilterOptions={this.handleFilterOptions}
                    searchPlaceholder={convertToLang(this.props.translation[POLICY_SEARCH], "Search Policy")}
                    addButtonText={convertToLang(this.props.translation[POLICY_ADD], "Add Policy")}
                    defaultPagingValue={this.state.defaultPagingValue}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={true}
                    AddPolicyModel={true}
                    handlePolicyModal={this.handlePolicyModal2}

                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    translation={this.props.translation}
                    pageHeading={convertToLang(this.props.translation[APP_MANAGE_POLICY], "Manage Policy")}
                />

                {/* Add Policy Modal */}
                <Modal
                    maskClosable={false}
                    width="780px"
                    className="policy_popup"
                    visible={this.state.policyModal}
                    title={convertToLang(this.props.translation[POLICY_ADD], "Add Policy")}
                    onOk={() => this.handlePolicyModal2(false)}
                    onCancel={() => this.handlePolicyModal(false)}
                    destroyOnClose={true}
                    okText={convertToLang(this.props.translation[Button_Save], "Save")}
                    footer={null}
                    ref='modal'
                >
                    <AddPolicy
                        // app_list={this.props.app_list}
                        handlePolicyModal={this.handlePolicyModal2}
                        getPolicies={this.props.getPolicies}
                        goToLastTab={this.state.goToLastTab}
                        refreshForm={this.state.formRefresh}
                        ref='addPolicy'
                        translation={this.props.translation}
                    />
                </Modal>

                {/* Policy List */}
                <PolicyList
                    totalDealers={this.props.dealerList.length}
                    savePermission={this.props.policyPermission}
                    onChangeTableSorting={this.handleTableChange}
                    user={this.props.user}
                    columns={this.state.columns}
                    policies={this.state.policies}
                    checktogglebuttons={this.props.checktogglebuttons}
                    defaultPolicyChange={this.props.defaultPolicyChange}
                    handlePolicyStatus={this.props.handlePolicyStatus}
                    handleEditPolicy={this.props.handleEditPolicy}
                    handleCheckAll={this.props.handleCheckAll}
                    SavePolicyChanges={this.props.SavePolicyChanges}
                    pagination={this.props.DisplayPages}
                    ref='policyList'
                    guestAlldealerApps={this.props.guestAlldealerApps}
                    encryptedAlldealerApps={this.props.encryptedAlldealerApps}
                    enableAlldealerApps={this.props.enableAlldealerApps}
                    guestAllappPermissions={this.props.guestAllappPermissions}
                    encryptedAllappPermissions={this.props.encryptedAllappPermissions}
                    enableAllappPermissions={this.props.enableAllappPermissions}
                    guestAllallExtensions={this.props.guestAllallExtensions}
                    encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                    enableAllallExtensions={this.props.enableAllallExtension}
                    editPolicyModal={this.editPolicyModal}
                    handleAppGotted={this.props.handleAppGotted}
                    appsGotted={this.state.appsGotted}
                    translation={this.props.translation}
                    push_apps={this.props.push_apps}
                    location={this.props.location}
                />

                {/* Edit Policy */}
                <Modal
                    maskClosable={false}
                    width="780px"
                    className="policy_popup"
                    visible={this.state.editPolicyModal}
                    // destroyOnClose={true}
                    title={convertToLang(this.props.translation[POLICY_EDIT], "Edit Policy")}
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => { this.editPolicyModalHide(); this.props.handleAppGotted(false) }}
                    okText={convertToLang(this.props.translation[Button_Update], "Update")}
                    footer={null}
                >
                    <EditPolicy
                        SavePolicyChanges={this.props.SavePolicyChanges}
                        handleEditPolicy={this.props.handleEditPolicy}
                        editAblePolicy={this.state.policies}
                        editAblePolicyId={this.state.editAblePolicyId}
                        push_apps={this.props.push_apps}
                        appPermissions={this.props.appPermissions}
                        handleCheckAll={this.props.handleCheckAll}
                        editPolicyModalHide={this.editPolicyModalHide2}
                        addAppsToPolicies={this.props.addAppsToPolicies}
                        removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                        onCancel={this.editPolicyModalHide}
                        guestAlldealerApps={this.state.guestAlldealerApps}
                        encryptedAlldealerApps={this.state.encryptedAlldealerApps}
                        enableAlldealerApps={this.state.enableAlldealerApps}
                        guestAllappPermissions={this.state.guestAllappPermissions}
                        encryptedAllappPermissions={this.state.encryptedAllappPermissions}
                        enableAllappPermissions={this.state.enableAllappPermissions}
                        guestAllallExtensions={this.props.guestAllallExtensions}
                        encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                        enableAllallExtensions={this.props.enableAllallExtension}
                        handleAppGotted={this.props.handleAppGotted}
                        appsGotted={this.state.appsGotted}
                        getPolicies={this.props.getPolicies}
                        wrappedComponentRef={(form) => this.form = form}
                        ref='editPolicy'

                        translation={this.props.translation}
                    />
                </Modal>
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        getPolicies: getPolicies,
        policyPermission: policyPermission,
        // dropdown actions
        getDropdown: getDropdown,
        postDropdown: postDropdown,

        // pagination actions
        postPagination: postPagination,
        getPagination: getPagination,

        handlePolicyStatus: handlePolicyStatus,
        handleEditPolicy: handleEditPolicy,
        SavePolicyChanges: SavePolicyChanges,
        handleCheckAll: handleCheckAll,
        getDealerApps: getDealerApps,
        getAppPermissions: getAppPermissions,
        addAppsToPolicies: addAppsToPolicies,
        defaultPolicyChange: defaultPolicyChange,
        removeAppsFromPolicies: removeAppsFromPolicies,
        checktogglebuttons: checktogglebuttons,
        resetPlicies: resetPlicies,
        resetAddPolicyForm: resetAddPolicyForm,
        handleAppGotted: handleAppGotted
        // getDefaultApps: getDefaultApps
    }, dispatch);
}
var mapStateToProps = ({ policies, auth, settings, dealers }) => {

    return {
        dealerList: dealers.dealers,
        user: auth.authUser,
        policies: policies.policies,
        apk_list: policies.apk_list,
        push_apps: policies.dealer_apk_list,
        appPermissions: policies.appPermissions,
        DisplayPages: policies.DisplayPages,
        guestAlldealerApps: policies.guestAll2dealerApps,
        encryptedAlldealerApps: policies.encryptedAll2dealerApps,
        enableAlldealerApps: policies.enableAll2dealerApps,
        guestAllappPermissions: policies.guestAll2appPermissions,
        encryptedAllappPermissions: policies.encryptedAll2appPermissions,
        enableAllappPermissions: policies.enableAll2appPermissions,
        guestAllallExtensions: policies.guestAll2allExtensions,
        encryptedAllallExtensions: policies.encryptedAll2allExtensions,
        enableAllallExtensions: policies.enableAll2allExtensions,
        appsGotted: policies.appsGotted,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy);