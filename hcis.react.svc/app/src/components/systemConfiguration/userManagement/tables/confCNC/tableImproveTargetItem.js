import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormImprove from "../../forms/create/cnc/formImprove"

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TableImprove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: props.editVisible,
      dataTableDetails: [],
      data: props.dataCnc
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
    let dataTableDetails = dataCnc.cncTPLData.contentSection.feebackSection.improveTargetItems.map((value) => {
      return [value.improveTargetItemID, value.improveTargetItemCategory ? value.improveTargetItemCategory.bizparValue : "-"]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
    "Component ID",
    "Component Type",
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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-improve")}
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
    let { data, dataTableDetails, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Improve Target Item"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormImprove
            type={"edit"}
            bizparCncImproveCat={this.props.bizparCncImproveCat}
            bizparCncImproveCatItem={this.props.bizparCncImproveCatItem}
            data={data.cncTPLData.contentSection.feebackSection.improveTargetItems[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableImprove;
