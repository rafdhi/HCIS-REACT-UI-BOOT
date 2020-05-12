import React, { Component } from "react";
import DropDown from "../../../../modules/popup/DropDown";
import CalendarPicker from "../../../../modules/popup/Calendar";
import FormQualification from "../edit/editQualification";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import M from "moment";
import { connect } from "react-redux";
import * as R from "ramda";
import FlexView from "react-flexview";
import Api from "../../../../Services/Api";

var ct = require("../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class EditMonitoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRec: {...props.rawRec,
        recruitmentPublishStartDate : props.rawRec.recruitmentPublishStartDate !== null ? M(props.rawRec.recruitmentPublishStartDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
        recruitmentPublishEndDate: props.rawRec.recruitmentPublishEndDate !== null ? M(props.rawRec.recruitmentPublishEndDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
        expectedEnterDate : props.rawRec.expectedEnterDate !== null ? M(props.rawRec.expectedEnterDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
        recruitmentRequestReasonTypeDTO:{
          ...props.rawRec.recruitmentRequestReasonTypeDTO,
          oldPersonnelDate: props.rawRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate !== null ? M(props.rawRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate, "DD-MM-YYYY").format("YYYY-MM-DD") : ''
        },
      },
      createVisible: false,
      editVisible: false,
      visibleOld: false,
      visibleOther: false,
      formSearchEmpVisible: false,
      visibleQualification: false,
      dataTampung: [],
      dataEdit: props.rawDataEdit
    };
  }

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible });
  };

  openEditForm(index) {
    this.setState({
      selectedIndex: index,
      editVisible: !this.state.editVisible
    });
  }

  openQualificationForm(index) {
    this.setState({
      visibleQualification: !this.state.visibleQualification,
      selectedIndex: index
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawRec !== prevProps.rawRec) {
      this.setState(
        {
          dataRec: {...this.props.rawRec,
          recruitmentPublishStartDate : this.props.rawRec.recruitmentPublishStartDate !== 'Invalid date' ? M(this.props.rawRec.recruitmentPublishStartDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
          recruitmentPublishEndDate: this.props.rawRec.recruitmentPublishEndDate !== 'Invalid date' ? M(this.props.rawRec.recruitmentPublishEndDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
          expectedEnterDate : this.props.rawRec.expectedEnterDate !== 'Invalid date' ? M(this.props.rawRec.expectedEnterDate, "DD-MM-YYYY").format("YYYY-MM-DD") : '',
          recruitmentRequestReasonTypeDTO:{
          ...this.props.rawRec.recruitmentRequestReasonTypeDTO,
          oldPersonnelDate: this.props.rawRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate !== 'Invalid date' ? M(this.props.rawRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate, "DD-MM-YYYY").format("YYYY-MM-DD") : ''
        }
      },
          // dataEdit:this.props.rawDataEdit,
          visibleOld: false,
          visibleOther: false
        },
        () => {
          this.selectType(
            this.props.rawRec.recruitmentRequestReasonTypeDTO
              .recruitmentReasonType.bizparKey
          )
          this.getDataTable(this.props.rawRec)
        }
      );
    }
  }

  componentDidMount() {
    this.selectType(
      this.state.dataRec.recruitmentRequestReasonTypeDTO
        ? this.state.dataRec.recruitmentRequestReasonTypeDTO
          .recruitmentReasonType.bizparKey
        : ""
    );
    this.getDataTable(this.state.dataRec)
  }

  getDataTable(dataRec) {
    let { dataTableQualification, dataTableQ } = [];
    if (dataRec.recruitmentRequestQualificationDTOs !== undefined) {
      dataTableQualification = dataRec.recruitmentRequestQualificationDTOs.map(
        (datax, index) => {
          let qType = [];
          if (datax.requestQualifications !== null) {
            datax.requestQualifications.map((value, index) => {
              if (index === datax.requestQualifications.length - 1) {
                qType.push(value.bizparKey);
              } else {
                qType.push(value.bizparKey + ", ");
              }
            });
          }
          return [
            (index += 1),
            datax.qualificationType.bizparValue,
            qType,
            datax.requestQualificationNotes,
            datax.isMandatory
          ];
        }
      );

      dataTableQ = dataRec.recruitmentRequestQualificationDTOs.map(
        (datax, index) => {
          let qTypeValue = [];
          if (datax.requestQualifications !== null) {
            datax.requestQualifications.map((value, index) => {
              if (index === datax.requestQualifications.length - 1) {
                qTypeValue.push(value.bizparValue);
              } else {
                qTypeValue.push(value.bizparValue + ", ");
              }
            });
          }
          return [
            (index += 1),
            datax.qualificationType.bizparValue,
            qTypeValue,
            datax.requestQualificationNotes,
            datax.isMandatory
          ];
        }
      );
      
      this.setState({ dataTableQualification, dataTableQ });
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

  handleSelectOldDate = date => {
    this.setState({
      dataRec: {
        ...this.state.dataRec,
        recruitmentRequestReasonTypeDTO: {
          ...this.state.dataRec.recruitmentRequestReasonTypeDTO,
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


  parseQualification(value, input, type, note, mandatory) {

    var valueCopy = Object.assign({}, value)
    if (value.qualificationType.bizparValue === type) {
      valueCopy.requestQualifications = input
      valueCopy.qualificationType = valueCopy.qualificationType.bizparKey
      valueCopy.requestQualificationNotes = note
      valueCopy.isMandatory = mandatory
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

  handleSave = (data, type, note, mandatory) => {
    console.log(data, type);
    var dataTableQualificationCopy = this.state.dataTableQualification;
    var dataTableNew = dataTableQualificationCopy.slice();
    dataTableQualificationCopy.map((item, index) => {
      if (
        (item.includes("AKREDITASI PRODI/JURUSAN") &&
          type === "AKREDITASI PRODI/JURUSAN") ||
        (item.includes("NILAI/IPK") && type === "NILAI/IPK") ||
        (item.includes("TOEFL") && type === "TOEFL") ||
        (item.includes("PENGUASAAN BAHASA") && type === "PENGUASAAN BAHASA") ||
        (item.includes("KEWARGANEGARAAN") && type === "KEWARGANEGARAAN") ||
        (item.includes("AKREDITASI PT") && type === "AKREDITASI PT") ||
        (item.includes("PENDIDIKAN") && type === "PENDIDIKAN") ||
        (item.includes("BERPENGALAMAN") && type === "BERPENGALAMAN") ||
        (item.includes("UMUR") && type === "UMUR") ||
        (item.includes("JENIS KELAMIN") && type === "JENIS KELAMIN")
      ) {
        var indexParent = dataTableQualificationCopy.indexOf(item);
        dataTableNew[indexParent] = Object.assign(
          [],
          dataTableNew[indexParent]
        );
        dataTableNew[indexParent].map((items, indexs) => {
          if (indexs == 2) {
            var dataTableNih = item.slice();
            dataTableNih[indexs] = Object.assign([], dataTableNih[indexs]);
            dataTableNih[indexs] = data;
            dataTableNih[3] = note;
            dataTableNih[4] = mandatory;
            dataTableNew[indexParent] = dataTableNih;
          }
        });
      } else { 
      }
    });
    setTimeout(() => {
      this.setState(
        {
          dataTableQualification: dataTableNew,
          visibleQualification: false
        },
        () => {
          var details = Object.assign([], this.state.dataRec.recruitmentRequestQualificationDTOs);
          details = details.map((item, index) => {
            return this.parseQualification(item, data, type, note, mandatory)
          })
          console.log(JSON.stringify(this.state.dataRec))
          let payload = {
            recruitmentRequestID: this.state.dataRec.recruitmentRequestID,
            recruitmentRequestDate: this.state.dataRec.recruitmentRequestDate,
            recruitmentPublishStartDate: M(this.state.dataRec.recruitmentPublishStartDate,"YYYY-MM-DD").format("DD-MM-YYYY"),
            recruitmentPublishEndDate: M(this.state.dataRec.recruitmentPublishEndDate,"YYYY-MM-DD").format("DD-MM-YYYY"),
            recruitmentRequestOtherClauses: this.state.dataRec.recruitmentRequestOtherClauses,
            recruitmentRequestStatus: this.state.dataRec.recruitmentRequestStatus,
            recruitmentRequestState: this.state.dataRec.recruitmentRequestState,
            recruitmentType: this.state.dataRec.recruitmentType.bizparKey,
            recruitmentEmployeeStatus: this.state.dataRec.recruitmentEmployeeStatus.bizparKey,
            recruitmentCategory: this.state.dataRec.recruitmentCategory.bizparKey,
            recruitmentRequestType: this.state.dataRec.recruitmentRequestType.bizparKey,
            recruitmentEmployeeStatusCategoryType: this.state.dataRec.recruitmentEmployeeStatusCategoryType.bizparKey,
            recruitmentRequestBy: this.state.dataRec.recruitmentRequestBy.employeeID,
            mppID: this.state.dataRec.recruitmentRequestMPP.mppID,
            recruitmentMethodologyID: this.state.dataRec.recruitmentMethodologyID.bizparKey,
            expectedEnterDate: M(this.state.dataRec.expectedEnterDate,"YYYY-MM-DD").format("DD-MM-YYYY"),
            esid: this.state.dataRec.recruitmentRequestMPP.esID,
            recruitmentRequestPositions: this.state.dataRec.recruitmentRequestPositionDTOs,
            recruitmentRequestSelections: this.state.dataRec.recruitmentRequestSelectionDTOs,
            recruitmentRequestQualifications: details,
            recruitmentRequestDocuments: this.state.dataRec.recruitmentRequestDocumentDTOs,
            recruitmentRequestReasonType: {
              oldPersonnelDate: this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey !== 'RECRSNTYP-002'  ?  '' : M(this.state.dataRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate,"YYYY-MM-DD").format("DD-MM-YYYY"),
              oldPersonnelName: this.state.dataRec.recruitmentRequestReasonTypeDTO.oldPersonnelName,
              recruitmentReasonType: this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey,
              recruitmentRequestOtherReason: this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentRequestOtherReason,
              recruitmentRequestReasonTypeID: this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentRequestReasonTypeID
            },
            createdBy: "SYSTEM",
            createdDate: "27-06-2019 11:52:07",
            updatedBy: null,
            updatedDate: null,
            recordID: this.state.dataRec.recordID
          }
          console.log(JSON.stringify(payload))
          Api.create('RECRUITMENT').putRecReq(payload).then((res) => {
            console.log(res)
            this.props.getData()
            this.setState({ dataEdit: payload })
          })
        }
      );
    }, 200);
  };

  validationSavePosition() {
    if (this.state.dataEdit.recruitmentRequestPositions[0].positionQuota === 0){
      return alert("Quota is Required."); 
    } else if (this.state.dataEdit.recruitmentRequestPositions[0].positionQuota > this.state.budget){
      return alert("Quota Should be Less Than Budget.");
    } else {
      console.log(this.state.dataEdit)
      this.props.onClickSavePosition(this.state.dataEdit);
    } 
  }

  //qualification
  columnsQualification = [
    "No",
    {
      name: "Qualification Type",
      options: {
        customBodyRender: (val, tableMeta) => {
          return <div>{val}</div>;
        }
      }
    },
    "Qualification",
    "Notes",
    {
      name: "Is Mandatory",
      options: {
        customBodyRender: val => {
          return (
            <div style={{ width: "100%", display: "flex" }}>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color: val ? "green" : "brown",
                  marginRight: 10
                }}
              />
              <div>{val ? "Yes" : "No"}</div>
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
                style={{ marginRight: 15, backgroundColor: "transparent" }}
                onClick={() => this.openQualificationForm(tableMeta.rowIndex)}
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
            </div>
          );
        }
      }
    }
  ];

  renderQualification = () => {
    let { dataRec } = this.state;
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={this.state.dataTableQ}
            columns={this.columnsQualification}
            options={options}
          />
        </MuiThemeProvider>

        {this.state.visibleQualification && (
          <FormQualification
            allData={dataRec.recruitmentRequestQualificationDTOs} 
            onClickSave={this.handleSave.bind(this)}
            dataTable={
              this.state.dataTableQualification[this.state.selectedIndex]
            }
            rawData={
              dataRec.recruitmentRequestQualificationDTOs[
              this.state.selectedIndex
              ]
            }
            onClickClose={this.openQualificationForm.bind(this)}
            qualificationType={this.props.qualificationType}
          />
        )}
        {/* <div className="border-top padding-15px content-right">
          <button className="btn btn-blue" type="submit">
            SAVE
          </button>
        </div> */}
      </div>
    );
  };

  renderPosition = () => {
    let { dataRec, dataEdit } = this.state;
    return (
      <div>
        <div className="grid grid-2x grid-mobile-none gap-15px">
          <div className="column-1">
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Position</h4>
                </div>
              </div>
              <input
                value={
                  dataRec.recruitmentRequestPositionDTOs.length > 0
                    ? dataRec.recruitmentRequestPositionDTOs[0].positionName
                    : ""
                }
                style={{ backgroundColor: "#E6E6E6" }}
                type="text"
                readOnly
                className="txt txt-sekunder-color"
                placeholder={""}
              />
            </div>
          </div>
          <div className="column-2">
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>
                    Quota <span style={{ color: "red" }}>*</span>
                  </h4>
                </div>
              </div>
              <input
                value={
                  dataEdit.recruitmentRequestPositions.length !== 0
                    ? dataEdit.recruitmentRequestPositions[0].positionQuota
                    : null
                }
                onChange={e => {
                  if (isNaN(e.target.value)) return true;
                  let recruitmentRequestPositions = Object.assign([], dataEdit.recruitmentRequestPositions);
                  recruitmentRequestPositions[0].positionQuota = e.target.value;
                  this.setState({
                    dataEdit: {
                      ...dataEdit,
                      recruitmentRequestPositions
                    }
                  });
                }}
                type="text"
                className="txt txt-sekunder-color"
                placeholder={"0"}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            border: "1px solid black",
            borderRadius: 20,
            fontSize: 20
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            MPP
          </div>
          <div className="grid grid-2x" style={{ textAlign: "center" }}>
            <div className="column-1" style={{ paddingLeft: 50 }}>
              <div>Budget</div>
              <div>Used</div>
              <div>Outstanding</div>
            </div>
            <div className="column-2" style={{ paddingRight: 100 }}>
              <div>{dataRec.recruitmentRequestMPP.budget}</div>
              <div>{dataRec.recruitmentRequestMPP.used}</div>
              <div>{dataRec.recruitmentRequestMPP.outstanding}</div>
            </div>
          </div>
        </div>
        <div className="border-top padding-15px content-right">
          <button
            className="btn btn-blue"
            type="button"
            onClick={() => {
              if (this.state.dataEdit.recruitmentRequestPositions[0].positionQuota === 0 || this.state.dataEdit.recruitmentRequestPositions[0].positionQuota === "0" || R.isEmpty(this.state.dataEdit.recruitmentRequestPositions[0].positionQuota)) return alert('Quota is Required.')
              if (this.state.dataEdit.recruitmentRequestPositions[0].positionQuota > this.state.dataRec.recruitmentRequestMPP.budget) return alert('Quota Should be Less Than Budget.')
              this.validationSavePosition()
            }}
          >
            SAVE
          </button>
        </div>
      </div>
    );
  };

  render() {
    let { dataRec, dataEdit } = this.state;
    let empReg = dataRec.recruitmentRequestBy.employeeRegistrationDate

    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              if (R.isEmpty(this.state.dataRec.recruitmentPublishStartDate)){
                return alert("Publish Start Date is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentPublishEndDate)){
                return alert("Publish End Date is Required."); 
              }
              // if (!R.isEmpty(this.state.dataRec.recruitmentPublishStartDate) && !R.isEmpty(this.state.dataRec.recruitmentPublishEndDate) &&
              //   this.state.dataRec.recruitmentPublishEndDate <
              //   this.state.dataRec.recruitmentPublishStartDate
              // )
              //   return alert("End Date Should be Greater Than Start Date.");

              if (R.isEmpty(this.state.dataRec.recruitmentType.bizparKey) || R.isNil(this.state.dataRec.recruitmentType.bizparKey)){
                  return alert("Recruitment Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentCategory.bizparKey) || R.isNil(this.state.dataRec.recruitmentCategory.bizparKey) ){
                return alert("Recruitment Category is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestType.bizparKey) || R.isNil(this.state.dataRec.recruitmentRequestType.bizparKey)){
                return alert("Recruitment Request Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentEmployeeStatus.bizparKey) || R.isNil(this.state.dataRec.recruitmentEmployeeStatus.bizparKey)){
                return alert("Employee Status Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentEmployeeStatusCategoryType.bizparKey) || R.isNil(this.state.dataRec.recruitmentEmployeeStatusCategoryType.bizparKey)){
                return alert("Employee Status Category is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.expectedEnterDate)){
                return alert("Entry Date is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey) || R.isNil(this.state.dataRec.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey)){
                return alert("Reason Type is Required."); 
              }
              if (R.isEmpty(this.state.dataRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate) && this.state.visibleOld === true){
                return alert("Old Date is Required."); 
              }
              this.props.onClickSave(dataRec, dataEdit);
            }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  Recruitment Request - Edit Form
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
                    value={dataRec.recruitmentRequestBy.employeeName}
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
                    value={
                      dataRec.recruitmentRequestBy.employeeRegistrationDate
                    }
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
                      style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                      type="text"
                      className="input"
                      placeholder=""
                      required
                      value={dataRec.recruitmentRequestMPP.positionValue}
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
                      <i className="fas fa-search" />
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
                      date={this.state.dataRec.recruitmentPublishStartDate}
                    />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
                    </div>
                    <CalendarPicker
                      disabled={this.props.type === "view" ? true : false}
                      onChange={e => {
                        this.handleSelectEndDate(e);
                      }}
                      date={this.state.dataRec.recruitmentPublishEndDate}
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
                            recruitmentType: {
                              ...dataRec.recruitmentType,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      value={dataRec.recruitmentType.bizparKey}
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
                            recruitmentCategory: {
                              ...dataRec.recruitmentCategory,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      value={dataRec.recruitmentCategory.bizparKey}
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
                      title="-- please select recruitment category --"
                      onChange={dt =>
                        this.setState({
                          dataRec: {
                            ...dataRec,
                            recruitmentRequestType: {
                              ...dataRec.recruitmentRequestType,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      value={dataRec.recruitmentRequestType.bizparKey}
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
                            recruitmentEmployeeStatus: {
                              ...dataRec.recruitmentEmployeeStatus,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      value={dataRec.recruitmentEmployeeStatus.bizparKey}
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
                            recruitmentEmployeeStatusCategoryType: {
                              ...dataRec.recruitmentEmployeeStatusCategoryType,
                              bizparKey: dt
                            }
                          }
                        })
                      }
                      value={
                        dataRec.recruitmentEmployeeStatusCategoryType.bizparKey
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
                    date={this.state.dataRec.expectedEnterDate}
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
                      onChange={dt => {
                        let dataCopy = Object.assign({}, this.state.dataRec);
                        dataCopy.recruitmentRequestReasonTypeDTO.recruitmentReasonType.bizparKey = dt;
                        this.setState({ dataRec: dataCopy });
                        this.selectType(dt);
                      }}
                      value={
                        dataRec.recruitmentRequestReasonTypeDTO
                          ? dataRec.recruitmentRequestReasonTypeDTO
                            .recruitmentReasonType.bizparKey
                          : ""
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
                        value={dataRec.recruitmentRequestReasonTypeDTO ? dataRec.recruitmentRequestReasonTypeDTO.oldPersonnelName : ''}
                        onChange={e => {
                          this.setState({
                            dataRec: {
                              ...this.state.dataRec,
                              recruitmentRequestReasonTypeDTO: {
                                ...this.state.dataRec
                                  .recruitmentRequestReasonTypeDTO,
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
                        date={dataRec.recruitmentRequestReasonTypeDTO.oldPersonnelDate}
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
                          dataRec.recruitmentRequestReasonTypeDTO
                            .recruitmentRequestOtherReason
                        }
                        onChange={e => {
                          this.setState({
                            dataRec: {
                              ...this.state.dataRec,
                              recruitmentRequestReasonTypeDTO: {
                                ...this.state.dataRec
                                  .recruitmentRequestReasonTypeDTO,
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
              <button className="btn btn-blue" type="submit">
                SAVE
              </button>
            </div>

            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <div className="app-open-close margin-top-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-qcf"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-globe margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Qualification
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-qcf">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  {this.renderQualification()}
                </div>
              </div>
            </div>

            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <div className="app-open-close margin-top-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-qc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-globe margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Qualification
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-qc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  {this.renderPosition()}
                </div>
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
              <button className="btn btn-blue" type="button"
              onClick={() => this.props.onClickSubmit(this.state.dataRec.recruitmentRequestID)}>
                SUBMIT
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

export default connect(mapStateToProps)(EditMonitoring);