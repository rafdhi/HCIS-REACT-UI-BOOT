import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import * as R from "ramda";
// import FormIPPComSection from "../../forms/create/performance/formIppComSection";

var ct = require("../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class QualificationTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      data: props.dataQualification,
      dataTableQualification:[]
    };
    alert(JSON.stringify(this.state.data))
    alert(JSON.stringify(this.props.qualificationType))
  }

  componentDidMount() {
    // this.getDataTable()
  }

  translateQualification(data) {
    if (typeof data === "string") return data

    let returnData = ""
    data.map((item, index) => {
      returnData = ++index === data.length ? returnData + item : returnData + item + ", "
    })

    return returnData
  }

  getDataTable() {
      let {data,dataTableQualification } = this.state
       if (data !== undefined) {
        dataTableQualification = this.props.qualificationType.map((datax, index) => {
        let indexQ = R.findIndex(R.propEq('qualificationType', datax.bizparKey))(data)
        return [
          ++index,
          datax.bizparValue,
          this.translateQualification(data[indexQ]),
          data[indexQ].requestQualificationNotes,
          data[indexQ].isMandatory
        ]
      })
    }
    alert(data.recruitmentRequestQualificationDTOs)
    //   console.log(this.state.data)
    
    // let qualificationItem  = this.state.data
    // let dataTableDetails = !qualificationItem ? [] : qualificationItem.map((value, index) => {
    //   const { recruitmentReqQualificationID, requestQualificationNotes,qualificationType } = value
    //   return [
    //     index += 1,
    //     computeID,
    //     computeType ? computeType.bizparValue : 'Component Name'
    //   ]
    // })
    // this.setState({ dataTableDetails, rawData: computeItems })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "ID-9292", "PERFORMANCE APPRAISAL MID YEAR"],
    ["2", "ID-9292", "PERFORMANCE APPRAISAL FULL YEAR"]
  ];

  columns = [
    "No",
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
            </div>
          );
        }
      }
    }
  ];

  render() {
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            data={this.state.dataTableQualification}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {/* {this.state.editVisible && (
          <FormIPPComSection
            type={"update"}
            bizparActivityPlanSection={this.props.bizparActivityPlanSection}
            rawData={this.state.rawData[this.state.selectedIndex]}
            bizparComputeType={this.props.bizparComputeType}
            bizparCorporateGrade={this.props.bizparCorporateGrade}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )} */}
      </div>
    );
  }
}
export default QualificationTable;
