import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";

class FormMonitoringGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monitoringData: props.monitoringData,
      visibleOld: false,
      visibleOther: false
    };
  }

  componentDidMount() {
    this.selectType(
      this.state.monitoringData.recruitmentRequestReasonTypeDTO
        ? this.state.monitoringData.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey
        : ""
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.monitoringData !== prevProps.monitoringData) {
      this.setState({ monitoringData: this.props.monitoringData }, () =>
        this.selectType(
          this.props.monitoringData.monitoringData.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey
        )
      );
    }
  }

  selectType(type) {
    if (type === "RECRSNTYP-002") {
      this.setState({ visibleOld: true, visibleOther: false });
    } else if (type === "RECRSNTYP-003") {
      this.setState({ visibleOld: false, visibleOther: true });
    } else {
      this.setState({ visibleOld: false, visibleOther: false });
    }
  }

  render() {
    let { monitoringData } = this.state;
    let empReg = monitoringData.recruitmentRequestBy.employeeRegistrationDate

    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Number</h4>
                  </div>
                </div>
                <input
                  value={monitoringData.recruitmentRequestID}
                  readOnly
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
                  value={
                    monitoringData
                      ? monitoringData.recruitmentRequestBy.employeeName
                      : ""
                  }
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Join Date</h4>
                  </div>
                </div>
                <input
                  value={
                    monitoringData
                      ? monitoringData.recruitmentRequestBy
                          .employeeRegistrationDate
                      : ""
                  }
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  required
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
                    style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                    type="text"
                    className="input"
                    placeholder=""
                    required
                    value={monitoringData.recruitmentRequestMPP.positionValue}
                  />
                  <button
                    className="btn btn-grey border-left btn-no-radius"
                    type="button"
                    disabled
                  >
                    <i class="fas fa-search" />
                  </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Year of Service</h4>
                  </div>
                </div>
                <input
                  value={ M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[0] + (M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "months" ? " Months Ago" : M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "days" ? " Days Ago" : M(empReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "hours" ? " Hours Ago" : " Years Ago")}
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
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
                    disabled
                    date={M(
                      monitoringData.recruitmentPublishStartDate,
                      "DD-MM-YYYY"
                    ).format("YYYY-MM-DD")}
                  />
                  <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                    To
                  </div>
                  <CalendarPicker
                    disabled
                    date={M(
                      monitoringData.recruitmentPublishEndDate,
                      "DD-MM-YYYY"
                    ).format("YYYY-MM-DD")}
                  />
                </div>
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Recruitment Type</h4>
                  </div>
                </div>
                <DropDown
                  title={
                    monitoringData && monitoringData.recruitmentType
                      ? monitoringData.recruitmentType.bizparValue
                      : ""
                  }
                  disabled
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Recruitment Category</h4>
                  </div>
                </div>
                <DropDown
                  title={
                    monitoringData && monitoringData.recruitmentCategory
                      ? monitoringData.recruitmentCategory.bizparValue
                      : ""
                  }
                  disabled
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Type</h4>
                  </div>
                </div>
                <DropDown
                  title={
                    monitoringData && monitoringData.recruitmentRequestType
                      ? monitoringData.recruitmentRequestType.bizparValue
                      : ""
                  }
                  disabled
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Status</h4>
                  </div>
                </div>
                <DropDown
                  title={
                    monitoringData && monitoringData.recruitmentEmployeeStatus
                      ? monitoringData.recruitmentEmployeeStatus.bizparValue
                      : ""
                  }
                  disabled
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Status Category</h4>
                  </div>
                </div>
                <DropDown
                  title={
                    monitoringData &&
                    monitoringData.recruitmentEmployeeStatusCategoryType
                      ? monitoringData.recruitmentEmployeeStatusCategoryType
                          .bizparValue
                      : ""
                  }
                  disabled
                />
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
                  disabled
                  date={M(
                    monitoringData.expectedEnterDate,
                    "DD-MM-YYYY"
                  ).format("YYYY-MM-DD")}
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
                      onChange={dt =>
                        this.setState(
                          () => this.selectType(dt)
                        )
                      }
                      disabled
                      value={monitoringData.recruitmentRequestReasonTypeDTO ? monitoringData.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey : ''}
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
                      readOnly
                      style={ { backgroundColor: "#E6E6E6" }}
                      value={
                        monitoringData.recruitmentRequestReasonTypeDTO.oldPersonnelName
                      }
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder={""}
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
                      disabled
                      date={M(monitoringData.recruitmentRequestReasonTypeDTO.oldPersonnelDate,"DD-MM-YYYY").format("YYYY-MM-DD")}
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
                      readOnly
                      style={ { backgroundColor: "#E6E6E6" }}
                      rows={5}
                      type="text"
                      required
                      className="txt txt-sekunder-color"
                      placeholder=""
                      value={monitoringData.recruitmentRequestReasonTypeDTO.recruitmentRequestOtherReason}
                    />
                  </div>
                </div>
              )}
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
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormMonitoringGeneral;
