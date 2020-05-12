import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'

import TableCncSigSectionEdit from "../../../tables/confCNC/tableCncSigSectionEdit";
import FormCncSigSectionDetail from "./formCncSigSectionDetail";

const defaultPayload = {
  "cncSignageSectionItemID": "",
  "cncSignageSectionItemCategory": "",
  "cncSignageSectionItems": []
}

class FormCncSigSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createItems: false,
      editVisible: false,
      savePopUpVisible: false,
      type: props.type,
      data: props.dataCnc ? props.dataCnc : { ...defaultPayload, cncSignageSectionItemID: "CNCSI-" + M() },
      dataTableDetail: [],
      selectedIndex: null
    }
  }

  componentDidMount = () => this.state.type === "edit" ? this.getDataDetail(this.state.data.cncSignageSectionItems) : null

  openDeletePopUp = (selectedIndex) => this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })

  getDataDetail(data) {
    let dataTableDetail = data.map((value) => {
      let componentItem = value.cncSignageSectionSubItemComponent ? value.cncSignageSectionSubItemComponent.bizparKey ? value.cncSignageSectionSubItemComponent.bizparKey : value.cncSignageSectionSubItemComponent : ""
      let index = R.findIndex(R.propEq("bizparKey", componentItem))(this.props.bizparCncSignageItem)
      if (index >= 0) componentItem = this.props.bizparCncSignageItem[index].bizparValue
      return [value.cncSignageSectionSubItemID, componentItem ? componentItem : "-"]
    })
    this.setState({ dataTableDetail })
  }

  addItem = (value, type) => {
    let { data } = this.state
    let dataItem = Object.assign([], this.state.data.cncSignageSectionItems)
    dataItem = dataItem.map((value) => {
      return {
        ...value,
        cncSignageSectionSubItemComponent: value.cncSignageSectionSubItemComponent ? value.cncSignageSectionSubItemComponent.bizparKey ? value.cncSignageSectionSubItemComponent.bizparKey : value.cncSignageSectionSubItemComponent : ""
      }
    })
    switch (type) {
      case "create":
        value = {
          ...value,
          cncSignageSectionSubItemComponent: value.cncSignageSectionSubItemComponent ? value.cncSignageSectionSubItemComponent.bizparKey ? value.cncSignageSectionSubItemComponent.bizparKey : value.cncSignageSectionSubItemComponent : ""
        }
        dataItem.push(value)
        break
      case "edit":
        value = {
          ...value,
          cncSignageSectionSubItemComponent: value.cncSignageSectionSubItemComponent ? value.cncSignageSectionSubItemComponent.bizparKey ? value.cncSignageSectionSubItemComponent.bizparKey : value.cncSignageSectionSubItemComponent : ""
        }
        let status = R.findIndex(R.propEq('cncSignageSectionSubItemID', value.cncSignageSectionSubItemID))(dataItem)
        if (status >= 0) {
          dataItem[status] = value
        }
        break
      case "delete":
        dataItem.splice(value, 1)
        break
      default:
        break
    }

    this.getDataDetail(dataItem)
    this.setState({ createItems: false, data: { ...data, cncSignageSectionItems: dataItem }, deletePopUpVisible: false, editVisible: false })
  }

  opPopupPage = type => {
    let savePopUpVisible
    this.setState({ editItems: false })
    switch (type) {
      case "popup-sigItems":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createItems: !this.state.createItems,
          savePopUpVisible
        });
        break;
      default:
        break;
    }
  };

  openSavePopUp = () => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })

  renderFormEdit = () => {
    return (
      <div className="padding-15px">
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-sit"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">Signage Item</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-sit">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-sigItems")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createItems && (
            <FormCncSigSectionDetail
              type={"create"}
              bizparCncSignageItem={this.props.bizparCncSignageItem}
              onClickSave={(value) => this.addItem(value, "create")}
              onClickClose={() => this.opPopupPage("popup-sigItems")}
            />
          )}
          <div className="app-open-close-content">
            <TableCncSigSectionEdit
              dataTableDetail={this.state.dataTableDetail}
              bizparCncSignageType={this.props.bizparCncSignageType}
              bizparCncSignageItem={this.props.bizparCncSignageItem}
              data={this.state.data}
              editVisible={this.state.editVisible}
              onDeletePopUp={this.openDeletePopUp.bind(this)}
              onClickSave={(value) => this.addItem(value, "edit")}
              onClickClose={() => this.opPopupPage("popup-sigItems")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                CNC Signage Section -{" "}
                {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
            <div className="padding-15px">
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-csi"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Signage Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-csi">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Component ID</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        value={data.cncSignageSectionItemID}
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
                            Component Type
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select component --"
                        type="bizpar"
                        data={this.props.bizparCncSignageType}
                        required
                        onChange={(e) => this.setState({
                          data: {
                            ...data,
                            cncSignageSectionItemCategory: e
                          }
                        })}
                        value={data.cncSignageSectionItemCategory ? data.cncSignageSectionItemCategory.bizparKey : ""}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
            {type === "edit" ? this.renderFormEdit() : null}
            <div className="border-top padding-15px content-right">
              <button
                type="button"
                onClick={this.props.onClickClose}
                className="btn btn-primary margin-right-10px">
                BACK
              </button>
              <button
                className="btn btn-blue"
                type="button"
                onClick={() => {
                  if (R.isEmpty(data.cncSignageSectionItemCategory)) return alert("Component Type is Required.")
                  this.props.onClickSave(data)
                }}>
                SAVE
              </button>
            </div>
          </form>
          <div className="margin-bottom-20px"></div>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-sigItems")}
          />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.setState({ deletePopUpVisible: false })}
            onClickDelete={() => this.addItem(this.state.selectedIndex, "delete")}
          />
        )}
      </div>
    );
  }
}

export default FormCncSigSection;
