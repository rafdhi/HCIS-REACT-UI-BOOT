import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormSkill from "../../forms/create/talent/createSkills";
import PopUp from "../../../../pages/PopUpAlert";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableTalentSkill extends Component {
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
    let { rawData } = this.props
    let dataTable = !rawData ? [] : rawData.map((value, index) => {
      return [
        index += 1,
        value
      ]
    })
    this.setState({ rawData, dataTable })
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
    this.props.onClickSave(
      this.props.dataTableDetail[this.state.selectedIndex],
      "delete-detail"
    );
  }

  close() {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }

  columns = [
    "No",
    // "Skill ID",
    "Description",
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
                onClick={() => this.props.onClickDelete(tableMeta.rowIndex, 'skills')}
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

  dataTable = [["1", "ID-921", "Skills 1"]];

  render() {
    return (
      <div>
        <div>
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Skills"
              subtitle={"lorem ipsum dolor"}
              data={this.state.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
        <div>
          {this.state.editVisible && (
            <FormSkill
              type="update"
              rawData={this.state.rawData[this.state.selectedIndex]}
              selectedIndex={this.state.selectedIndex}
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
export default TableTalentSkill;
