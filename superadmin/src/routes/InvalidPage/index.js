import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class InvalidPage extends Component {
  render() {
    return (
      <div className="gx-page-error-container">
        <div className="gx-page-error-content">
          <div className="gx-error-code gx-mb-4">403</div>
          <h2 className="gx-text-center">
            Access Denied!
          </h2>
          <p className="gx-text-center">
            <Link className="gx-btn gx-btn-primary" to="/">Go to Home</Link>
          </p>
        </div>
      </div>
    )
  }
}
