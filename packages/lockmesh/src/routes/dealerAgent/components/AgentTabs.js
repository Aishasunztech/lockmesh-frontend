import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Table, Button, Card, Tabs, Modal, Icon, Tag, Form, Input, Popconfirm, Empty } from "antd";

import AgentList from './AgentList';
import EditAgent from './EditAgent'

const confirm = Modal.confirm;

export default class AgentTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dealerAgents: [],
            editAgentModal: false,
            agent: null
        }
    }

    handlePagination = (value) => {
        // this.refs.devciesList.handlePagination(value);
    }

    showEditModal = (visible, agent = null) => {
        if (agent) {
            this.setState({
                editAgentModal: visible,
                agent: agent
            })
        } else {
            this.setState({
                editAgentModal: visible
            })
        }
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                dealerAgents: this.props.dealerAgents,
                columns: this.props.columns,
                // tabselect: this.props.tabselect,
                // selectedOptions: this.props.selectedOptions
            })
            // this.refs.devciesList.handlePagination(this.state.tabselect);
        }
    }

    render() {

        return (
            <Fragment>
                {/* <Tabs type="card" className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                        <Tabs.TabPane tab={<span className="green">{convertToLang(translation[Tab_All], Tab_All)} ({this.props.allDevices})</span>} key="1" >
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="green">{convertToLang(translation[Tab_Active], Tab_Active)} ({this.props.activeDevices})</span>} key="4" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="red">{convertToLang(translation[Tab_Expired], Tab_Expired)} ({this.props.expireDevices})</span>} key="6" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="green">{convertToLang(translation[Tab_Trial], Tab_Trial)} ({this.props.trialDevices})</span>} key="9" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="yellow">{convertToLang(translation[Tab_Suspended], Tab_Suspended)} ({this.props.suspendDevices})</span>} key="7" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="blue">{convertToLang(translation[Tab_PreActivated], Tab_PreActivated)}  ({this.props.preActiveDevices})</span>} key="3" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="gray">{convertToLang(translation[Tab_PendingActivation], Tab_PendingActivation)}  ({this.props.pendingDevices})</span>} key="2" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="purple">{convertToLang(translation[Tab_Transfer], Tab_Transfer)} (0)</span>} key="8" forceRender={true}>
                            <h2 className="coming_s">{convertToLang(translation[Tab_ComingSoon], Tab_ComingSoon)}</h2>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="orange">{convertToLang(translation[Tab_Unlinked], Tab_Unlinked)} ({this.props.unlinkedDevices})</span>} key="5" forceRender={true}>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab={<span className="black">{convertToLang(translation[Tab_Flagged], Tab_Flagged)}({this.props.flaggedDevices})</span>} key="10" forceRender={true}>
                        </Tabs.TabPane>

                    </Tabs> */}
                <AgentList
                    showEditModal={this.showEditModal}
                    columns={this.props.columns}
                    onChangeTableSorting={this.props.onChangeTableSorting}
                    translation={this.props.translation}
                    dealerAgents={this.props.dealerAgents}
                    agentStatusHandler={this.props.agentStatusHandler}
                    handleDeleteAgent={this.props.handleDeleteAgent}
                    handleResetPwd={this.props.handleResetPwd}
                    user={this.props.user}
                />
                <EditAgent
                    showEditModal={this.showEditModal}
                    editAgentModal={this.state.editAgentModal}
                    agent={this.state.agent}
                    updateAgent={this.props.updateAgent}
                    translation={this.props.translation}
                />
            </Fragment>
        )
    }
}