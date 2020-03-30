import React from "react";
import { Button, Form, Icon, Input, message } from "antd";
import { connect } from "react-redux";
// import {Link} from "react-router-dom";
import { convertToLang } from "../routes/utils/commonUtils";
import { hideMessage, showAuthLoader, loginUser } from "appRedux/actions/Auth";
import CircularProgress from "components/CircularProgress/index";
import { AUTO_UPDATE_ADMIN, SIGN_IN } from "../constants/Constants";
import { APP_TITLE } from "../constants/Application";

const FormItem = Form.Item;
var LoginExp = true;
var capsLockEnabled = null;



class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			demail: '',
			pwd: ''
		}

	}

	demailHandler = event => {
		this.setState({ demail: event.target.value });
	};

	pwdlHandler = event => {
		this.setState({ pwd: event.target.value });
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, user) => {
			if (!err) {
				this.props.showAuthLoader();
				this.props.loginUser(user);
			}
		});
	};

	componentDidMount() {
	}

	componentDidUpdate(prevProps) {
		if (this.props.showMessage) {
			setTimeout(() => {
				this.props.hideMessage();
			}, 100);
		}
		const { authUser, alertMessage } = this.props;
		// console.log(this.props.auth);
		if (
			this.props.auth.two_factor_auth === true ||
			this.props.auth.two_factor_auth === 1 ||
			this.props.auth.two_factor_auth === "true"
		) {
			// console.log("asdaddsa");
			this.props.history.push("/verify-auth");
		}

		if (
			authUser.id !== null &&
			authUser.email !== null &&
			authUser.token !== null &&
			authUser.type === AUTO_UPDATE_ADMIN
		) {
			// console.log("Updater");
			this.props.history.push("/apk-list/autoupdate");
		} else if (
			authUser.id !== null &&
			authUser.email !== null &&
			authUser.token !== null &&
			authUser.type !== null
		) {
			this.props.history.push("/");
		}

		if (this.props.showMessage) {
			if (alertMessage == "Login expired" && LoginExp) {
				message.error(alertMessage.toString());
				LoginExp = false;
			} else if (this.props.loginFailedStatus != prevProps.loginFailedStatus) {
				message.error(alertMessage.toString());
			}
			// else if (alertMessage == 'Invalid verification code') {
			//   message.error(alertMessage.toString())
			// }
		}
	}
	checkCapsLock = (e) => {
		let isCapsLock = e.getModifierState('CapsLock');
		let element = document.getElementById("text")
		if (isCapsLock) {
			element.style.display = "block"
		} else {
			element.style.display = "none"
		}

	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { showMessage, loader, alertMessage } = this.props;

		return (

			<div className="gx-app-login-wrap">
				<div className="gx-app-login-container">
					<div className="gx-app-login-main-content">
						<div className="gx-app-logo-content">
							<div className="gx-app-logo-content-bg" />
							<div className="gx-app-logo-wid" />
							<div className="gx-app-logo">
								<p className="mb-0" style={{ fontSize: 18 }}>
									<Icon type="lock" />
									{APP_TITLE}
								</p>
							</div>
						</div>
						<div className="gx-app-login-content">
							<Form
								onSubmit={this.handleSubmit}
								className="gx-signin-form gx-form-row0"
								autoComplete="off"
							>
								{/* <input autoComplete="off" name="hidden" type="text" style={{ display: 'none' }}></input> */}
								<FormItem>
									{getFieldDecorator("demail", {
										initialValue: "",
										setFieldsValue: this.state.demail,
										rules: [
											{
												required: true,
												type: "email",
												message: "Doesn't seem to be a valid Email ID"
											}
										]
									})(<Input type="email" placeholder="Email" autoComplete="new-password"
										onChange={this.demailHandler} />)}
								</FormItem>
								<FormItem>
									{getFieldDecorator("pwd", {
										initialValue: "",
										setFieldsValue: this.state.pwd,
										rules: [
											{
												required: true,
												message: "You forgot to enter your password"
											}
										]
									})(<Input.Password
										type="password" placeholder="Password" autoComplete="new-password"
										onKeyUp={(e) => { this.checkCapsLock(e) }}
										onChange={this.pwdHandler}
									/>)}
								</FormItem>
								<p id="text" style={{ display: 'none', color: 'red', margin: 0, padding: 0 }}>NOTE: Your CapsLock key is currently turned on</p>
								<FormItem>
									<Button type="primary" className="gx-mb-0" htmlType="submit">
										{convertToLang(this.props.translation[SIGN_IN], "SIGN IN")}
										{/* <IntlMessages id="app.userAuth.signIn" /> */}
									</Button>
								</FormItem>
							</Form>
						</div>

						{loader ? (
							<div className="gx-loader-view">
								<CircularProgress />
							</div>
						) : null}
						{/* {showMessage ?
              message.error(alertMessage.toString()) : null} */}
					</div>
				</div>
			</div>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(Login);

const mapStateToProps = ({ auth, settings }) => {
	// console.log(auth);

	const {
		loader,
		alertMessage,
		showMessage,
		authUser,
		loginFailedStatus
	} = auth;

	return {
		loader,
		alertMessage,
		showMessage,
		authUser,
		auth,
		loginFailedStatus,
		translation: settings.translation
	};
};

export default connect(
	mapStateToProps,
	{
		loginUser,
		hideMessage,
		showAuthLoader
	}
)(WrappedNormalLoginForm);
