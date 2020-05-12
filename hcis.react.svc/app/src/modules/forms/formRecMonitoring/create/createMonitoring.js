import React, { Component } from "react";
import DropDown from "../../../../modules/popup/DropDown";
import CalendarPicker from "../../../../modules/popup/Calendar";
import M, { invalid } from "moment";
import { connect } from "react-redux";
import uuid from "uuid";
import FormSearchMPP from "../../../searchForm/searchFormMPP";
import * as R from "ramda";

const defaultPayload = {
  recruitmentRequestID: "",
  recruitmentRequestDate: "",
  recruitmentPublishStartDate: "",
  recruitmentPublishEndDate: "",
  recruitmentRequestStatus: "INITIATE",
  recruitmentRequestState: null,
  recruitmentType: "",
  recruitmentEmployeeStatus: "",
  recruitmentCategory: "",
  recruitmentRequestType: "",
  recruitmentEmployeeStatusCategoryType: "",
  recruitmentRequestBy: "",
  mppID: "",
  recruitmentMethodologyID: "",
  recruitmentRequestPositions:[],
  recruitmentRequestQualifications:[],
  expectedEnterDate: "",
  recruitmentRequestReasonType: {
    oldPersonnelDate: "",
    oldPersonnelName: "",
    recruitmentReasonType: "",
    recruitmentRequestOtherReason: "",
    recruitmentRequestReasonTypeID: ""
  },
  createdBy: null,
  createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
  updatedBy: null,
  updatedDate: null,
  recordID: uuid.v4(),
  esid:''
};

class CreateMonitoring extends Component {
  constructor(props) {
    super(props);
    let { dataEmp } = this.props;
    this.state = {
      dataRec: {
        ...defaultPayload,
        recruitmentRequestID: "R-" + M(),
        recruitmentRequestBy:this.props.auth.user.employeeID,
      },
      dataEmp,
      visibleOld: false,
      visibleOther: false,
      formSearchEmpVisible: false
    };
  }

  addMPPHandler(value) {
    let selectedMPP = value;
    this.setState({
        dataRec: { ...this.state.dataRec, mppID: selectedMPP.mppID },
        dataMppID: selectedMPP.mppID,
        dataMppPosition: selectedMPP.position.ouName,
        formSearchEmpVisible: !this.state.formSearchEmpVisible
    });
    this.state.dataRec.recruitmentRequestPositions.push({
      positionID: selectedMPP.position.ouID,
      recruitmentRequestPositionID: "P-" + M(),
      positionQuota: 0,
      positionNotes: "",
    })
  }

  componentDidMount() {
  }

  selectType(type) {
    if (type === "RECRSNTYP-002") {
      this.setState({ visibleOld: true, visibleOther: false});
    } else if (type === "RECRSNTYP-003") {
      this.setState({ visibleOld: false, visibleOther: true,});
    } else {
      this.setState({ visibleOld: false, visibleOther: false });
    }
  }

  handleSelectOldDate = date => {
    this.setState({
      dataRec: {
        ...this.state.dataRec,
        recruitmentRequestReasonType: {
          ...this.state.dataRec.recruitmentRequestReasonType,
          oldPersonnelDate: M(date).format("YYYY-MM-DD")
        }
      }
    });
  };

  handleSelectEntryDate = date => {
    this.setState({
      dataRec: {
        ...this.state.dataRec,
        expectedEnterDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  handleSelectStartDate = date => {
    this.setState({
      dataRec: {
        ...this.state.dataRec,
        recruitmentPublishStartDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  handleSelectEndDate = date => {
    this.setState({
      dataRec: {
        ...this.state.dataRec,
        recruitmentPublishEndDate: M(date).format("YYYY-MM-DD")
      }
    });
  };

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  render() {
    let { dataRec } = this.state;
    let empReg = this.state.dataEmp.employeeRegistrationDate;

    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          {this.state.formSearchEmpVisible && (
            <FormSearchMPP
              onClickClose={this.openSearch.bind(this)}
              onChoose={this.addMPPHandler.bind(this)}
            />
          )}
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              if (R.isEmpty(this.state.dataRec.recruitmentRequestPositions)){
                return alert("MPP is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentPublishStartDate)){
                return alert("Publish Start Date is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentPublishEndDate)){
                return alert("Publish End Date is Required."); 
              }
              if (!R.isEmpty(this.state.dataRec.recruitmentPublishStartDate) && !R.isEmpty(this.state.dataRec.recruitmentPublishEndDate) &&
                this.state.dataRec.recruitmentPublishEndDate <
                this.state.dataRec.recruitmentPublishStartDate
              )
                return alert("End Date Should be Greater Than Start Date.");
              if (R.isEmpty(this.state.dataRec.recruitmentType)){
                  return alert("Recruitment Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentCategory)){
                return alert("Recruitment Category is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestType)){
                return alert("Recruitment Request Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentEmployeeStatus)){
                return alert("Employee Status Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentEmployeeStatusCategoryType)){
                return alert("Employee Status Category is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.expectedEnterDate)){
                return alert("Entry Date is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestReasonType.recruitmentReasonType)){
                return alert("Reason Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestReasonType.oldPersonnelDate) && this.state.visibleOld === true){
                return alert("Old Date is Required."); 
              }
              this.props.onClickSave(this.state.dataRec);
            }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  Recruitment Request - Create Form
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  type="button"
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose.bind(this)}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Request Number</h4>
                    </div>
                  </div>
                  <input
                    value={dataRec.recruitmentRequestID}
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Requestor</h4>
                    </div>
                  </div>
                  <input
                    value={this.props.auth.user.employeeName}
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Join Date</h4>
                    </div>
                  </div>
                  <input
                    value={empReg}
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Years of Service</h4>
                    </div>
                  </div>
                  <input
                    value={M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[0] + (M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "months" ? " Months Ago" : M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "days" ? " Days Ago" : M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "hours" ? " Hours Ago" : " Years Ago")}
                    style={{ backgroundColor: "#E6E6E6" }}
                    type="text"
                    readOnly
                    className="txt txt-sekunder-color"
                    placeholder={""}
                  />
                </div>
                <div className="card-date-picker margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        MPP Position <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <div className="double">
                    <input
                      readOnly
                      style={{ padding: 15 }}
                      type="text"
                      className="input"
                      placeholder=""
                      required
                      value={this.state.dataMppPosition}
                    />
                    <button
                      className="btn btn-grey border-left btn-no-radius"
                      type="button"
                      onClick={
                        this.props.type !== "view"
                          ? () => this.openSearch()
                          : null
                      }
                    >
                      <i class="fas fa-search" />
                    </button>
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Publish Date <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <div className="display-flex-normal">
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      onChange={e => {
                        this.handleSelectStartDate(e);
                      }}
                      date={dataRec.recruitmentPublishStartDate}
                    />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
                    </div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      onChange={e => {
                        this.handleSelectEndDate(e);
                      }}
                      date={dataRec.recruitmentPublishEndDate}
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Recruitment Type <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select recruitment type --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentType: dt
                          }
                        })
                      }
                      data={this.props.bizparRecruitmentType}
                      type="bizpar"
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Recruitment Category
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select recruitment category --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentCategory: dt
                          }
                        })
                      }
                      data={this.props.bizparRecruitmentCategory}
                      type="bizpar"
                    />
                  </div>
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Request Type
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select request type  --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentRequestType: dt
                          }
                        })
                      }
                      data={this.props.bizparRequestType}
                      type="bizpar"
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Employee Status Type
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select employee status type --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentEmployeeStatus: dt
                          }
                        })
                      }
                      data={this.props.bizparEmployeeStatusType}
                      type="bizpar"
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Employee Status Category
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select employee status category --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentEmployeeStatusCategoryType: dt
                          }
                        })
                      }
                      data={this.props.bizparEmployeeStatusCategory}
                      type="bizpar"
                    />
                  </div>
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>
                        Expected Entry Date
                        <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={this.props.type === "view" ? true : false}
                    date={dataRec.expectedEnterDate  }
                    onChange={e => {
                      this.handleSelectEntryDate(e);
                    }}
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                    <h4>
                      Reason Type
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                  <div className="margin-5px">
                    <DropDown
                      title="-- please select reason type --"
                      onChange={(dt) => {
                        this.setState({
                          dataRec: {
                            ...this.state.dataRec,
                            recruitmentRequestReasonType: {
                              ...this.state.dataRec.recruitmentRequestReasonType,
                              recruitmentReasonType: dt
                            }
                          }
                        })
                        this.selectType(dt)
                      }
                      }
                      data={this.props.bizparReasonType}
                      type="bizpar"
                    />
                  </div>
                </div>

                {this.state.visibleOld && (
                  <div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Personel Old Name
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <input
                        value={
                          dataRec.recruitmentRequestReasonType.oldPersonnelName
                        }
                        onChange={e => {
                          this.setState({
                            dataRec: {
                              ...this.state.dataRec,
                              recruitmentRequestReasonType: {
                                ...this.state.dataRec.recruitmentRequestReasonType,
                                oldPersonnelName: e.target.value
                              }
                            }
                          });
                        }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder={""}
                        required
                      />
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Date
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <CalendarPicker
                        disabled={this.props.type === "view" ? true : false}
                        onChange={e => {
                          this.handleSelectOldDate(e);
                        }}
                      />
                    </div>
                  </div>
                )}

                {this.state.visibleOther && (
                  <div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>
                            Description <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <textarea
                        readOnly={this.props.type === "view" ? true : false}
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        rows={5}
                        type="text"
                        required
                        className="txt txt-sekunder-color"
                        placeholder=""
                        value={
                          dataRec.recruitmentRequestReasonType
                            .recruitmentRequestOtherReason
                        }
                        onChange={e => {
                          this.setState({
                            dataRec: {
                              ...this.state.dataRec,
                              recruitmentRequestReasonType: {
                                ...this.state.dataRec.recruitmentRequestReasonType,
                                recruitmentRequestOtherReason: e.target.value
                              }
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-top padding-15px content-right">
              <button
                type="button"
                onClick={this.props.onClickClose.bind(this)}
                className="btn btn-primary margin-right-10px"
              >
                BACK
              </button>
              <button className="btn btn-blue" type="submit">
                SAVE
              </button>
            </div>
          </form>
        </div>
        <div className="padding-top-20px" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(CreateMonitoring);
