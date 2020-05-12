import React, { Component } from "react";
import { getBizpar, renderInputText } from "../../../../Services/Utils";
import FlexView from "react-flexview";
import * as R from "ramda";
import DropDown from "../../../../modules/popup/DropDown";

class EditQualificationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bizpar: [],
      optionsType: "",
      data: this.props.rawData,
      dataTable: this.props.dataTable[2],
      checking: [],
      dropdown: '',
      isSelected: [],
      notes: this.props.dataTable[3] === null ? "" : this.props.dataTable[3],
      isActive: this.props.dataTable[4] === false ? false : true
    };
  }

  componentDidMount() {
    console.log(this.props.dataTable);
    var checking = []
    this.props.dataTable[2].map((item, index) => { 
      checking.push(String(item).replace(/, /g, ''))
      console.log(checking)
      this.setState({ 
        checking,
        dropdown: String(item)
      })
    }) 
  }

  async componentWillMount() {
    let bizpar = [];
    let optionsType = "";
    let data;

    switch (this.state.data.qualificationType.bizparValue) {
      case "AKREDITASI PRODI/JURUSAN":
        bizpar = await getBizpar("ACCREDITATION_TYPE");
        this.setState({ type: 'AKREDITASI PRODI/JURUSAN'})
        optionsType = "checkbox";
        break;
      case "AKREDITASI PT":
        bizpar = await getBizpar("ACCREDITATION_TYPE");
        this.setState({ type: 'AKREDITASI PT'})
        optionsType = "checkbox";
        break;
      case "NILAI/IPK":
        bizpar = await getBizpar("GPA");
        this.setState({ type: 'NILAI/IPK'})
        optionsType = "selectbox";
        break;
      case "KEWARGANEGARAAN":
        bizpar = await getBizpar("NATIONALITY_TYPE");
        this.setState({ type: 'KEWARGANEGARAAN'})
        optionsType = "checkbox";
        console.log(bizpar);
        break;
      case "TOEFL":
        bizpar = await getBizpar("TOEFL");
        this.setState({ type: 'TOEFL'})
        optionsType = "selectbox";
        break;
      case "PENGUASAAN BAHASA":
        bizpar = await getBizpar("LANGUAGE_SKILL");
        this.setState({ type: 'PENGUASAAN BAHASA'})
        optionsType = "checkbox";
        break;
      case "PENDIDIKAN":
        bizpar = await getBizpar("EDUCATION_LEVEL");
        this.setState({ type: 'PENDIDIKAN'})
        optionsType = "checkbox";
        break;
      case "BERPENGALAMAN":
        bizpar = await getBizpar("RECRUITMENT_WORK_EXPERIENCE");
        this.setState({ type: 'BERPENGALAMAN'})
        optionsType = "selectbox";
        break;
      case "UMUR":
        bizpar = await getBizpar("RECRUITMENT_AGE");
        this.setState({ type: 'UMUR'})
        optionsType = "selectbox";
        break;
      case "JENIS KELAMIN":
        bizpar = await getBizpar("GENDER_TYPE");
        this.setState({ type: 'JENIS KELAMIN'})
        optionsType = "checkbox";
        break;
      default:
        bizpar = [];
        optionsType = "";
        break;
    }

    let notes = "";
    let selected = optionsType === "checkbox" ? [] : "";
    let is_mandatory = false;

    let {
      requestQualifications,
      requestQualificationNotes,
      isMandatory
    } = this.state.data;

    if (requestQualificationNotes) notes = requestQualificationNotes;

    if (requestQualifications) {
      selected = requestQualifications;
    }

    if (isMandatory) is_mandatory = isMandatory;

    switch (optionsType) {
      case "checkbox":
        data = {
          notes,
          selected,
          is_mandatory
        };
        break;
      default:
        data = {
          notes,
          selected,
          is_mandatory
        };
        break;
    }

    let { bizValue } = "";
    let index = R.findIndex(R.propEq("bizparKey", data.selected))(bizpar);
    if (index >= 0) {
      bizValue = bizpar[index].bizparValue;
      // bizKey = bizpar[index].bizparKey
    }

    this.setState({ bizpar, optionsType, data, bizValue });
  }

  handleChecked(data){ 
    var dataTable = this.state.checking
    var index = dataTable.indexOf(data.bizparKey)
    // console.log(index)
    if (index == -1) {
      dataTable.push(data.bizparKey)
    } else {
      dataTable.splice(index, 1)
    }
    this.setState({checking: dataTable}, () => console.log(dataTable))
  }

  handleDropdown(data){
    let arrayData = []
    arrayData.push(data)
    let newArray = Object.assign([], this.state.checking)
    newArray = arrayData
    this.setState({ checking: newArray, dropdown: data})
  }

  renderOptions() {
    if (this.state.optionsType === "checkbox") {
      return (
        <div row="true" style={this.state.type === "PENGUASAAN BAHASA" ? { flexFlow: 'wrap', boxSizing:'border-box', minWidth: '0px', display: 'flex', flex: '0 1 auto' } : { flexFlow: 'row-nowrap', boxSizing:'border-box', minWidth: '0px', display: 'flex', flex: '0 1 auto' }}>
          {this.state.bizpar.map((data, index) => {
            let { selected } = this.state.data;
            let is_checked = false;

            selected.map((item, index) => {
              if (item.bizparKey === data.bizparKey) {
                is_checked = true;
              }
              return null;
            });

            return (
              <div key={index} style={this.state.type === "PENGUASAAN BAHASA" ? { padding: 5, width: '30%' } : { padding: 5 }}>
                <label>
                  <input
                    checked={this.state.checking.includes(data.bizparKey)}
                    onChange={() => {
                        this.handleChecked(data)
                    }}
                    style={{ marginRight: 10}}
                    value={data.bizparKey}
                    type="checkbox"
                  />
                  {this.props.qualificationType === "PENGUASAAN BAHASA" ? (
                    <span style={{ fontSize: 13, marginLeft: 10 }}>
                      {" "}
                      <br /> {data.bizparValue}
                    </span>
                  ) : (
                    data.bizparValue
                  )}
                </label>
              </div>
            );
          })}
        </div>
      );
    } else if (this.state.optionsType === "selectbox") {
      let { selected } = this.state.data;
      selected.map((item, index) => {
        selected = item.bizparKey;
      });
      return (
        <DropDown
          title="-- please select qualification --"
          bizValue={this.state.bizValue}
          onChange={(dt) =>{
            this.handleDropdown(dt)
          }}
          type="bizpar"
          data={this.state.bizpar}
          value={this.state.dropdown}
        />
      );
    } else {
      return renderInputText(
        "",
        this.state.data && this.state.data.selected,
        e => {
          if (isNaN(e.target.value)) return true;
          this.setState({
            data: {
              ...this.state.data,
              selected: e.target.value
            }
          });
        }
      );
    }
  }

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">Edit Qualification - Form</div>
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
          <form action="#">
            <div className="padding-15px grid-mobile-none">
              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Qualification Type
                  </span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={this.props.rawData.qualificationType.bizparValue}
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Qualification{" "}
                    <div style={{ color: "red", display: "inline-block" }}>
                      *
                    </div>
                  </span>
                </div>
                {this.renderOptions()}
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Notes
                  </span>
                </div>
                <textarea
                  value={this.state.notes}
                  onChange={e =>
                    this.setState({
                      notes: e.target.value
                    })
                  }
                  rows={5}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                />
              </div>

              <div className="margin-bottom-15px">
                <div className="margin-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    Is Mandatory{" "}
                    <div style={{ color: "red", display: "inline-block" }}>
                      *
                    </div>
                  </span>
                </div>
                <label className="radio">
                  <input
                    type="checkbox"
                    name="status"
                    checked={this.state.isActive}
                    onChange={e =>
                      this.setState({
                        isActive: e.target.checked
                      })
                    }
                  />
                  <span className="checkmark" />
                  <span className="txt-site txt-11 txt-bold txt-main">
                    Activate now
                  </span>
                </label>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      this.props.onClickSave(this.state.checking, this.state.type, this.state.notes, this.state.isActive)
                    }}
                  >
                    <span>SAVE</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}
export default EditQualificationForm;
