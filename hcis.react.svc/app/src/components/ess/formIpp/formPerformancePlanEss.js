import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormPerformancePlanEssDetail from './formPerformancePlanEssDetail.js';
import * as R from "ramda";
import FormPerformanceAppraisalScoreEssDetail from "./formPerformanceAppraisalScoreDetail.js";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormPerformancePlanEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData,
            rawDataValues: props.rawDataValues,
            performancePlanValues: { valueMidYear: '', valueFullYear: '', valueMidYearHead: '', valueFullYearHead: '' }
        }
    }

    getTable(dataConfig) {
        let valueFullYear, valueMidYear, valueMidYearHead, valueFullYearHead = ''
        if (this.state.rawDataValues && !R.isEmpty(this.state.rawDataValues)) {
            let { activityPlanPerformanceByTime, activityPlanPerformanceAppraisalByTime } = this.state.rawDataValues
            switch (this.props.title) {
                case 'PERFORMANCE PLAN':
                    if (!R.isEmpty(activityPlanPerformanceByTime)) {
                        activityPlanPerformanceByTime.map((value) => {
                            switch (value.performancePlanComponent.bizparKey) {
                                case 'IPPPERFPLAN-002':
                                    valueFullYear = value.performancePlanEmpValue
                                    break;
                                case 'IPPPERFPLAN-001':
                                    valueMidYear = value.performancePlanEmpValue
                                    break;
                            }
                        })
                    }
                    break;
                case 'PERFORMANCE APPRAISAL SCORE':
                    if (!R.isEmpty(activityPlanPerformanceAppraisalByTime)) {
                        activityPlanPerformanceAppraisalByTime.map((value) => {
                            switch (value.achievement.bizparKey) {
                                case 'IPPPERFAPPACH-002':
                                    valueFullYear = value.achievementEmpValue
                                    valueFullYearHead = value.achievementValue
                                    break;
                                case 'IPPPERFAPPACH-001':
                                    valueMidYear = value.achievementEmpValue
                                    valueMidYearHead = value.achievementValue
                                    break;
                            }
                        })
                    }
                    break;
            }

        }
        let data = []
        data.push(dataConfig)
        let dataTablePerformancePlan = !data ? [] : data.map((value, index) => {
            return [
                index += 1,
                value.activityPlanSection,
                valueMidYear,
                valueFullYear
            ]
        })
        this.setState({ dataTablePerformancePlan, performancePlanValues: { valueMidYear, valueFullYear,valueMidYearHead, valueFullYearHead } })
    }

    componentDidMount() {
        this.getTable(this.props.rawData)
    }

    columns = [
        "No",
        "Activity Plan",
        "Mid Year Target",
        "Full Year Target",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    type='button'
                                    onClick={() => this.openPopUp('edit', this.props.title, tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', this.props.title, tableMeta.rowIndex)}
                                type='button'
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                className='btnAct'
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    columnsAppraisal = [
        "No",
        "Activity Plan",
        "Mid Year Achievement",
        "Full Year Achievement",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    type='button'
                                    onClick={() => this.openPopUp('edit', this.props.title, tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', this.props.title, tableMeta.rowIndex)}
                                type='button'
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                className='btnAct'
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    openPopUp(type, formType, index) {
        switch (formType) {
            case 'PERFORMANCE PLAN':
                switch (type) {
                    case 'edit':
                        this.setState({ editPerformancePlanDetail: !this.state.editPerformancePlanDetail })
                        break;
                    case 'view':
                        this.setState({ viewPerformancePlanDetail: !this.state.viewPerformancePlanDetail })
                        break;
                }
                break;
            case 'PERFORMANCE APPRAISAL SCORE':
                switch (type) {
                    case 'edit':
                        this.setState({ editAppDetail: !this.state.editAppDetail })
                        break;
                    case 'view':
                        this.setState({ viewAppDetail: !this.state.viewAppDetail })
                        break;
                }
                break;
        }
        this.setState({ selectedIndex: index })
    }

    handleSave(payload) {
        this.props.onClickSave(payload)
    }

    render() {
        let { data, type, editPerformancePlanDetail, viewPerformancePlanDetail, editAppDetail, viewAppDetail } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                {editPerformancePlanDetail &&
                    <FormPerformancePlanEssDetail
                        dataConfig={this.props.rawData}
                        performancePlanValueDTO={this.state.performancePlanValues}
                        type='edit'
                        onClickSave={this.handleSave.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'PERFORMANCE PLAN')}
                    />}
                {viewPerformancePlanDetail &&
                    <FormPerformancePlanEssDetail
                        type='view'
                        dataConfig={this.props.rawData}
                        performancePlanValueDTO={this.state.performancePlanValues}
                        onClickClose={() => this.openPopUp('view', 'PERFORMANCE PLAN')}
                    />}
                {editAppDetail &&
                    <FormPerformanceAppraisalScoreEssDetail
                        type='edit'
                        dataConfig={this.props.rawData}
                        performancePlanValueDTO={this.state.performancePlanValues}
                        onClickSave={this.handleSave.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'PERFORMANCE APPRAISAL SCORE')}
                    />}
                {viewAppDetail &&
                    <FormPerformanceAppraisalScoreEssDetail
                        type='view'
                        dataConfig={this.props.rawData}
                        performancePlanValueDTO={this.state.performancePlanValues}
                        onClickClose={() => this.openPopUp('view', 'PERFORMANCE APPRAISAL SCORE')}
                    />}
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                {this.props.title} - {title} FORM
                        </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Performance Plan ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.outputCriteriaValuationID}
                                    />
                                </div>
                                {/* <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Criteria Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    // value={data.activityPlanSection}
                                    />
                                </div> */}
                            </div>
                            <div className='column-2'>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Component Category</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.activityPlanCategory ? data.activityPlanCategory.bizparValue : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='padding-10px'>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={'Activity Plan'}
                                    subtitle={"lorem ipsum dolor"}
                                    data={this.state.dataTablePerformancePlan}
                                    columns={this.props.title === 'PERFORMANCE PLAN' ? this.columns : this.columnsAppraisal}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
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
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div >
        )
    }
}
export default FormPerformancePlanEss