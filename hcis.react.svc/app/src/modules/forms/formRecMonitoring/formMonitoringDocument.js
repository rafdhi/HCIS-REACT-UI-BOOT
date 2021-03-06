import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMonitoringDocument extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monitoringData: props.monitoringData
        }
    }

    columnsDocument = [
        "No",
        {
            name: "Document Type",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <input type="checkbox" style={{ marginRight: 5 }} disabled checked={val !== "" ? true : false} />
                            {val}
                        </div>
                    );
                }
            }
        },
        {
            name: "Mandatory",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <input type="checkbox" disabled checked={val === true ? true : false} />
                        </div>
                    );
                }
            }
        },
        "Sequence",
        "Comment"
    ];

    render() {
        let { monitoringData } = this.state
        let dataTableDocument = monitoringData && monitoringData.recruitmentRequestDocumentDTOs.map((value, index) => {
            if(value === null) return []
            const { recruitmentDocumentType, documentMandatory, requestDocumentSequence, requestDocumentNotes } = value;
            return [
                index +=1,
                recruitmentDocumentType ? recruitmentDocumentType.bizparValue : "",
                documentMandatory,
                requestDocumentSequence,
                requestDocumentNotes,
            ]
        })

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px  grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Document'
                                data={dataTableDocument}
                                columns={this.columnsDocument}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormMonitoringDocument