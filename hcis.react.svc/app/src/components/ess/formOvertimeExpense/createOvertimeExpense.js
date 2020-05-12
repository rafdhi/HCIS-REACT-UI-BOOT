import React, { Component } from "react";
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from "../../../modules/popup/Calendar";
import TimePicker from "../../../modules/popup/Time";
import PopUp from "../../../components/pages/PopUpAlert";
import FileViewer from "react-file-viewer";
import LoadingBar from "react-top-loading-bar";
import UploadFile from "../../../modules/upload/upload";
import * as R from "ramda";
import Api from "../../../Services/Api";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

const defaultData = {
    overtimeSettlementID: "OSE-" + M(),
    overtimeID: "",
    date: "",
    employeeName: "",
    NIK: '',
    headEmployeeName: "",
    overtimeType: "",
    startTime: "",
    endTime: "",
    Reason: "",
    realizationStartTime: "",
    realizationEndTime: "",
    realizationReason: "",
    docURL: "",
    overtimeID: "",
    overtimeResponsibilityCommandDTO: {
        creationalSpecificationDTO: {
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: ""
        },
        overtimeResponsibilityID: "",
        overtimeResponsibilityDocumentURL: "",
        overtimeResponsibilityStartDate: "",
        overtimeResponsibilityEndDate: "",
        overtimeResponsibilityReason: ""
    },
    updatedBy: "",
    updatedDate: ""

}

class createOvertimeExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadStatus: "idle",
            result: "",
            files: [],
            percentage: "0",
            message: "",
            deletePopUpVisible: false,
            settleID : 'OVR-' + M(),
            payloadOvertime:
            {
                ...props.data,
                overtimeResponsibility:{
                    ...props.data.overtimeResponsibility,
                overtimeResponsibilityDocumentURL:
            this.props.type === "edit"
              ? props.data.overtimeResponsibility.overtimeResponsibilityDocumentURL
              : ""
                }
            }
            }     
            // console.log(JSON.stringify(this.state.data))  
    }

    // componentDidUpdate() {
    //     this.getDocument(this.props.data)
    // }

    // componentDidUpdate(prevProps) {
    //     if (this.props.type !== "create" && this.props.data !== undefined) {
    //       if (this.props.data !== prevProps.data) {
    //         this.setState({
    //           data: this.props.data,
    //           sendState: "",
    //           data: {
    //             ...this.state.data,
    //             overtimeResponsibilityStartDate:
    //               this.props.data.overtimeResponsibility.overtimeResponsibilityStartDate === "Invalid date"
    //                 ? ""
    //                 : M(
    //                   this.props.data.overtimeResponsibility.overtimeResponsibilityStartDate,
    //                   "DD-MM-YYYY HH:mm:ss"
    //                 ).format("HH:mm"),
    //             overtimeResponsibilityEndDate:
    //               this.props.data.overtimeResponsibility.overtimeResponsibilityEndDate === "Invalid date"
    //                 ? ""
    //                 : M(
    //                   this.props.data.overtimeResponsibility.overtimeResponsibilityEndDate,
    //                   "DD-MM-YYYY HH:mm:ss"
    //                 ).format("HH:mm"),
    //                 overtimeResponsibilityReason: this.props.data.overtimeResponsibility.overtimeResponsibilityReason
    //           }
    //         });
    //       }
    //     }
    //   }

    componentDidMount() {
        this.getDocument(this.state.payloadOvertime);
    }

    openDeletePopup = selectedIndex => {
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible,
          selectedIndex
        });
      };

    handleFile(event) {
        let { payloadOvertime } = this.state;
        var url = event;
        var number = payloadOvertime.overtimeID;

        const formData = new FormData();
        formData.append("overtimeID", number);
        formData.append("file", url);
        formData.append("updatedBy", "SYSTEM")
        formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))

        this.setState({ formData, url });
    }

    getDocument(payloadOvertime) {
        console.log(payloadOvertime)
        let documents = [];
    documents.push([payloadOvertime.overtimeResponsibility.overtimeResponsibilityDocumentURL.split("document/overtime_responsibility_doc/")]);
    this.setState({
      documents,
      result: null
    });
    }

    async uploadDocument(formData) {
        if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
            this.setState({ uploadStatus: "upload" });
            if (this.state.url.type === "application/pdf") {
                let response = await Api.create("TIME").uploadOvertimeResDoc(formData, {
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
                                    payloadOvertime:{
                                        ...this.state.data
                                    },
                                    result: "success"
                                })
                                // this.props.getData()
                                this.getDocument(this.state.payloadOvertime);
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

    deleteDocument() {
        let documents = [];
        documents = [];
        this.setState({
          documents,
          payloadOvertime: {
            ...this.state.payloadOvertime,
            overtimeResponsibility:{
                ...this.state.overtimeResponsibility,
                overtimeResponsibilityDocumentURL:""
            }
          }
        });
        this.openDeletePopup();
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
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
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
        let resStartDate = this.state.payloadOvertime.overtimeResponsibility !== null ? M(this.state.payloadOvertime.overtimeResponsibility.overtimeResponsibilityStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm') : "00:00"
        let resEndDate = this.state.payloadOvertime.overtimeResponsibility !== null ? M(this.state.payloadOvertime.overtimeResponsibility.overtimeResponsibilityEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm') : "00:00"

        let {payloadOvertime} = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                OVERTIME SETTLEMENT - {this.props.type === 'create' ? 'CREATE' : 'EDIT'} FORM
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
                            let typeSave = this.state.typeSave;
                            switch (typeSave) {
                                case "final":
                                    this.props.onClickSubmit(this.state.payloadOvertime);
                                    break;
                                default:
                                    this.props.onClickSave(this.state.payloadOvertime,this.state.settleID)
                                    break;
                            }
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Overtime Settlement ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={this.props.type === 'create' ? this.state.settleID : payloadOvertime.overtimeResponsibility.overtimeResponsibilityID}
                                    />
                                </div>

                                <div className="margin-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Overtime ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={payloadOvertime.overtimeID}
                                    />
                                </div>
                                <div className="margin-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>
                                                Current Date & Time
                                            </h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        date={payloadOvertime.overtimeDate && M(payloadOvertime.overtimeDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                                    // onChange={e => this.setState({ data: { ...data, trainingExpenseDate: e } })}
                                    />
                                </div>
                                <div className="margin-bottom-10px grid grid-2x">
                                    <div className="column-1">
                                        <div style={{ marginRight: '10px' }}>
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Employee Name</h4>
                                                </div>
                                            </div>
                                            <input
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                value={payloadOvertime.employee.employeeName}
                                            />
                                        </div>
                                    </div>
                                    <div className="column-2">
                                        <div style={{ marginLeft: '10px' }}>
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>NIK</h4>
                                                </div>
                                            </div>
                                            <input
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                value={payloadOvertime.employee.employeeID}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Head Employee Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        // value={data.approvalManagers !== [] && !null ? data.approvalManagers[0].employeeName : ""}
                                    />
                                </div>
                                <div className="margin-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Overtime Type</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        type='bizpar'
                                        title=' -- please select item --'
                                        disabled
                                        data={this.props.bizparOvertimeType}
                                        value={payloadOvertime.overtimeType.corporateOvertimeID}
                                    />
                                </div>
                                <div className="margin-bottom-10px grid grid-2x">
                                    <div className="column-1">
                                        <div style={{ marginRight: '10px' }}>
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>
                                                        Start Time <span style={{ color: "red" }}>*</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <TimePicker
                                                time={M(payloadOvertime.overtimeStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm')}
                                                // onChange={e => {
                                                //     this.setState({
                                                //         payloadOvertime: {
                                                //             ...this.state.payloadOvertime,
                                                //             overtimeStartDate: e
                                                //         }
                                                //     });
                                                // }}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="column-2">
                                        <div style={{ marginLeft: '10px' }}>
                                            <div className="margin-5px" style={{ marginLeft: '10px' }}>
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>
                                                        End Time <span style={{ color: "red" }}>*</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <TimePicker
                                                time={M(payloadOvertime.overtimeEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm')}
                                                // onChange={e => {
                                                //     this.setState({
                                                //         payloadOvertime: {
                                                //             ...this.state.payloadOvertime,
                                                //             overtimeEndDate: e
                                                //         }
                                                //     });
                                                // }}
                                                disabled
                                                style={{ backgroundColor: "#E6E6E6" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="padding-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Reason <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <textarea
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        rows={3}
                                        disabled
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={payloadOvertime.overtimeNotes}
                                        // onChange={(e) => this.setState({
                                        //     data: { ...data, trainingExpenseDescription: e.target.value }
                                        // })}
                                    ></textarea >
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-10px grid grid-2x">
                                    <div className="column-1">
                                        <div style={{ marginRight: '10px' }}>
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>
                                                        Realization Start Time <span style={{ color: "red" }}>*</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <TimePicker
                                                time={resStartDate}
                                                onChange={e => {
                                                    this.setState({
                                                        payloadOvertime: {
                                                            ...this.state.payloadOvertime,
                                                            overtimeResponsibility:{
                                                                ...payloadOvertime.overtimeResponsibility,
                                                                overtimeResponsibilityStartDate: e}
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="column-2">
                                        <div style={{ marginLeft: '10px' }}>
                                            <div className="margin-5px" style={{ marginLeft: '10px' }}>
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>
                                                        Realization End Time <span style={{ color: "red" }}>*</span>
                                                    </h4>
                                                </div>
                                            </div>
                                            <TimePicker
                                                time={resEndDate}
                                                onChange={e => {
                                                    this.setState({
                                                        payloadOvertime: {
                                                            ...payloadOvertime,
                                                            overtimeResponsibility:{
                                                                ...payloadOvertime.overtimeResponsibility, 
                                                                overtimeResponsibilityEndDate: e}
                                                        }
                                                    });
                                                }}   
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="padding-bottom-10px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Realization Reason <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <textarea
                                        rows={5}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={payloadOvertime.overtimeResponsibility!==null ? payloadOvertime.overtimeResponsibility.overtimeResponsibilityReason : ""}
                                        onChange={(e) => this.setState({
                                            payloadOvertime: { ...payloadOvertime,overtimeResponsibility:{...this.state.payloadOvertime.overtimeResponsibility, overtimeResponsibilityReason: e.target.value} }
                                        })}
                                    ></textarea >
                                </div>
                                <div className="margin-bottom-20px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            data={
                                                this.state.payloadOvertime.overtimeResponsibility.overtimeResponsibilityDocumentURL === ""
                                                 ? this.dataDocument
                                                 : this.state.documents
                                            }
                                            columns={this.columnsDocument}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div className="margin-bottom-10px">
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
                                <div className="padding-15px" style={{ paddingTop: '70px' }}>
                                    <div className="content-right">
                                        <button
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </button>
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                            onClick={() => {
                                                this.setState({
                                                    typeSave: "final"
                                                });
                                            }}
                                        >
                                            <span>SAVE & SUBMIT</span>
                                        </button>
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
                        </div>
                    </form>

                    {this.state.deletePopUpVisible && (
                <PopUp
                  type={"delete"}
                  class={"app-popup app-popup-show"}
                  onClickDelete={this.deleteDocument.bind(this)}
                  onClick={this.openDeletePopup.bind(this)}
                />
              )}
                </div >
            </div >
        )
    }

}

export default createOvertimeExpense;