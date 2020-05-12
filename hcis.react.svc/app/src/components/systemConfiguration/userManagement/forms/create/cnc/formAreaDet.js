import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import * as R from 'ramda'

const defaultPayload = {
  "areaDevelopmentSectionSubItemID": "",
  "areaDevelopmentSectionSubItemComponent": "",
  "areaDevelopmentSectionSubItemValue": ""
}

class FormAreaDet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      data: props.data ? props.data : { ...defaultPayload, areaDevelopmentSectionSubItemID: "CNCADS-" + M() }
    }
  }

  render() {
    let { type, data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="popup-title">
                Area Development Item -{" "}
                {type === "create" ? "Create Form" : "Edit Form"}
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

          <form action="#">
            <div className="border-bottom padding-15px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Component ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  value={data.areaDevelopmentSectionSubItemID}
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Component Name <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select component --"
                  type="bizpar"
                  data={this.props.bizparCncAreaDevCatItem}
                  onChange={(e) => this.setState({
                    data: {
                      ...data,
                      areaDevelopmentSectionSubItemComponent: e
                    }
                  })}
                  value={data.areaDevelopmentSectionSubItemComponent ? data.areaDevelopmentSectionSubItemComponent.bizparKey ? data.areaDevelopmentSectionSubItemComponent.bizparKey : data.areaDevelopmentSectionSubItemComponent : ""}
                />
              </div>
            </div>

            <div className="border-top padding-15px content-right">
              <button
                type="button"
                onClick={this.props.onClickClose}
                className="btn btn-primary margin-right-10px"
              >
                BACK
              </button>
              <button
                className="btn btn-blue"
                type="button"
                onClick={() => {
                  if (R.isEmpty(data.areaDevelopmentSectionSubItemComponent)) return alert("Component Name is Required.")
                  this.props.onClickSave(data)
                }}>
                SAVE
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default FormAreaDet;
