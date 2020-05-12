import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCncCompHead from "../../forms/create/cnc/formCncCompHead";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableCncCompHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: props.editVisible,
      dataTableDetails: [],
      dataCnc: props.dataCnc
    };
  }

  componentDidMount = () => this.getData(this.state.dataCnc)
  
  componentDidUpdate(prevProps) {
    if (this.props.dataCnc !== prevProps.dataCnc) {
      this.setState({ dataCnc: this.props.dataCnc, editVisible: this.props.editVisible })
      this.getData(this.props.dataCnc)
    } 
  }

  getData = (dataCnc) => {
    let dataTableDetails = dataCnc.cncTPLData.header.components.map((value) => {
      const { cncHeaderSectionItemID, cncHeaderSectionItemComponent } = value
      return [ cncHeaderSectionItemID, cncHeaderSectionItemComponent ? cncHeaderSectionItemComponent.bizparValue : "-" ]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
    "Component ID",
    "Component Name",
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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-header")}>
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
    let { dataCnc, dataTableDetails, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"CNC Component Header"}
            subtitle={"CNC Component Header"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormCncCompHead
            type={"edit"}
            bizparCncHeaderComp={this.props.bizparCncHeaderComp}
            data={dataCnc.cncTPLData.header.components[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableCncCompHeader;
