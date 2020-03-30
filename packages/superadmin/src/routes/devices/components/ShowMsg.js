import React, { Component } from 'react'

export default class ShowMsg extends Component {

constructor(props)
{
    super(props);

    this.state={
        msg:this.props.msg,
        showMsg:false
    }    

}

  render() {

    // console.log("showMsg");
    // console.log(this.props);
    
      if(this.props.showMsg){
          // console.log(this.props.msg);
      }
    return (
      null
    );
  }
}
