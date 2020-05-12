import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormChallenge from "../../forms/create/cnc/formChallenge"

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TableChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: props.editVisible,
      dataTableDetails: [],
      data: props.dataCnc,
      selectedIndex: null
    }
  }

  componentDidMount = () => this.getDataTable(this.state.data)

  componentDidUpdate(prevProps) {
    if (this.props.dataCnc !== prevProps.dataCnc) {
      this.setState({ data: this.props.dataCnc, editVisible: this.props.editVisible })
      this.getDataTable(this.props.dataCnc)
    } 
  }

  getDataTable(dataCnc) {
    let dataTableDetails = dataCnc.cncTPLData.contentSection.feebackSection.challengeItems.map((value) => {
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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-challenge")}
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
    let { data, selectedIndex, dataTableDetails } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Challenge Item"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormChallenge
            type={"edit"}
            data={data.cncTPLData.contentSection.feebackSection.challengeItems[selectedIndex]}
            onClickSave={(value) => this.props.onClickSave(value, "update-challenge", selectedIndex)}
            onClickClose={this.openEdit.bind(this)}
            onClick={this.props.onDeletePopUp}
          />
        )}
      </div>
    );
  }
}
export default TableChallenge;
