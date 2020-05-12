import React, { Component } from "react";
import PopUp from "../../../pages/PopUpAlert";
import ResizeSlider from "../../../../modules/resize/Slider";
import M from "moment";
// import * as R from "ramda";
import { connect } from "react-redux";

import TableTalent from "../tables/tableTalent";
import FormTalent from "./create/talent/createTalent";
import FormEditTalent from "./edit/talent/formEditTalent";
import Api from "../../../../Services/Api";

const clSlidePage = "a-s-p-main";

class ConfTalent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      classAppSlidePage: "app-side-page",
      classAppSlidePageMain: clSlidePage,
      savePopUpVisible: false,
      createTalent: false,
      deletePopUpVisible: false,
      editTalent: false,
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      rawData: []
    };
  }

  componentDidMount() {
    this.getDataTalent()
    this.getDataPosition()
  }

  async getDataPosition() {
    let response = await Api.create('ES').getTplJson(this.state.auth.user.companyID)
    if (response && response.data && response.data.status === "S") {
      this.setState({
        rawDataPosition: response.data.data
      })
    }
  }

  async getDataTalent() {
    let payload = {
      "limit": 100,
      "offset": 0,
      "params": {}
    }
    let res = await Api.create('CFG').getAllCorporateTalent(payload)
    if (res.data.status === 'S') {
      let rawData = res.data.data
      let dataTable = !rawData ? [] : rawData.map((value, index) => {
        const { talentTPLID, talentTPLName, talentTPLStatus } = value
        let status = talentTPLStatus === 'ACTIVE' ? 'YES' : 'NO'
        return [
          index += 1,
          talentTPLID,
          talentTPLName,
          status
        ]
      })
      this.setState({ rawData, dataTable })
    }
    else { this.setState({ dataTable: [] }) }
  }

  dataTableTalent = [
    ["1", "ID-9291", "Talent TEMPLATE 2018", "YES"],
    ["2", "ID-9292", "Talent TEMPLATE 2018", "YES"]
  ];

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    });
  };

  clResizePane = () => {
    this.setState({
      editTalent: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    });
  };

  opSidePage = (menu, index) => e => {
    this.setState({
      classAppSlidePage: "app-side-page op-app-side",
      editTalent: false
    });

    this.opResizePane();

    switch (menu) {
      case "slide-talent":
        this.setState({
          editTalent: true,
          selectedIndex: index
        });
        break;
      default:
        break;
    }
  };

  clSidePage = () => {
    this.setState({ classAppSlidePage: "app-side-page" });
  };

  // openCreateForm = (type = "create") => {
  //   this.clResizePane();
  //   this.setState({ createVisible: !this.state.createVisible, type });
  // };

  opPopupPage = menu => e => {
    e.preventDefault();

    this.setState({
      createTalent: false
    });

    this.clResizePane();
    switch (menu) {
      case "create-talent":
        this.setState({
          createTalent: true,
          editTalent: false,
          sub: "talent",
          classAppSlidePage: "app-side-page"
        });
        break;
      default:
        break;
    }
  };

  clPopupPage = () => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createTalent: false,
      editTalent: false,
      savePopUpVisible
    });
  };

  openSavePopUp = () => {
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      createTalent: false,
      editTalent: false,
      classAppSlidePage: "app-side-page"
    });
  };

  openDeletePopUp = (index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
    if (type !== "delete-detail") return this.clResizePane();
  };

  async handleSubmit(type, value) {
    let payload, res = ''
    switch (type) {
      case 'create':
        payload = value
        res = await Api.create('CFG').postCorporateTalent(payload)
        break;
      case 'update':
        let detailPayload = !value.payload ? [] : value.payload.map((values) => {
          const { ouID, ouIDDirectorat, criterias, skills } = values
          return {
            ouID: ouID,
            ouIDDirectorat: ouIDDirectorat,
            criterias: criterias,
            skills: skills
          }
        })
        payload = {
          "esID": value.company.esID,
          "payload": detailPayload,
          "talentTPLCreational": {
            "createdBy": value.talentTPLCreational.createdBy,
            "createdDate": value.talentTPLCreational.createdDate,
            "modifiedBy": this.props.auth.user.employeeID,
            "modifiedDate": M().format('DD-MM-YYYY HH:mm:ss')
          },
          "talentTPLID": value.talentTPLID,
          "talentTPLName": value.talentTPLName,
          "talentTPLNotes": value.talentTPLNotes,
          "talentTPLPhotoURL": value.talentTPLPhotoURL,
          "talentTPLStatus": value.talentTPLStatus
        }
        res = await Api.create('CFG').putCorporateTalent(payload)
        break;
      case 'delete':
        payload = {
          "referenceID": this.state.rawData[this.state.selectedIndex].talentTPLID,
          "requestBy": this.props.auth.user.employeeID,
          "requestDate": M().format('DD-MM-YYYY HH:mm:ss')
        }
        res = Api.create('CFG').deleteCorporateTalent(payload)
      default: break;
    }
    if (type === 'delete') {
      this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
      this.openSavePopUp()
      this.getDataTalent()
    } else if (res.data && res.data.status === 'S') {
      this.openSavePopUp();
      this.getDataTalent()
    }
    else return alert(res.data.message)
  }

  async handleUpdate() {
    this.openSavePopUp();
  }

  async handleDelete(index) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index });
  }

  render() {
    return (
      <div>
        <ResizeSlider
          allowResize={this.state.allowResize}
          defaultSize={this.state.defaultSize}
          minSize={this.state.minSize}
          maxSize={this.state.maxSize}
          main={
            <div>
              <div className="a-s-p-place a-s-p-content active">
                <div className="a-s-p-top">
                  <div className="grid grid-2x">
                    <div className="col-1">
                      <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                        <div>
                          <i className="color-blue fas fa-star margin-right-10px"></i>
                        </div>
                        <div>
                          <div className="txt-site txt-12 txt-bold txt-main">
                            Talent
                          </div>
                          <div className="txt-site txt-10 txt-thin txt-primary">
                            Talent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a-s-p-mid border-top">
                  <div className="padding-10px">
                    <div className="app-open-close margin-bottom-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-tl"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-tl">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                            onClick={this.opPopupPage("create-talent")}
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                        {this.state.createTalent && (
                          <FormTalent
                            type="create"
                            auth={this.props.auth}
                            onClickSave={this.handleSubmit.bind(this)}
                            onClickClose={this.clPopupPage.bind(this)}
                          />
                        )}
                      </div>
                      <div className="app-open-close-content">
                        <TableTalent
                          dataTable={this.state.dataTable}
                          openSlide={this.opSidePage.bind(this)}
                          onDeletePopup={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          side={
            <div className="a-s-p-side">
              {/* edit */}
              {this.state.editTalent ? (
                <FormEditTalent
                  type={'update'}
                  rawDataPosition={this.state.rawDataPosition}
                  rawData={this.state.rawData[this.state.selectedIndex]}
                  closeSlide={this.clResizePane}
                  onDeletePopUp={this.openDeletePopUp.bind(this)}
                  onClickSave={this.handleSubmit.bind(this)}
                />
              ) : null}
            </div>
          }
        ></ResizeSlider>

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={
              // this.state.editTalent
              // ? () =>
              () => this.handleSubmit('delete')
              //  this.handleDelete.bind(this)
            }
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, null)(ConfTalent);
