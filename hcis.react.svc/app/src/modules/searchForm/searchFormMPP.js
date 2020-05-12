import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import AuthAction from "../../Redux/AuthRedux";
import MasterdataAction from "../../Redux/MasterdataRedux";
import { connect } from "react-redux";
import LoadingBar from "react-top-loading-bar";
import * as R from "ramda";
import API from "../../Services/Api";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class searchMPP extends Component {
  constructor() {
    super();
    this.state = {
      rawData: [],
      dataTable: [],
      refreshing: false,
      fetching: false,
      mppCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: ""
    };
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getData(this.state.table_page, this.state.table_limit);
      this.startFetch();
    }
  }

  getData = (page, limit) => {
    this.props.getMpp({
      offset: page,
      limit: limit
    });
    this.getCountPage();
  };

  getCountPage = async () => {
    let res = await API.create("CFG").getCountAllMpp();
    console.log(res.data.data);
    let countActive = res.data.data;
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create("CFG").getCountMppByPositionName(
        this.state.table_query
      );
      console.log(response.data.data);
      if (response.ok) {
        this.setState({ mppCount: response.data.data });
      }
      let body = {
        limit: this.state.table_limit,
        offset: this.state.table_page,
        params: {
          positionName: this.state.table_query
        }
      };
      let res = await API.create("CFG").getMppByPositionName(body);
      console.log(res.data.data);
      if (res.ok) {
        if (res.data.data === null) {
          this.setState({ dataTable: [] });
        } else {
          let dataTable = res.data.data.map((value, index) => {
            if (value === null) return ["", "", "", ""];
            const { period, position, budget } = value;
            return [
              (index += 1),
              period ? period : "-",
              "OPERATION",
              position ? position.ouName : "-",
              budget
            ];
          });
          this.setState({
            rawData: res.data.data,
            dataTable
          });
        }
      }
    } else {
      this.setState({ mppCount: countActive });
    }
  };

  componentWillReceiveProps(newProps) {
    if (!newProps.masterdata.fetching && !R.isNil(newProps.masterdata.mpp)) {
      this.onFinishFetch();
      let dataTable = newProps.masterdata.mpp.map((value, index) => {
        if (value === null) return ["", "", "", "", ""];
        const { period, position, budget } = value;
        return [
          (index += 1),
          period ? period : "-",
          "OPERATION",
          position ? position.ouName : "-",
          budget
        ];
      });
      this.setState({
        rawData: newProps.masterdata.mpp,
        dataTable
      });
    }

    this.setState({
      fetching: newProps.masterdata.fetching,
      refreshing: newProps.masterdata.fetching
    });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No.",
    "Period",
    "Departement",
    "Position",
    "Budget",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                onClick={() =>
                  this.props.onChoose(this.state.rawData[tableMeta.rowIndex])
                }
                className={"btn btn-blue btn-small-circle"}
              >
                <i className={"fa fa-lw fa-plus"} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    let { mppCount, table_query } = this.state;
    let tableOptions = {
      ...options,
      serverSide: true,
      count: mppCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.setState({ table_page: tableState.page });
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case "changeRowsPerPage":
            this.setState({ table_limit: tableState.rowsPerPage });
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case "search":
            let searchText = tableState.searchText ? tableState.searchText : "";
            this.setState({ table_query: searchText }, () => {
              this.getData(tableState.page, tableState.rowsPerPage);
            });
            break;
          default:
            break;
        }
      }
    };
    return (
      <div className="app-popup app-popup-show">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px"></div>
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="margin-bottom-5px display-flex-normal padding-15px ">
                <i className="fa fa-lg fa-users margin-right-10px margin-top-5px"></i>
                <h1 className="txt-site txt-18 txt-main ">
                  Man Power Planning
                </h1>
              </div>
            </div>
          </div>
          <div className="padding-10px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                key={mppCount}
                title="Man Power Planning"
                data={this.state.dataTable}
                columns={this.columns}
                options={tableOptions}
              />
            </MuiThemeProvider>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1"></div>
              <div className="col-2 content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="padding-bottom-20px"></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    masterdata: state.masterdata
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMpp: obj => dispatch(MasterdataAction.getMpp(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(searchMPP);
