import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormEditTalentDet from "../../forms/create/talent/createTalentDetail";
import PopUp from "../../../../pages/PopUpAlert";
import * as R from 'ramda'

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableTalentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false
    };
  }

  componentDidMount() {
    this.getTable()
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.getTable()
    }
  }

  getTable() {
    let { payload } = this.props.rawData
    let dataTable = !payload ? [] : payload.map((value, index) => {
      const { positionName, directoratName, ouIDDirectorat, criterias, skills } = value
      let indexed = R.findIndex(R.propEq('ouid', ouIDDirectorat))(this.props.rawDataPosition)
      let dirName = indexed >= 0 ? this.props.rawDataPosition[indexed].ouposition.bizparValue : ''
      let crit = !criterias ? '' : criterias.map((value) => {
        return [value, ', ']
      })
      let skill = !skills ? '' : skills.map((value) => {
        return [value, ', ']
      })
      return [
        index += 1,
        positionName,
        dirName,
        crit,
        skill
      ]
    })
    this.setState({ dataTable, rawData: payload })
  }

  openEdit(index) {
    this.setState({
      selectedIndex: index,
      editVisible: !this.state.editVisible
    });
  }

  openDeletePopUp = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  handleDelete() {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible
    });
  }

  close() {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }

  columns = [
    "No",
    "Position Name",
    "Directorat Name",
    "Criteria",
    "Skill",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15 }}
                type="button"
                onClick={() => this.openEdit(tableMeta.rowIndex)}
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
                className="btnAct"
                type="button"
                onClick={() => this.props.onClickDelete(tableMeta.rowIndex)}
              >
                <i
                  className="fa fa-lw fa-trash-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
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

  render() {
    return (
      <div>
        <div>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Talent Template Detail"
              subtitle={"lorem ipsum dolor"}
              data={this.state.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
        <div>
          {this.state.editVisible && (
            <FormEditTalentDet
              type="update"
              rawDataPosition={this.props.rawDataPosition}
              rawData={this.props.rawData.payload[this.state.selectedIndex]}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={this.close.bind(this)}
            />
          )}
        </div>
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={this.handleDelete.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableTalentDetail;
