import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Icon } from "antd";
import styles from './session.css';
import { APP_TITLE } from '../constants/Application';
export default class SessionTimeOut extends Component {
    render() {
        return (
            <div className="session_exp">
                <div>
                    <h1 className="mb-24"><Icon type="lock" theme="filled" /> {APP_TITLE}</h1>
                    <h1 className="font_36">Session Timed Out</h1>
                    <p>Your session has timed out due to inactivity</p>

                    <Link to="/login">
                        <p>Click here to login again</p>
                    </Link>
                </div>
            </div>
        )
    }
}