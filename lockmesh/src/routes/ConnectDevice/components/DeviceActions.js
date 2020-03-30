import React, { Component } from 'react'
import { Button } from "antd";
import { convertToLang } from '../../utils/commonUtils';
import { Button_Apply, Button_Undo, Button_Redo, Button_Clear } from '../../../constants/ButtonConstants';


const DeviceActions = (props) => {
    return (
        <Button.Group className="act_b_grp">
            <Button type="default" icon="check" disabled={!props.applyBtn} onClick={() => { props.applyActionButton() }} className="action_btn clr_green" >
                {convertToLang(props.translation[Button_Apply], "Apply")}
            </Button>
            <Button type="default" icon="undo" disabled={!props.undoBtn} onClick={() => { props.undoApplications() }} className="action_btn clr_orange" >
                {convertToLang(props.translation[Button_Undo], "Undo")}
            </Button>
            <Button type="default" icon="redo" disabled={!props.redoBtn} onClick={() => { props.redoApplications() }} className="action_btn clr_orange" >
                {convertToLang(props.translation[Button_Redo], "Redo")}
            </Button>
            <Button type="default" icon="close" disabled={!props.clearBtn} onClick={() => { props.clearApplications() }} className="action_btn clr_red" >
                {convertToLang(props.translation[Button_Clear], "Clear")}
            </Button>
        </Button.Group>
    )

}
export default DeviceActions;