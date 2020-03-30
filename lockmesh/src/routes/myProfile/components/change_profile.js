import React, { Component } from 'react';
import { Modal, Button, Form, Input, message, Select } from 'antd';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { Change_Profile, User_Name_require, Name } from '../../../constants/Constants';
const { TextArea } = Input
let form_data = '';
const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombi",
    "Comoros",
    "Congo (Brazzaville)",
    "Congo",
    "Costa Rica",
    "Cote d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor (Timor Timur)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia, The",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea, North",
    "Korea, South",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia and Montenegro",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe"
];
export default class ChangeProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,

        }
    }
    showModal = () => {
        // console.log('lksdjkldafdsfaasdf');

        this.setState({
            visible: true,
            name: this.props.name,

        });
    }


    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        const { visible, loading } = this.state;
        const number = this.state.number;
        const tips = 'A prime is a natural number greater than ';

        return (
            <div>
                <Modal
                    visible={visible}
                    title={convertToLang(this.props.translation[Change_Profile], "Change Profile")}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={false}
                    // cancelText="Cancel"
                    className="prof_f_b"
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >

                    <EditFormCreate
                        profile={this.props.profile}
                        handleCancel={this.handleCancel}
                        updateUserProfile={this.props.updateUserProfile}
                        getUser={this.props.getUser}
                        translation={this.props.translation}

                    />

                </Modal>
            </div>
        )
    }
}


class EditForm extends Component {
    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('done', values);
                // console.log(values);
                this.props.updateUserProfile(values);
                this.props.handleCancel();

            }
        });
    }

    render() {

        return (
            <Form onSubmit={this.handleSubmit}>

                <Form.Item
                    label={convertToLang(this.props.translation[Name], "Name")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.profile.name,
                        rules: [{ required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is Required") }],
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Company Name")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('company_name', {
                        initialValue: this.props.profile.company_name,
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Company Address")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('company_address', {
                        initialValue: this.props.profile.company_address,
                    })(

                        <TextArea
                            autosize
                        />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "City")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('city', {
                        initialValue: this.props.profile.city,
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "State/Province")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('state', {
                        initialValue: this.props.profile.state,
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Country")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('country', {
                        initialValue: this.props.profile.country,
                    })(

                        <Select
                            showSearch
                            placeholder={convertToLang(this.props.translation[""], "Select Country")}
                            optionFilterProp="children"
                        >
                            {checkIsArray(countryList).map((Item) => {
                                return <Select.Option key={Item} value={Item}>{Item}</Select.Option>
                            })}
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Postal code")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('postal_code', {
                        initialValue: this.props.profile.postal_code,
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Tel#")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('tel_no', {
                        initialValue: this.props.profile.tel_no,
                    })(

                        <Input />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[""], "Website")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                    {this.props.form.getFieldDecorator('website', {
                        initialValue: this.props.profile.website,
                    })(

                        <Input />
                    )}
                </Form.Item>

                <Form.Item>
                    {this.props.form.getFieldDecorator('dealerId', {
                        initialValue: this.props.profile.dealerId,
                    })(

                        <Input type='hidden' />
                    )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                    <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                </Form.Item>
            </Form>

        )
    }
}

const EditFormCreate = Form.create({ name: 'Edit_form' })(EditForm);

