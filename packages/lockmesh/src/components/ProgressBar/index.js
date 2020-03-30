import React, { Component } from "react";
import { Progress, Modal } from 'antd'
import CircularProgress from "../CircularProgress";

const ProgressBar = (props) => {
    return (
        <div>
            <Progress type="circle" percent={(props.completed / props.total) * 100} format={percent => `${props.completed} of ${props.total}`} />
        </div>
    )
}

export default ProgressBar;
