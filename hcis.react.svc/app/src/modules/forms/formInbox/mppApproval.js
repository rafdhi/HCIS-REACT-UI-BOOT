import React, { Component } from 'react'
import FlexView from 'react-flexview'
import FormReport from './formReport';
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown'
import * as R from 'ramda'
import FormSearchEmp from '../../../components/systemConfiguration/userManagement/forms/create/searchEmployee'
import Api from '../../../Services/Api';
import PopUp from '../../../components/pages/PopUpAlert';
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import UploadFile from '../../upload/upload'
import uuid from 'uuid'
import AuthAction from "../../../Redux/AuthRedux";
import { connect } from "react-redux";
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import KpkRequest from '../../../modules/forms/formInbox/kpkRequest'
import FileViewer from "react-file-viewer";


var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const optionsMc = ct.customOptions4();

class mppApproval extends Component {
    constructor(props) {
        super(props)
        let title = this.props.data.taskName
        title = title.toLowerCase().split(' ')
        title = title.map((value) => {
            let string = value.replace(/^\w/, c => c.toUpperCase())
            return string + ' '
        })
        this.state = {
            data: this.props.data,
            user: this.props.user,
            title: this.props.type === 'MPP' ? 'MPP Approval' : this.props.type === 'Applicant Job' ? 'Applicant Job' : this.props.type === 'KSE Checklist' ? this.props.type : title,
            titleNumber: this.props.type === 'Claim Approval' ? 'Claim Request Number' : this.props.type === 'Termination Checklist' ? 'Termination Request Number' : this.props.type + ' Number',
            notes: '',
            description: '',
            fileType:'',
            reportURL: '',
            reportVisible: false,
            reportVisibleRecruitmentRequest: false,
            createPopUpVisible: false,
            date: '',
            psikotestType: '',
            pic: '',
            rawMcu:'',
            tm:'',
            url: '',
            document: '',
            documentMCU: '',
            interviewType: '',
            interviewTypeValue: '',
            documentUrl: '',
            formSearchEmpVisible: false,
            formReportVisibleMcu:false,
            dataEmp: {
                employeeID: '',
                employeeName: ''
            },
            uploadStatus: 'idle',
            percentage: '0',
            dataFacilityKse: [],
            facility: [],
            payloadFacility: [],
            facilityID: '',
            terminationEmpID: '',
            notifVisible: false,
            message: '',
            biztripSett: false,
            kpkRequestVisible: false,
        }
        console.log(this.props.data)

    }

    componentDidMount() {
        console.log(this.props.type, this.props.data)
    }

    options = {
        ...ct.customOptions2(),
        selectableRowsOnClick: true,
        onRowsSelect: (currentRowsSelected, allRowsSelected) => {
            let facilities = []
            allRowsSelected.map((data, index) => {
                if (this.state.data.taskName === "KSE CHECKLIST") {
                    facilities.push({
                        ...this.state.facility[data.index],
                        facilityDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        isFacilityGiven: true
                    })
                } else {
                    facilities.push({
                        ...this.state.facility[data.index],
                        facilityReturnDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        isFacilityReturn: true
                    })
                }
            })
            this.setFacility(facilities)
        }
    }

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/recruitment/psikotest/post.recruitment.psikotest.document/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                this.setState({ notifVisible: true, message: res.messages })
                setTimeout(() => {
                    this.setState({
                        notifVisible: false
                    })
                }, 2000);
            })
        })
    }

    closeNotif() {
        this.setState({ notifVisible: false })
    }

    setFacility(facilities) {
        this.setState({
            payloadFacility: facilities
        })
    }

    columnsKse = ["No", "Facility Name"]

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.getRecMCUById(this.props.data.variables.TASK_REFNO)
            let title = this.props.data.taskName
            title = title.toLowerCase().split(' ')
            title = title.map((value) => {
                let string = value.replace(/^\w/, c => c.toUpperCase())
                return string + ' '
            })
            if (this.state.data.variables.INTERVIEW_ID) this.getInterview()
            this.setState({
                data: this.props.data,
                titleNumber: this.props.type + ' Number',
                title
            })
        }
    }

    openBiztrip = (index = null) => {
        this.setState({
            biztripSett: !this.state.biztripSett,
            selectedIndex: index
        });
    };

    openKpk = (index = null) => {
        this.setState({
            kpkRequestVisible: !this.state.kpkRequestVisible,
            selectedIndex: index
        });
    };


    async getInterview() {
        let tm = ''
        if(this.state.data.taskName === 'HRD INTERVIEW'){
                tm = this.state.data.variables.HRDINTERVIEW_ID
        }else if (this.state.data.taskName === 'USER INTERVIEW'){
                tm = this.state.data.variables.USERINTERVIEW_ID
        }
        Api.create('RECRUITMENT_QUERY').getRecInterviewByInterviewId(tm).then(
            (res) => {
                if (res.data && res.data.status === "S") {
                    this.setState({
                        interviewType: res.data.data.interviewType.bizparKey,
                        interviewTypeValue: res.data.data.interviewType.bizparValue
                    })
                }
            }
        )
    }

    async getEmployee() {
        let payload = {
            "employeeID": this.state.data.variables.TASK_REFNO
        }
        let res = await Api.create("EMPLOYEE_QUERY").getEmployeeById(payload)
        if (res.data && res.data.status === "S") {
            this.getFacilityKse(res.data.data.company.companyID, res.data.data.position.positionID)
        } else {
            alert("Data Employee Not Found.")
        }
    }

    async getFacilityKse(esid, ouid) {
        let payload = {
            "esid": esid,
            "ouid": ouid,
        }
        let res = await Api.create('ES').getEsByOuid(payload)
        console.log('test' + JSON.stringify(res.data.data.ouFacilityTPLID))
        if (res.data.data.ouFacilityTPLID !== null) {
            if (res.data && res.data.status === "S") {
                let facility = res.data.data.ouFacilityTPLID.facilities.map((data, index) => {
                    return {
                        "employeeFacilityID": data.facilityDetailID,
                        "facilityCategory": data.facilitycategory.bizparKey,
                        "facilityDate": null,
                        "facilityNotes": data.facilityDetailNotes,
                        "facilityQuantity": data.facilityDetailQty,
                        "facilityReturnDate": null,
                        "facilityType": data.facilityType.bizparKey,
                        "isFacilityGiven": false,
                        "isFacilityReturn": false
                    }
                })
                let dataFacilityKse = res.data.data.ouFacilityTPLID.facilities.map((value, index) => {
                    const { facilitycategory } = value
                    return [
                        index += 1,
                        facilitycategory.bizparValue
                    ]
                })
                this.setState({ dataFacilityKse, facilityID: res.data.data.ouFacilityTPLID.facilityID, facility })
            }
        }
    }

    async getDataTermination() {
        let res = await Api.create("TERMINATION_QUERY").getTerminationByID(this.state.data.variables.TASK_REFNO)
        if (res.data && res.data.status === "S" && res.data.code === "201") {
            this.getFacilityTermination(res.data.data.employee.employeeID)
            this.setState({ terminationEmpID: res.data.data.employee.employeeID })
        } else {
            alert("Data Termination Not Found.")
        }
    }

    async getFacilityTermination(employeeID) {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "employeeID": employeeID
            }
        }
        let res = await Api.create("EMPLOYEE_QUERY").getEmployeeKseCheckByEmpId(payload)
        if (res.data && res.data.status === "S" && res.data.data.length > 0) {
            let facility = res.data.data[0].employeeFacilities.map((data, index) => {
                return {
                    "employeeFacilityID": data.employeeFacilityID,
                    "facilityCategory": data.facilitycategory.bizparKey,
                    "facilityDate": data.facilityDate,
                    "facilityNotes": data.facilityDetailNotes,
                    "facilityQuantity": data.facilityDetailQty,
                    "facilityReturnDate": null,
                    "facilityType": data.facilityType.bizparKey,
                    "isFacilityGiven": data.isFacilityGiven,
                    "isFacilityReturn": false
                }
            })
            let dataFacilityKse = res.data.data[0].employeeFacilities.map((value, index) => {
                const { facilitycategory } = value
                return [
                    index += 1,
                    facilitycategory.bizparValue
                ]
            })
            this.setState({ dataFacilityKse, facilityID: res.data.data[0].facilityID.facilityID, facility })
        }
    }

    componentWillMount() {
        if (this.state.data.variables.INTERVIEW_ID || this.state.data.variables.HRDINTERVIEW_ID) this.getInterview()
        if (this.state.data.taskName === "KSE CHECKLIST") return this.getEmployee()
        if (this.state.data.taskName === "TERMINATION CHECKLIST") return this.getDataTermination()
        if (this.state.data.taskName === 'MEDICAL CHECKUP') return this.getRecMCUById(this.state.data.variables.TASK_REFNO)
    }

    openSearch() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    pickEmployee(value) {
        let dataEmp = value
        this.setState({ dataEmp, pic: value.employeeID, formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    renderHeader = () => (
        <div className="popup-panel grid grid-2x">
            <div className="col-1">
                <div className="popup-title">
                    {this.state.title}
                </div>
            </div>
            <div className="col-2 content-right">
                <button
                    className="btn btn-circle background-white"
                    onClick={this.props.onClickClose}
                >
                    <i className="fa fa-lg fa-times" />
                </button>
            </div>
        </div>
    )

    handleApproval(type) {
        let notes = this.state.notes
        let { taskID, taskName } = this.state.data
        let { TASK_TYPE } = this.state.data.variables
        let recID = this.state.data.variables.TASK_REFNO
        let vacancyID = this.state.data.variables.RECRUITMENTREQID
        let { userID, employeeID } = this.state.user
        let { payload, buttonType } = ''

        switch (type) {
            case 'APPROVE':
                console.log('Approved')
                buttonType = 'APPROVE'
                break;
            case 'REJECT':
                console.log('Rejected')
                buttonType = 'REJECT'
                break;
            case 'RESUBMIT':
                console.log('Please resubmit')
                buttonType = 'RESUBMIT'
                break;
            case 'PASS':
                console.log('OK')
                buttonType = 'OK'
                break;
            case 'FAILED':
                console.log('FAILED')
                buttonType = 'KO'
                break;
            case 'CANDIDATE':
                console.log('APPROVE')
                buttonType = 'APPROVE'
                break;
            case 'EMPLOYEE SIGN TO BE':
                buttonType = ''
                break;
            case 'PROCESS':
                console.log('APPROVE')
                buttonType = 'APPROVE'
                break;
            default:
                break;
        }
        switch (TASK_TYPE) {
            case 'APPLICANTJOB':
                console.log('masuk')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "data": {
                        "applicantNumber": recID,
                        "vacancyID": vacancyID
                    }
                }
                break;
            case 'APPLICANTCOLLECTION':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            default:
                break
        }
        switch (taskName) {
            case 'MPP APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": null
                }
                break;
            case 'PKWT APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'PKWT APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'REQUEST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'REQUEST APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'REQUEST APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'REQUEST APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'SELECTION RECRUITMENT APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'VALID APPLICANT DATA':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'PSIKOTEST':
                if (R.isEmpty(this.state.date)) return alert('Date is Required')
                if (R.isEmpty(this.state.psikotestType)) return alert('Psikotest Type is Required.')
                if (R.isEmpty(this.state.pic)) return alert('PIC is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": '',
                    "senderBPMStatus": "INITIATE",
                    "data": {
                        "applicantNumber": recID,
                        "psikotestNumber": this.state.data.variables.PSIKOTEST_ID,
                        "psikotestDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "psikotestType": this.state.psikotestType,
                        "psikotestNotes": notes,
                        "psikotestDocumentURL": this.state.documentUrl,
                        "pic": this.state.pic,
                        "updatedBy": employeeID,
                        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "isPass": buttonType

                    }
                }
                break;
            case 'USER INTERVIEW':
                if (R.isEmpty(this.state.date)) return alert('Date is Required')
                if (R.isEmpty(this.state.pic)) return alert('PIC is Required.')
                if (R.isEmpty(this.state.interviewType)) return alert('Interview Type is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": '',
                    "senderBPMStatus": "INITIATE",
                    "data": {
                        "applicantNumber": recID,
                        "interviewID": this.state.data.variables.USERINTERVIEW_ID,
                        "interviewDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "interviewType": this.state.interviewType,
                        "interviewNotes": notes,
                        "esid": this.state.data.variables.SENDER_ESID,
                        "pic": this.state.pic,
                        "updatedBy": employeeID,
                        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "isPass": buttonType,
                    }
                }
                break;
            case 'HRD INTERVIEW':
                if (R.isEmpty(this.state.date)) return alert('Date is Required')
                if (R.isEmpty(this.state.pic)) return alert('PIC is Required.')
                if (R.isEmpty(this.state.interviewType)) return alert('Interview Type is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": '',
                    "senderBPMStatus": "INITIATE",
                    "data": {
                        "applicantNumber": recID,
                        "interviewID": this.state.data.variables.HRDINTERVIEW_ID,
                        "interviewDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "interviewType": this.state.interviewType,
                        "interviewNotes": notes,
                        "recruitmentRequestID": vacancyID,
                        "esid": this.state.data.variables.SENDER_ESID,
                        "pic": this.state.pic,
                        "updatedBy": employeeID,
                        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "isPass": buttonType,
                    }
                }
                break;
            case 'MEDICAL CHECKUP':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'CANDIDATE':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'EMPLOYEE SIGN TO BE':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID,
                    }
                }
                break;
            case 'KSE CHECKLIST':
                this.state.facility.map((value, index) => {
                    let isExist = R.findIndex(R.propEq("employeeFacilityID", value.employeeFacilityID))(this.state.payloadFacility)
                    let payloadFacility = this.state.payloadFacility
                    if (isExist < 0) {
                        payloadFacility.push({
                            ...value
                        })
                        this.setState({ payloadFacility })
                    }
                })
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "empKSEChecklistID": "KSEC-" + M(),
                        "employeeFacilities": this.state.payloadFacility,
                        "employeeID": recID,
                        "facilityID": this.state.facilityID,
                        "overtimeType": null,
                        "empKSEChecklistDate": M().format("DD-MM-YYYY"),
                        "empKSEChecklistNotes": notes,
                        "empKSEChecklistDocumentURL": null,
                        "pic": employeeID,
                        "createdBy": employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "updatedBy": employeeID,
                        "updatedDate": null,
                        "recordID": uuid.v4()
                    }
                }
                break;
            case 'TERMINATION CHECKLIST':
                this.state.facility.map((value, index) => {
                    let isExist = R.findIndex(R.propEq("employeeFacilityID", value.employeeFacilityID))(this.state.payloadFacility)
                    let payloadFacility = this.state.payloadFacility
                    if (isExist < 0) {
                        payloadFacility.push({
                            ...value
                        })
                        this.setState({ payloadFacility })
                    }
                })
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "terminationChecklistID": "TMN-CHECKLIST-" + M(),
                        "employeeID": this.state.terminationEmpID,
                        "facilityID": this.state.facilityID,
                        "terminationChecklistFacilities": this.state.payloadFacility,
                        "terminationChecklistDate": M().format("DD-MM-YYYY"),
                        "terminationChecklistNotes": notes,
                        "terminationChecklistDocumentURL": null,
                        "pic": employeeID,
                        "createdBy": employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "updatedBy": employeeID,
                        "updatedDate": null,
                        "recordID": uuid.v4()
                    }
                }
                break;
            case 'TERMINATION APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "terminationID": recID
                    }
                }
                break;
            case 'MOVEMENT APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "movementID": recID
                    }
                }
                break;
            case 'BUSINESS TRIP APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": recID
                    }
                }
                break;
            case 'BUSINESS TRIP APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": recID
                    }
                }
                break;
            case 'BUSINESS TRIP APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": recID
                    }
                }
                break;
            case 'BUSINESS TRIP APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": recID
                    }
                }
                break;
            case 'BT RESPONSIBILITY APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "businessTripResponsibilityID": recID
                    }
                }
                break;
            case 'BT RESPONSIBILITY APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "businessTripResponsibilityID": recID
                    }
                }
                break;
            case 'LEAVE APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": recID
                    }
                }
                break;
            case 'LEAVE APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": recID
                    }
                }
                break;
            case 'LEAVE APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": recID
                    }
                }
                break;
            case 'LEAVE APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": recID
                    }
                }
                break;
            case 'OVERTIME APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME RESPONSIBILITY APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME RESPONSIBILITY APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME RESPONSIBILITY APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'OVERTIME RESPONSIBILITY APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'KPK APPROVAL LEVEL 1':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "kpkID": recID
                    }
                }
                break;
            case 'KPK APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "kpkID": recID
                    }
                }
                break;
            case 'KPK APPROVAL LEVEL 3':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "kpkID": recID
                    }
                }
                break;
            case 'KPK APPROVAL LEVEL 4':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "kpkID": recID
                    }
                }
                break;
            case 'KPK APPROVAL LEVEL 5':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "kpkID": recID
                    }
                }
                break;
            case 'TRAINING REQUEST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "trainingRequestID": recID
                    }
                }
                break;
            case 'BLACKLIST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "blacklistID": recID
                    }
                }
                break;
            case 'MANUAL ABSENCE APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "hcisRequestID": recID
                    }
                }
                break;
            case 'MANUAL ABSENCE APPROVAL LEVEL 2':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "hcisRequestID": recID
                    }
                }
                break;
            case 'LOAN APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "loanID": recID
                    }
                }
                break;
            case 'CLAIM APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "claimID": recID
                    }
                }
                break;
            default:
                break;
        }
        // return console.log(payload)

        if (R.isEmpty(notes) && taskName !== 'MEDICAL CHECKUP') return alert('Notes is Required.')
        this.props.handleSubmit(payload)
    }

    renderFooter = () => {
        let buttons = [
            {
                label: "APPROVE",
                cb: () => this.handleApproval('APPROVE')
                // console.log("ini tombol approve")
            },
            {
                label: "REJECT",
                cb: () => this.handleApproval('REJECT')
            },
            // {
            //     label: "RESUBMIT",
            //     cb: () => this.handleApproval('RESUBMIT')
            // }
        ]
        let buttonsMpp = [
            {
                label: "APPROVE",
                cb: () => this.handleApproval('APPROVE')
                // console.log("ini tombol approve")
            },
            {
                label: "REJECT",
                cb: () => this.handleApproval('REJECT')
            }
        ]

        let buttonTest = [
            {
                label: "PASS",
                cb: () => this.handleApproval('PASS')
                // console.log("ini tombol approve")
            },
            {
                label: "FAILED",
                cb: () => this.handleApproval('FAILED')
            }
        ]

        let buttonCandidate = [
            {
                label: "PROCESS CANDIDATE",
                cb: () => this.handleApproval('CANDIDATE')
                // console.log("ini tombol approve")
            }
        ]

        let buttonSigntobe = [
            {
                label: "SIGN TO BE EMPLOYEE",
                cb: () => this.handleApproval('EMPLOYEE SIGN TO BE')
                // console.log("ini tombol approve")
            }
        ]

        let buttonMedical = [
            {
                label: "SUBMIT",
                cb: () => this.handleApproval('APPROVE')
                // console.log("ini tombol approve")
            }
        ]

        let buttonKse = [
            {
                label: "PROCESS",
                cb: () => this.handleApproval('PROCESS')
                // console.log("ini tombol approve")
            }
        ]

        return (
            <div className="padding-15px border-top">
                <div className="content-right">
                    {this.state.data.taskName === 'MPP APPROVAL' || this.state.data.taskName === "APPLICANT COLLECTION" || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || this.state.data.taskName === "TRAINING REQUEST APPROVAL" ? buttonsMpp.map((data, index) => {
                        return (
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                type="button"
                                onClick={data.cb}
                            >
                                <span>{data.label}</span>
                            </button>
                        )
                    }) :
                        this.state.data.variables.TASK_TYPE === 'PSIKOTEST' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' ? buttonTest.map((data, index) => {
                            return (
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={data.cb}
                                >
                                    <span>{data.label}</span>
                                </button>
                            )
                        }) :
                            this.state.data.taskName === 'CANDIDATE' ? buttonCandidate.map((data, index) => {
                                return (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={data.cb}
                                    >
                                        <span>{data.label}</span>
                                    </button>
                                )
                            })
                                :
                                this.state.data.taskName === 'EMPLOYEE SIGN TO BE' ? buttonSigntobe.map((data, index) => {
                                    return (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={data.cb}
                                        >
                                            <span>{data.label}</span>
                                        </button>
                                    )
                                })
                                    :
                                    this.state.data.taskName === 'MEDICAL CHECKUP' ? buttonMedical.map((data, index) => {
                                        return (
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-blue"
                                                type="button"
                                                onClick={data.cb}
                                            >
                                                <span>{data.label}</span>
                                            </button>
                                        )
                                    })
                                        :
                                        this.state.data.taskName === 'KSE CHECKLIST' || this.state.data.taskName === 'TERMINATION CHECKLIST' ? buttonKse.map((data, index) => {
                                            return (
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-blue"
                                                    type="button"
                                                    onClick={data.cb}
                                                >
                                                    <span>{data.label}</span>
                                                </button>
                                            )
                                        })
                                            :
                                            buttons.map((data, index) => {
                                                return (
                                                    <button
                                                        style={{ marginLeft: "15px" }}
                                                        className="btn btn-blue"
                                                        type="button"
                                                        onClick={data.cb}
                                                    >
                                                        <span>{data.label}</span>
                                                    </button>
                                                )
                                            })
                    }
                </div>
            </div>
        )
    }

    async openReportMpp(value) {
        let type = this.state.data.taskName

        if (type === 'CLAIM APPROVAL') {
            let res = await Api.create('CNB_QUERY').getClaimById(value)
            if (res.data && res.data.status === 'S') {
                if (res.data.code === "201") {
                    let dataClaim = res.data.data
                    dataClaim = {
                        "claimID": dataClaim.claimID,
                        "employeeName": dataClaim.employee.employeeName,
                        "claimDescription": dataClaim.claimDescription,
                        "claimValue": dataClaim.claimValue,
                        "claimURL": dataClaim.claimURL,
                        "type": "form"
                    }
                    this.setState({ reportURL: dataClaim, reportVisible: !this.state.reportVisible })
                } else return alert("Failed: " + res.data.message)
            } else return alert("Failed: " + res.data ? res.data.message : res.message)
        } else {
            let url = (
                type === 'MPP APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                    type === 'MPP APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                        type === 'MPP APPROVAL LEVEL 3' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                            type === 'MPP APPROVAL LEVEL 4' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                                type === 'REQUEST APPROVAL' || type === 'REQUEST APPROVAL LEVEL 2' || type === 'REQUEST APPROVAL LEVEL 3' || type === 'REQUEST APPROVAL LEVEL 4' || type === 'SELECTION RECRUITMENT APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/' : 
                                    type === 'PSIKOTEST' || type === 'APPLICANT COLLECTION' || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || type === 'VALID APPLICANT DATA' || type === 'USER INTERVIEW' || type === 'HRD INTERVIEW' || type === 'CANDIDATE' || type === 'EMPLOYEE SIGN TO BE' || type === 'MEDICAL CHECKUP' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/curriculum.vitae/' :
                                        type === 'KSE CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' :
                                            type === 'TERMINATION APPROVAL' || type === 'TERMINATION CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/terminasi.by.termination.id/' :
                                                type === 'MOVEMENT APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/movement.pengangkatan.karyawan/' :
                                                    type === 'BUSINESS TRIP APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                                        type === 'BUSINESS TRIP APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                                            type === 'BUSINESS TRIP APPROVAL LEVEL 3' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                                                type === 'BUSINESS TRIP APPROVAL LEVEL 4' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                                                    type === 'OVERTIME APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                                                        type === 'OVERTIME APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                                                            type === 'OVERTIME APPROVAL LEVEL 3' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                                                                type === 'OVERTIME APPROVAL LEVEL 4' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                                                                    type === 'LEAVE APPROVAL LEVEL 1' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                                                        type === 'LEAVE APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                                                            type === 'LEAVE APPROVAL LEVEL 3' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                                                                type === 'LEAVE APPROVAL LEVEL 4' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                                                                    type === 'TRAINING REQUEST APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/training.request/' :
                                                                                                        type === 'MANUAL ABSENCE APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/manual.absence.request/' :
                                                                                                            type === 'MANUAL ABSENCE APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/manual.absence.request/' :
                                                                                                                type === 'BLACKLIST APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/blacklist/' : ''
            )
            let res = await fetch(url + value, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                    'Content-Type': 'application/pdf',
                }
            })
            // let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/keterangan.kerja/EMP-206', {
            //     headers: {
            //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
            //         'Content-Type': 'application/pdf',
            //     }
            // })
            console.log(res)
            res = await res.blob()
            console.log(res)
            if (res.size > 0 && res.type === 'application/pdf') {
                res = URL.createObjectURL(res);
                this.setState({ reportURL: res, reportVisible: !this.state.reportVisible })
            } else return alert('Report Not Found!')
        }
    }

    async openReportR(value) {
        // let id = 'MPP-001'
        let url = process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/'
        let res = await fetch(url + value, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })
        // let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/keterangan.kerja/EMP-206', {
        //     headers: {
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
        //         'Content-Type': 'application/pdf',
        //     }
        // })
        console.log(res)
        res = await res.blob()
        console.log(res)
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            this.setState({ reportURL: res, reportVisibleRecruitmentRequest: !this.state.reportVisibleRecruitmentRequest })
        } else return alert('Report Not Found!')
    }

    async getRecPsikotestById(id) {
        let response = await Api.create("RECRUITMENT_QUERY").getRecPsikotestById(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.psikotestDocumentURL,
                result: null
            })
        }
    }

    async getRecMCUById(id) {
        let response = await Api.create("RECRUITMENT_QUERY").getApplicantById(id)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.applicantMedicalCheckUps.map(item => {
                return [
                    item.medicalCheckUpDocumentURL.split("document/applicant_doc/mcu/")
                ]
            })
            this.setState({ dataTable, rawDataMCU: response.data.data.applicantMedicalCheckUps })
        }
    }

    async getReport(index) {
        let applicantID = this.state.data.variables.TASK_REFNO;
        var tmp = this.state.dataTable[index]
        var tmp2 = tmp[0]
        var tmp3 = String(tmp2[1])
        var medicalID = tmp3.split('_', 5)
        let length = tmp3.split('.', 2)
        let response = await fetch(
          process.env.REACT_APP_HCIS_BE_API + "/recruitmentcmd/api/applicant.medical.check.up.document.get/" + applicantID + '/' + medicalID[4],
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
              "Content-Type": "application/pdf"
            }
          }
        );
        console.log(response)
        response = await response.blob();
        if (response.size > 0) {
          response = URL.createObjectURL(response);
          this.setState({
            reportURL: response,
            fileType: length[1],
            formReportVisibleMcu: !this.state.formReportVisibleMcu
          });
        } else {
          alert("Failed: Document Not Found");
        }
      }
    
      openReport() {
        this.setState({ formReportVisibleMcu: !this.state.formReportVisibleMcu });
      }
    
    columnsDocumentMc = [
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
                    onClick={() => this.getReport(tableMeta.rowIndex)}
                  >
                    {val}
                    <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                  {/* {this.props.type !== "view" ? (
                    <button
                      type="button"
                      className="btnAct"
                      style={{ marginRight: 15, backgroundColor: 'transparent' }}
                      onClick={() => this.deleteMCU(tableMeta.rowIndex)}
                    >
                      <i className="fa fa-lw fa-times" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                    </button>
                  ) : null} */}
                </div>
              );
            }
          }
        }
      ];

      dataMc =[]
    closeReport() {
        this.setState({ reportVisible: false, reportVisibleRecruitmentRequest: false })
    }

    renderReport = () => {
        return (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">Document Viewer</div>
                </div>
              </div>
              <div style={{ textAlign: "center", margin: 20 }}>
                <FileViewer
                  fileType={this.state.fileType}
                  filePath={this.state.reportURL}
                />
              </div>
              <div className="padding-15px background-white">
                <div className="grid margin-top-15px">
                  <div className="content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.openReport.bind(this)}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="margin-bottom-20px" />
          </div>
        );
      };

    render() {
        return (
            <div className={"a-s-p-place active"}>
                {/* <div className="padding-top-20px" /> */}
                <div>
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-envelope"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        {this.state.title}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.closeSlide}
                                    className="btn btn-circle btn-grey">
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* {this.renderHeader()} */}
                    {this.state.reportVisible && (
                        <FormReport
                            url={this.state.reportURL}
                            id={this.state.data.variables.TASK_REFNO}
                            taskName={this.state.data.taskName}
                            onClickClose={this.closeReport.bind(this)}
                        />
                    )}
                    {this.state.reportVisibleRecruitmentRequest && (
                        <FormReport
                            type={'RecRequest'}
                            url={this.state.reportURL}
                            id={this.state.data.variables.RECRUITMENTREQID}
                            taskName={this.state.data.taskName}
                            onClickClose={this.closeReport.bind(this)}
                        />
                    )}
                    {this.state.formSearchEmpVisible && (
                        <FormSearchEmp
                            onClickClose={this.openSearch.bind(this)}
                            onClick={this.pickEmployee.bind(this)}
                        />
                    )}
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <FlexView column>
                            {this.state.data.taskName === 'APPLICANT COLLECTION' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.variables.TASK_TYPE === "APPLICANT JOB" && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'VALID APPLICANT DATA' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'PSIKOTEST' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'USER INTERVIEW' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'HRD INTERVIEW' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'EMPLOYEE SIGN TO BE' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {this.state.data.taskName === 'MEDICAL CHECKUP' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {this.state.data.taskName === 'CANDIDATE' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                            onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                            style={{
                                                borderRadius: 20,
                                                padding: 10,
                                                width: '100%'
                                            }}
                                            className="btn btn-blue">
                                            {this.state.data.variables.TASK_REFNO}
                                        </button>
                                    </div>
                                    <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                        <span style={{ paddingTop: 10 }}>
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                <div
                                    style={{ width: '100%', paddingTop: 20 }}
                                >
                                    {this.state.data.taskName === 'BT RESPONSIBILITY APPROVAL LEVEL 1' || this.state.data.taskName === 'BT RESPONSIBILITY APPROVAL LEVEL 2' ?
                                        <div style={{ paddingBottom: 20 }}>
                                            <button
                                                type='button'
                                                onClick={() => this.openBiztrip()}
                                                style={{
                                                    borderRadius: 20,
                                                    padding: 10,
                                                    width: '100%'
                                                }}
                                                className="btn btn-blue">
                                                {this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' || this.state.data.taskName === 'CANDIDATE' ? this.state.data.variables.RECRUITMENTREQID : this.state.data.taskName === 'KSE CHECKLIST' ? this.state.data.variables.TASK_REFNO : this.state.data.variables.TASK_REFNO}
                                            </button>
                                        </div>
                                        : null}
                                    {this.state.data.taskName !== 'MEDICAL CHECKUP' ?
                                    <button
                                        type='button'
                                        // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                        onClick={() => this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' || this.state.data.taskName === 'CANDIDATE' ? this.openReportR(this.state.data.variables.RECRUITMENTREQID) : this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                        style={{
                                            borderRadius: 20,
                                            padding: 10,
                                            width: '100%'
                                        }}
                                        className="btn btn-blue">
                                        {this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' || this.state.data.taskName === 'CANDIDATE' ? this.state.data.variables.RECRUITMENTREQID : this.state.data.taskName === 'KSE CHECKLIST' ? this.state.data.variables.TASK_REFNO : this.state.data.variables.TASK_REFNO}
                                    </button> : null }
                                </div>
                                <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                    <span style={{ paddingTop: 10 }}>
                                        {this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.variables.TASK_TYPE === "APPLICANT JOB" || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' || this.state.data.taskName === 'CANDIDATE' || this.state.data.taskName === 'EMPLOYEE SIGN TO BE' || this.state.data.taskName === 'SELECTION RECRUITMENT APPROVAL' ? 'Recruitment Request Number' : this.state.data.taskName === 'KSE CHECKLIST' ? 'Employee Number'
                                            : this.state.data.taskName === '' || this.state.data.taskName === 'OVERTIME APPROVAL LEVEL 2' || this.state.data.taskName === 'OVERTIME APPROVAL LEVEL 3' || this.state.data.taskName === 'OVERTIME APPROVAL LEVEL 4' ? 'Overtime Request Number' : this.state.data.taskName === 'MEDICAL CHECKUP' ? null  : this.state.titleNumber}
                                    </span>
                                </div>
                            </div>
                            {this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'HRD INTERVIEW' ? (
                                <div className='grid'>
                                    <FlexView
                                        grow>
                                        {/* <div className='col-1'> */}
                                        <div className="padding-15px">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* </div> */}
                                    </FlexView>
                                    <FlexView
                                        grow>
                                        <div className='col-2'>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-15px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            {this.state.data.taskName === 'PSIKOTEST' ? 'Psikotest Type' : this.state.data.taskName === 'HRD INTERVIEW' ? 'HRD Interview' : this.state.data.taskName === 'USER INTERVIEW' ? 'User Interview' : 'Interview Type'} <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <DropDown
                                                            disabled={this.state.data.taskName === 'PSIKOTEST' ? false : true}
                                                            title={this.state.data.taskName === 'PSIKOTEST' ? "-- please select psikotest type --" : this.state.interviewTypeValue}
                                                            bizValue={this.state.interviewTypeValue}
                                                            onChange={(dt) => this.setState({
                                                                psikotestType: dt
                                                            })}
                                                            data={this.props.bizparPsikotesType}
                                                            type="bizpar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow style={{padding:15}}>
                                        <div className="card-date-picker margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    PIC <span style={{ color: "red" }}>*</span>
                                                </h4>
                                                </div>
                                            </div>
                                            <div className="double">
                                                <input
                                                readOnly
                                                style={{ padding: 15 ,backgroundColor: "#E6E6E6"}}
                                                type="text"
                                                className="input"
                                                placeholder=""
                                                required
                                                value={this.state.dataEmp.employeeID + ' - ' + this.state.dataEmp.employeeName}
                                                    // onChange={(e) => this.setState({
                                                    //     PIC: e.target.value
                                                    // })}
                                                />
                                                <button
                                                className="btn btn-grey border-left btn-no-radius"
                                                type="button"
                                                onClick={() => this.openSearch()}
                                                >
                                                <i class="fas fa-search" />
                                                </button>
                                            </div>
                                            </div>
                                    </FlexView>
                                    <FlexView grow>
                                        {this.state.data.taskName === 'PSIKOTEST' ?
                                            <div className='col-4' style={{ width: "100%" }}>
                                                <div className="padding-15px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            Document <span style={{ color: "red" }}>*format file (docx & pdf)</span>
                                                        </span>
                                                    </div>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        className="txt txt-sekunder-color margin-bottom-15px"
                                                        placeholder=""
                                                        // onChange={(e) => this.setState({
                                                        //     document: e.target.value
                                                        // })}
                                                        value={this.state.documentUrl && this.state.documentUrl.split('document/recruitment_psikotest_doc/')}
                                                        required />

                                                    <UploadFile
                                                        type={this.state.uploadStatus}
                                                        percentage={this.state.percentage}
                                                        result={this.state.result}
                                                        acceptedFiles={['pdf', 'docx']}
                                                        onHandle={(dt) => {
                                                            this.setState({
                                                                url: dt, uploadStatus: 'idle', percentage: '0'
                                                            })
                                                        }
                                                        }
                                                        onUpload={() => {
                                                            this.connectWebsocket()
                                                            this.setState({ uploadStatus: 'upload' })
                                                            if (this.state.url === '') return alert('Please Select Document.')
                                                            if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                                            const formData = new FormData()
                                                            formData.append('file', this.state.url)
                                                            formData.append('psikotestID', this.state.data.variables.PSIKOTEST_ID)
                                                            formData.append('updatedBy', this.props.auth.user.employeeID)
                                                            formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss"))
                                                            Api.create('RECRUITMENT').postDocumentPsikotest(formData, {
                                                                onUploadProgress: (progress) => {
                                                                    if (progress.lengthComputable) {
                                                                        if (progress.total >= 1000000) {
                                                                            this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                                                        } else {
                                                                            var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                                                            this.setState({ percentage: percentCompleted })
                                                                            if (progress.loaded === progress.total) {
                                                                                this.setState({ result: 'success' })
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }).then(
                                                                (res) => {
                                                                    if (!res.ok && res.status === 413) {
                                                                        alert("Your Document Too Large, Please Select Another Document")
                                                                        this.setState({ result: 'error', percentage: '0' })
                                                                    }
                                                                    if (!res.ok && res.status === 500) {
                                                                        alert("Please Select Document")
                                                                        this.setState({ result: 'error' })
                                                                    }
                                                                    if (!res.ok && R.isNil(res.status)) {
                                                                        alert(res.problem)
                                                                        this.setState({ result: 'error' })
                                                                    }
                                                                    if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                    if (res.data.code === '201') {
                                                                        this.setState({
                                                                            // createPopUpVisible: true,
                                                                            // document: this.state.url.name,
                                                                            result: 'success'
                                                                        })
                                                                        this.getRecPsikotestById(this.state.data.variables.PSIKOTEST_ID)
                                                                    }
                                                                })
                                                        }} />

                                                    {/* <FilePond
                                                        allowMultiple={false}
                                                        onupdatefiles={
                                                            fileItems => {
                                                                let file = fileItems.map(fileItem => fileItem.file)
                                                                var url = file[0]
                                                                // console.log('url',url)
                                                                this.setState({ url })
                                                                if (file[0]) {
                                                                    this.setState({
                                                                        buttonVisible: true
                                                                    })
                                                                } else {
                                                                    this.setState({
                                                                        buttonVisible: false
                                                                    })
                                                                }
                                                            }
                                                        }
                                                        onremovefile={
                                                            () => {
                                                                this.setState({
                                                                    buttonVisible: false
                                                                })
                                                            }
                                                        } /> */}
                                                    {/* {this.state.buttonVisible
                                                        ? <button
                                                            type="button"
                                                            className="btn btn-blue btn-width-all margin-top-5px"
                                                            onClick={() => {
                                                                if (this.state.url === '') return alert('Please Select Document.')
                                                                if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                                                const formData = new FormData()
                                                                formData.append('file', this.state.url)
                                                                formData.append('psikotestID', this.state.data.variables.PSIKOTEST_ID)
                                                                Api.create('RECRUITMENT').postDocumentPsikotest(formData).then(
                                                                    (res) => {
                                                                        if (!res.ok && res.status === 400) alert("Please Insert File")
                                                                        if (!res.ok && res.status === 413) alert("Your Document Too Large, Please Select Another Document")
                                                                        if (!res.ok && res.status === 500) alert("Please Select Document")
                                                                        if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                        if (res.data.code === '201') {
                                                                            this.setState({
                                                                                createPopUpVisible: true,
                                                                                document: this.state.url.name
                                                                            })
                                                                            this.getRecPsikotestById(this.state.data.variables.PSIKOTEST_ID)
                                                                        }
                                                                    })
                                                            }}>
                                                            Upload File
                                                            </button>
                                                        : null} */}
                                                </div>

                                            </div>
                                            : null}
                                    </FlexView>

                                </div>
                            ) : null}

                            {this.state.kpkRequestVisible && (
                                <KpkRequest
                                    type="view"
                                    onClickClose={this.openKpk}
                                />
                            )}


                            {this.state.biztripSett && (
                                <div className="app-popup app-popup-show">
                                    <div className="padding-top-20px" />
                                    <div className="popup-content background-white border-radius">
                                        <div className="popup-panel grid grid-2x">
                                            <div className="col-1" style={{ width: '140%' }}>
                                                <div className="popup-title">
                                                    {"Business Trip Settlement"}
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-circle btn-grey"
                                                    onClick={this.openBiztrip}
                                                >
                                                    <i className="fa fa-lg fa-times" />
                                                </button>
                                            </div>
                                        </div>
                                        <form action="#"
                                            onSubmit={(e) => {
                                                e.preventDefault()
                                                //this.props.onClickSave(this.props.type, data)
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
                                                                <h4> Employee Name</h4>
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
                                                                <h4>Responsibility Type <span style={{ color: "red" }}>*</span></h4>
                                                            </div>
                                                        </div>
                                                        <DropDown
                                                            readOnly
                                                            style={{ backgroundColor: "#E6E6E6" }}
                                                            type='bizpar'
                                                            title=' -- please select item --'
                                                            disabled
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
                                                            disabled
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
                                                            style={{ backgroundColor: "#E6E6E6" }}
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            placeholder=""
                                                        // value={data.trainingExpenseAmount}
                                                        // onChange={(e) => this.setState({
                                                        //     data: { ...data, trainingExpenseAmount: e.target.value }
                                                        // })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="column-2">
                                                    <div className="margin-bottom-20px margin-top-25px">
                                                        <MuiThemeProvider theme={getMuiTheme()}>
                                                            <MUIDataTable
                                                                data={
                                                                    // this.state.payloadSppd.sppdDocumentURL === ""
                                                                    //     ? this.dataDocument: 
                                                                    this.state.documents
                                                                }
                                                                columns={this.columnsDocument}
                                                            // options={options}
                                                            />
                                                        </MuiThemeProvider>
                                                    </div>
                                                    <div className="padding-bottom-20px">
                                                        <div className="margin-5px">
                                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                                <h4>Note</h4>
                                                            </div>
                                                        </div>
                                                        <textarea
                                                            readOnly={this.props.type === "view" ? true : false}
                                                            style={{ backgroundColor: "#E6E6E6" }}
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
                                            </div>

                                            <div className="padding-15px">
                                                <div className="grid grid-2x">
                                                    <div className="col-1" />
                                                    <div className="col-2 content-right">
                                                        <button
                                                            style={{ marginLeft: "15px" }}
                                                            className="btn btn-primary"
                                                            type="button"
                                                            onClick={this.openBiztrip}
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
                            )}

                            {this.state.data.taskName === 'KSE CHECKLIST' || this.state.data.taskName === 'TERMINATION CHECKLIST' ? (
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={this.state.dataFacilityKse}
                                        columns={this.columnsKse}
                                        options={this.options}
                                    />
                                </MuiThemeProvider>
                            ) : null}

                            {this.state.data.taskName === 'EMPLOYEE SIGN TO BE' ? (
                                <FlexView grow>
                                    <div className='col-4' style={{ width: "100%" }}>
                                        <div className="padding-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Document <span style={{ color: "red" }}>*format file (pdf)</span>
                                                </span>
                                            </div>
                                            <input
                                                readOnly
                                                type="text"
                                                className="txt txt-sekunder-color margin-bottom-15px"
                                                placeholder=""
                                                // onChange={(e) => this.setState({
                                                //     document: e.target.value
                                                // })}
                                                // value={this.state.documentUrl && this.state.documentUrl.split('document/recruitment_psikotest_doc/')}
                                                required />

                                            <UploadFile
                                                type={this.state.uploadStatus}
                                                percentage={this.state.percentage}
                                                result={this.state.result}
                                                acceptedFiles={['pdf']}
                                                onHandle={(dt) => {
                                                    this.setState({
                                                        url: dt, uploadStatus: 'idle', percentage: '0'
                                                    })
                                                }
                                                }
                                            // onUpload={() => {
                                            //     this.connectWebsocket()
                                            //     this.setState({ uploadStatus: 'upload' })
                                            //     if (this.state.url === '') return alert('Please Select Document.')
                                            //     if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                            //     const formData = new FormData()
                                            //     formData.append('file', this.state.url)
                                            //     formData.append('psikotestID', this.state.data.variables.PSIKOTEST_ID)
                                            //     formData.append('updatedBy', this.props.auth.user.employeeID)
                                            //     formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss"))
                                            //     Api.create('RECRUITMENT').postDocumentPsikotest(formData, {
                                            //         onUploadProgress: (progress) => {
                                            //             if (progress.lengthComputable) {
                                            //                 if (progress.total >= 1000000) {
                                            //                     this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                            //                 } else {
                                            //                     var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                            //                     this.setState({ percentage: percentCompleted })
                                            //                     if (progress.loaded === progress.total) {
                                            //                         this.setState({ result: 'success' })
                                            //                     }
                                            //                 }
                                            //             }
                                            //         }
                                            //     }).then(
                                            //         (res) => {
                                            //             if (!res.ok && res.status === 413) {
                                            //                 alert("Your Document Too Large, Please Select Another Document")
                                            //                 this.setState({ result: 'error', percentage: '0' })
                                            //             }
                                            //             if (!res.ok && res.status === 500) {
                                            //                 alert("Please Select Document")
                                            //                 this.setState({ result: 'error' })
                                            //             }
                                            //             if (!res.ok && R.isNil(res.status)) {
                                            //                 alert(res.problem)
                                            //                 this.setState({ result: 'error' })
                                            //             }
                                            //             if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                            //             if (res.data.code === '201') {
                                            //                 this.setState({
                                            //                     // createPopUpVisible: true,
                                            //                     // document: this.state.url.name,
                                            //                     result: 'success'
                                            //                 })
                                            //                 this.getRecPsikotestById(this.state.data.variables.PSIKOTEST_ID)
                                            //             }
                                            //         })
                                            // }}
                                            />
                                        </div>

                                    </div>
                                </FlexView>
                            ) : null}

                            {this.state.data.taskName === 'MEDICAL CHECKUP' ? (
                                <FlexView grow>
                                    <div className='col-4' style={{ width: "100%" }}>
                                        <div className="padding-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Document <span style={{ color: "red" }}>*format file (pdf)</span>
                                                </span>
                                            </div>
                                            {/* <input
                                                readOnly
                                                type="text"
                                                className="txt txt-sekunder-color margin-bottom-15px"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    document: e.target.value
                                                })}
                                                // value={this.state.documentUrl && this.state.documentUrl.split('document/applicant_doc/mcu/')}
                                                value={this.state.documentMCU}
                                                required /> */}
                                                 <div className="margin-bottom-20px">
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                <MUIDataTable
                                                    data={ this.state.dataTable}
                                                    columns={this.columnsDocumentMc}
                                                    options={optionsMc}
                                                />
                                                </MuiThemeProvider>
                                            </div>

                                            <UploadFile
                                                type={this.state.uploadStatus}
                                                percentage={this.state.percentage}
                                                result={this.state.result}
                                                acceptedFiles={['pdf']}
                                                onHandle={(dt) => {
                                                    var url = dt
                                                    var formData = new FormData()
                                                    var mcuID = 'AMC-'+ M()
                                                    formData.append('file', url)
                                                    formData.append('applicantNumber', this.state.data.variables.TASK_REFNO)
                                                    formData.append('applicantMedicalCheckUpID', mcuID)
                                                    formData.append('medicalCheckUpDate', M().format("DD-MM-YYYY HH:mm:ss"))
                                                    formData.append('medicalCheckUpDescription', this.state.description)
                                                    formData.append('updatedBy', this.props.auth.user.employeeID)
                                                    formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss")) 
                                                    this.setState({ formData, url, mcuID })
                                                    // this.setState({
                                                    //     url: dt, uploadStatus: 'idle', percentage: '0'
                                                    // })
                                                }}
                                            onUpload={() => {
                                                this.setState({ uploadStatus: 'upload' })
                                                if (this.state.url === '') return alert('Please Select Document.')
                                                if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                                
                                                Api.create('RECRUITMENT').uploadMedicalDoc(this.state.formData, {
                                                    onUploadProgress: (progress) => {
                                                        if (progress.lengthComputable) {
                                                            if (progress.total >= 1000000) {
                                                                this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                                            } else {
                                                                var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                                                this.setState({ percentage: percentCompleted })
                                                                if (progress.loaded === progress.total) {
                                                                    this.setState({ result: 'success' })
                                                                }
                                                            }
                                                        }
                                                    }
                                                }).then(
                                                    (res) => {
                                                        console.log(res)
                                                        if (!res.ok && res.status === 413) {
                                                            alert("Your Document Too Large, Please Select Another Document")
                                                            this.setState({ result: 'error', percentage: '0' })
                                                        }
                                                        if (!res.ok && res.status === 500) {
                                                            alert("Please Select Document")
                                                            this.setState({ result: 'error' })
                                                        }
                                                        if (!res.ok && R.isNil(res.status)) {
                                                            alert(res.problem)
                                                            this.setState({ result: 'error' })
                                                        }
                                                        if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                        if (res.data.code === '201') {
                                                            this.setState({
                                                                // createPopUpVisible: true,
                                                                // document: this.state.url.name,
                                                                result: 'success'
                                                            })
                                                            this.getRecMCUById(this.state.data.variables.TASK_REFNO)
                                                        }
                                                    })
                                            }}
                                            />
                                        </div>

                                    </div>
                                </FlexView>
                            ) : null}

                            {this.state.data.taskName === 'MEDICAL CHECKUP' || this.state.data.taskName === 'EMPLOYEE SIGN TO BE' ? (
                                <FlexView
                                    grow>
                                    <div className="padding-15px">
                                        <div className="margin-bottom-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Description <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    description: e.target.value
                                                })}
                                                required />
                                        </div>
                                    </div>
                                </FlexView>) :
                                <FlexView
                                    grow>
                                    <div className="padding-15px">
                                        <div className="margin-bottom-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Notes <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    notes: e.target.value
                                                })}
                                                required />
                                        </div>
                                    </div>
                                </FlexView>
                            }
                        </FlexView>
                        {this.renderFooter()}

                        {this.state.formReportVisibleMcu ? this.renderReport() : null}
                    </div>
                </div>
                {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />)}

                {
                    this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createPopUpVisible: false
                                })
                            }}
                        />
                    )
                }
                <div className="padding-bottom-20px" />
            </div >
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(mppApproval);