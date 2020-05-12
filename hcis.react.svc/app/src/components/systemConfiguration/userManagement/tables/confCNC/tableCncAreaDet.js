import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormAreaDet from "../../forms/create/cnc/formAreaDet";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableCncAreaDet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: props.editVisible,
      data: props.data,
      dataTableDetail: props.dataTableDetail ? props.dataTableDetail : []
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataTableDetail !== prevProps.dataTableDetail) return this.setState({ dataTableDetail: this.props.dataTableDetail, data: this.props.data, editVisible: this.props.editVisible })
  }

  openEdit = (selectedIndex )=> this.setState({ editVisible: !this.state.editVisible, selectedIndex })

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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex)}
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
    let { data, dataTableDetail, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Area Development Item"}
            data={dataTableDetail}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormAreaDet
            type={"edit"}
            bizparCncAreaDevCat={this.props.bizparCncAreaDevCat}
            bizparCncAreaDevCatItem={this.props.bizparCncAreaDevCatItem}
            data={data.areaDevelopmentSectionItems[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableCncAreaDet;
