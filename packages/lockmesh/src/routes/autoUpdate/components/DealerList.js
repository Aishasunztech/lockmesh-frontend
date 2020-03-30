import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table, Card } from "antd";
import CustomScrollbars from '../../../util/CustomScrollbars';




const DealerList = (props) => {
    // let selectedDealers = props.selectedDealers;
    // console.log(props.selectedRows);
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows
    };
    return (
        <Fragment>
            <Card className='fix_card'>
                <hr className="fix_header_border" style={{ top: "56px" }} />
                <CustomScrollbars className="gx-popover-scroll ">
                    <Table
                        bordered
                        rowSelection={rowSelection}
                        dataSource={props.dealers}
                        columns={props.columns}
                        onChange={this.handleTableChange}
                        hideDefaultSelections={props.hideDefaultSelections}
                    />
                </CustomScrollbars>
            </Card>
        </Fragment>
    )

}

export default DealerList;