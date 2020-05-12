import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormWorkExp from './formWorkExperience'
import PopUp from "../../components/pages/PopUpAlert";
import DropDown from '../../modules/popup/DropDown'
import API from '../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'
import { Multiselect } from 'multiselect-react-dropdown';

var ct = require("../../modules/custom/customTable");

class formWorkExperienceApplicant extends Component {
    constructor(props) {
        super(props)
        let { applicantData } = this.props

        this.state = {
            applicantData,
            dataTableWorkExp: [],
            createVisible: false,
            viewVisible: false,
            updateVisible: false,
            createPopUpVisible: false,
            notifVisible: false,
            message: "",
            auth: props.auth,
            defaultValue: [],
            provinceData: [],
            sendState: "",
            isWeb: false
        }
    }

    connectWebsocket = async (type) => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/applicant/put.applicant.work.experience/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                if (type !== "delete") {
                    setTimeout(() => {
                        this.setState({ sendState: "finished" }, () => {
                            setTimeout(() => {
                                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, })
                                this.props.onSelect({
                                    message: res.messages,
                                    // formWorkExperienceVisible: false,
                                    formApplicantDetailUpdateVisible: false,
                                    // formApplicantDataVisible: false
                                })
                                this.props.onFinishFetch()
                            }, 500);
                        })
                    }, 500);
                } else {
                    this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false })
                    this.props.onSelect({
                        message: res.messages,
                        formWorkExperienceVisible: false,
                        formApplicantDetailUpdateVisible: false,
                        formApplicantDataVisible: false
                    })
                }
            })
        })
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    componentDidMount() {
        this.getDataWorkExp(this.state.applicantData)
        this.getProvinceByCountryID()
        this.getDesire()
        console.log(this.props.applicantData)
    }

    getDesire(){
        let desire = this.props.applicantData.applicantDesireWorkingLocations
        var selectedValue = []
        desire.map((item, index) => {
            selectedValue.push({
                name: item
            })
        })
        console.log(desire)
        setTimeout(() => {
            this.setState({
                selectedValue,
                limitSelected: selectedValue.length
            })
        },300)
    }

    getProvinceByCountryID() {
        API.create('MASTERDATA').getProvinceByCountryID('IND').then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        let array = []
                        res.data.data.map((item) => {
                            array.push({ 
                                name: item.provinceName
                            })
                        })
                        setTimeout(() => {
                            this.setState({
                                provinceData: array
                            })
                        }, 200);
                    }
                }
            })
    }

    componentWillReceiveProps(newProps) {
        let { applicantData } = newProps
        this.setState({ applicantData })
        this.getDataWorkExp(applicantData)
    }

    getDataWorkExp(applicantData) {
        let dataTableWorkExp = applicantData.applicantWorkExperiences.map((value) => {
            const { applicantWorkExperienceID, workExperienceStartDate, workExperienceEndDate, workExperiencePosition, workExperienceCompany, workExperienceCity } = value;
            return [
                applicantWorkExperienceID,
                workExperienceStartDate,
                workExperienceEndDate,
                workExperiencePosition,
                workExperienceCompany,
                workExperienceCity
            ]
        })
        this.setState({ dataTableWorkExp })
    }

    openCreate() {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
    }

    openView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
    }

    openUpdate(selectedIndex) {
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        this.setState({ updateVisible: !this.state.updateVisible, selectedIndex, createPopUpVisible })
    }

    openDeletePopup(selectedIndex) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
    }

    handleSubmit(value, type = "") {
        console.log(value)
        this.setState({ defaultValue: value, sendState: "loading" })
        let { applicantWorkExperiences, applicantNumber } = this.state.applicantData
        let data = Object.assign([], applicantWorkExperiences)
        let { workExperienceStartDate, workExperienceEndDate } = value

        switch (type) {
            case "create":
                value = {
                    ...value,
                    applicantWorkExperienceID: "WE-" + M(),
                    workExperienceStartDate: M(workExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceEndDate: M(workExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
                }

                data.push(value)
                break;
            case "edit":
                value = {
                    ...value,
                    workExperienceStartDate: M(workExperienceStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceEndDate: M(workExperienceEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
                    workExperienceSalary: (!R.isEmpty(value.workExperienceSalary) || !R.isNil(value.workExperienceSalary)) ? String(value.workExperienceSalary).split(",").join("") : value.workExperienceSalary
                }
                let status = R.findIndex(R.propEq('applicantWorkExperienceID', value.applicantWorkExperienceID))(data)
                if (status >= 0) {
                    data[status] = value
                }
                break;
            case "delete":
                data.splice(this.state.selectedIndex, 1)
                break;
            default:
                break;
        }

        applicantWorkExperiences = data
        let payload = {
            applicantWorkExperiences,
            applicantNumber,
            "updatedBy": this.state.auth.user.employeeID,
            "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        console.log(payload)

        this.connectWebsocket(type)
        API.create('RECRUITMENT').updateApplicantWorkExperience(payload).then(
            (res) => {
                console.log(JSON.stringify(res.data))
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.props.openSavePopUp()
                        if (type !== "delete") this.setState({
                            sendState: "finished"
                        })
                        else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                        this.props.getApplicantName({
                            "params": {
                                applicantName: this.props.name
                            },
                            "offset": 0,
                            "limit": this.props.limit
                        })
                        if (type === "delete") {
                            // this.props.backToPage()
                        }
                    } else {
                        alert("Failed: " + res.data.message)
                    }
                }
            }
        )

    }

    columnsWorkExp = [
        "Work Experience Number",
        "Start Date",
        "Finish Date",
        "Position",
        "Company Name",
        "Place",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className='grid grid-3x'>
                                <div className='column-1'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openUpdate(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-2'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-3'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }
        }
    ];

    render() {
        return (
            <div className="vertical-tab-content active" id="content-nav-7">
                <form action="#">
                    <div className="padding-10px">
                        <div className="col-1 content-right margin-bottom-10px">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCreate.bind(this)}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Work Experience'
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableWorkExp}
                                columns={this.columnsWorkExp}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                        <div className="padding-5px">
                            <div className="app-open-close margin-bottom-20px">
                                <input
                                    type="checkbox"
                                    name="navmenu"
                                    className="app-open-close-input"
                                    id="navmenu-bag"
                                />
                                <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-certificate margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">BAG Work Priority</span>
                                        </div>
                                        <div><span className="txt-site txt-11 txt-main margin-left-10px">Choose 3 main priorities the following types of work that interest you in Bank of Artha Graha</span></div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-bag">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div style={{ border: '1px solid #e9e9e9', borderRadius: 10 }}>
                                        <div className='grid grid-2x grid-mobile-none'>
                                            <div className="column-1" style={{ borderRight: '1px solid #e9e9e9'}}>
                                                <div className="margin-bottom-20px">
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', height: '40px', paddingTop: '10px' }}>
                                                        <div style={{ display: 'flex', flex: 1 }}>
                                                            <div style={{ width: '50%', textAlign: 'center', justifyContent: 'center' }}>
                                                                <span>Job Type</span>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'right', marginRight: 10 }}>
                                                                <span>Sequence</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Back Office /  Sundries</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Exim</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Teller</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                                value={''}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Costumer Service</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Accounting</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Marketing / Account Officer</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Administrasi Kredit (Legal, Investigasi</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Consumer Banking</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='column-2'>
                                                <div className="margin-bottom-20px">
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', height: '40px', paddingTop: '10px' }}>
                                                        <div style={{ display: 'flex', flex: 1 }}>
                                                            <div style={{ width: '50%', textAlign: 'center', justifyContent: 'center' }}>
                                                                <span>Job Type</span>
                                                            </div>
                                                            <div style={{ width: '50%', textAlign: 'right', marginRight: 10 }}>
                                                                <span>Sequence</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Valas / Settlement</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Kontrol / Audit</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Treasury</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Card Centre</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Analis Kredit</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Corporate Banking</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Sistem & Prosedur</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ borderBottom: '1px solid #e9e9e9', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                                        <div style={{ alignSelf: 'center' }}>
                                                            <span>Other</span>
                                                        </div>
                                                        <div>
                                                            <DropDown
                                                                title=""
                                                                onChange={(e) => { console.log('data', e) }}
                                                                data={[
                                                                    { id: '1', title: '1', value: '1' },
                                                                    { id: '2', title: '2', value: '2' },
                                                                    { id: '3', title: '3', value: '3' }
                                                                ]}
                                                                placeholder={''}
                                                            // value={this.state.sundries} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className='column-1'>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Expected Salary</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Expected Benefit</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                            <div className='column-2'>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Expected Facility</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>When To Start Working (If Passed)</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="padding-15px content-right">
                                            <button type="submit" className="btn btn-blue"> SAVE </button> */}
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
                                    id="navmenu-bwp"
                                />
                                <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-certificate margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">Tentative Information</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-bwp">
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
                                                            <h4>Expected Salary</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Expected Benefit</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                            </div>
                                            <div className='column-2'>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>Expected Facility</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                    />
                                                </div>
                                                <div className="margin-bottom-20px">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main txt-bold">
                                                            <h4>When To Start Working (If Passed)</h4>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
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
                                    id="navmenu-dwl"
                                />
                                <div className="grid grid-2x margin-bottom-10px margin-top-10px">
                                    <div className="col-1">
                                        <div className="display-flex-normal margin-top-10px">
                                            <i className="fas fa-certificate margin-right-5px"></i>
                                            <div>
                                                <div className="txt-site txt-12 txt-bold txt-main">
                                                    Desire Working Location
                                                </div>
                                                <div className="txt-site txt-10 txt-thin txt-primary margin-top-5px">
                                                    Choose the region that you are willing to be placed (Can be more than 1)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-dwl">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <div style={{ border: '1px solid #e9e9e9', padding: 15, borderRadius: 10 }}>
                                        <div className="margin-bottom-20px" style={{ width: '50%' }}>
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Type The Region</h4>
                                                </div>
                                            </div>
                                            <Multiselect
                                                selectedValues={this.state.selectedValue}
                                                disablePreSelectedValues={true}
                                                selectionLimit={String(this.state.limitSelected)}
                                                placeholder={this.state.limitSelected === 0 ? "Null": ""}
                                                // options={this.state.gradeData} // Options to display in the dropdown 
                                                displayValue="name" // Property name to display in the dropdown options
                                                // options={this.state.provinceData}
                                            />
                                        </div>
                                        {this.props.type !== 'view' ?
                                        <div className="padding-15px content-right">
                                            <button type="submit" className="btn btn-blue"> SAVE </button>
                                        </div> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.createVisible && (
                        <FormWorkExp
                            sendState={this.state.sendState}
                            type={'create'}
                            onClickClose={this.openCreate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "create")}
                        />
                    )}

                    {this.state.viewVisible && (
                        <FormWorkExp
                            type={'view'}
                            onClickClose={this.openView.bind(this)}
                            applicantDataWorkExp={this.state.applicantData.applicantWorkExperiences[this.state.selectedIndex]}
                        />
                    )}

                    {this.state.updateVisible && (
                        <FormWorkExp
                            sendState={this.state.sendState}
                            type={'update'}
                            onClickClose={this.openUpdate.bind(this)}
                            onClickSave={(value) => this.handleSubmit(value, "edit")}
                            applicantDataWorkExp={this.state.applicantData.applicantWorkExperiences[this.state.selectedIndex]}
                        />
                    )}

                    {this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createVisible: false,
                                    editVisible: false,
                                    createPopUpVisible: false
                                })
                                //this.props.backToPage()
                            }}
                        />
                    )}
                    {this.state.deletePopUpVisible && (
                        <PopUp
                            type={"delete"}
                            class={"app-popup app-popup-show"}
                            onClick={this.openDeletePopup.bind(this)}
                            onClickDelete={(value) => this.handleSubmit(value, "delete")}
                        />
                    )}
                </form>
            </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(formWorkExperienceApplicant);