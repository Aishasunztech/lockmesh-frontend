import React, { Component } from 'react'
import { Input } from "antd";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import styles from "../style.css";
import ChatBody from './ChatBody';
// import scrits from "./script"


export default class ChatBox extends Component {

    render() {
        return (
            <div
                className="msg_box" style={{
                    "right": this.props.rightPosition
                }} 
                rel="skp"
                id={this.props.chatID}
                // indexKey={this.props.index}
            >
                <div className="msg_head" onClick={(e) => { this.props.minMaxChatBox(e, this.props.chatID) }}>
                    {(this.props.chatTitle) ? `Device ID: (${this.props.chatTitle})` : 'Demo Chat'}
                    <div className="close" onClick={(e) => { this.props.closeChatBox(e) }}>x</div>
                </div>
                <div className="msg_wrap">
                    <ChatBody />
                    <div className="msg_footer">
                        {/* <Picker /> */}
                        <Input.TextArea rows={4} className="msg_input" />
                       
                    </div>
                </div>
            </div>
        )
    }
}

