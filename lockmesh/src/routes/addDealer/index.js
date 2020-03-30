import React, { Component } from 'react';
import { Row, Card, Button, Divider, Form, Input, Select, Modal } from 'antd';
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { getDealerList, addDealer } from "../../appRedux/actions/Dealers";
import { ADMIN, DEALER, SDEALER, Name, Email, User_Name_require, Only_alpha_numeric, SELECT, Not_valid_Email, PLZ_INPUT_Email } from "../../constants/Constants";
import { convertToLang, checkIsArray } from '../utils/commonUtils';
import { SELECT_Dealer } from '../../constants/DealerConstants';

// const FormItem = Form.Item;
const { Option } = Select;
class AddDealer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validateStatus: 'success',
            help: null,
            btnLoading: false
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                btnLoading: nextProps.btnLoading
            })
        }
    }

    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)


        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }
    handleSubmit = (e) => {

        this.props.form.validateFields((err, values) => {
            console.log(values, 'name is the ')
            if (values.name === '' || values.name === undefined || (values.name != undefined ? values.name.trim() === '' : false)) {
                this.setState({
                    validateStatus: 'error',
                    help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
                })
            }
            else if (!err) {

                if (/[^A-Za-z \d]/.test(values.name)) {
                    this.setState({
                        validateStatus: 'error',
                        help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
                    })
                } else {
                    this.setState({
                        btnLoading: true
                    })
                    values.pageType = window.location.pathname.split("/").pop();
                    // values.dealerId = this.props.profile.dealerId;
                    values.name = values.name.trim();
                    this.props.addDealer(values);
                    // message.success('Action done Successfylly');
                    //  this.props.history.goBack();
                    //  this.props.getDealerList(window.location.pathname.split("/").pop()); 
                    // setTimeout(() => {
                    //     this.props.handleCancel(false);
                    // }, 1000);

                }
                // console.log('form values',values);
            }
        });
    }

    // componentDidUpdate(prevProps) {
    //     // console.log('this.props',this.props)
    //     if (this.props.navigate_to !== prevProps.navigate_to) {

    //         alert('its working');
    //     }
    // }

    componentDidMount() {
        // console.log('cmp');
        this.props.getDealerList('dealer', false);
    }

    render() {

        //  console.log('my test routs',  this.props.history)
        // if(window.location.pathname.split("/").pop() === 'sdealer')
        // {
        //     this.props.getDealerList( window.location.pathname.split("/").pop());
        // }

        let dealer_type = window.location.pathname.split("/").pop();
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                {/* <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 50 }}>

                </Row>

                <div style={{ marginTop: - 90 }}>
                    <Row>
                     
                        <Card style={{ borderRadius: 15, width: '100%', margin: 30, }}>
                            <div>
                                <h1 style={{float:"left", marginTop:"5px"}}>Add {dealer_type}</h1>
                                <Link to={`/dealer/${window.location.pathname.split("/").pop()}`} ><Button type="primary" style={{float:"right", marginBottom:"16px"}}>Back</Button></Link>
                                <Divider />   
                                 */}

                <Form  >
                    {
                        ((dealer_type !== DEALER) && (dealer_type === SDEALER) && (this.props.profile.type === ADMIN)) ?

                            <Form.Item
                                {...formItemLayout}
                                label={convertToLang(this.props.translation[SELECT], "Select")}
                                hasFeedback


                            >
                                {getFieldDecorator('dealerId', {
                                    rules: [{
                                        required: true, message: "Dealer  is Required",
                                    }],
                                })(
                                    <Select placeholder={convertToLang(this.props.translation[SELECT_Dealer], "Select Dealer")}>
                                        {checkIsArray(this.props.dealersList).map((dealer, index) => {
                                            return (<Option key={index} value={dealer.dealer_id} ><strong>{dealer.dealer_name}</strong> ({dealer.dealer_email})</Option>)
                                        })
                                        }

                                    </Select>
                                )}
                            </Form.Item> : false}

                    <Form.Item
                        {...formItemLayout}
                        label={convertToLang(this.props.translation[Name], "Name")}
                        validateStatus={this.state.validateStatus}
                        help={this.state.help}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is Required"),
                            }],
                        })(
                            <Input onChange={(e) => this.handleNameValidation(e)} />
                        )}
                    </Form.Item>

                    <Form.Item
                        {...formItemLayout}
                        label={convertToLang(this.props.translation[Email], "Email")}
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], "The input is not a valid E-mail!"),
                            }, {
                                required: true, message: convertToLang(this.props.translation[PLZ_INPUT_Email], "Please input your E-mail!"),
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <div className='submitButton' style={{ justifyContent: 'right', alignItems: 'right' }} >
                        <Button className='submitButton' onClick={this.handleSubmit} loading={this.state.btnLoading} >{this.props.dealerTypeText}</Button>
                        {/* <Button className='submitButton' onClick={this.showModal}  >Add Dealer </Button> */}
                    </div>

                </Form>

                {/* </div>
                        </Card>
                     

                    </Row>
                </div> */}
            </div>
        )
    }
}

const AddDealerForm = Form.create()(AddDealer);

var mapStateToProps = (dealers) => {
    // console.log("mapStateToProps");
    // console.log(dealers);
    // console.log('dealer', dealers);
    return {
        msg: dealers.dealers.msg,
        dealersList: dealers.dealers.parent_dealers,
        profile: dealers.auth.authUser,
        navigate_to: dealers.navigate_to,
    }
}
export default connect(mapStateToProps, { getDealerList, addDealer })(AddDealerForm)
