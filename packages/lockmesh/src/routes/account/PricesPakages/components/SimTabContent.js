import React, { Component } from 'react'
import PricingFrom from "./PricingForm";

export default class SimTabContent extends Component {
    render() {
        return (
            <div>
                <PricingFrom
                    showPricingModal={this.props.showPricingModal}
                    innerTab={this.props.innerTab}
                    setPrice={this.props.setPrice}
                    price_for={this.props.innerTab}
                    innerTabData={this.props.innerTabData}
                    translation= {this.props.translation}
                    restrictSubmit={this.props.restrictSubmit}
                    submitAvailable={this.props.submitAvailable}
                    pricesFormErrors={this.props.pricesFormErrors}
                />
            </div>
        )
    }
}
