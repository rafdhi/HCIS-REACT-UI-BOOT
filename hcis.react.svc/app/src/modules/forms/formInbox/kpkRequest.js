import React, { Component } from "react"
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown';
import { Rabbit as Button } from 'react-button-loaders'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import Api from "../../../Services/Api";
import M from "moment";
import AuthAction from "../../../Redux/AuthRedux";
import { connect } from "react-redux";
import uuid from 'uuid'
import { Multiselect } from 'multiselect-react-dropdown';
import NumberFormat from "react-number-format";

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class kpkRequest extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: this.props.user,
            statusKontrak: false,
            grade: '',
            salary: "",
            year: "",
            notes: ''
        }
    }

    componentDidMount() {
        console.log(this.props.type, this.props.data)
        this.getDataApplicant()
    }

    getDataApplicant() {
        Api.create("RECRUITMENT_QUERY").getApplicantById(this.props.data.variables.TASK_REFNO).then((response) => {
            this.setState({
                name: response.data.data.applicantName,
                gender: response.data.data.applicantGender.bizparValue,
                bod: response.data.data.applicantBirthDate,
                education: response.data.data.applicantFormalEducations[0].formalEducationLevel.bizparValue,
                status: response.data.data.applicantRecruitmentRequestDTO.recruitmentCategory.bizparValue,
                statusKontrak: response.data.data.applicantRecruitmentRequestDTO.recruitmentCategory.bizparValue === 'TETAP' ? false : true,
                position: response.data.data.applicantRecruitmentRequestDTO.recruitmentRequestPositionDTOs[0].positionName,
                ipk: response.data.data.applicantFormalEducations[0].formalEducationIPK === null ? 0 : response.data.data.applicantFormalEducations[0].formalEducationIPK,
                kpkType: this.props.data.variables.KPK_TYPE
            })

            let location = []
            response.data.data.applicantDesireWorkingLocations.map(item => {
                location.push({
                    name: item
                })
            })

            let dataWE = []
            let positionWE
            let dataTableWE = response.data.data.applicantWorkExperiences.map(item => {
                dataWE.push({ data: item })
                positionWE = item.workExperiencePosition.split('-', 2)
                return [
                    item.workExperienceStartDate + '|' + item.workExperienceEndDate,
                    item.workExperienceCompany,
                    positionWE[0] + '|' + positionWE[1],
                    item.workExperienceResignationReason
                ]
            })
            this.setState({ dataTableWE, location, limitSelected: location.length, dataWE, positionWE })
        })
    }

    validasi() {
        console.log(this.state.dataWE[0].data.workExperienceEndDate)
        let { userID, employeeID } = this.state.user
        if (this.state.statusKontrak === true && this.state.year === '') {
            alert('Year is required')
        } else if (this.state.salary === '') {
            alert('Basic Salary is required')
        } else if (this.state.grade === '') {
            alert('Grade is required')
        } else if (this.state.notes === '') {
            alert('Special Notes is required')
        } else {
            let payload = {
                "taskID": this.props.data.taskID,
                "senderUserID": this.props.data.variables.SENDER_USERID,
                "senderEmpID": this.props.data.variables.SENDER_EMPID,
                "senderNotes": this.state.notes,
                "senderBPMStatus": "APPROVE",
                "data": {
                    "applicantNumber": this.props.data.variables.TASK_REFNO,
                    "kpkID": "KPK-BPM-" + M(),
                    "isDeal": "OK",
                    "basicSalary": Number(this.state.salary.split(",").join("")),
                    "allowance": "cek",
                    "allowanceOther": "cek",
                    "allowanceValue": 100,
                    "allowanceOtherValue": 100,
                    "contractDuration": Number(this.state.year),
                    "kpkNotes": this.state.notes,
                    "appGradeID": this.state.grade,
                    "kpkWorkExperiences": [
                        {
                            "kpkWECompanyName": this.state.dataWE[0].data.workExperienceCompany,
                            "kpkWEEndYear": Number(M(this.state.dataWE[0].data.workExperienceEndDate, 'DD-MM-YYYY').format('YYYY')),
                            "kpkWEID": this.state.dataWE[0].data.applicantWorkExperienceID,
                            "kpkWEPositionEnd": this.state.positionWE[0],
                            "kpkWEPositionStart": this.state.positionWE[1],
                            "kpkWEResignationReason": this.state.dataWE[0].data.workExperienceResignationReason,
                            "kpkWEStartYear": Number(M(this.state.dataWE[0].data.workExperienceStartDate, 'DD-MM-YYYY').format('YYYY'))
                        }
                    ],
                    "kpkStatus": "INITIATE",
                    "kpkType": this.props.data.variables.KPK_TYPE,
                    "ouid": this.props.data.variables.SENDER_OUID,
                    "esID": this.props.data.variables.SENDER_ESID,
                    "updatedBy": employeeID,
                    "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                    "recordID": uuid.v4()
                }
            } 
            this.props.handleSubmit(payload)
            console.log(payload)    
        }
    }

    columns = [
        {
            name: "Year",
            options: {
                filter: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid", position: "sticky" }}>{columnMeta.name}</div>
                        <div className="grid grid-2x" style={{ fontSize: 13, fontWeight: 1, position: "sticky" }}>
                            <div className="col-1">
                                {"Start"}
                            </div>
                            <div className="col-2">
                                {"End"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div className="grid grid-2x" style={{ textAlign: "center" }}>
                        <div className="col-1">
                            {val.split("|")[0]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[1]}
                        </div>
                    </div>
                ),
            }
        },
        {
            name: "Company Name",
            options: {
                customHeadRender: (columnMeta, updateDirection) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        <div style={{ position: "sticky" }}>{columnMeta.name}</div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div style={{ textAlign: "center" }}>
                        {val}
                    </div>
                )
            }
        },
        {
            name: "Position",
            options: {
                filter: false,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid", position: "sticky" }}>{columnMeta.name}</div>
                        <div className="grid grid-2x" style={{ fontSize: 13, fontWeight: 1, position: "sticky" }}>
                            <div className="col-1">
                                {"First"}
                            </div>
                            <div className="col-2">
                                {"Last"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div className="grid grid-2x" style={{ textAlign: "center" }}>
                        <div className="col-1">
                            {val.split("|")[0]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[1]}
                        </div>
                    </div>
                ),
            }
        },
        {
            name: "Resign Reason",
            options: {
                customHeadRender: (columnMeta, updateDirection) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        <div style={{ position: "sticky" }}>{columnMeta.name}</div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div style={{ textAlign: "center" }}>
                        {val}
                    </div>
                )
            }
        },
    ]

    render() {
        return (
            <div className='app-popup app-popup-show'>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Keputusan Penerimaan Karyawan (KPK)
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
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                    }}
                    >
                        <div className="padding-15px" >
                            <div className="app-open-close margin-top-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-kpkGeneral"
                                />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-globe margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">
                                                Corporate Global Policy
                                </span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-kpkGeneral">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div className="grid grid-2x gap-20px">
                                        <div className="column-1">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Name</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.name}
                                                />
                                            </div>
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Date Of Birth</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.bod}
                                                />
                                            </div>
                                        </div>
                                        <div className="column-2">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Gender</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.gender}
                                                />
                                            </div>
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Education</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.education}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="app-open-close margin-top-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-accEmp"
                                />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-globe margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">
                                                Accepted as an employee of Bank Artha Graha with the following conditions:
                                </span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-accEmp">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div className="grid grid-2x gap-20px">
                                        <div className="column-1">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Status</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.status}
                                                />
                                            </div>

                                            {this.state.statusKontrak && (
                                                <div className="margin-bottom-15px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Year</h4>
                                                        </div>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <div className="card-date-picker">
                                                            <div className="double">
                                                                <NumberFormat
                                                                    required
                                                                    className="txt txt-sekunder-color"
                                                                    placeholder=""
                                                                    onChange={(e) => this.setState({
                                                                        year: e.target.value
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Position</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.position}
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="column-2">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Location</h4>
                                                    </div>
                                                </div>
                                                <Multiselect
                                                    selectedValues={this.state.location === null ? "" : this.state.location}
                                                    disablePreSelectedValues={true}
                                                    closeOnSelect={true}
                                                    selectionLimit={String(this.state.limitSelected)}
                                                    placeholder={this.state.limitSelected === 0 ? "Null" : ""}
                                                    // options={this.state.gradeData} // Options to display in the dropdown 
                                                    displayValue="name" // Property name to display in the dropdown options
                                                // options={this.state.provinceData}
                                                />
                                            </div>
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>GPA</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    value={this.state.ipk}
                                                />
                                            </div>
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>IQ</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <div className="grid grid-2x gap-20px">
                                            <div className="column-1">
                                                <div className="grid grid-2x gap-20px">
                                                    <div className="column-1">
                                                        <div className="margin-bottom-15px">
                                                            <div className="margin-5px">
                                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                                    <h4>Basic Salary</h4>
                                                                </div>
                                                            </div>
                                                            <div className="margin-5px">
                                                                <div className="card-date-picker">
                                                                    <div className="double">
                                                                        <NumberFormat
                                                                            thousandSeparator={true}
                                                                            required
                                                                            className="txt txt-sekunder-color"
                                                                            placeholder=""
                                                                            onChange={(e) => this.setState({
                                                                                salary: e.target.value
                                                                            })}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="column-2">
                                                        <div className="margin-bottom-15px">
                                                            <div className="margin-5px">
                                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                                    <h4>Grade</h4>
                                                                </div>
                                                            </div>
                                                            <DropDown
                                                                type='bizpar'
                                                                title=' -- please select item --'
                                                                data={[
                                                                    { bizparKey: 'GOLONGAN 1', bizparValue: 'GOLONGAN 1' },
                                                                    { bizparKey: 'GOLONGAN 2', bizparValue: 'GOLONGAN 2' },
                                                                    { bizparKey: 'GOLONGAN 3', bizparValue: 'GOLONGAN 3' },
                                                                    { bizparKey: 'GOLONGAN 4', bizparValue: 'GOLONGAN 4' },
                                                                ]}
                                                                onChange={e => this.setState({
                                                                    grade: e
                                                                })}
                                                                disabled={this.props.type === "view"}
                                                                style={
                                                                    this.props.type === "view"
                                                                        ? { backgroundColor: "#E6E6E6" }
                                                                        : null
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="column-2">
                                                <div className="grid grid-2x gap-20px">
                                                    <div className="column-1">
                                                        <div className="margin-bottom-15px">
                                                            <div className="margin-5px">
                                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                                    <h4>Positional Allowance, as :</h4>
                                                                </div>
                                                            </div>
                                                            <input
                                                                readOnly
                                                                style={{ backgroundColor: "#E6E6E6" }}
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                required
                                                            />
                                                        </div>
                                                        {this.state.kpkType === "STAFF" ? 
                                                            <div className="margin-bottom-15px">
                                                                <div className="margin-5px">
                                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                                        <h4>Other Allowance</h4>
                                                                    </div>
                                                                </div>
                                                                <input
                                                                    readOnly
                                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                                    type="text"
                                                                    className="txt txt-sekunder-color"
                                                                    placeholder=""
                                                                    required
                                                                />
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                    <div className="column-2">
                                                        <div className="margin-bottom-15px">
                                                            <div className="margin-5px">
                                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                                    <h4>Amount</h4>
                                                                </div>
                                                            </div>
                                                            <input
                                                                readOnly
                                                                style={{ backgroundColor: "#E6E6E6" }}
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                required
                                                            />
                                                        </div>
                                                        {this.state.kpkType === "STAFF" ? 
                                                        <div className="margin-bottom-15px">
                                                            <div className="margin-5px">
                                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                                    <h4>Amount</h4>
                                                                </div>
                                                            </div>
                                                            <input
                                                                readOnly
                                                                style={{ backgroundColor: "#E6E6E6" }}
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                required
                                                            />
                                                        </div> : null }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="app-open-close margin-top-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-workExp"
                                />
                                <div className="grid grid-2x margin-bottom-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-globe margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">
                                                Work Experience
                                </span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-workExp">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div className="padding-5px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                data={this.state.dataTableWE}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    <div className="grid grid-2x gap-20px padding-15px">
                                        <div className="column-1">
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Special Notes</h4>
                                                    </div>
                                                </div>
                                                <div class="input-border form-group">
                                                    <textarea
                                                        class="form-control rounded-0"
                                                        type="text"
                                                        required
                                                        placeholder=""
                                                        rows={"5"}
                                                        onChange={(e) => this.setState({
                                                            notes: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    <button
                                        onClick={() => this.validasi()}
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="submit"
                                    >
                                        <span>SAVE</span>
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
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(kpkRequest);
