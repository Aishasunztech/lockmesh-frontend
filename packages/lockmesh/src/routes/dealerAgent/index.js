import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal } from 'antd';

import {
    getAgentList,
    getPagination,
    addAgent,
    updateAgent,
    changeAgentStatus,
    deleteAgent,
    resetAgentPwd
} from '../../appRedux/actions'

import {
    WARNING
} from '../../constants/Constants';

import AppFilter from '../../components/AppFilter';
import AgentTabs from './components/AgentTabs';
import AddAgent from './components/AddAgent';

import {
    convertToLang, componentSearch, checkIsArray
} from '../utils/commonUtils'
import { dealerAgentColumns } from '../utils/columnsUtils';
import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel } from '../../constants/ButtonConstants';
import { AGENTS_PAGE_HEADING } from '../../constants/AppFilterConstants';

var copyDealerAgents = [];
var status = true;
var copy_status = true;
const confirm = Modal.confirm;
class DealerAgent extends Component {
    constructor(props) {
        super(props);
        let columns = dealerAgentColumns(props.translation, this.handleColumnSearch);
        this.state = {
            addAgentModal: false,
            columns: columns,
            dealerAgents: []
        }
    }

    componentDidMount() {
        this.props.getAgentList();
        // this.props.getPagination('agents');
        // console.log(this.props.location.state);
        // this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
        this.setState({
            dealerAgents: this.props.dealerAgents,
            // originalUsers: this.props.users_list,
            // expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
        })
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.dealerAgents.length !== this.props.dealerAgents.length) {
            this.setState({
                // defaultPagingValue: this.props.DisplayPages,
                dealerAgents: nextProps.dealerAgents,
                // originalUsers: nextProps.users_list,
                // expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
            })

        }
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props !== prevProps) {
    //         // console.log('this.props ', this.props.DisplayPages);
    //         this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
    //         this.setState({
    //             defaultPagingValue: this.props.DisplayPages,
    //             expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
    //         })
    //     }
    //     if (this.props.translation !== prevProps.translation) {
    //         this.setState({ 
    //             columns: usersColumns(this.props.translation, this.handleSearch)
    //          });
    //     }
    // }

    handleColumnSearch = (e) => {

        let demoDealerAgents = [];
        if (copy_status) {
            copyDealerAgents = this.state.dealerAgents;
            copy_status = false;
        }


        if (e.target.value.length) {

            checkIsArray(copyDealerAgents).forEach((agent) => {

                if (agent[e.target.name] !== undefined) {
                    if ((typeof agent[e.target.name]) === 'string') {

                        if (agent[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else if (agent[e.target.name] !== null) {

                        if (agent[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else {

                    }
                } else {
                }
            });
            this.setState({
                dealerAgents: demoDealerAgents
            })
        } else {
            this.setState({
                dealerAgents: copyDealerAgents
            })
        }
    }

    handleComponentSearch = (value) => {

        if (value.length) {

            // console.log('length')

            if (status) {
                copyDealerAgents = this.state.dealerAgents;
                status = false;
            }

            let foundDealerAgents = componentSearch(copyDealerAgents, value);
            // console.log('found devics', foundUsers)
            if (foundDealerAgents.length) {
                this.setState({
                    dealerAgents: foundDealerAgents,
                })
            } else {
                this.setState({
                    dealerAgents: []
                })
            }
        } else {
            // status = true;

            this.setState({
                dealerAgents: copyDealerAgents,
            })
        }

    }

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

    handleAddUserModal = (visible) => {
        this.setState({
            addAgentModal: visible
        })
    }
    addAgentHandler = (values) => {
        this.props.addAgent(values);
    }
    agentStatusHandler = (e, agent) => {
        this.props.changeAgentStatus(agent, e);
    }
    handleDeleteAgent = (agentID) => {
        let _this = this;
        confirm({
            title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
            content: convertToLang(_this.props.translation[WARNING], "Are you sure, you want to delete Agent?"),
            okText: convertToLang(this.props.translation[Button_Confirm], "Confirm"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk() {
                _this.props.deleteAgent(agentID);
            },
            onCancel() {

            },
        });

    }
    handleResetPwd = (agentID) => {
        let _this = this;
        confirm({
            title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
            content: convertToLang(_this.props.translation[WARNING], "Are you sure, you want to change password?"),
            okText: convertToLang(this.props.translation[Button_Confirm], "Confirm"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk() {
                _this.props.resetAgentPwd(agentID);
            },
            onCancel() {

            },
        });
    }
    render() {
        return (
            <Fragment>
                <AppFilter
                    // 1) options and selected options
                    // if options will not be provided, selection will be hidden
                    // options={this.props.options}
                    // selectedOptions={this.props.selectedOptions}
                    // handleCheckChange={this.handleCheckChange}

                    // 2) Filteration 
                    // if handleFilterOptions will not be provided, filteration will not show in appfilter
                    // handleFilterOptions={this.handleFilterOptions}

                    // 3) searching
                    // if handleComponentSearch will not be provided, search will be hidden
                    handleComponentSearch={this.handleComponentSearch}
                    // searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchDevices], "Search Devices")}

                    // 4) Pagination
                    // if handlePagination will not be provided, pagination will be hidden
                    // defaultPagingValue={this.state.defaultPagingValue}
                    // handlePagination={this.handlePagination}

                    // 5) ADD Section
                    // if isAddButton will not be provided, Add Button will be hidden
                    //  common prop of button handler is handleAppFilterAddButton
                    // if we dont want link on button then we will use toLink prop
                    // if we want to disable button use disableAddButton

                    isAddButton={this.props.user.type !== ADMIN}
                    isAddAgentButton={true}
                    disableAddButton={this.props.user.type === ADMIN}
                    addButtonText={convertToLang(this.props.translation['button.add.agent'], "Add Agent")}
                    handleAppFilterAddButton={this.handleAddUserModal}
                    pageHeading={convertToLang(this.props.translation[AGENTS_PAGE_HEADING], "Agents")}
                    // toLink="add-device"

                    // language translation
                    translation={this.props.translation}
                />
                <AgentTabs
                    columns={this.state.columns}
                    dealerAgents={this.state.dealerAgents}
                    onChangeTableSorting={this.handleTableChange}
                    translation={this.props.translation}
                    updateAgent={this.props.updateAgent}
                    agentStatusHandler={this.agentStatusHandler}
                    handleDeleteAgent={this.handleDeleteAgent}
                    handleResetPwd={this.handleResetPwd}
                    user={this.props.user}
                />
                <AddAgent
                    addAgentModal={this.state.addAgentModal}
                    handleAddUserModal={this.handleAddUserModal}

                    addAgentHandler={this.addAgentHandler}

                    translation={this.props.translation}
                />
            </Fragment>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAgentList: getAgentList,
        getPagination: getPagination,
        addAgent: addAgent,
        updateAgent: updateAgent,
        changeAgentStatus: changeAgentStatus,
        deleteAgent: deleteAgent,
        resetAgentPwd: resetAgentPwd
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, socket, settings, agents }) => {
    return {
        user: auth.authUser,
        routing: routing,
        dealerAgents: agents.dealerAgents,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealerAgent);