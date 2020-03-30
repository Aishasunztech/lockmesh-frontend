import React, { Component } from 'react'

import {
    Tabs
} from "antd";

import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../constants/TabConstants';
import { sim, chat, pgp, vpn } from '../../constants/Constants';
import { CLEAR_APPLICATIONS } from '../../constants/ActionTypes';
import SimTabContent from "../../routes/account/PricesPakages/components/SimTabContent";
import { convertToLang } from '../../routes/utils/commonUtils';
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
        // console.log(this.props.prices, 'item tab pos', this.state.innerTabData, this.state.tabSelected)
        return (
            <div>
                <Tabs
                    tabPosition={'left'}
                    type="card"
                    onChange={(e) => this.tabChaged(e)}
                    className="price_table_tabs width_auto"
                >
                    <TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SIM")} key={sim} >

                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], "CHAT")} key={chat} >
                        {/* {this.props.simTabContent} */}

                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_PGP_EMAIL], "PGP")} key={pgp} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_VPN], "VPN")} key={vpn} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                </Tabs>
                <div className="price_table1">
                    <SimTabContent
                        setPrice={this.props.setPrice}
                        innerTab={this.state.tabSelected}
                        innerTabData={this.props.prices ? this.props.prices[this.state.tabSelected] : {}}
                        translation={this.props.translation}
                        restrictSubmit={this.props.restrictSubmit}
                        submitAvailable={this.props.submitAvailable}
                        pricesFormErrors={this.props.pricesFormErrors}
                    />
                </div>

            </div>
        )
    }
}
