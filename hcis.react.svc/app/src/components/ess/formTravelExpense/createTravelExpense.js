import React, { Component } from "react";
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from "../../../modules/popup/Calendar";
import FileViewer from "react-file-viewer";
import LoadingBar from "react-top-loading-bar";
import UploadFile from "../../../modules/upload/upload";
import * as R from "ramda";
import Api from "../../../Services/Api";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

// import EmployeeSearchForm from '../../modules/forms/formInbox/employeeSearchForm.js'

// const defaultData = {
//     "trainingExpenseID": "",
//     "trainingExpenseName": "",
//     "trainingExpensePIC": "",
//     "trainingExpenseReference": "",
//     "trainingExpenseAmount": '',
//     "trainingExpenseCOA": "",
//     "trainingExpenseDate": "",
//     "trainingExpenseDescription": "",
//     "trainingExpenseTrainingID": "",
//     "createdBy": "",
//     "createdDate": "",
//     "updatedBy": "",
//     "updatedDate": "",
// }

class createTravelExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: "idle",
            result: "",
            files: [],
            percentage: "0",
            message: "",
            // data: props.data ? props.data : { ...defaultData, trainingExpenseID: "TRNEXP-" + M() },
            // formSearchVisible: false
        }
    }

    openSearchEmployee() {
        // this.setState({ formSearchVisible: !this.state.formSearchVisible })
    }

    handleSearchPIC(value) {
        // let employee = value
        // this.setState({
        //     data: {
        //         ...this.state.data,
        //         trainingExpensePIC: employee.employeeID
        //     },
        //     formSearchVisible: false
        // })
    }

    handleFile(event) {
        let { data } = this.state;
        var url = event;
        var number = 1999;

        const formData = new FormData();
        formData.append("sppdID", number);
        formData.append("file", url);
        formData.append("updatedBy", "SYSTEM")
        formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

        this.setState({ formData, url });
    }

    getDocument(data) {
        let documents = [];
        // documents.push([data.split("document/sppd_doc/")]);
        // this.setState({
        //   documents
        // });
      }

    async uploadDocument(formData) { 
        if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
          this.setState({ uploadStatus: "upload" });
          if (this.state.url.type === "application/pdf") {
            let response = await Api.create("TIME").uploadSppdDoc(formData, {
              onUploadProgress: progress => {
                if (progress.lengthComputable) {
                  if (progress.total >= 1000000) {
                    this.setState({
                      result: "error",
                      percentage: "0",
                      uploadStatus: "idle"
                    });
                  } else {
                    var percentCompleted = Math.round(
                      (progress.loaded * 100) / progress.total
                    );
                    this.setState({ percentage: percentCompleted });
                    if (progress.loaded === progress.total) {
                      this.setState({ result: "success" });
                    }
                  }
                }
              }
            });
            if (!response.ok && response.status === 413) {
              alert("Your Document Too Large, Please Select Another Document");
              this.setState({ result: "error", percentage: "0" });
            }
            if (!response.ok && response.status === 500) {
              alert("Please Select Document");
              this.setState({ result: "error" });
            }
            if (!response.ok && R.isNil(response.status)) {
              alert(response.problem);
              this.setState({ result: "error" });
            }
    
            if (!R.isNil(response.data)) {
              switch (response.data.status) {
                case "S":
                  if (response.data.code === "201") {
                    this.setState({
                      result: "success"
                    })
                    // this.props.getData()
                    this.getDocument(this.state.url);
                  } else alert("Failed: " + response.data.message);
                  break;
                default:
                  break;
              }
            }
          } else {
            alert("Unsupported File Type");
          }
        }
      }

    columnsDocument = [
        {
            name: "Document",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i className="fa fa-lw fa-file" style={{ marginRight: 5 }} />
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
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                            // onClick={() => this.getReport()}
                            >
                                {val}
                                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                            //   onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-times" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    render() {
        let { data, formSearchVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                {
                                    this.props.type === "create" ? "Business Trip Settlement - Create Detail" :
                                        this.props.type === "edit" ? "Business Trip Settlement - Edit Detail" : "Business Trip Settlement - View Detail"}
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
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(this.props.type, data)
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Settlement ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    // value={data.trainingExpenseID}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Business Trip Item</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        type='bizpar'
                                        title=' -- please select item --'
                                        disabled={this.props.type === "view" ? true : false}
                                    // value={data.trainingExpenseCOA}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>
                                                Date <span style={{ color: "red" }}>*</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        disabled={this.props.type === "view" ? true : false}
                                    // date={data.trainingExpenseDate && M(data.trainingExpenseDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                                    // onChange={e => this.setState({ data: { ...data, trainingExpenseDate: e } })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Amount</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    // value={data.trainingExpenseAmount}
                                    // onChange={(e) => this.setState({
                                    //     data: { ...data, trainingExpenseAmount: e.target.value }
                                    // })}
                                    />
                                </div>
                                <div className="padding-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Note</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        rows={6}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                    // value={data.trainingExpenseDescription}
                                    // onChange={(e) => this.setState({
                                    //     data: { ...data, trainingExpenseDescription: e.target.value }
                                    // })}
                                    ></textarea >
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            data={
                                                // this.state.payloadSppd.sppdDocumentURL === ""
                                                //     ? this.dataDocument: 
                                                    this.state.documents
                                            }
                                            columns={this.columnsDocument}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div className="margin-bottom-20px">
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

                                    <div className="padding-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            <h4>File<span style={{ color: "red" }}>(Format file: pdf)</span>
                                            </h4>
                                        </span>
                                    </div>

                                    <UploadFile
                                        type={this.state.uploadStatus}
                                        percentage={this.state.percentage}
                                        result={this.state.result}
                                        acceptedFiles={["pdf"]}
                                        onHandle={(dt) => {
                                            this.handleFile(dt)
                                            this.setState({ uploadStatus: 'idle', percentage: '0' })
                                        }}
                                        onUpload={() => {
                                            this.uploadDocument(this.state.formData);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </button>
                                    ) : null}
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
                <div className="padding-bottom-20px" />
            </div >
        );
    }
}
export default createTravelExpense;
