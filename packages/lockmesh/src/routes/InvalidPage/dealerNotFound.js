import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class DealerNotFound extends Component {
  render() {
    return (
      <div className="gx-page-error-container">
        <div className="gx-page-error-content">
          <div className="gx-error-code gx-mb-4" style={{fontSize: '40px'}}>Dealer Not Found</div>
          <h2 className="gx-text-center">
          </h2>
        </div>
      </div>
    )
  }
}
