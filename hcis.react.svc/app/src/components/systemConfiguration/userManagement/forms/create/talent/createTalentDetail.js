import React, { Component } from "react";
import M from "moment";
import * as R from 'ramda'
import PopUp from "../../../../../pages/PopUpAlert";

import FormSkill from "../talent/createSkills";
import FormCriteria from "../talent/createCriteria";

import TableTalentSkill from "../../../tables/confTalent/tableTalentSkill";
import TableTalentCriteria from "../../../tables/confTalent/tableTalentCriteria";

import PositionSearchForm from "../../../../../../modules/forms/formInbox/positionSearchForm";

const dataCreate = {
  "criterias": [],
  "ouID": "",
  "ouIDDirectorat": "",
  "skills": [],
  "positionName": '',
  "directoratName": ''
}

class FormTalentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTalentSkill: false,
      createTalentCriteria: false,
      searchPositionVisible: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : dataCreate,
    };
  }

  componentDidMount() {
    let index = R.findIndex(R.propEq('ouid', this.state.data.ouIDDirectorat))(this.props.rawDataPosition)
    if (index >= 0) {
      this.setState({
        data: { ...this.state.data, directoratName: this.props.rawDataPosition[index].ouposition.bizparValue }
      })
    }

  }

  openDeletePopUp(selectedIndex, attribute) {
    this.setState({
      selectedIndex,
      attribute,
      deletePopUpVisible: !this.state.deletePopUpVisible
    })
  }

  handleSave(type, attribute, value, index) {
    let { criterias, skills } = this.state.data
    switch (attribute) {
      case 'criterias':
        switch (type) {
          case 'create':
            criterias.push(value)
            break;
          case 'update':
            criterias[index] = value
            break;
          case 'delete':
            criterias.splice(index, 1)
            break;
          default: break;
        }
        break;
      case 'skills':
        switch (type) {
          case 'create':
            skills.push(value)
            break;
          case 'update':
            skills[index] = value
            break;
          case 'delete':
            skills.splice(index, 1)
            break;
          default: break;
        }
        break;
      default: break;
    }
    let payload = {
      ...this.state.data,
      criterias: criterias,
      skills: skills
    }
    this.props.onClickSave('update', payload)
  }

  openSearchPosition = () =>
    this.setState({ searchPositionVisible: !this.state.searchPositionVisible });

  handlePosition(value) {
    let { rawDataPosition } = this.props
    let index = R.findIndex(R.propEq('ouid', value.ouparentID))(rawDataPosition)
    this.setState({
      data: {
        ...this.state.data,
        ouID: value.ouid,
        positionName: value.ouposition.bizparValue,
        ouIDDirectorat: value.ouparentID,
        directoratName: index >= 0 ? rawDataPosition[index].ouposition.bizparValue : ''
      },
      searchPositionVisible: false
    })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editTalentSkill: false,
      editTalentCriteria: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-talentSkill":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createTalentSkill: !this.state.createTalentSkill,
          savePopUpVisible
        });
        break;
      case "popup-talentCriteria":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createTalentCriteria: !this.state.createTalentCriteria,
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
    let { data } = this.state
    return (
      <div className="padding-10px">
        {/* criterias */}
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-crs"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">Criterias</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-crs">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-talentCriteria")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createTalentCriteria && (
            <FormCriteria
              type={"create"}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-talentCriteria")}
            />
          )}
          <div className="app-open-close-content">
            <TableTalentCriteria
              rawData={this.state.data.criterias}
              onClickDelete={this.openDeletePopUp.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-criteria")}
            />
          </div>
        </div>
        {/* Skill */}
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-skl"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">Skills</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-skl">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-talentSkill")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createTalentSkill && (
            <FormSkill
              type={"create"}
              onClickSave={this.handleSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-talentSkill")}
            />
          )}
          <div className="app-open-close-content">
            <TableTalentSkill
              rawData={this.state.data.skills}
              onClickSave={this.handleSave.bind(this)}
              onClickDelete={this.openDeletePopUp.bind(this)}
              onClickClose={() => this.opPopupPage("popup-talentSkill")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Talent Template Detail -{" "}
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
                  id="navmenu-thd"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Talent Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-thd">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="column-1">
                      <div className="card-date-picker margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Position ID
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <div className="double">
                          <input
                            style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                            className="input"
                            name="search"
                            disabled
                            placeholder="Position ID"
                            value={data.ouID}
                          ></input>
                          <button
                            className="btn btn-grey border-left btn-no-radius"
                            type="button"
                            onClick={this.openSearchPosition.bind(this)}
                          >
                            <i className="fa fa-lg fa-search"></i>
                          </button>
                        </div>
                      </div>
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Position Name</h4>
                          </div>
                        </div>
                        <input
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          readOnly
                          value={data.positionName}
                          style={{ backgroundColor: "#E6E6E6" }}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Directorat ID</h4>
                          </div>
                        </div>
                        <input
                          readOnly
                          value={data.ouIDDirectorat}
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
                            <h4>Directorat Position Name</h4>
                          </div>
                        </div>
                        <input
                          type="text"
                          style={{ backgroundColor: "#E6E6E6" }}
                          readOnly
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          value={data.directoratName}
                        />
                      </div>
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
                      onClick={() => this.props.onClickSave(type, data)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {type === "update" ? this.renderFormEdit() : null}
          </form>
        </div>
        {this.state.searchPositionVisible && (
          <PositionSearchForm
            onChoose={this.handlePosition.bind(this)}
            onClickClose={this.openSearchPosition.bind(this)}
          />
        )}
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-talentDet")}
          />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.openDeletePopUp(null)}
            onClickDelete={() => this.handleSave('delete', this.state.attribute, '', this.state.selectedIndex)}
          />
        )}
      </div>
    );
  }
}

export default FormTalentDetail;
