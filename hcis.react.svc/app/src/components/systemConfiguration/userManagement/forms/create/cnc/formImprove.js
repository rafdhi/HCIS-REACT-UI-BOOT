import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";
import * as R from 'ramda'
import TableImproveDetail from "../../../tables/confCNC/tableImproveTargetItemDet";
import FormImproveDetail from "./formImproveDetail";

const defaultPayload = {
  "improveTargetItemID": "",
  "improveTargetItemCategory": "",
  "improveTargetItems": []
}

class FormImprove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTargetSub: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      selectedIndex: null,
      type: props.type,
      data: props.data ? props.data : { ...defaultPayload, improveTargetItemID: "CNCI-" + M() }
    }
  }

  componentDidMount = () => this.state.type === "edit" ? this.getDataDetail(this.state.data.improveTargetItems) : null

  openDeletePopUp = (selectedIndex) => this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })

  getDataDetail(data) {
    let dataTableDetail = data.map((value) => {
      let componentItem = value.improveTargetComponent ? value.improveTargetComponent.bizparKey ? value.improveTargetComponent.bizparKey : value.improveTargetComponent : ""
      let index = R.findIndex(R.propEq("bizparKey", componentItem))(this.props.bizparCncImproveCatItem)
      if (index >= 0) componentItem = this.props.bizparCncImproveCatItem[index].bizparValue
      return [value.improveTargetItemID, componentItem ? componentItem : "-"]
    })
    this.setState({ dataTableDetail })
  }

  addItem = (value, type) => {
    let { data } = this.state
    let dataItem = Object.assign([], this.state.data.improveTargetItems)
    dataItem = dataItem.map((value) => {
      return {
        ...value,
        improveTargetComponent: value.improveTargetComponent ? value.improveTargetComponent.bizparKey ? value.improveTargetComponent.bizparKey : value.improveTargetComponent : ""
      }
    })
    switch (type) {
      case "create":
        value = {
          ...value,
          improveTargetComponent: value.improveTargetComponent ? value.improveTargetComponent.bizparKey ? value.improveTargetComponent.bizparKey : value.improveTargetComponent : ""
        }
        dataItem.push(value)
        break
      case "edit":
        value = {
          ...value,
          improveTargetComponent: value.improveTargetComponent ? value.improveTargetComponent.bizparKey ? value.improveTargetComponent.bizparKey : value.improveTargetComponent : ""
        }
        let status = R.findIndex(R.propEq('improveTargetItemID', value.improveTargetItemID))(dataItem)
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
    console.log("prrr", dataItem)
    this.getDataDetail(dataItem)
    this.setState({ createTargetSub: false, data: { ...data, improveTargetItems: dataItem }, deletePopUpVisible: false, editVisible: false })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editTargetSub: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-targetSub":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createTargetSub: !this.state.createTargetSub,
          savePopUpVisible
        });
        break;
      default:
        break;
    }
  };

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible
    });
  };

  renderFormEdit = () => {
    return (
      <div className="padding-10px">
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-itsi"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Improve Target Sub Item
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-itsi">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-targetSub")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createTargetSub && (
            <FormImproveDetail
              type={"create"}
              bizparCncImproveCatItem={this.props.bizparCncImproveCatItem}
              onClickSave={(value) => this.addItem(value, "create")}
              onClickClose={() => this.opPopupPage("popup-targetSub")}
            />
          )}
          <div className="app-open-close-content">
            <TableImproveDetail
              data={this.state.data}
              dataTableDetails={this.state.dataTableDetail}
              bizparCncImproveCatItem={this.props.bizparCncImproveCatItem}
              editVisible={this.state.editVisible}
              onDeletePopUp={this.openDeletePopUp.bind(this)}
              onClickSave={(value) => this.addItem(value, "edit")}
              onClickClose={() => this.opPopupPage("popup-targetSub")}
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
                Improve Target Item -{" "}
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
            <div className="padding-10px">
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-iti"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Improve Target Item
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-iti">
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
                        value={data.improveTargetItemID}
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
                        data={this.props.bizparCncImproveCat}
                        value={data.improveTargetItemCategory ? data.improveTargetItemCategory.bizparKey ? data.improveTargetItemCategory.bizparKey : data.improveTargetItemCategory : ""}
                        onChange={(e) => this.setState({
                          data: {
                            ...data,
                            improveTargetItemCategory: e
                          }
                        })}
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
                onClick={() => this.props.onClickClose()}
                className="btn btn-primary margin-right-10px">
                BACK
              </button>
              <button
                className="btn btn-blue"
                type="button"
                onClick={() => {
                  if (R.isEmpty(data.improveTargetItemCategory)) return alert("Component Type is Required.")
                  this.props.onClickSave(data)
                }}>
                SAVE
              </button>
            </div>
          </form>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-targetSub")}
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

export default FormImprove;
