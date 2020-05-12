import React, { Component } from "react";
import * as R from 'ramda'
import M from 'moment'
import DropDown from '../../modules/popup/DropDown';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import Api from "../../Services/Api";
import PopUp from '../pages/PopUpAlert'
import CreateTravelExpense from './formTravelExpense/createTravelExpense'
import EditTravelExpense from './formTravelExpense/editTravelExpense'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class travelExpenseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createTravelExpense: false,
            editTravelExpense: false,
            viewTravelExpense: false,
            selectedIndex: null
        }
    }

    openCreate(type, selectedIndex) {
        if (type === "create") {
            this.setState({
                createTravelExpense: !this.state.createTravelExpense, selectedIndex: null
            })
        } else if (type === "edit") {
            console.log('masuk')
            this.setState({
                editTravelExpense: !this.state.editTravelExpense, selectedIndex
            })
        } else {
            this.setState({
                viewTravelExpense: !this.state.viewTravelExpense, selectedIndex
            })
        }
    }

    dataTable = [
        ["1", "RES-001", "Transportasi", "18-01-2020", "Rp.300.000", "INITIATE"],
        ["2", "RES-002", "Transportasi", "18-01-2020", "Rp.300.000", "INITIATE"],
    ]

    columns = [
        "No",
        "Settlement ID",
        "Settlement Type",
        "Date",
        "Amount",
        {
            name: "Status",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === "INITIATE"
                                            ? "orange"
                                            : val === "APPROVED"
                                                ? "brown"
                                                : val === "" || val === null
                                                    ? null
                                                    : val === "REJECTED"
                                                        ? "#424242"
                                                        : "gray",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val}
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btnAct"
                                style={{ marginRight: 10 }}
                                type="button"
                                onClick={() => this.openCreate("edit", tableMeta.rowIndex)}
                            >
                                <i
                                    className="fa fa-lw fa-pencil-alt"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#004c97",
                                        fontSize: 20
                                    }}
                                />
                            </button>
                            <button
                                className="btnAct"
                                type="button"
                                style={{ marginRight: 10 }}
                            // onClick={() => this.openPopupDelete(tableMeta.rowIndex)}
                            >
                                <i
                                    className="fa fa-lw fa-trash-alt"
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "red",
                                        fontSize: 20
                                    }}
                                />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openCreate("view", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];


    render() {
        let { createTravelExpense, editTravelExpense, viewTravelExpense, selectedIndex } = this.state
        return (
            <div className="app-popup app-popup-show">
                {createTravelExpense && (
                    <CreateTravelExpense
                        type={"create"}
                        onClickClose={() => this.openCreate("create")}
                    // onClickSave={this.handleCrud.bind(this)}
                    // data={this.data[selectedIndex]}
                    />
                )}
                {editTravelExpense && (
                    <EditTravelExpense
                        type={"edit"}
                        onClickClose={() => this.openCreate("edit")}
                        // onClickSave={this.handleCrud.bind(this)}
                        data={this.dataTable[selectedIndex]}
                    />
                )}
                {viewTravelExpense && (
                    <EditTravelExpense
                        type={"view"}
                        onClickClose={() => this.openCreate("view")}
                        // onClickSave={this.handleCrud.bind(this)}
                        data={this.dataTable[selectedIndex]}
                    />
                )}
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Business Trip - Settlement
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="display-flex-normals" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                        <div className='grid grid-2x' style={{ marginTop: 10, marginBottom: 10 }}>
                            <div className='column-1'></div>
                            <div className='column-2 content-right'>
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={() => this.openCreate("create")}
                                >
                                    <i className="fa fa-lg fa-plus" />
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={"Business Trip Settlement"}
                                    subtitle={"lorem ipsum dolor"}
                                    data={this.dataTable}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        );
    }
}
export default travelExpenseDetail;