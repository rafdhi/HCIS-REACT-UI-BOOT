import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import FormCNC from "./formCNC";

//formChild
import FormCncCompHeader from "../../create/cnc/formCncCompHead";
import FormFeedback from "../../create/cnc/formFeedback";
import FormChallenge from "../../create/cnc/formChallenge";
import FormAspiration from "../../create/cnc/formAspiration";
import FormImprove from "../../create/cnc/formImprove";
import FormArea from "../../create/cnc/formArea";
import FormCNCSigSection from "../../create/cnc/formCncSigSection";

//table
import TableCncCompHead from "../../../tables/confCNC/tableCncCompHeader";
import TableFeedbackItem from "../../../tables/confCNC/tablefeedbackItem";
import TableChallengeItem from "../../../tables/confCNC/tableChallengeItem";
import TableAspirationItem from "../../../tables/confCNC/tableAspirationItem";
import TableImproveItem from "../../../tables/confCNC/tableImproveTargetItem";
import TableCncArea from "../../../tables/confCNC/tableCncArea";
import TableCncSegSection from "../../../tables/confCNC/tableCncSigSection";

import PopUp from "../../../../../pages/PopUpAlert";
import { getBizpar } from '../../../../../../Services/Utils'
import Api from "../../../../../../Services/Api";
import * as R from 'ramda'

class FormEditCNC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createCompHead: false,
      createFeedback: false,
      createChallenge: false,
      createAspiration: false,
      createImprove: false,
      createArea: false,
      createSigSection: false,
      savePopUpVisible: false,
      editVisible: false,
      dataCnc: props.data,
      bizparCncSignageType: [],
      bizparCncSignageItem: [],
      bizparCncHeaderComp: [],
      bizparCncAreaDevCat: [],
      bizparCncAreaDevCatItem: [],
      bizparCncFeedbackType: [],
      bizparCncImproveCat: [],
      bizparCncImproveCatItem: []
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) return this.setState({ dataCnc: this.props.data })
  }

  componentDidMount = () => this.getDataBizpar()

  getDataBizpar = async () => {
    let bizparCncSignageType = await getBizpar('CNC_SIGNAGE_CATEGORY')
    let bizparCncSignageItem = await getBizpar('CNC_SIGNAGE_CATEGORY_ITEM')
    let bizparCncHeaderComp = await getBizpar('CNC_HEADER_COMPONENT')
    let bizparCncAreaDevCat = await getBizpar('CNC_AREA_DEV_CATEGORY')
    let bizparCncAreaDevCatItem = await getBizpar('CNC_AREA_DEV_CATEGORY_ITEM')
    let bizparCncFeedbackType = await getBizpar('CNC_FEEDBACK_TYPE')
    let bizparCncImproveCat = await getBizpar('CNC_IMPROVE_CATEGORY')
    let bizparCncImproveCatItem = await getBizpar('CNC_IMPROVE_CATEGORY_ITEM')

    this.setState({ bizparCncSignageType, bizparCncSignageItem, bizparCncHeaderComp, bizparCncAreaDevCat, bizparCncAreaDevCatItem, bizparCncFeedbackType, bizparCncImproveCat, bizparCncImproveCatItem })
  }

  postCncSignage = async (data) => {
    let payload = {
      "cncSignageSectionID": this.state.dataCnc.cncTPLData.signageSections.cncSignageSectionID,
      "cncTPLID": this.state.dataCnc.cncTPLID,
      "items": [data]
    }
    let response = await Api.create("CFG").postCncSignageSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.openSavePopUp()
        this.setState({ createSigSection: false })
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  updateCncSignage = async (value, type) => {
    let { dataCnc } = this.state
    let dataSignage = Object.assign([], dataCnc.cncTPLData.signageSections.cncSignageSectionItems)
    dataSignage = dataSignage.map((value) => {
      return {
        ...value,
        cncSignageSectionItemCategory: value.cncSignageSectionItemCategory ? value.cncSignageSectionItemCategory.bizparKey : "",
        cncSignageSectionItems: value.cncSignageSectionItems.map((data) => {
          return {
            ...data,
            cncSignageSectionSubItemComponent: data.cncSignageSectionSubItemComponent ? data.cncSignageSectionSubItemComponent.bizparKey ? data.cncSignageSectionSubItemComponent.bizparKey : data.cncSignageSectionSubItemComponent : ""
          }
        })
      }
    })
    switch (type) {
      case "update-signage":
        value = {
          ...value,
          cncSignageSectionItemCategory: value.cncSignageSectionItemCategory ? value.cncSignageSectionItemCategory.bizparKey ? value.cncSignageSectionItemCategory.bizparKey : value.cncSignageSectionItemCategory : "",
          cncSignageSectionItems: value.cncSignageSectionItems.map((data) => {
            return {
              ...data,
              cncSignageSectionSubItemComponent: data.cncSignageSectionSubItemComponent ? data.cncSignageSectionSubItemComponent.bizparKey ? data.cncSignageSectionSubItemComponent.bizparKey : data.cncSignageSectionSubItemComponent : ""
            }
          })
        }
        let status = R.findIndex(R.propEq('cncSignageSectionItemID', value.cncSignageSectionItemID))(dataSignage)
        if (status >= 0) {
          dataSignage[status] = value
        }
        break
      case "delete-signage":
        dataSignage.splice(value, 1)
        break
      default:
        break
    }

    let payload = {
      "cncSignageSectionID": dataCnc.cncTPLData.signageSections.cncSignageSectionID,
      "cncTPLID": dataCnc.cncTPLID,
      "items": dataSignage
    }
    let response = await Api.create("CFG").updateCncSignageSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.setState({ deletePopUpVisible: false, editVisible: false })
        this.openSavePopUp()
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  postCncHeader = async (data) => {
    let { dataCnc } = this.state
    let payload = {
      "cncHeaderSectionID": dataCnc.cncTPLData.header.cncHeaderSectionID,
      "cncTPLID": dataCnc.cncTPLID,
      "components": [data]
    }
    let response = await Api.create("CFG").postCncHeaderSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.openSavePopUp()
        this.setState({ createCompHead: false })
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  updateCncHeader = async (value, type) => {
    let { dataCnc } = this.state
    let dataHeader = Object.assign([], dataCnc.cncTPLData.header.components)
    dataHeader = dataHeader.map((value) => {
      return {
        ...value,
        cncHeaderSectionItemComponent: value.cncHeaderSectionItemComponent ? value.cncHeaderSectionItemComponent.bizparKey : ""
      }
    })
    switch (type) {
      case "update-header":
        value = {
          ...value,
          cncHeaderSectionItemComponent: value.cncHeaderSectionItemComponent ? value.cncHeaderSectionItemComponent.bizparKey ? value.cncHeaderSectionItemComponent.bizparKey : value.cncHeaderSectionItemComponent : ""
        }
        let status = R.findIndex(R.propEq('cncHeaderSectionItemID', value.cncHeaderSectionItemID))(dataHeader)
        if (status >= 0) {
          dataHeader[status] = value
        }
        break
      case "delete-header":
        dataHeader.splice(value, 1)
        break
      default:
        break
    }
    let payload = {
      "cncHeaderSectionID": dataCnc.cncTPLData.header.cncHeaderSectionID,
      "cncTPLID": dataCnc.cncTPLID,
      "components": dataHeader
    }
    let response = await Api.create("CFG").updateCncHeaderSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.setState({ deletePopUpVisible: false })
        this.openSavePopUp()
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  updateCncArea = async (value, type) => {
    let { dataCnc } = this.state
    let dataArea = Object.assign([], dataCnc.cncTPLData.contentSection.areaDevelopmentSection.items)
    dataArea = dataArea.map((value) => {
      return {
        ...value,
        areaDevelopmentSectionItemCategory: value.areaDevelopmentSectionItemCategory ? value.areaDevelopmentSectionItemCategory.bizparKey : "",
        areaDevelopmentSectionItems: value.areaDevelopmentSectionItems.map((data) => {
          return {
            ...data,
            areaDevelopmentSectionSubItemComponent: data.areaDevelopmentSectionSubItemComponent ? data.areaDevelopmentSectionSubItemComponent.bizparKey : ""
          }
        })
      }
    })
    switch (type) {
      case "create-area":
        value = {
          ...value,
          areaDevelopmentSectionItemCategory: value.areaDevelopmentSectionItemCategory ? value.areaDevelopmentSectionItemCategory.bizparKey ? value.areaDevelopmentSectionItemCategory.bizparKey : value.areaDevelopmentSectionItemCategory : ""
        }
        dataArea.push(value)
        break
      case "update-area":
        value = {
          ...value,
          areaDevelopmentSectionItemCategory: value.areaDevelopmentSectionItemCategory ? value.areaDevelopmentSectionItemCategory.bizparKey ? value.areaDevelopmentSectionItemCategory.bizparKey : value.areaDevelopmentSectionItemCategory : "",
          areaDevelopmentSectionItems: value.areaDevelopmentSectionItems.map((data) => {
            return {
              ...data,
              areaDevelopmentSectionSubItemComponent: data.areaDevelopmentSectionSubItemComponent ? data.areaDevelopmentSectionSubItemComponent.bizparKey ? data.areaDevelopmentSectionSubItemComponent.bizparKey : data.areaDevelopmentSectionSubItemComponent : ""
            }
          })
        }
        let status = R.findIndex(R.propEq('areaDevelopmentSectionItemID', value.areaDevelopmentSectionItemID))(dataArea)
        if (status >= 0) {
          dataArea[status] = value
        }
        break
      case "delete-area":
        dataArea.splice(value, 1)
        break
      default:
        break
    }
    let payload = {
      "areaDevelopmentSection": {
        "areaDevelopmentSectionItemRequestItems": dataArea
      },
      "cncMainContentSectionID": dataCnc.cncTPLData.contentSection.cncMainContentSectionID,
      "cncTPLID": dataCnc.cncTPLID
    }
    let response = await Api.create("CFG").updateCncAreaSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.setState({ createArea: false, deletePopUpVisible: false })
        this.openSavePopUp()
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  updateCncMain = async (value, type, index) => {
    let { dataCnc } = this.state
    let status = ""
    let dataAspiration = Object.assign([], dataCnc.cncTPLData.contentSection.feebackSection.aspirationItems)
    let dataChallenge = Object.assign([], dataCnc.cncTPLData.contentSection.feebackSection.challengeItems)
    let dataFeedback = Object.assign([], dataCnc.cncTPLData.contentSection.feebackSection.feedbackItems)
    let dataImprove = Object.assign([], dataCnc.cncTPLData.contentSection.feebackSection.improveTargetItems)
    dataFeedback = dataFeedback.map((value) => {
      return {
        ...value,
        feedbackType: value.feedbackType ? value.feedbackType.bizparKey : ""
      }
    })
    dataImprove = dataImprove.map((value) => {
      return {
        ...value,
        improveTargetItemCategory: value.improveTargetItemCategory ? value.improveTargetItemCategory.bizparKey : "",
        improveTargetItems: value.improveTargetItems.map((data) => {
          return {
            ...data,
            improveTargetComponent: data.improveTargetComponent ? data.improveTargetComponent.bizparKey ? data.improveTargetComponent.bizparKey : data.improveTargetComponent : ""
          }
        })
      }
    })

    switch (type) {
      case "create-aspiration":
        dataAspiration.push(value)
        break
      case "create-challenge":
        dataChallenge.push(value)
        break
      case "create-feedback":
        value = {
          ...value,
          feedbackType: value.feedbackType ? value.feedbackType.bizparKey ? value.feedbackType.bizparKey : value.feedbackType : ""
        }
        dataFeedback.push(value)
        break
      case "create-improve":
        value = {
          ...value,
          improveTargetItemCategory: value.improveTargetItemCategory ? value.improveTargetItemCategory.bizparKey ? value.improveTargetItemCategory.bizparKey : value.improveTargetItemCategory : ""
        }
        dataImprove.push(value)
        break
      case "update-aspiration":
        dataAspiration[index] = value
        break
      case "update-challenge":
        dataChallenge[index] = value
        break
      case "update-feedback":
        value = {
          ...value,
          feedbackType: value.feedbackType ? value.feedbackType.bizparKey ? value.feedbackType.bizparKey : value.feedbackType : ""
        }
        status = R.findIndex(R.propEq('feedbackPerformanceID', value.feedbackPerformanceID))(dataFeedback)
        if (status >= 0) {
          dataFeedback[status] = value
        }
        break
      case "update-improve":
        value = {
          ...value,
          improveTargetItemCategory: value.improveTargetItemCategory ? value.improveTargetItemCategory.bizparKey ? value.improveTargetItemCategory.bizparKey : value.improveTargetItemCategory : "",
          improveTargetItems: value.improveTargetItems.map((data) => {
            return {
              ...data,
              improveTargetComponent: data.improveTargetComponent ? data.improveTargetComponent.bizparKey ? data.improveTargetComponent.bizparKey : data.improveTargetComponent : ""
            }
          })
        }
        status = R.findIndex(R.propEq('improveTargetItemID', value.improveTargetItemID))(dataImprove)
        if (status >= 0) {
          dataImprove[status] = value
        }
        break
      case "delete-aspiration":
        dataAspiration.splice(value, 1)
        break
      case "delete-challenge":
        dataChallenge.splice(value, 1)
        break
      case "delete-feedback":
        dataFeedback.splice(value, 1)
        break
      case "delete-improve":
        dataImprove.splice(value, 1)
        break
      default:
        break
    }
    let payload = {
      "cncMainContentSectionID": dataCnc.cncTPLData.contentSection.cncMainContentSectionID,
      "cncTPLID": dataCnc.cncTPLID,
      "feebackSection": {
        "aspirationItems": dataAspiration,
        "challengeItems": dataChallenge,
        "feedbackItems": dataFeedback,
        "improveTargetItems": dataImprove
      }
    }
    let response = await Api.create("CFG").updateCncFeedbackSection(payload)
    if (response.data) {
      if (response.data.status === "S") {
        this.setState({ createChallenge: false, createAspiration: false, createFeedback: false, createImprove: false, deletePopUpVisible: false })
        this.openSavePopUp()
        this.props.getData()
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editCompHead: false,
      editFeedback: false,
      editAspiration: false,
      editImprove: false,
      editArea: false,
      editSigSection: false,
    });
    switch (type) {
      case "popup-compHead":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createCompHead: !this.state.createCompHead,
          savePopUpVisible
        });
        break;
      case "popup-feedback":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createFeedback: !this.state.createFeedback,
          savePopUpVisible
        });
        break;
      case "popup-challenge":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createChallenge: !this.state.createChallenge,
          savePopUpVisible
        });
        break;
      case "popup-aspiration":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createAspiration: !this.state.createAspiration,
          savePopUpVisible
        });
        break;
      case "popup-improve":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createImprove: !this.state.createImprove,
          savePopUpVisible
        });
        break;
      case "popup-area":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createArea: !this.state.createArea,
          savePopUpVisible
        });
        break;
      case "popup-sigSection":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createSigSection: !this.state.createSigSection,
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

  openDeletePopUp = (index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index,
      cncType: type
    });
  };

  render() {
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  CNC Template
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey"
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <div className="a-s-p-mid a-s-p-pad border-top">
          <div className="padding-10px">
            <div>
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cnc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Template Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cnc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <FormCNC
                    type={"update"}
                    dataCnc={this.state.dataCnc}
                    onClickSave={this.props.onClickSave.bind(this)}
                  />
                </div>
              </div>
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cih"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Component Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cih">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-compHead")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>

                {this.state.createCompHead && (
                  <FormCncCompHeader
                    type={"create"}
                    bizparCncHeaderComp={this.state.bizparCncHeaderComp}
                    onClickSave={this.postCncHeader.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableCncCompHead
                    dataCnc={this.state.dataCnc}
                    bizparCncHeaderComp={this.state.bizparCncHeaderComp}
                    onDeletePopUp={this.openDeletePopUp.bind(this)}
                    editVisible={this.state.editVisible}
                    onClickSave={(value) => this.updateCncHeader(value, "update-header")}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                  />
                </div>
              </div>

              {/* CNC Main Section */}
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cmc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Main Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cmc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="app-open-close margin-bottom-20px padding-5px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-cf"
                    />
                    {/* FeedBack */}
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fas fa-certificate margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">
                            Feedback
                          </span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-cf">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    {/* child */}
                    <div className="app-open-close-content">
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-fi"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                FeedBack Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-fi">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-feedback")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createFeedback && (
                          <FormFeedback
                            type={"create"}
                            bizparCncFeedbackType={this.state.bizparCncFeedbackType}
                            onClickSave={(value) => this.updateCncMain(value, "create-feedback")}
                            onClickClose={() => this.opPopupPage("popup-feedback")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableFeedbackItem
                            dataCnc={this.state.dataCnc}
                            bizparCncFeedbackType={this.state.bizparCncFeedbackType}
                            editVisible={this.state.editVisible}
                            onDeletePopUp={this.openDeletePopUp.bind(this)}
                            onClickSave={(value) => this.updateCncMain(value, "update-feedback")}
                            onClickClose={() => this.opPopupPage("popup-feedback")}
                          />
                        </div>
                      </div>

                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-ci"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                Challenge Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-ci">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-challenge")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createChallenge && (
                          <FormChallenge
                            type={"create"}
                            onClickSave={(value) => this.updateCncMain(value, "create-challenge")}
                            onClickClose={() => this.opPopupPage("popup-challenge")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableChallengeItem
                            dataCnc={this.state.dataCnc}
                            onDeletePopUp={this.openDeletePopUp.bind(this)}
                            editVisible={this.state.editVisible}
                            onClickSave={this.updateCncMain.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-challenge")}
                          />
                        </div>
                      </div>
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-api"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                Aspiration Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-api">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-aspiration")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createAspiration && (
                          <FormAspiration
                            type={"create"}
                            onClickSave={(value) => this.updateCncMain(value, "create-aspiration")}
                            onClickClose={() => this.opPopupPage("popup-aspiration")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableAspirationItem
                            dataCnc={this.state.dataCnc}
                            editVisible={this.state.editVisible}
                            onDeletePopUp={this.openDeletePopUp.bind(this)}
                            onClickSave={this.updateCncMain.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-aspiration")}
                          />
                        </div>
                      </div>
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-imt"
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
                            <label htmlFor="navmenu-imt">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-improve")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createImprove && (
                          <FormImprove
                            type={"create"}
                            bizparCncImproveCat={this.state.bizparCncImproveCat}
                            onClickSave={(value) => this.updateCncMain(value, "create-improve")}
                            onClickClose={() => this.opPopupPage("popup-improve")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableImproveItem
                            dataCnc={this.state.dataCnc}
                            bizparCncImproveCat={this.state.bizparCncImproveCat}
                            bizparCncImproveCatItem={this.state.bizparCncImproveCatItem}
                            editVisible={this.state.editVisible}
                            onDeletePopUp={this.openDeletePopUp.bind(this)}
                            onClickSave={(value) => this.updateCncMain(value, "update-improve")}
                            onClickClose={() => this.opPopupPage("popup-improve")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-are"
                    />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fas fa-certificate margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">
                            Area Development
                          </span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-are">
                          <div className="app-open-close-icon"></div>
                        </label>
                        <button
                          className="btn btn-small-circle btn-sekunder margin-left-5px"
                          onClick={() => this.opPopupPage("popup-area")}
                        >
                          <i className="fa fa-lw fa-plus" />
                        </button>
                      </div>
                    </div>
                    {this.state.createArea && (
                      <FormArea
                        type={"create"}
                        bizparCncAreaDevCat={this.state.bizparCncAreaDevCat}
                        onClickSave={(value) => this.updateCncArea(value, "create-area")}
                        onClickClose={() => this.opPopupPage("popup-area")}
                        onClick={this.props.onDeletePopUp}
                      />
                    )}
                    <div className="app-open-close-content">
                      <TableCncArea
                        dataCnc={this.state.dataCnc}
                        bizparCncAreaDevCat={this.state.bizparCncAreaDevCat}
                        bizparCncAreaDevCatItem={this.state.bizparCncAreaDevCatItem}
                        editVisible={this.state.editVisible}
                        onDeletePopUp={this.openDeletePopUp.bind(this)}
                        onClickSave={(value) => this.updateCncArea(value, "update-area")}
                        onClickClose={() => this.opPopupPage("popup-area")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-csc"
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
                    <label htmlFor="navmenu-csc">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-sigSection")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>
                {this.state.createSigSection && (
                  <FormCNCSigSection
                    type={"create"}
                    bizparCncSignageType={this.state.bizparCncSignageType}
                    onClickSave={this.postCncSignage.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableCncSegSection
                    dataCnc={this.state.dataCnc}
                    bizparCncSignageType={this.state.bizparCncSignageType}
                    bizparCncSignageItem={this.state.bizparCncSignageItem}
                    onDeletePopUp={this.openDeletePopUp.bind(this)}
                    editVisible={this.state.editVisible}
                    onClickSave={(value) => this.updateCncSignage(value, "update-signage")}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                  />
                </div>
              </div>
            </div>
            <div className="display-flex-normals margin-bottom-15px"></div>
          </div>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.setState({ savePopUpVisible: false })}
          />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.setState({ deletePopUpVisible: false })}
            onClickDelete={() => {
              this.state.cncType === "delete-signage" ? this.updateCncSignage(this.state.selectedIndex, "delete-signage") :
                this.state.cncType === "delete-header" ? this.updateCncHeader(this.state.selectedIndex, "delete-header") :
                  this.state.cncType === "delete-area" ? this.updateCncArea(this.state.selectedIndex, "delete-area") :
                    this.state.cncType === "delete-challenge" ? this.updateCncMain(this.state.selectedIndex, "delete-challenge") :
                      this.state.cncType === "delete-aspiration" ? this.updateCncMain(this.state.selectedIndex, "delete-aspiration") :
                        this.state.cncType === "delete-feedback" ? this.updateCncMain(this.state.selectedIndex, "delete-feedback") :
                          this.state.cncType === "delete-improve" ? this.updateCncMain(this.state.selectedIndex, "delete-improve") :
                            this.setState({ deletePopUpVisible: false })
            }}
          />
        )}
        <ReactTooltip />
      </div>
    );
  }
}

export default FormEditCNC;
