import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCreateMedical from './formMedical'
import FormCrime from './formCrime'
import FormReference from './formOtherReference'
import PopUp from '../../components/pages/PopUpAlert'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import API from '../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");

class formOtherInformationApplicant extends Component {
    constructor(props) {
        super(props)
        // let { applicantData } = this.props
        this.state = {
            // applicantData,
            createMedicalVisible: false,
            createCrimeVisible: false,
            createReferenceVisible: false,
            editMedicalVisible: false,
            editCrimeVisible: false,
            editReferenceVisible: false,
            viewMedicalVisible: false,
            viewCrimeVisible: false,
            viewReferenceVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            notifVisible: false,
            message: "",
            auth: props.auth,
            sendState: "",
            defaultValue: []
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();
    opPopupPage = menu => e => {
        e.preventDefault();

        this.setState({
            createMedicalVisible: false,
            createCrimeVisible: false,
            createReferenceVisible: false,
            editMedicalVisible: false,
            editReferenceVisible: false,
            editCrimeVisible: false,
            viewMedicalVisible: false,
            viewCrimeVisible: false,
            viewReferenceVisible: false
        });

        this.clPopupPage();
        switch (menu) {
            case "create-medical":
                this.setState({
                    createMedicalVisible: true,
                    editMedicalVisible: false,
                    editCrimeVisible: false,
                    editReferenceVisible: false,
                });
                break;
            case "edit-medical":
                this.setState({
                    createMedicalVisible: false,
                    editMedicalVisible: true,
                    editCrimeVisible: false,
                    editReferenceVisible: false,
                });
                break;
            case "create-crime":
                this.setState({
                    createCrimeVisible: true,
                    editMedicalVisible: false,
                    editCrimeVisible: false,
                    editReferenceVisible: false,
                });
                break;
            case "edit-crime":
                this.setState({
                    editCrimeVisible: true,
                });
                break;
            case "view-crime":
                this.setState({
                    viewCrimeVisible: true,
                });
                break;
            case "create-reference":
                this.setState({
                    createReferenceVisible: true,
                    editMedicalVisible: false,
                    editCrimeVisible: false,
                    editReferenceVisible: false,
                });
                break;
            case "edit-reference":
                this.setState({
                    editReferenceVisible: true,
                });
                break;
            case "view-reference":
                this.setState({
                    viewReferenceVisible: true,
                });
                break;
            default:
                break;
        }
    };

    clPopupPage = () => {
        let savePopUpVisible = this.state.savePopUpVisible
            ? !this.state.savePopUpVisible
            : false;
        this.setState({
            createMedicalVisible: false,
            createCrimeVisible: false,
            createReferenceVisible: false,
            savePopUpVisible
        });
    };

    openCloseCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({
            createMedicalVisible: false,
            createReferenceVisible: false,
            createCrimeVisible: false,
            createPopUpVisible
        });
    }

    openCloseEdit(selectedIndex) {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({
            editMedicalVisible: false,
            editReferenceVisible: false,
            editCrimeVisible: false,
            createPopUpVisible
        });
    }

    openCloseView(selectedIndex) {
        this.setState({
            viewMedicalVisible: false,
            viewReferenceVisible: false,
            viewCrimeVisible: false
        });
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    // handleSubmit(value, type = "") {
    //     this.setState({ defaultValue: value, sendState: "loading" })
    //     let { applicantReferences, applicantNumber } = this.state.applicantData
    //     let data = Object.assign([], applicantReferences)
    //     data = data.map((value, index) => {
    //         return {
    //             ...value,
    //             referenceType: value.referenceType.bizparKey
    //         }
    //     })

    //     switch (type) {
    //         case "create":
    //             value = {
    //                 ...value,
    //                 applicantReferenceID: "R-" + M(),
    //                 referenceType: value.referenceType.bizparKey
    //             }
    //             data.push(value)
    //             break;
    //         case "edit":
    //             value = {
    //                 ...value,
    //                 referenceType: value.referenceType.bizparKey
    //             }
    //             let status = R.findIndex(R.propEq('applicantReferenceID', value.applicantReferenceID))(data)
    //             if (status >= 0) {
    //                 data[status] = value
    //             }
    //             break;
    //         case "delete":
    //             data.splice(this.state.selectedIndex, 1)
    //             break;
    //         default:
    //             break;
    //     }

    //     applicantReferences = data
    //     let payload = {
    //         applicantNumber,
    //         applicantReferences,
    //         "updatedBy": this.state.auth.user.employeeID,
    //         "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    //     }

    //     this.connectWebsocket(type)
    //     API.create('RECRUITMENT').updateApplicantReference(payload).then(
    //         (res) => {
    //             if (res.status === 200) {
    //                 if (res.data.status === 'S') {
    //                     console.log(res.data)
    //                     this.props.openSavePopUp()
    //                     if (type !== "delete") this.setState({
    //                         // createPopUpVisible: true,
    //                         // createVisible: false,
    //                         // editVisible: false,
    //                     })
    //                     else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    //                     this.props.getApplicantName({
    //                         "params": {
    //                           applicantName: this.props.name
    //                         },
    //                         "offset": 0,
    //                         "limit": this.props.limit
    //                     })
    //                     if (type === "delete") {
    //                         //this.props.backToPage()
    //                     }
    //                 } else {
    //                     console.log(res);
    //                     alert("Failed: " + res.data.message)
    //                 }
    //             } else {
    //                 console.log(res)
    //             }
    //         })

    // }

    columnsMedic = [
        "Medical ID",
        "Disease Name",
        "Hospital Name",
        "Year",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className="grid grid-3x">
                                <div className="col-1">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={this.opPopupPage("edit-medical", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCloseView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }
        }
    ];
    dataMedic = [["MR-01", 'Hipertensi', 'RSCM', '2007']]
    columnsCrime = [
        "Criminal ID",
        "Name of Crime",
        "Victim Type",
        "Date",
        "City Place",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className="grid grid-3x">
                                <div className="col-1">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCloseEdit("edit-crime", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView("view-crime", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCloseView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }
        }
    ];
    dataCrime = [["CR-01", 'Mencuri Sepeda', 'Pidana', '11-01-2019', 'bogor']]
    columnsReference = [
        "Reference ID",
        "Name",
        "Relationship",
        "Address",
        "Phone Number",
        "Acquanted Since",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className="grid grid-3x">
                                <div className="col-1">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCloseEdit("edit-reference", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-2">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView("view-reference", tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCloseView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }
        }
    ];
    dataReference = [["RF-01", 'JAJANG', 'Teman', 'Jl.mangga', '14056', '2010']]
    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-12">
                <form action="#">
                    <div className='padding-5px'>
                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-oti"
                            />
                            <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Other Information</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-oti">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <div style={{ border: '1px solid #e9e9e9', padding: 15, borderRadius: 10 }}>
                                    <div className='grid grid-2x grid-mobile-none gap-20px'>
                                        <div className='column-1'>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Body Weight</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    // required
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Body Height</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    // required
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Who Suggests You to Apply to Our Bank</h4>
                                                    </div>
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Have You Ever Applied For at Our Bank(If Yes, Please Tell Us Where & When That You Applied)</h4>
                                                    </div>
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                        <div className='column-2'>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>What job / position do you want to do in the next 5 years?</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    type="text"
                                                    // required
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Mention the name and title of your family member / friend who works at our bank</h4>
                                                    </div>
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Are you involved in debt now? (If Yes, Please Described it!)</h4>
                                                    </div>
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    readOnly={this.props.type === 'view'}
                                                    style={this.props.type === 'view' ? { backgroundColor: "#E6E6E6" } : null}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {this.props.type !== 'view' ?
                                        <div className="padding-15px content-right">
                                            <button type="submit" className="btn btn-blue"> SAVE </button>
                                        </div> : null}
                                </div>
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-mrc"
                            />
                            <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Medical Record</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-mrc">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    {this.props.type !== 'view' ?
                                        <button
                                            onClick={this.opPopupPage("create-medical")}
                                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        >
                                            <i className="fa fa-lw fa-plus" />
                                        </button> : null}
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                    <MUIDataTable
                                        subtitle={'lorem ipsum dolor'}
                                        data={this.dataMedic}
                                        columns={this.columnsMedic}
                                        options={this.options}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cr"
                            />
                            <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Crime Record</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cr">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    {this.props.type !== 'view' ?
                                        <button
                                            onClick={this.opPopupPage("create-crime")}
                                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        >
                                            <i className="fa fa-lw fa-plus" />
                                        </button> : null}
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                    <MUIDataTable
                                        subtitle={'lorem ipsum dolor'}
                                        data={this.dataCrime}
                                        columns={this.columnsCrime}
                                        options={this.options}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-rfp"
                            />
                            <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <div>
                                            <div className="txt-site txt-12 txt-bold txt-main">
                                                Reference Person
                                                </div>
                                            <div className="txt-site txt-10 txt-thin txt-primary margin-top-5px">
                                                Reference or Recomendation About You Can Be Obtained From
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-rfp">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    {this.props.type !== 'view' ?
                                        <button
                                            onClick={this.opPopupPage("create-reference")}
                                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        >
                                            <i className="fa fa-lw fa-plus" />
                                        </button> : null}
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                    <MUIDataTable
                                        subtitle={'lorem ipsum dolor'}
                                        data={this.dataReference}
                                        columns={this.columnsReference}
                                        options={this.options}
                                    />
                                </MuiThemeProvider>
                            </div>
                        </div>
                    </div>
                    {this.state.createMedicalVisible && (
                        <FormCreateMedical
                            type={"create"}
                            onClickClose={() => this.openCloseCreate.bind(this)}
                        />
                    )}
                    {this.state.editMedicalVisible && (
                        <FormCreateMedical
                            type={"edit"}
                            onClickClose={() => this.openCloseEdit.bind(this)}
                        />
                    )}
                    {this.state.viewMedicalVisible && (
                        <FormCreateMedical
                            type={"view"}
                            onClickClose={() => this.openCloseView.bind(this)}
                        />
                    )}

                    {this.state.createCrimeVisible && (
                        <FormCrime
                            type={"create"}
                            onClickClose={() => this.openCloseCreate.bind(this)}
                        />
                    )}

                    {this.state.editCrimeVisible && (
                        <FormCrime
                            type={"edit"}
                            onClickClose={() => this.openCloseEdit.bind(this)}
                        />
                    )}

                    {this.state.viewCrimeVisible && (
                        <FormCrime
                            type={"view"}
                            onClickClose={() => this.openCloseView.bind(this)}
                        />
                    )}

                    {this.state.createReferenceVisible && (
                        <FormReference
                            type={"create"}
                            onClickClose={() => this.openCloseCreate.bind(this)}
                        />
                    )}
                    {this.state.editReferenceVisible && (
                        <FormReference
                            type={"edit"}
                            onClickClose={() => this.openCloseEdit.bind(this)}
                        />
                    )}
                    {this.state.viewReferenceVisible && (
                        <FormReference
                            type={"view"}
                            onClickClose={() => this.openCloseView.bind(this)}
                        />
                    )}
                    {/* {this.state.editVisible && (
                        <FormReference
                            type={"update"}
                            sendState={this.state.sendState}
                            onClickClose={this.openCloseEdit.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataReference={this.state.applicantData.applicantReferences[this.state.selectedIndex]}
                            bizparReference={this.state.bizparReference}
                        />
                    )}
                    {this.state.viewVisible && (
                        <FormReference
                            type={"view"}
                            onClickClose={this.openCloseView.bind(this)}
                            applicantDataReference={this.state.applicantData.applicantReferences[this.state.selectedIndex]}
                            bizparReference={this.state.bizparReference}
                        />
                    )} */}

                    {this.state.createPopUpVisible && (
                        <PopUp type={'save'} class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createVisible: false,
                                    editVisible: false,
                                    createPopUpVisible: false
                                })
                            }}
                        />
                    )}

                    {this.state.deletePopUpVisible && (
                        <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup.bind(this)} onClickDelete={(value) => this.handleSubmit(value, "delete")} />
                    )}
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        recruitment: state.recruitment,
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getApplicant: obj => dispatch(RecruitmentAction.getApplicant(obj)),
        getApplicantName: obj => dispatch(RecruitmentAction.getApplicantName(obj)),
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(formOtherInformationApplicant);