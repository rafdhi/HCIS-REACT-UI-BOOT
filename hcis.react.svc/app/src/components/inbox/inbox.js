import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import FlexView from 'react-flexview'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import PopUp from '../pages/PopUpAlert'
import FormRequest from '../../modules/forms/formInbox/recruitmentRequest'
import API from '../../Services/Api'
import { getBizpar } from '../../Services/Utils'
import M from 'moment'
import { connect } from 'react-redux'
import * as R from 'ramda'
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import FormApproval from '../../modules/forms/formInbox/mppApproval'
import Resubmit from '../../modules/forms/formInbox/formResubmit'
import FormCompensationApproval from '../../modules/forms/formInbox/formCompensationApproval'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'
import KpkRequest from '../../modules/forms/formInbox/kpkRequest'

const clSlidePage = 'a-s-p-main'

const ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

// const BASE_URL_PHOTO = (data) => process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + data + '?id=' + M()


class Inbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foto: [],
      user: this.props.auth.user,
      popUpSaveVisible: false,
      rawData: [],
      claimVisible: false,
      dataTable: [],
      bizparRecruitmentType: [],
      bizparRecruitmentCategory: [],
      bizparRequestType: [],
      bizparEmployeeStatusType: [],
      bizparEmployeeStatusCategory: [],
      rawDataRecruitmentRequestByID: '',
      selectedIndex: null,
      approvalVisible: false,
      resubmitVisible: false,
      payApplovalVisible: false,
      kpkRequestVisible: false,
      imageUrl: '',
      dataByID: [],
      dataPosition: [],
      inboxCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      notifVisible: false,
      message: "",
      messages: "",
    }
    this.idleTimer = null
  }

  connectWebsocket = async (method) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/' + method,
        (message) => {
          let res = JSON.parse(message.body)
          console.log('messages: ' + res.messages)
          this.setState({
            notifVisible: true, message: res.messages,
          })
          this.clResizePane()
          setTimeout(() => {
            this.setState({
              notifVisible: false,
              message: res.message
            })
          }, 2000);
        })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

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

  clSidePage = () => {
    this.setState({ classAppSlidePage: 'app-side-page' })
  }

  opSidePage = (menu, data) => (e) => {
    console.log(menu)
    e.preventDefault()
    let selectedIndex = data
    this.setState({
      classAppSlidePage: 'app-side-page op-app-side',
      approvalVisible: false,
      payApplovalVisible: false,
      claimVisible: false,
      resubmitVisible: false,
      selectedIndex
    })

    this.opResizePane()
    switch (menu) {
      case "MPPAPP":
        this.setState({
          typeApproval: 'MPP',
          approvalVisible: true,
        })
        break
      case "MPPAPP2":
        this.setState({
          typeApproval: 'MPP Level 2',
          approvalVisible: true,
        })
        break
      case "MPPAPP3":
        this.setState({
          typeApproval: 'MPP Level 3',
          approvalVisible: true,
        })
        break
      case "MPPAPP4":
        this.setState({
          typeApproval: 'MPP Level 4',
          approvalVisible: true,
        })
        break
      case "PKWTAPPROVALLV1":
        this.setState({
          typeApproval: 'PKWT Level 1',
          approvalVisible: true,
        })
        break
      case "PKWTAPPROVALLV2":
        this.setState({
          typeApproval: 'PKWT Level 2',
          approvalVisible: true,
        })
        break
      case "KPKAPPROVALL1":
        this.setState({
          typeApproval: 'KPK Level 1 Request',
          approvalVisible: true, 
        })
        break;
      case "STAFFKPKLEVEL2APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 2 Request',
          approvalVisible: true,
        })
        break;
      case "MANAGERKPKLEVEL1APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 1 Request',
          approvalVisible: true, 
        })
        break;
      case "MANAGERKPKLEVEL2APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 2 Request',
          approvalVisible: true, 
        })
        break;
      case "MANAGERKPKLEVEL3APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 3 Request',
          approvalVisible: true, 
        })
        break;
        case "MANAGERKPKLEVEL4APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 4 Request',
          approvalVisible: true, 
        })
        break;
        case "MANAGERKPKLEVEL5APPROVAL":
        this.setState({
          typeApproval: 'KPK Level 5 Request',
          approvalVisible: true, 
        })
        break;
      case "RECRUITMENTREQ":
        this.setState({
          typeRequest: 'Recruitment Request',
          claimVisible: true
        })
        break
      case "RECRUITMENTREQAPPROVAL":
        this.setState({
          typeApproval: 'Recruitment Request Level 1',
          approvalVisible: true
        })
        break
      case "RECRUITMENTREQAPPROVAL2":
        this.setState({
          typeApproval: 'Recruitment Request Level 2',
          approvalVisible: true
        })
        break
      case "RECRUITMENTREQAPPROVAL3":
        this.setState({
          typeApproval: 'Recruitment Request Level 3',
          approvalVisible: true
        })
        break
      case "RECRUITMENTREQAPPROVAL4":
        this.setState({
          typeApproval: 'Recruitment Request Level 4',
          approvalVisible: true
        })
        break
      case "RECRUITMENTREQSELECTION":
        this.setState({
          typeRequest: 'Recruitment Selection',
          claimVisible: true
        })
        break
      case "RECRUITMENTREQSELECTIONAPPROVAL":
        this.setState({
          typeApproval: 'Recruitment Selection',
          approvalVisible: true,
        })
        break
      case "APPLICANTCOLLECTION":
        this.setState({
          typeApproval: 'Applicant Collection',
          approvalVisible: true,
        })
        break;
      case "APPLICANTJOB":
        this.setState({
          typeApproval: 'Applicant Job',
          approvalVisible: true,
        })
        break;
      case "VALIDAPPLICANTDATA":
        this.setState({
          typeApproval: 'Valid Applicant Data',
          approvalVisible: true
        })
        break;
      case "PSIKOTEST":
        this.setState({
          typeApproval: 'Psikotest',
          approvalVisible: true,
        })
        break;
      case "USERINTERVIEW":
        this.setState({
          typeApproval: 'User Interview',
          approvalVisible: true,
        })
        break;
      case "HRDINTERVIEW":
        this.setState({
          typeApproval: 'HRD Interview',
          approvalVisible: true,
        })
        break;
      case "MEDICALCHECKUP":
        this.setState({
          typeApproval: 'Medical Checkup',
          approvalVisible: true,
        })
        break;
      case "KPKNEGOSIATION":
        this.setState({
          typeApproval: 'Kpk Negosiation',
          kpkRequestVisible: true,
          approvalVisible: false,
          payApplovalVisible: false,
          claimVisible: false,
          resubmitVisible: false,
          allowResize: false,
          defaultSize: 0,
          minSize: 0,
          maxSize: 0
        })
        break;
      case "CANDIDATE":
        this.setState({
          typeApproval: 'Candidate',
          approvalVisible: true,
        })
        break;
      case "EMPSIGNTOBE":
        this.setState({
          typeApproval: 'Employee Sign To Be',
          approvalVisible: true,
        })
        break;
      case "KSECHECKLIST":
        this.setState({
          typeApproval: 'KSE Checklist',
          approvalVisible: true,
        })
        break;
      case "TERMINATIONCHECKLIST":
        this.setState({
          typeApproval: 'Termination Checklist',
          approvalVisible: true
        })
        break;
      case "BUSINESSTRIPAPPROVALLV1":
        this.setState({
          typeApproval: 'Business Trip Request',
          approvalVisible: true,
        })
        break;
      case "BUSINESSTRIPAPPROVALLV2":
        this.setState({
          typeApproval: 'Business Trip Level 2 Request',
          approvalVisible: true,
        })
        break;
      case "BUSINESSTRIPAPPROVALLV3":
        this.setState({
          typeApproval: 'Business Trip Level 3 Request',
          approvalVisible: true,
        })
        break;
      case "BUSINESSTRIPAPPROVALLV4":
        this.setState({
          typeApproval: 'Business Trip Level 4 Request',
          approvalVisible: true,
        })
        break;
      case "BUSINESSTRIPRESPONSIBILITYAPPROVALLV1":
        this.setState({
          typeApproval: 'Business Trip Responsibility',
          approvalVisible: true,
        })
        break;
      case "BUSINESSTRIPRESPONSIBILITYAPPROVALLV2":
        this.setState({
          typeApproval: 'Business Trip Responsibility Level 2',
          approvalVisible: true,
        })
        break;
      case "OVERTIMEAPPROVALLV1":
        this.setState({
          typeApproval: 'Overtime Request',
          approvalVisible: true,
        })
        break;
      case "OVERTIMEAPPROVALLV2":
        this.setState({
          typeApproval: 'Overtime Request 2',
          approvalVisible: true,
        })
        break
      case "OVERTIMEAPPROVALLV3":
        this.setState({
          typeApproval: 'Overtime Request 3',
          approvalVisible: true,
        })
        break
      case "OVERTIMEAPPROVALLV4":
        this.setState({
          typeApproval: 'Overtime Request 4',
          approvalVisible: true,
        })
        break
      case "OVERTIMERESPONSIBILITYAPPROVALLV1":
        this.setState({
          typeApproval: 'Overtime Responsibility',
          approvalVisible: true,
        })
        break;
      case "OVERTIMERESPONSIBILITYAPPROVALLV2":
        this.setState({
          typeApproval: 'Overtime Responsibility 2',
          approvalVisible: true,
        })
        break
      case "OVERTIMERESPONSIBILITYAPPROVALLV3":
        this.setState({
          typeApproval: 'Overtime Responsibility 3',
          approvalVisible: true,
        })
        break
      case "OVERTIMERESPONSIBILITYAPPROVALLV4":
        this.setState({
          typeApproval: 'Overtime Responsibility 4',
          approvalVisible: true,
        })
        break
      case "LEAVEAPPROVALLV1":
        this.setState({
          typeApproval: 'Leave Level 1 Request',
          approvalVisible: true,
        })
        break;
      case "LEAVEAPPROVALLV2":
        this.setState({
          typeApproval: 'Leave Level 2 Request',
          approvalVisible: true,
        })
        break;
      case "LEAVEAPPROVALLV3":
        this.setState({
          typeApproval: 'Leave Level 3 Request',
          approvalVisible: true,
        })
        break;
      case "LEAVEAPPROVALLV4":
        this.setState({
          typeApproval: 'Leave Level 4 Request',
          approvalVisible: true,
        })
        break;
      case "MOVEMENTAPPROVAL":
        this.setState({
          typeApproval: 'Movement Request',
          approvalVisible: true,
        })
        break;
      case "TERMINATIONAPPROVAL":
        this.setState({
          typeApproval: 'Termination Request',
          approvalVisible: true,
        })
        break;
      case "ABSENCEAPPROVAL":
        this.setState({
          typeApproval: 'Absence Request',
          approvalVisible: true,
        })
        break;
      case "ABSENCEAPPROVALLV2":
        this.setState({
          typeApproval: 'Absence Request2',
          approvalVisible: true,
        })
        break;
      case "LOANAPPROVAL":
        this.setState({
          typeApproval: 'Loan Request',
          approvalVisible: true,
        })
        break;
      case "TRAININGAPPROVAL":
        this.setState({
          typeApproval: 'Training Request',
          approvalVisible: true,
        })
        break;
      case "BLACKLISTAPPROVAL":
        this.setState({
          typeApproval: 'Blacklist Request',
          approvalVisible: true,
        })
        break;
      case "MOVEMENTRESUBMIT":
        API.create('MOVEMENT_QUERY').getMovementByID(this.state.rawData[selectedIndex].variables.TASK_REFNO)
          .then((res) => {
            if (res.data && res.data.status === 'S') {
              let datas = res.data.data
              this.setState({
                typeApproval: 'Movement Resubmit',
                dataByID: datas,
                resubmitVisible: true
              })
            }
            else return alert(res.data.message)
          })
        break;
      case "BUSINESSTRIPRESUBMIT":
        this.setState({
          typeApproval: 'Business Trip Resubmit',
          resubmitVisible: true
        })
        break;
      case "TERMINATIONRESUBMIT":
        this.setState({
          typeApproval: 'Termination Resubmit',
          resubmitVisible: true
        })
        break;
      case "TRAININGRESUBMIT":
        this.setState({
          typeApproval: 'Training Resubmit',
          resubmitVisible: true
        })

        break;
      case "LEAVERESUBMIT":
        this.setState({
          typeApproval: 'Leave Resubmit',
          resubmitVisible: true
        })
        break;
      case "ABSENCERESUBMIT":

        this.setState({
          typeApproval: 'Absence Resubmit',
          resubmitVisible: true
        })
        break;
      case "BLACKLISTRESUBMIT":
        this.setState({
          typeApproval: 'Blacklist Resubmit',
          resubmitVisible: true
        })
        break;
      case "OVERTIMERESUBMIT":
        this.setState({
          typeApproval: 'Overtime Resubmit',
          resubmitVisible: true
        })
        break;
      case "PAYROLLBATCHAPPROVAL":
        this.setState({
          typeApproval: 'Payroll Batch Approval',
          payApplovalVisible: true
        })
        break;
      case "CLAIMAPPROVAL":
        this.setState({
          typeApproval: 'Claim Approval',
          approvalVisible: true
        })
        break;
      case "CLAIMRESUBMIT":
        this.setState({
          typeApproval: 'Claim Resubmit',
          resubmitVisible: true
        })
        break;
      case "MPPRESUBMIT":
        this.setState({
          typeApproval: 'MPP Resubmit',
          resubmitVisible: true
        })
        break;
      default:
        break
    }
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })
  }

  clResizePane = () => {
    this.setState({
      approvalVisible: false,
      payApplovalVisible: false,
      claimVisible: false,
      resubmitVisible: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  getAllBizpar = async () => {
    let bizparRecruitmentType = await getBizpar('RECRUITMENT_TYPE')
    let bizparRecruitmentCategory = await getBizpar('RECRUITMENT_CATEGORY')
    let bizparRequestType = await getBizpar('RECRUITMENT_REQUEST_TYPE')
    let bizparEmployeeStatusType = await getBizpar('EMPLOYEE_STATUS')
    let bizparEmployeeStatusCategory = await getBizpar('CATEGORY_EMPLOYEE_STATUS')
    let bizparPsikotesType = await getBizpar('PSIKOTEST_TYPE')
    let bizparBlacklist = await getBizpar('BLACKLIST_TYPE')
    let bizparBlacklistCategory = await getBizpar('BLACKLIST_CATEGORY')

    this.setState({
      bizparRecruitmentType,
      bizparRecruitmentCategory,
      bizparRequestType,
      bizparEmployeeStatusCategory,
      bizparEmployeeStatusType,
      bizparPsikotesType,
      bizparBlacklist,
      bizparBlacklistCategory
    })
  }

  async getDataInbox(page, limit) {
    let { companyID, userID, employeeID } = this.state.user
    let payload = {
      "esID": companyID,
      userID,
      employeeID,
      "params": this.state.table_query,
      "offset": page,
      "limit": limit
    }

    let response = await API.create('BPM').getInboxData(payload)
    console.log(response)
    if (response.data && response.data.status === "S") {
      let foto = []
      let inboxCount
      if (response.data.data === null) {
        this.setState({
          dataPosition: []
        })
      } else {
        response.data.data.tasks.map((value) => {
          const { variables } = value;
          fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + variables.SENDER_EMPID, {
            headers: {
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
          })
            .then(response => response.blob())
            .then((blob) => {
              if (blob.size > 0) {
                foto.push({
                  url: URL.createObjectURL(blob),
                  empID: variables.SENDER_EMPID
                })
              }
              else { foto.push('') }
              let dataTable = response.data.data.tasks.map((value) => {
                const { taskName, taskDate, variables } = value;
                return [
                  {
                    name: variables.SENDER_EMPNAME,
                    employeeID: variables.SENDER_EMPID
                  },
                  variables.TASK_TYPE,
                  {
                    name: taskName,
                    desc: variables.TASK_DESCRIPTION
                  },
                  taskDate
                ]
              })
              if (R.isEmpty(this.state.table_query)) {
                inboxCount = response.data.data.totalTask
              } else {
                inboxCount = response.data.data.tasks.length
              }
              this.setState({ foto, dataTable, inboxCount })
            })
          return null
        })
        this.setState({ rawData: response.data.data.tasks })
      }
    }

    this.onFinishFetch()
  }

  openClaimForm = (selectedIndex = null) => {
    let dataByID = this.state.rawData[selectedIndex].variables
    this.setState({ claimVisible: !this.state.claimVisible, selectedIndex })
    console.log('data by id ', dataByID && dataByID.TASK_REFNO)
  }

  closeClaimForm = (selectedIndex = null) => {
    this.setState({ claimVisible: !this.state.claimVisible, selectedIndex })
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getDataPosition()
    }
  }

  getDataPosition() {
    API.create('ES').getTplJson(this.props.auth.user.companyID).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ dataPosition: res.data.data })
          }
        } else {
          this.onFinishFetch()
        }
      })
  }

  componentWillMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getDataInbox(this.state.table_page, this.state.table_limit)
      this.getAllBizpar()
      // this.getImage()
    }
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
    if (this.state.message !== "") {
      setTimeout(
        function () {
          this.setState({ notifVisible: false, message: "" })
        }.bind(this), 3000)
    }
  }

  async getImage() {
    let { employeeID } = this.state.user
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({ imageUrl: response })
    }
  }

  columns = [
    {
      name: "Requestor",
      options: {
        customBodyRender: (val, tableMeta) => {
          if (this.state.rawData && this.state.rawData[tableMeta.rowIndex] && this.state.rawData[tableMeta.rowIndex].variables) {
            let index = R.findIndex(R.propEq('empID', this.state.rawData[tableMeta.rowIndex].variables.SENDER_EMPID))(this.state.foto)
            return (
              <FlexView vAlignContent="center">
                <FlexView>
                  {index >= 0 ? (
                    <div>
                      <img alt='img' src={this.state.foto[index].url} style={{ verticalAlign: "middle", borderRadius: "50%", width: "50px", height: "50px", marginRight: 25 }} />
                    </div>
                  ) : (
                      <div>
                        <div className="image image-50px image-circle background-white border-all" style={{ marginRight: 25 }}>
                          <i className="icn fa fa-1x fa-user" style={{ textAlign: 'center' }} />
                        </div>
                      </div>
                    )}
                </FlexView>
                {val.name}
              </FlexView>
            )
          }
        }
      }
    },
    {
      name: "Task Type",
      options: {
        customBodyRender: (val) => {
          return (
            <FlexView vAlignContent="center">
              {val}
            </FlexView>
          )
        }
      }
    },
    {
      name: "Task Summary",
      options: {
        customBodyRender: (val) => {
          return (
            <FlexView column vAlignContent="center">
              <FlexView>
                <span style={{ fontWeight: "bold" }}>
                  {val.name}
                </span>
              </FlexView>
              <FlexView>
                {val.desc}
              </FlexView>
            </FlexView>
          )
        }
      }
    },
    "Request Date",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div style={{ width: '100px' }}>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage(tableMeta.rowData[1], tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          )
        }
      }
    }
  ]

  handleRequestPosition = async (data) => {
    let { recruitmentRequestID, recruitmentRequestPositions } = data
    if (typeof data.recruitmentRequestPositions[0].positionID === 'object') {
      recruitmentRequestPositions[0] = {
        ...recruitmentRequestPositions[0],
        positionID: data.recruitmentRequestPositions[0].positionID.ouid
      }
    }
    let employeeID = this.props.auth.user.employeeID
    let payload = {
      recruitmentRequestID,
      recruitmentRequestPositions,
      "updatedBy": employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    console.log('payload', payload)
    this.connectWebsocket('recruitment/request/put.recruitment.request.position/' + employeeID)
    let response = await API.create('RECRUITMENT').putRecReqPos(payload)
    console.log('PUT REC REQ', response)
    if (response.data && response.data.status === "S") {
      this.setState({
        //popUpSaveVisible: true
      })

    }
  }

  handleRequest = async (data) => {
    let employeeID = this.props.auth.user.employeeID
    let payload = {
      "taskID": this.state.rawData[this.state.selectedIndex].taskID,
      "senderUserID": this.state.user.userID,
      "senderEmpID": this.state.user.employeeID,
      "senderNotes": '',
      "senderBPMStatus": "INITIATE",
      "data": {
        ...data,
        recruitmentRequestDate: M().format('DD-MM-YYYY'),
        recruitmentPublishEndDate: M(data.recruitmentPublishEndDate).format('DD-MM-YYYY'),
        recruitmentPublishStartDate: M(data.recruitmentPublishStartDate).format('DD-MM-YYYY'),
        recruitmentRequestStatus: 'INITIATE'
      }
    }
    console.log('payload', JSON.stringify(payload))
    console.log('tes', this.state.rawDataRecruitmentRequestByID)
    let res = await API.create('RECRUITMENT_QUERY').getRecruitmentRequestByID(payload.data.recruitmentRequestID)
    console.log(res)
    if (res.data.code === "204") {
      console.log('post')
      this.connectWebsocket('recruitment/request/post/' + employeeID)
      let response
      response = await API.create('BPM').saveReqruitmentRequestPartial(payload)
      console.log('PUT REC REQ', response)
      if (response.data && response.data.status === "S") {
        this.openSavePopUp()
      }
      else { return alert(response.data.message) }
    } else if (res.data.code === "201") {
      console.log('put')
      this.connectWebsocket('recruitment/request/put/' + employeeID)
      let response
      response = await API.create('BPM').saveReqruitmentRequestPartial(payload)
      console.log('PUT REC REQ', response)
      if (response.data && response.data.status === "S") {
        this.openSavePopUp()
      }
      else { return alert(response.data.message) }
    }


  }

  openSavePopUp = () => {
    this.clResizePane()
    this.setState({ popUpSaveVisible: !this.state.popUpSaveVisible, resubmitVisible: false, approvalVisible: false, payApplovalVisible: false, kpkRequestVisible: false, claimVisible: false, rawData: [] })
    this.LoadingBar.continousStart()
    this.getDataInbox(this.state.table_page, this.state.table_limit)
  }

  async getRecruitmentRequestByID(value) {
    let response = await API.create('RECRUITMENT_QUERY').getRecruitmentRequestByID(value)
    if (response.data && response.data.status === "S") {
      this.setState({ rawDataRecruitmentRequestByID: response.data.data })
    }
  }

  onCloseKPK() {
    this.setState({
      kpkRequestVisible: false
    })
  }

  openApproval(index) {
    this.setState({
      approvalVisible: !this.state.approvalVisible,
      selectedIndex: index
    })
  }

  openResubmit(index, data) {
    this.setState({
      resubmitVisible: !this.state.resubmitVisible,
      selectedIndex: index,
      dataByID: data
    })
  }

  openPayApproval(index, data) {
    this.setState({
      payApplovalVisible: !this.state.payApplovalVisible,
      selectedIndex: index,
      dataByID: data
    })
  }

  submitResubmit(data) {
    let typeApproval = this.state.typeApproval
    let payload = data
    console.log('payload', JSON.stringify(payload))

    switch (typeApproval) {
      case 'Movement Resubmit':
        API.create('BPM').resubmitMovement(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Termination Resubmit':
        API.create('BPM').resubmitTermination(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Leave Resubmit':
        API.create('BPM').resubmitLeave(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Absence Resubmit':
        API.create('BPM').resubmitAbsence(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Training Resubmit':
        API.create('BPM').resubmitTraining(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Blacklist Resubmit':
        API.create('BPM').resubmitBlacklist(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Resubmit':
        API.create('BPM').resubmitOvertime(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Resubmit':
        API.create('BPM').resubmitSPPD(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Claim Resubmit':
        API.create('BPM').resubmitClaim(payload)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              alert("Failed: " + res.message)
            }
          })
        break;
      case 'MPP Resubmit':
        API.create('BPM').resubmitMPP(payload)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              alert("Failed: " + res.message)
            }
          })
        break;
      default:
        break
    }
  }

  submitApproval(data) {
    let typeApproval = this.state.typeApproval
    let apiCheck = this.state.rawData[this.state.selectedIndex].variables.LEAVE_REQUESTOR_LEVEL
    let kpkCheck = this.state.rawData[this.state.selectedIndex].variables.KPK_TYPE
    let payload = data
    let employeeID = this.props.auth.user.employeeID
    console.log('payload', JSON.stringify(payload))

    switch (typeApproval) {
      case 'MPP':
        API.create('BPM').submitMppApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'MPP Level 2':
        API.create('BPM').submitMppApprovalLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'MPP Level 3':
        API.create('BPM').submitMppApprovalLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'MPP Level 4':
        API.create('BPM').submitMppApprovalLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === "S" || res.data.code === "201") {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'PKWT Level 1':
        API.create('BPM').submitPKWTLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'PKWT Level 2':
        API.create('BPM').submitPKWTLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KPK Level 1 Request':
        kpkCheck === "STAFF" ? API.create('BPM').submitKPKStaffLv1Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitKPKManagerLv1Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KPK Level 2 Request':
        kpkCheck === "STAFF" ? API.create('BPM').submitKPKStaffLv2Approval(payload).then(
          (res) => {
            console.log('ww', res)
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitKPKManagerLv2Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KPK Level 3 Request':
        API.create('BPM').submitKPKManagerLv3Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KPK Level 4 Request':
        API.create('BPM').submitKPKManagerLv4Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KPK Level 5 Request':
        API.create('BPM').submitKPKManagerLv5Approval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Recruitment Request Level 1':
        this.connectWebsocket('recruitment/request/put.recruitment.request.state.and.status/SYSTEM')
        API.create('BPM').submitRecruitmentRequestApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Recruitment Request Level 2':
        this.connectWebsocket('recruitment/request/put.recruitment.request.state.and.status/SYSTEM')
        API.create('BPM').submitRecruitmentRequestApprovalLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Recruitment Request Level 3':
        this.connectWebsocket('recruitment/request/put.recruitment.request.state.and.status/SYSTEM')
        API.create('BPM').submitRecruitmentRequestApprovalLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Recruitment Request Level 4':
        this.connectWebsocket('recruitment/request/put.recruitment.request.state.and.status/SYSTEM')
        API.create('BPM').submitRecruitmentRequestApprovalLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Recruitment Selection':
        API.create('BPM').submitRecruitmentSelectionApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Applicant Collection':
        API.create('BPM').submitApplicantCollection(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Applicant Job':
        console.log(JSON.stringify(payload))
        API.create('BPM').submitApplicantJob(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Valid Applicant Data':
        API.create('BPM').submitValidApplicantData(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Psikotest':
        this.connectWebsocket('recruitment/psikotest/post/' + employeeID)
        API.create('BPM').submitPsikotest(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'User Interview':
        this.connectWebsocket('recruitment/interview/post/' + employeeID)
        API.create('BPM').submitUserInterview(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'HRD Interview':
        this.connectWebsocket('recruitment/interview/post/' + employeeID)
        API.create('BPM').submitHrdInterview(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Medical Checkup':
        API.create('BPM').submitMedicalCheckup(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Kpk Negosiation':
        API.create('BPM').submitKPKNegosiation(payload).then(
          (res) => {
            console.log(res)
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Candidate':
        API.create('BPM').submitCandidate(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Employee Sign To Be':
        API.create('BPM').submitSignToBe(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'KSE Checklist':
        this.connectWebsocket('employee.kse/post/' + employeeID)
        API.create('BPM').submitKseChechklist(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Termination Checklist':
        this.connectWebsocket('termination.checklist/post/' + employeeID)
        API.create('BPM').submitTerminationChecklist(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              alert("Failed: " + res.message)
            }
          }
        )
        break;
      case 'Termination Request':
        API.create('BPM').submitTerminationApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Movement Request':
        API.create('BPM').submitMovementApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Request':
        API.create('BPM').submitSPPDApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Level 2 Request':
        API.create('BPM').submitSPPDApprovalLvl2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Level 3 Request':
        API.create('BPM').submitSPPDApprovalLvl3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Level 4 Request':
        API.create('BPM').submitSPPDApprovalLvl4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Responsibility':
        API.create('BPM').submitSPPDSetApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Business Trip Responsibility Level 2':
        API.create('BPM').submitSPPDSetApprovalLvl2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Leave Level 1 Request':
        apiCheck === "STAFF" ? API.create('BPM').submitLeaveApprovalStaffLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === "SO" ? API.create('BPM').submitLeaveApprovalSOLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'EO' ? API.create('BPM').submitLeaveApprovalEOLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'DD' ? API.create('BPM').submitLeaveApprovalDDLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitLeaveApprovalDIRLv1(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Leave Level 2 Request':
        apiCheck === "STAFF" ? API.create('BPM').submitLeaveApprovalStaffLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === "SO" ? API.create('BPM').submitLeaveApprovalSOLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'EO' ? API.create('BPM').submitLeaveApprovalEOLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'DD' ? API.create('BPM').submitLeaveApprovalDDLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitLeaveApprovalDIRLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Leave Level 3 Request':
        apiCheck === "STAFF" ? API.create('BPM').submitLeaveApprovalStaffLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === "SO" ? API.create('BPM').submitLeaveApprovalSOLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'EO' ? API.create('BPM').submitLeaveApprovalEOLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : apiCheck === 'DD' ? API.create('BPM').submitLeaveApprovalDDLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitLeaveApprovalDIRLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Leave Level 4 Request':
        apiCheck === "SO" ? API.create('BPM').submitLeaveApprovalSOLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        ) : API.create('BPM').submitLeaveApprovalEOLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Request':
        API.create('BPM').submitOvertimeApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Request 2':
        API.create('BPM').submitOvertimeApprovalLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Request 3':
        API.create('BPM').submitOvertimeApprovalLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Request 4':
        API.create('BPM').submitOvertimeApprovalLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Responsibility':
        API.create('BPM').submitOvertimeSetApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Responsibility 2':
        API.create('BPM').submitOvertimeSetApprovalLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Responsibility 3':
        API.create('BPM').submitOvertimeSetApprovalLv3(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Overtime Responsibility 4':
        API.create('BPM').submitOvertimeSetApprovalLv4(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Absence Request':
        API.create('BPM').submitAbsenceApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Absence Request2':
        API.create('BPM').submitAbsenceApprovalLv2(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Training Request':
        API.create('BPM').submitTrainingApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Blacklist Request':
        API.create('BPM').submitBlacklistApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Payroll Batch Approval':
        API.create('BPM').submitPayrollBatchApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break;
      case 'Loan Request':
        API.create('BPM').submitLoanApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              alert("Failed: " + res.message)
            }
          }
        )
        break;
      case 'Claim Approval':
        API.create('BPM').submitClaimApproval(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              alert("Failed: " + res.message)
            }
          }
        )
        break;
      default:
        break
    }


  }

  submitRecruitmentRequest(data, taskID) {
    let typeRequest = this.state.typeRequest
    let payload = {
      "taskID": taskID,
      "senderUserID": this.state.user.userID,
      "senderEmpID": this.state.user.employeeID,
      "senderNotes": "",
      "senderBPMStatus": "INITIATE",
      "data": {
        "recruitmentRequestID": data.recruitmentRequestID
      }
    }

    switch (typeRequest) {
      case 'Recruitment Request':
        console.log('payload', JSON.stringify(payload))
        API.create('BPM').submitRecruitmentRequest(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break
      case 'Recruitment Selection':
        console.log('payload', JSON.stringify(payload))
        API.create('BPM').submitRecruitmentSelection(payload).then(
          (res) => {
            if (res.status === 200) {
              if (res.data.status === 'S') {
                this.openSavePopUp()
              } else {
                alert("Failed: " + res.data.message)
              }
            } else {
              console.log(res)
            }
          }
        )
        break
      default:
        break
    }
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }}></Redirect>

    let {
      bizparRecruitmentType,
      bizparRecruitmentCategory,
      bizparRequestType,
      bizparEmployeeStatusCategory,
      bizparEmployeeStatusType,
      inboxCount,
      table_query
    } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: inboxCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.clResizePane()
            this.setState({ table_page: tableState.page })
            this.getDataInbox(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.clResizePane()
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getDataInbox(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            this.clResizePane()
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getDataInbox(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className='col-1'></div>
        <div className='col-2'>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout} />
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={(
                <div className='a-s-p-place a-s-p-content active'>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className='a-s-p-mid no-header'>
                    <div className="padding-10px">
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          key={inboxCount}
                          title={'Inbox'}
                          subtitle={'lorem ipsum dolor'}
                          data={this.state.dataTable}
                          columns={this.columns}
                          options={tableOptions}
                        />
                      </MuiThemeProvider>
                    </div>

                  </div>
                  {this.state.kpkRequestVisible && (
                    <KpkRequest
                      title={this.state.typeApproval}
                      type={this.state.typeApproval}
                      data={this.state.rawData[this.state.selectedIndex]}
                      user={this.state.user}
                      handleSubmit={this.submitApproval.bind(this)}
                      onClickClose={this.onCloseKPK.bind(this)}
                      bizparPsikotesType={this.state.bizparPsikotesType}
                    />
                  )}
                  {this.state.notifVisible && (
                    <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}
                    />
                  )}
                  {this.state.popUpSaveVisible && (
                    <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={this.openSavePopUp.bind(this)} />
                  )}
                  {/* <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup} /> */}
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.approvalVisible && (
                    <FormApproval
                      title={this.state.typeApproval}
                      type={this.state.typeApproval}
                      data={this.state.rawData[this.state.selectedIndex]}
                      user={this.state.user}
                      handleSubmit={this.submitApproval.bind(this)}
                      closeSlide={this.clResizePane}
                      bizparPsikotesType={this.state.bizparPsikotesType}
                    // data={this.state.rawData[this.state.selectedIndex]}
                    // title={"Some title here"}
                    // titleNumber={"Some title number here"}
                    />
                  )}

                  {this.state.claimVisible && (
                    <FormRequest
                      rawDataRecruitmentRequestByID={this.state.rawDataRecruitmentRequestByID}
                      data={this.state.rawData[this.state.selectedIndex]}
                      bizparRecruitmentType={bizparRecruitmentType}
                      bizparRecruitmentCategory={bizparRecruitmentCategory}
                      bizparRequestType={bizparRequestType}
                      bizparEmployeeStatusCategory={bizparEmployeeStatusCategory}
                      bizparEmployeeStatusType={bizparEmployeeStatusType}
                      type={"create"}
                      closeSlide={this.clResizePane}
                      onClickSave={this.handleRequest.bind(this)}
                      onClickSavePosition={this.handleRequestPosition.bind(this)}
                      handleSubmit={this.submitRecruitmentRequest.bind(this)}
                      user={this.state.user}
                    />
                  )}

                  {this.state.resubmitVisible && (
                    <Resubmit
                      title={this.state.typeApproval}
                      type={this.state.typeApproval}
                      data={this.state.rawData[this.state.selectedIndex]}
                      user={this.state.user}
                      dataByID={this.state.dataByID}
                      handleSubmit={this.submitResubmit.bind(this)}
                      closeSlide={this.clResizePane}
                      selectedIndex={this.state.selectedIndex}
                      bizparBlacklistCategory={this.state.bizparBlacklistCategory}
                      bizparBlacklist={this.state.bizparBlacklist}
                      dataPosition={this.state.dataPosition}
                    />
                  )}
                  {this.state.payApplovalVisible && (
                    <FormCompensationApproval
                      title={this.state.typeApproval}
                      type={this.state.typeApproval}
                      data={this.state.rawData[this.state.selectedIndex]}
                      user={this.state.user}
                      dataByID={this.state.dataByID}
                      handleSubmit={this.submitApproval.bind(this)}
                      closeSlide={this.clResizePane}
                    // data={this.state.rawData[this.state.selectedIndex]}
                    // title={"Some title here"}
                    // titleNumber={"Some title number here"}
                    />
                  )}
                </div>
              )}
            >
            </ResizeSlider>
          </div>
        </div>
      </SplitPaneSecond>
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

export default connect(mapStateToProps, mapDispatchToProps)(Inbox)