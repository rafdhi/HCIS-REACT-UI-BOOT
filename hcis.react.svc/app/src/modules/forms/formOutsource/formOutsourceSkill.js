import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
// import FormLanguageSkill from './formLanguageSkill'
import PopUp from "../../../components/pages/PopUpAlert";
import FormOutsourceSkill from "./formOutsourceSkillDetail";
import * as R from 'ramda'

var ct = require("../../custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormLanguageSkill extends Component {
  constructor(props) {
    super(props);
    let { data } = this.props;

    this.state = {
      data,
      dataTableSkill: [],
      createVisible: false,
      viewVisible: false,
      updateVisible: false,
      createPopUpVisible: false,
      bizparLanguSkill: [],
      bizparCompetencySkill: []
    };
  }

  async handleSave(type, value) {
    let { data } = this.state
    let payload = Object.assign([], data.osSkillSet)
    switch (type) {
      case 'create':
        payload.push(value)
        break;
      case 'update':
        let index = R.findIndex(R.propEq('ssID', value.ssID))(payload)
        if (index >= 0) {
          payload[index] = value
        }
        break;
      case 'delete':
        payload.splice(this.state.selectedIndex, 1)
        break;
      default: break;
    }
    data = { ...data, osSkillSet: payload }
    this.props.onClickSave('workExp', data)
  }

  componentDidMount() {
    // this.getBizpar()
    let { osSkillSet } = this.state.data
    if (!R.isEmpty(osSkillSet)) {
      let dataTableSkill = osSkillSet.map((value, index) => {
        const { ssID, ssName, } = value
        return [
          index += 1, ssID, ssName, 'JAVA',
        ]
      })
      this.setState({ dataTableSkill, rawData: osSkillSet })
    }
  }

  openCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  openView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openUpdate(selectedIndex) {
    let createPopUpVisible = this.state.createVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      updateVisible: !this.state.updateVisible,
      selectedIndex,
      createPopUpVisible
    });
  }

  openDelete(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  handleSubmit(value, type = "") {
    if (type !== "delete") this.setState({ createPopUpVisible: true });
    else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
  }

  columnsSkill = [
    "No",
    "Skill ID",
    "Skill Name",
    "Description",
    {
      name: "Action",
      options: {
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index}
            style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
            {columnMeta.name}
          </th>
        ),
        customBodyRender: (val, tableMeta) => {
          return this.props.type !== "view" ? (
            <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.openUpdate(tableMeta.rowIndex)}
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
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.openDelete(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-trash-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    fontSize: 20
                  }}
                />
              </button>
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openView(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-ellipsis-v"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
            </div>
          ) : (
              <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openView(tableMeta.rowIndex)}
                >
                  <i
                    className="fa fa-ellipsis-v"
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

  dataSkill = [
    ["1", "Skill-001", "Coding full Stack", "JAVA"]
  ];

  render() {
    return (
      <div className="vertical-tab-content active" id="content-nav-8">
        <form action="#">
          <div className="padding-10px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              ) : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title="Skill Set"
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableSkill}
                columns={this.columnsSkill}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.createVisible && (
            <FormOutsourceSkill
              type={"create"}
              onClickClose={this.openCreate.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              bizparCompetencySkill={this.state.bizparCompetencySkill}
              bizparLanguSkill={this.state.bizparLanguSkill}
            />
          )}

          {this.state.viewVisible && (
            <FormOutsourceSkill
              type={"view"}
              dataSkill={this.state.rawData[this.state.selectedIndex]}
              onClickClose={this.openView.bind(this)}
              bizparCompetencySkill={this.state.bizparCompetencySkill}
              bizparLanguSkill={this.state.bizparLanguSkill}
            />
          )}

          {this.state.updateVisible && (
            <FormOutsourceSkill
              type={"update"}
              dataSkill={this.state.rawData[this.state.selectedIndex]}
              onClickClose={this.openUpdate.bind(this)}
              onClickSave={this.handleSave.bind(this)}
              bizparCompetencySkill={this.state.bizparCompetencySkill}
              bizparLanguSkill={this.state.bizparLanguSkill}
            />
          )}

          {this.state.createPopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={() => {
                this.setState({
                  createVisible: false,
                  updateVisible: false,
                  createPopUpVisible: false
                });
              }}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={"delete"}
              class={"app-popup app-popup-show"}
              onClick={this.openDelete.bind(this)}
              onClickDelete={() => this.handleSave('delete')}
            />
          )}
        </form>
      </div>
    );
  }
}

export default FormLanguageSkill;
