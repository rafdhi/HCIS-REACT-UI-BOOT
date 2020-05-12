import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import PopUp from "../../../../../pages/PopUpAlert";
import M from "moment";
import * as R from "ramda";

import TableTalentDetail from "../../../tables/confTalent/tableTalentDetail";
import FormTalentDetail from "../../create/talent/createTalentDetail";

class EditTalent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTalentDet: false,
      savePopUpVisible: false,
      data: props.rawData
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.setState({
        data: this.props.rawData
      })
    }
  }

  openDeletePopUp(index) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    })
  }

  handleSave(type, value) {
    let { data } = this.state
    let { payload } = this.state.data
    switch (type) {
      case 'create':
        payload.push(value)
        break;
      case 'update':
        let index = R.findIndex(R.propEq('positionID', value.positionID))(payload)
        if (index >= 0) payload[index] = value
        break;
      case 'delete':
        payload.splice(this.state.selectedIndex, 1)
        break;
    }
    data = { ...data, payload: payload }
    this.props.onClickSave('update', data)
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editTalentDet: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-talentDet":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createTalentDet: !this.state.createTalentDet,
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

  dataTableTalentDet = [
    ["1", "Human Resource", "HR Departement", "baik", "cepat"]
  ];
  render() {
    let { data } = this.state
    let { type } = this.props
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-star"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  Talent Template
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
        <div className="a-s-p-mid a-s-p-pad border-bottom">
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              this.props.onClickSave(type, data);
            }}
          >
            <div>
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-tth"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-star margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Talent Template Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-tth">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div>
                    <div className="margin-15px">
                      <div>
                        <div className="margin-30px">
                          <div
                            className="image image-100px image-circle background-white border-all"
                            style={{ margin: "auto" }}
                          >
                            <i className="icn fa fa-2x fa-image"></i>
                          </div>
                        </div>

                        <div className="txt-site txt-13 txt-bold txt-main content-center">
                          <input
                            type="file"
                            id="pick-image"
                            style={{ display: "none" }}
                          />
                          <label htmlFor="pick-image">
                            <div className="btn btn-div btn-grey-dark">
                              <i className="fa fa-1x fa-upload margin-right-10px"></i>
                              Pick Image
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="margin-15px">
                      <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                          <h4>Template ID: {data.talentTPLID}</h4>
                        </div>
                        <div className="margin-5px">
                          <p className="txt-site txt-11 txt-primary">
                            The Talent template menu is to be used to create
                            detail Talent template.
                          </p>
                        </div>
                      </div>
                      <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                          <h4>
                            Template Name
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                        <div className="margin-5px">
                          <div className="card-date-picker">
                            <div className="double">
                              <input
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                required
                                value={data.talentTPLName}
                                onChange={e => this.setState({ data: { ...data, talentTPLName: e.target.value } })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Description</h4>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          className="txt txt-sekunder-color"
                          rows={4}
                          placeholder={""}
                          value={data.talentTPLNotes}
                          onChange={e => this.setState({ data: { ...data, talentTPLNotes: e.target.value } })}
                        />
                      </div>
                      <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                          <h4>Activation</h4>
                        </div>
                        <div className="margin-15px">
                          <label className="radio">
                            <input type="checkbox" name="all-day" checked />
                            <span className="checkmark" />
                            <span className="txt-site txt-11 txt-bold txt-main">
                              Activate Now
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-ttd"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-star margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Talent Template Detail
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-ttd">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      type="button"
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-talentDet")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>
                {this.state.createTalentDet && (
                  <FormTalentDetail
                    type="create"
                    rawDataPosition={this.props.rawDataPosition}
                    onClickSave={this.handleSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-talentDet")}
                  />
                )}
                <div className="app-open-close-content">
                  <TableTalentDetail
                    rawData={this.state.data}
                    rawDataPosition={this.props.rawDataPosition}
                    onClickSave={this.handleSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-talentDet")}
                    onClickDelete={this.openDeletePopUp.bind(this)}
                    dataTable={this.dataTableTalentDet}
                  />
                </div>
              </div>
            </div>
            <div className="display-flex-normals margin-bottom-15px">
              <div className="border-top padding-top-20px">
                <div className="grid grid-2x">
                  <div className="col-1 content-left"></div>
                  <div className="col-2 content-right">
                    <button
                      type="button"
                      className="btn btn-blue"
                      onClick={() => {
                        this.props.onClickSave(type, data);
                      }}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
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
            onClick={() => this.openDeletePopUp()}
            onClickDelete={() => this.handleSave('delete')}
          />
        )}
        <ReactTooltip />
      </div>
    );
  }
}

export default EditTalent;
