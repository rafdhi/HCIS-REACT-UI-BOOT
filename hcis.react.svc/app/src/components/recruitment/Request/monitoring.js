import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from '../../../Services/Api'
import FormCreateMonitoring from "../../../modules/forms/formRecMonitoring/create/createMonitoring"
import FormEditMonitoring from "../../../modules/forms/formRecMonitoring/edit/editMonitoring"
import FormMonitoringGeneral from "../../../modules/forms/formRecMonitoring/formMonitoringGeneral";
import FormMonitoringQualification from "../../../modules/forms/formRecMonitoring/formMonitoringQualification";
import FormMonitoringPosition from "../../../modules/forms/formRecMonitoring/formMonitoringPosition";
import FormMonitoringDocument from "../../../modules/forms/formRecMonitoring/formMonitoringDocument";
import FormMonitoringSelection from "../../../modules/forms/formRecMonitoring/formMonitoringSelection";
import FormMonitoringOther from "../../../modules/forms/formRecMonitoring/formMonitoringOther";
import FormMonitoringHistory from "../../../modules/forms/formRecMonitoring/formMonitoringHistory";
import * as R from 'ramda'
import { getBizpar } from '../../../Services/Utils'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import PopUp from "../../pages/PopUpAlert";
import M from "moment";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Monitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      savePopupVisible: false,
      deletePopUpVisible: false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false,
      selectedIndex: null,
      activeTab: "",
      tabMenu: [
        "General",
        "Qualification",
        "Position",
        "Document",
        "Selection",
        "Other",
        "History"
      ],
      bizparRecruitmentType: [],
      bizparRecruitmentCategory: [],
      bizparRequestType: [],
      bizparEmployeeStatusType: [],
      bizparEmployeeStatusCategory: [],
      bizparReasonType: [],
      qualificationType: [],
      bizparAkreditasiProdi: [],
      bizparAkreditasiPT: [],
      bizparNilai: [],
      bizparKewarganegaraan: [],
      bizparToefl: [],
      bizparPenguasaanBahasa: [],
      bizparPendidikan: [],
      bizparBerpengalaman: [],
      bizparUmur: [],
      bizparJenisKelamin: [],
      dataTable: [],
      rawData: [],
      rawDataEmp: [],
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      recCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      qType: "",
    }
    this.idleTimer = null
  }

  async getEmployee() {
    let body = {
      employeeID: this.props.auth.user.employeeID
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeById(body)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              rawDataEmp: res.data.data
            });
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  getBizparType = async () => {
    let bizparRecruitmentType = await getBizpar('RECRUITMENT_TYPE')
    let bizparRecruitmentCategory = await getBizpar('RECRUITMENT_CATEGORY')
    let bizparEmployeeStatusType = await getBizpar('EMPLOYEE_STATUS')
    let bizparEmployeeStatusCategory = await getBizpar('CATEGORY_EMPLOYEE_STATUS')
    let bizparRequestType = await getBizpar('RECRUITMENT_REQUEST_TYPE')
    let bizparReasonType = await getBizpar('RECRUITMENT_REASON_TYPE')
    let qualificationType = await getBizpar('RECRUITMENT_QUALIFICATION_TYPE')
    let bizparAkreditasiProdi = await getBizpar('ACCREDITATION_TYPE')
    let bizparAkreditasiPT = await getBizpar('ACCREDITATION_TYPE')
    let bizparNilai = await getBizpar('GPA')
    let bizparKewarganegaraan = await getBizpar('NATIONALITY_TYPE')
    let bizparToefl = await getBizpar('TOEFL')
    let bizparPenguasaanBahasa = await getBizpar('LANGUAGE_SKILL')
    let bizparPendidikan = await getBizpar('EDUCATION_LEVEL')
    let bizparBerpengalaman = await getBizpar('RECRUITMENT_WORK_EXPERIENCE')
    let bizparUmur = await getBizpar('RECRUITMENT_AGE')
    let bizparJenisKelamin = await getBizpar('GENDER_TYPE')
    this.setState({
      bizparRecruitmentType,
      bizparRecruitmentCategory,
      bizparRequestType,
      bizparEmployeeStatusType,
      bizparEmployeeStatusCategory,
      bizparReasonType,
      qualificationType,
      bizparAkreditasiProdi,
      bizparAkreditasiPT,
      bizparNilai,
      bizparKewarganegaraan,
      bizparToefl,
      bizparPenguasaanBahasa,
      bizparPendidikan,
      bizparBerpengalaman,
      bizparUmur,
      bizparJenisKelamin
    });
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "AKREDITASI PRODI/JURUSAN") {
        this.setState({ qTypeProd: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "AKREDITASI PT") {
        this.setState({ qTypePT: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "NILAI/IPK") {
        this.setState({ qTypeNil: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "KEWARGANEGARAAN") {
        this.setState({ qTypeKw: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "TOEFL") {
        this.setState({ qTypeToefl: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "PENGUASAAN BAHASA") {
        this.setState({ qTypeBhs: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "PENDIDIKAN") {
        this.setState({ qTypePd: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "BERPENGALAMAN") {
        this.setState({ qTypeBp: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "UMUR") {
        this.setState({ qTypeUmr: item.bizparKey })
      }
    })
    this.state.qualificationType.map((item) => {
      if (item.bizparValue === "JENIS KELAMIN") {
        this.setState({ qTypeJk: item.bizparKey })
      }
    })
    let bap = []
    this.state.bizparAkreditasiProdi.map((item) => {
      bap.push(item.bizparKey)
    })
    let bapt = []
    this.state.bizparAkreditasiPT.map((item) => {
      bapt.push(item.bizparKey)
    })
    let bn = []
    this.state.bizparNilai.map((item) => {
      bn.push(item.bizparKey)
    })
    let bk = []
    this.state.bizparKewarganegaraan.map((item) => {
      bk.push(item.bizparKey)
    })
    let btl = []
    this.state.bizparToefl.map((item) => {
      btl.push(item.bizparKey)
    })
    let bpb = []
    this.state.bizparPenguasaanBahasa.map((item) => {
      bpb.push(item.bizparKey)
    })
    let bpk = []
    this.state.bizparPendidikan.map((item) => {
      bpk.push(item.bizparKey)
    })
    let bbp = []
    this.state.bizparBerpengalaman.map((item) => {
      bbp.push(item.bizparKey)
    })
    let bu = []
    this.state.bizparUmur.map((item) => {
      bu.push(item.bizparKey)
    })
    let bizparGender = []
    this.state.bizparJenisKelamin.map((item) => {
      bizparGender.push(item.bizparKey)
    })

    this.setState({ bizparGender, bap, bapt, bn, bk, btl, bpb, bpk, bbp, bu })
  };

  async handlepostRecruitmentReq(value) {
    value = {
      ...value = {
        recruitmentRequestID: value.recruitmentRequestID,
        recruitmentRequestDate: M().format("DD-MM-YYYY"),
        recruitmentPublishStartDate: M(value.recruitmentPublishStartDate).format("DD-MM-YYYY"),
        recruitmentPublishEndDate: M(value.recruitmentPublishEndDate).format("DD-MM-YYYY"),
        recruitmentRequestStatus: value.recruitmentRequestStatus,
        recruitmentRequestState: null,
        recruitmentType: value.recruitmentType,
        recruitmentEmployeeStatus: value.recruitmentEmployeeStatus,
        recruitmentCategory: value.recruitmentCategory,
        recruitmentRequestType: value.recruitmentRequestType,
        recruitmentEmployeeStatusCategoryType: value.recruitmentEmployeeStatusCategoryType,
        recruitmentRequestBy: this.props.auth.user.employeeID,
        mppID: value.mppID,
        recruitmentMethodologyID: "",
        recruitmentRequestPositions: value.recruitmentRequestPositions,
        recruitmentRequestQualifications: [{
          recruitmentReqQualificationID: 'Q-1' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeProd,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-2' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypePT,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-3' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeNil,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-4' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeKw,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-5' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeToefl,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-6' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeBp,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-7' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypePd,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-8' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeBhs,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-9' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeUmr,
          isMandatory: false
        },
        {
          recruitmentReqQualificationID: 'Q-10' + M(),
          requestQualifications: null,
          requestQualificationNotes: null,
          qualificationType: this.state.qTypeJk,
          isMandatory: false
        },
        ],
        expectedEnterDate: M(value.expectedEnterDate).format("DD-MM-YYYY"),
        recruitmentRequestReasonType: {
          oldPersonnelDate: value.recruitmentRequestReasonType.oldPersonnelDate !== "" ? M(value.recruitmentRequestReasonType.oldPersonnelDate).format("DD-MM-YYYY") : value.recruitmentRequestReasonType.oldPersonnelDate,
          oldPersonnelName: value.recruitmentRequestReasonType.oldPersonnelName,
          recruitmentReasonType: value.recruitmentRequestReasonType.recruitmentReasonType,
          recruitmentRequestOtherReason: value.recruitmentRequestReasonType.recruitmentRequestOtherReason,
          recruitmentRequestReasonTypeID: "RTYPE-" + M()
        },
        createdBy: this.props.auth.user.employeeID,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
        updatedBy: null,
        updatedDate: null,
        recordID: value.recordID,
        esid: this.props.auth.user.companyID
      }
    }
    console.log(JSON.stringify(value))
    let response = await API.create("RECRUITMENT").postRecReq(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
      this.getDataRecruitment(0, 5)
    } else {
      alert("Failed" + response.message);
    }
  }

  handleRequestPosition = async (data) => {
    let response = await API.create('RECRUITMENT').putRecReqPos(data)
    console.log(JSON.stringify(data))
    console.log('PUT REC REQ', response)
    if (response.data && response.data.status === "S") {
      this.openSavePopUp()
      this.getDataRecruitment(0, 5)
    }
  }

  async handleSubmitReq(value) {
    let payload = {
      "taskID": '',
      "senderUserID": this.props.auth.user.userID,
      "senderEmpID": this.props.auth.user.employeeID,
      "senderNotes": "",
      "senderBPMStatus": "INITIATE",
      "data": {
        "recruitmentRequestID": value
      }
    }
    let response = await API.create("BPM").submitRecruitmentRequest(payload);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
      this.getDataRecruitment(0, 5)
    } else {
      alert("Failed" + response.message);
    }
  }

  async handlePutRecruitmentReq(value, input) {
    value.recruitmentRequestQualificationDTOs.map((item) => {
      if (item.qualificationType.bizparKey === this.state.qTypeProd) {
        this.setState({ recruitmentReqQualificationIDProd: item.recruitmentReqQualificationID })
      } else if (item.qualificationType.bizparKey === this.state.qTypePT) {
        this.setState({ recruitmentReqQualificationIDPT: item.recruitmentReqQualificationID })
      }
    })
    value = {
      ...value = {
        recruitmentRequestID: value.recruitmentRequestID,
        recruitmentRequestDate: value.recruitmentRequestDate,
        recruitmentPublishStartDate: value.recruitmentPublishStartDate !== 'Invalid date' ? M(value.recruitmentPublishStartDate, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
        recruitmentPublishEndDate: value.recruitmentPublishEndDate !== 'Invalid date' ? M(value.recruitmentPublishEndDate, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
        recruitmentRequestStatus: value.recruitmentRequestStatus,
        recruitmentRequestState: null,
        recruitmentType: value.recruitmentType.bizparKey,
        recruitmentEmployeeStatus: value.recruitmentEmployeeStatus.bizparKey,
        recruitmentCategory: value.recruitmentCategory.bizparKey,
        recruitmentRequestType: value.recruitmentRequestType.bizparKey,
        recruitmentEmployeeStatusCategoryType: value.recruitmentEmployeeStatusCategoryType.bizparKey,
        recruitmentRequestBy: value.recruitmentRequestBy.employeeID,
        mppID: input.mppID,
        recruitmentMethodologyID: "",
        recruitmentRequestDocuments: [],
        recruitmentRequestSelections: [],
        recruitmentRequestPositions: input.recruitmentRequestPositions,
        recruitmentRequestQualifications: input.recruitmentRequestQualifications,
        expectedEnterDate: value.expectedEnterDate !== 'Invalid date' ? M(value.expectedEnterDate, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
        recruitmentRequestReasonType: {
          oldPersonnelDate: value.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey === 'RECRSNTYP-002' ? M(value.recruitmentRequestReasonTypeDTO.oldPersonnelDate, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
          oldPersonnelName: value.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey === 'RECRSNTYP-002' ? value.recruitmentRequestReasonTypeDTO.oldPersonnelName : '',
          recruitmentReasonType: value.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey,
          recruitmentRequestOtherReason: value.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey === 'RECRSNTYP-003' ? value.recruitmentRequestReasonTypeDTO.recruitmentRequestOtherReason : '',
          recruitmentRequestReasonTypeID: value.recruitmentRequestReasonTypeDTO.recruitmentRequestReasonTypeID
        },
        createdBy: value.recruitmentRequestCreationalDTO.createdBy,
        createdDate: value.recruitmentRequestCreationalDTO.createdDate,
        updatedBy: this.props.auth.user.employeeID,
        updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
        recordID: value.recordID,
        esid: value.recruitmentRequestCompany.esID
      }
    }
    let response = await API.create("RECRUITMENT").putRecReq(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
      this.getDataRecruitment(0, 5)
    } else {
      alert("Failed" + response.message);
    }
  }

  deleteRecruitmentReq() {
    let payload = {
      recruitmentRequestID: this.state.rawData[this.state.selectedIndex].recruitmentRequestID,
      updatedBy: this.props.auth.user.employeeID
    };

    API.create("RECRUITMENT").deleteRecReq(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({ deletePopUpVisible: false });
            this.getDataRecruitment(0, 5)
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          console.log(res);
        }
      });
  }

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible })
  };

  openEditForm = (index) => {
    this.parseData(index)
    this.setState({
      selectedIndex: index, editVisible: !this.state.editVisible
    });
  }

  closeEdit() {
    this.setState({
      editVisible: false
    })
  }

  parseQualification(value, input, type) {
    var valueCopy = Object.assign({}, value)
    if (value.qualificationType.bizparValue === type) {
      valueCopy.requestQualifications = input
      valueCopy.qualificationType = valueCopy.qualificationType.bizparKey
      return valueCopy;
    } else {
      if (value.requestQualifications.length !== 0) {
        let arrayQ = []
        value.requestQualifications.map(item => {
          arrayQ.push(item.bizparKey)
        })
        return {
          recruitmentReqQualificationID: value.recruitmentReqQualificationID,
          requestQualifications: arrayQ,
          requestQualificationNotes: value.requestQualificationNotes,
          qualificationType: value.qualificationType.bizparKey,
          isMandatory: value.isMandatory
        }
      } else {
        return {
          recruitmentReqQualificationID: value.recruitmentReqQualificationID,
          requestQualifications: value.requestQualifications,
          requestQualificationNotes: value.requestQualificationNotes,
          qualificationType: value.qualificationType.bizparKey,
          isMandatory: value.isMandatory
        }
      }
    }
  }

  parseData(index) {
    var details = Object.assign([], this.state.rawData[index].recruitmentRequestQualificationDTOs);
    details = details.map((item, index) => {
      return this.parseQualification(item, [], "")
    })
    let payload = {
      recruitmentRequestID: this.state.rawData[index].recruitmentRequestID,
      recruitmentRequestDate: this.state.rawData[index].recruitmentRequestDate,
      recruitmentPublishStartDate: this.state.rawData[index].recruitmentPublishStartDate,
      recruitmentPublishEndDate: this.state.rawData[index].recruitmentPublishEndDate,
      recruitmentRequestOtherClauses: this.state.rawData[index].recruitmentRequestOtherClauses,
      recruitmentRequestStatus: this.state.rawData[index].recruitmentRequestStatus,
      recruitmentRequestState: this.state.rawData[index].recruitmentRequestState,
      recruitmentType: this.state.rawData[index].recruitmentType.bizparKey,
      recruitmentEmployeeStatus: this.state.rawData[index].recruitmentEmployeeStatus.bizparKey,
      recruitmentCategory: this.state.rawData[index].recruitmentCategory.bizparKey,
      recruitmentRequestType: this.state.rawData[index].recruitmentRequestType.bizparKey,
      recruitmentEmployeeStatusCategoryType: this.state.rawData[index].recruitmentEmployeeStatusCategoryType.bizparKey,
      recruitmentRequestBy: this.state.rawData[index].recruitmentRequestBy.employeeID,
      mppID: this.state.rawData[index].recruitmentRequestMPP.mppID,
      recruitmentMethodologyID: this.state.rawData[index].recruitmentMethodologyID.bizparKey,
      expectedEnterDate: this.state.rawData[index].expectedEnterDate,
      esid: this.state.rawData[index].recruitmentRequestMPP.esID,
      recruitmentRequestPositions: this.state.rawData[index].recruitmentRequestPositionDTOs,
      recruitmentRequestSelections: this.state.rawData[index].recruitmentRequestSelectionDTOs,
      recruitmentRequestQualifications: details,
      recruitmentRequestDocuments: this.state.rawData[index].recruitmentRequestDocumentDTOs,
      createdBy: "SYSTEM",
      createdDate: "27-06-2019 11:52:07",
      updatedBy: null,
      updatedDate: null,
      recordID: this.state.rawData[index].recordID
    }
    this.setState({
      rawDataEdit: payload
    })
  }

  openDetailForm = (index) => {
    let { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible,
      selectedIndex: !detailVisible ? index : null,
      activeTab: !detailVisible ? "General" : "",
      generalVisible: !detailVisible ? true : false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false
    })
  }

  openSavePopUp = () => {
    this.setState({
      savePopupVisible: !this.state.savePopupVisible,
      createVisible: false,
      editVisible: false
    });
  };

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataRecruitment(this.state.table_page, this.state.table_limit)
      this.getBizparType()
      this.getEmployee()
    }
  }

  getDataRecruitment(page, limit) {
    if (!R.isEmpty(this.state.table_query)) {
      let payload = {
        offset: page,
        limit: limit
      }
      API.create('RECRUITMENT_QUERY').getCountRecruitmentReqAll().then(res => {
        if (res.status === 200) {
          this.setState({ recCount: res.data.data })
        }
      })
      API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
        (res) => {
          if (res.status === 200) {
            if (res.data.status === 'S') {
              this.onFinishFetch()
              let dataTable = res.data.data.map((value, index) => {
                const { recruitmentRequestID, recruitmentRequestDate, recruitmentRequestBy, recruitmentType, recruitmentCategory, recruitmentRequestType, recruitmentEmployeeStatus, recruitmentEmployeeStatusCategoryType, recruitmentPublishStartDate, recruitmentPublishEndDate, recruitmentRequestStatus } = value;
                return [
                  index += 1,
                  recruitmentRequestID + "|" + recruitmentRequestDate,
                  recruitmentRequestBy.employeeID + "|" + recruitmentRequestBy.employeeName,
                  (recruitmentType && !R.isNil(recruitmentType.bizparValue) ? recruitmentType.bizparValue : "") + " | " + (recruitmentCategory && !R.isNil(recruitmentCategory.bizparValue) ? recruitmentCategory.bizparValue : ""),
                  recruitmentRequestType && !R.isNil(recruitmentRequestType.bizparValue) ? recruitmentRequestType.bizparValue : "",
                  (recruitmentEmployeeStatus && !R.isNil(recruitmentEmployeeStatus.bizparValue) ? recruitmentEmployeeStatus.bizparValue : "") + " | " + (recruitmentEmployeeStatusCategoryType && !R.isNil(recruitmentEmployeeStatusCategoryType.bizparValue) ? recruitmentEmployeeStatusCategoryType.bizparValue : ""),
                  recruitmentPublishStartDate + " - " + recruitmentPublishEndDate,
                  recruitmentRequestStatus.replace(/_/g, " "),
                ]
              })
              this.setState({
                rawData: res.data.data,
                dataTable
              })
            } else {
              this.onFinishFetch()
              alert("Failed: " + res.data.message)
            }
          }
        })
    } else {
      let payload = {
        offset: page,
        limit: limit
      }
      API.create('RECRUITMENT_QUERY').getCountRecruitmentReqAll().then(res => {
        console.log(res)
        if (res.status === 200) {
          this.setState({ recCount: res.data.data })
        }
      })
      API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
        (res) => {
          if (res.status === 200) {
            if (res.data.status === 'S') {
              this.onFinishFetch()
              let dataTable = res.data.data.map((value, index) => {
                const { recruitmentRequestID, recruitmentRequestDate, recruitmentRequestBy, recruitmentType, recruitmentCategory, recruitmentRequestType, recruitmentEmployeeStatus, recruitmentEmployeeStatusCategoryType, recruitmentPublishStartDate, recruitmentPublishEndDate, recruitmentRequestStatus } = value;
                return [
                  index += 1,
                  recruitmentRequestID + "|" + recruitmentRequestDate,
                  recruitmentRequestBy.employeeID + "|" + recruitmentRequestBy.employeeName,
                  (recruitmentType && !R.isNil(recruitmentType.bizparValue) ? recruitmentType.bizparValue : "") + " | " + (recruitmentCategory && !R.isNil(recruitmentCategory.bizparValue) ? recruitmentCategory.bizparValue : ""),
                  recruitmentRequestType && !R.isNil(recruitmentRequestType.bizparValue) ? recruitmentRequestType.bizparValue : "",
                  (recruitmentEmployeeStatus && !R.isNil(recruitmentEmployeeStatus.bizparValue) ? recruitmentEmployeeStatus.bizparValue : "") + " | " + (recruitmentEmployeeStatusCategoryType && !R.isNil(recruitmentEmployeeStatusCategoryType.bizparValue) ? recruitmentEmployeeStatusCategoryType.bizparValue : ""),
                  recruitmentPublishStartDate + " - " + recruitmentPublishEndDate,
                  recruitmentRequestStatus.replace(/_/g, " "),
                ]
              })
              this.setState({
                rawData: res.data.data,
                dataTable
              })
            } else {
              this.onFinishFetch()
              alert("Failed: " + res.data.message)
            }
          }
        })
    }
  }

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columnsGeneral = [
    "No",
    {
      name: "No Request",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              <div>
                {val.split("|")[0]}
              </div>
              <div>
                Tgl Buat: {val.split("|")[1]}
              </div>
            </div>
          );
        }
      }
    },
    {
      name: "Requestor",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              <div>
                {val.split("|")[0]}
              </div>
              <div>
                {val.split("|")[1]}
              </div>
            </div>
          );
        }
      }
    },
    "Recruitment (Type | Category)",
    "Request Type",
    "Employee Status (Type | Category)",
    "Publish Date",
    {
      name: "Last Known Status",
      options: {
        customBodyRender: val => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 20 }}>
              <div style={{ width: '20%' }}>
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
                  }}
                />
              </div>
              <div style={{ width: '80%', textAlign: 'center' }}>
                {val}
              </div>
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
              {String(tableMeta.rowData).includes("INITIATE") ?
                <div>
                  <button
                    className="btnAct"
                    style={{ marginRight: 10 }}
                    type="button"
                    onClick={() => this.openEditForm(tableMeta.rowIndex)}
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
                    style={{ marginRight: 10 }}
                    type="button"
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                : null}
              <button
                type='button'
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  // important
  // vertical tab function
  opNavigator = (title) => {
    let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      generalVisible: false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false,
      activeTab: title
    }
    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          generalVisible: true
        }
        break;
      case "Qualification":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          qualificationVisible: true
        }
        break;
      case "Position":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          positionVisible: true
        }
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          documentVisible: true
        }
        break;
      case "Selection":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          selectionVisible: true
        }
        break;
      case "Other":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          otherVisible: true
        }
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          historyVisble: true
        }
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse)
  };

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { recCount, table_query, rawData, selectedIndex, qualificationType, tabMenu, dataTable, savePopupVisible, deletePopUpVisible, createVisible, editVisible, detailVisible, generalVisible, positionVisible, qualificationVisible, documentVisible, selectionVisible, otherVisible, historyVisble, bizparRecruitmentType, bizparRecruitmentCategory, bizparRequestType, bizparEmployeeStatusType, bizparEmployeeStatusCategory, bizparReasonType } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: recCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getDataRecruitment(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getDataRecruitment(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getDataRecruitment(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <div className="main-content">



        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />


        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* Monitoring */}
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={this.openCreateForm}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              key={recCount}
              title={"Recruitment Request"}
              subtitle={'lorem ipsum dolor'}
              data={dataTable}
              columns={this.columnsGeneral}
              options={tableOptions}
            />
          </MuiThemeProvider>
        </div>

        {createVisible && (
          <FormCreateMonitoring
            bizparRecruitmentType={bizparRecruitmentType}
            bizparRecruitmentCategory={bizparRecruitmentCategory}
            bizparRequestType={bizparRequestType}
            bizparEmployeeStatusType={bizparEmployeeStatusType}
            bizparEmployeeStatusCategory={bizparEmployeeStatusCategory}
            bizparReasonType={bizparReasonType}
            dataEmp={this.state.rawDataEmp}
            onClickClose={this.openCreateForm.bind(this)}
            onClickSave={this.handlepostRecruitmentReq.bind(this)}
          />
        )}

        {editVisible && (
          <FormEditMonitoring
            bizparRecruitmentType={bizparRecruitmentType}
            bizparRecruitmentCategory={bizparRecruitmentCategory}
            bizparRequestType={bizparRequestType}
            bizparEmployeeStatusType={bizparEmployeeStatusType}
            bizparEmployeeStatusCategory={bizparEmployeeStatusCategory}
            bizparReasonType={bizparReasonType}
            qualificationType={qualificationType}
            rawRec={rawData[selectedIndex]}
            rawDataEdit={this.state.rawDataEdit}
            getData={() => this.getDataRecruitment(this.state.table_page, this.state.table_limit)}
            onClickSavePosition={this.handleRequestPosition.bind(this)}
            onClickClose={this.closeEdit.bind(this)}
            onClickSave={this.handlePutRecruitmentReq.bind(this)}
            onClickSubmit={this.handleSubmitReq.bind(this)}
          />
        )}

        {savePopupVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.setState({ createVisible: false, savePopupVisible: false })}
          />
        )}

        {deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.deleteRecruitmentReq.bind(this)}
            onClick={this.openDeletePopup}
          />
        )}

        {detailVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Recruitment Request Detail - View Form
                </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openDetailForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="grid grid-2x-col7 gap-10px">

                <div className="col-1">
                  <ul className="vertical-tab">
                    {tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                  </ul>
                </div>

                <div className="col-2">
                  {generalVisible && (
                    <FormMonitoringGeneral
                      monitoringData={rawData[selectedIndex]}
                      dataEmp={this.state.rawDataEmp}
                      onClickClose={this.openDetailForm.bind(this)}
                      bizparReasonType={bizparReasonType}
                    />
                  )}
                  {qualificationVisible && (
                    <FormMonitoringQualification
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {positionVisible && (
                    <FormMonitoringPosition
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {documentVisible && (
                    <FormMonitoringDocument
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {selectionVisible && (
                    <FormMonitoringSelection
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {otherVisible && (
                    <FormMonitoringOther
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {historyVisble && (
                    <FormMonitoringHistory
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}
      </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
