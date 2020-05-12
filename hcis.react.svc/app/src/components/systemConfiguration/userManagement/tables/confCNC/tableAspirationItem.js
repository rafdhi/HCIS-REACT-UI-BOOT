import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormAspiration from "../../forms/create/cnc/formAspiration";
import M from "moment"

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableAspiration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: props.editVisible,
      data: props.dataCnc,
      dataTableDetails: []
    };
  }

  componentDidMount = () => this.getDataTable(this.state.data)

  componentDidUpdate(prevProps) {
    if (this.props.dataCnc !== prevProps.dataCnc) {
      this.setState({ data: this.props.dataCnc, editVisible: this.props.editVisible })
      this.getDataTable(this.props.dataCnc)
    }
  } 

  getDataTable(dataCnc) {
    let dataTableDetails = dataCnc.cncTPLData.contentSection.feebackSection.aspirationItems.map((value) => {
      return [value]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
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
                onClick={() => this.openEdit(tableMeta.rowIndex)}>
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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-aspiration")}>
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
    let { dataTableDetails, data, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Aspiration Item"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormAspiration
            type={"edit"}
            data={data.cncTPLData.contentSection.feebackSection.aspirationItems[selectedIndex]}
            onClickSave={(value) => this.props.onClickSave(value, "update-aspiration", selectedIndex )}
            onClickClose={this.openEdit.bind(this)}
            onClick={this.props.onDeletePopUp}
          />
        )}
      </div>
    );
  }
}
export default TableAspiration;
