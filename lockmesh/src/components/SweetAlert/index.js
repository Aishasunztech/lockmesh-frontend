import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Col, Row } from "antd";


class SweetAlerts extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="gx-main-content">
                {/* 
                    show:basic, withDes, success, warning, custom, html, prompt, password, style
                    success:true
                    warning:true
                    showCancel:
                    confirmBtnText:danger, default, info
                    confirmBtnBsStyle:danger, default, info
                    title:""
                    content:html_tags
                */}
                
                {/* <SweetAlert show={warning}
                    warning
                    showCancel
                    confirmBtnText={<IntlMessages id="sweetAlerts.yesDeleteIt" />}
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="default"
                    title={<IntlMessages id="sweetAlerts.areYouSure" />}
                    onConfirm={this.deleteFile}
                    onCancel={this.onCancelDelete}
                >
                    <IntlMessages id="sweetAlerts.youWillNotAble" />
                </SweetAlert>
                <SweetAlert show={custom}
                    custom
                    showCancel
                    confirmBtnText={<IntlMessages id="button.yes" />}
                    cancelBtnText={<IntlMessages id="button.no" />}
                    confirmBtnBsStyle="primary"
                    cancelBtnBsStyle="default"
                    customIcon='https://via.placeholder.com/500x330'
                    title={<IntlMessages id="sweetAlerts.doYouLikeThumb" />}
                    onConfirm={this.onConfirm}
                    onCancel={this.onCancel}
                >
                    <IntlMessages id="sweetAlerts.youWillFind" />
                </SweetAlert>
                <SweetAlert show={html}
                    customClass="gx-sweet-alert-top-space"
                    title={<span>HTML <small>Title</small>!</span>}
                    onConfirm={this.onConfirm}
                >
                    <span>A custom <span style={{ color: '#F8BB86' }}>html</span> message.</span>
                </SweetAlert>
                <SweetAlert show={prompt}
                    input
                    showCancel
                    cancelBtnBsStyle="default"
                    title={<IntlMessages id="sweetAlerts.anInput" />}
                    inputPlaceHolder={<IntlMessages id="sweetAlerts.anInput" />}
                    onConfirm={this.onConfirm}
                    onCancel={this.onCancel}
                    customClass="gx-sweet-alert-top-space"
                >
                    <IntlMessages id="sweetAlerts.basic" />{<IntlMessages id="sweetAlerts.writeSomething" />}
                </SweetAlert>
                <SweetAlert show={password}
                    customClass="gx-sweet-alert-top-space"
                    input
                    required
                    inputType="password"
                    title={<IntlMessages id="sweetAlerts.youMustEnterPassword" />}
                    validationMsg="You must enter your password!"
                    onConfirm={this.onConfirm}
                />
                <SweetAlert show={style}
                    title="Yay!"
                    customClass="gx-custom-sweet-alert gx-sweet-alert-top-space"
                    style={{ backgroundColor: '#008000', color: '#ffffff' }}
                    onConfirm={this.onConfirm}
                >
                    <IntlMessages id="sweetAlerts.itsBlue" />
                </SweetAlert> */}
            </div>
        )
    }
}

export default SweetAlerts;
