import React, { Component } from 'react'
import PricingFrom from "./PricingForm";

export default class SimTabContent extends Component {
    render() {
        // console.log(this.props.pricesFormErrors, 'render 3')

        return (
            <div>

                <PricingFrom
                    showPricingModal={this.props.showPricingModal}
                    setPrice={this.props.setPrice}
                    innerTab={this.props.innerTab}
                    price_for={this.props.innerTab}
                    innerTabData={this.props.innerTabData}
                    restrictSubmit={this.props.restrictSubmit}
                    submitAvailable={this.props.submitAvailable}
                    pricesFormErrors={this.props.pricesFormErrors}

                />
            </div>
        )
    }
}
