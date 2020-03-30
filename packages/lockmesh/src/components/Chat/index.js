import React, { Component, Fragment } from 'react'
import ChatBox from "./components/ChatBox";
// import jQuery from "jQuery";
import jQuery from "jquery";

export default class Chat extends Component {


    closeChatBox = (e) => {

    }

    minMaxChatBox = (e, chatID) => {
        // console.log(e);
        let elem = this.refs[chatID];
        // console.log(parent.childrens)
        // jQuery(this.refs[index]).slideToggle('slow')
        jQuery('#' + chatID + ' .msg_wrap').toggle();
        // jQuery('#'+ chatID +' .msg_wrap').slideToggle('slow');
        // return false;
    }
    render() {
        return (
            <Fragment>
                <ChatBox
                    index="1"
                    chatID="ABCD123456"
                    rightPosition="50px"
                    chatTitle="ABCD123456"
                    ref="ABCD123456"
                    
                    minMaxChatBox = {this.minMaxChatBox}
                    closeChatBox = {this.closeChatBox}
                />
                <ChatBox
                    index="2"
                    chatID="wxyz09876"
                    rightPosition="350px"
                    chatTitle="wxyz09876"
                    ref="wxyz09876"

                    minMaxChatBox = {this.minMaxChatBox}
                    closeChatBox = {this.closeChatBox}
                />
            </Fragment>
        )
    }
}

