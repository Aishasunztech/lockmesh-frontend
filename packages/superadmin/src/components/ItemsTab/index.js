import React, { Component } from 'react'

import {
    Tabs
} from "antd";

import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../constants/LabelConstants';
import { sim, chat, pgp, vpn } from '../../constants/Constants';
import { CLEAR_APPLICATIONS } from '../../constants/ActionTypes';
import SimTabContent from "../../routes/whitelabels/components/pricesPackages/components/SimTabContent";
const { TabPane } = Tabs;


export default class ItemTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabSelected: sim,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
        }
    }
    tabChaged = (e) => {
        this.props.innerTabChanged(e)
        this.setState({
            tabSelected: e,
            innerTabData: this.props.prices ? this.props.prices[e] : {}
        })
    }
    render() {
        // console.log(this.props.pricesFormErrors, 'render 2')
        return (
            <div>
                <Tabs
                    tabPosition={'left'}
                    type="card"
                    onChange={(e) => this.tabChaged(e)}
                    style={{width: '15%', float: 'left'}}
                >
                    <TabPane tab={TAB_SIM_ID} key={sim} >

                    </TabPane>
                    <TabPane tab={TAB_CHAT_ID} key={chat} >
                        {/* {this.props.simTabContent} */}

                    </TabPane>
                    <TabPane tab={TAB_PGP_EMAIL} key={pgp} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                    <TabPane tab={TAB_VPN} key={vpn} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                </Tabs>
                <div style={{width: '83%', float: 'right'}}>
                    <SimTabContent
                        setPrice={this.props.setPrice}
                        innerTab={this.state.tabSelected}
                        innerTabData={this.state.innerTabData}
                        restrictSubmit={this.props.restrictSubmit}
                        submitAvailable={this.props.submitAvailable}
                        pricesFormErrors={this.props.pricesFormErrors}


                    />
                </div>

            </div>
        )
    }
}
