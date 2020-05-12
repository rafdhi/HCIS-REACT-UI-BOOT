import React, { Component } from "react";
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from "../../../modules/popup/Calendar";
import * as R from "ramda";
import FormPerformancePlanEss from "./formPerformancePlanEss";
import FormCriteriaEss from "./formCriteriaEss";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

const dataCreate = {
    "ippTrxID": '',
    "ippTrxName": '',
    "ippTrxEmpID": '',
    "ippTrxEmpName": '',
    "ippTrxDocDate": '',
    "ippTrxPayload": null,
    "ippTrxStatus": "INITIATE",
    "ippTrxType": '',
    "createdBy": '',
    "createdDate": '',
    "updatedBy": '',
    "updatedDate": '',
}

class formIppEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData ? {
                ...props.rawData,
                ippTrxType: props.rawData.ippTrxType ? props.rawData.ippTrxType.bizparKey : '',
                ippTrxDocDate: props.rawData.ippTrxDocDate ? M(props.rawData.ippTrxDocDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
            } : {
                    ...dataCreate,
                    ippTrxID: 'IPP-' + M(),
                    ippTrxEmpName: props.user.employeeName,
                    ippTrxEmpID: props.user.employeeID,
                    createdBy: props.user.employeeID,
                    createdDate: M().format('DD-MM-YYYY HH:mm:ss')
                }
        }
    }

    getTable(dataConfig) {
        let { ippOCVItems } = dataConfig.ippTPLData.contentSection.outputCriteria
        let dataTablePerformancePlan = !ippOCVItems ? [] : ippOCVItems.map((value, index) => {
            const { outputCriteriaValuationID, activityPlanSection, activityPlanCategory } = value
            return [
                index += 1,
                outputCriteriaValuationID,
                activityPlanCategory ? activityPlanCategory.bizparValue : ''
            ]
        })
        this.setState({ dataTablePerformancePlan, rawDataPerformancePlan: ippOCVItems })
    }

    getTableProcess(dataConfig) {
        let { ippOCVItems } = dataConfig.ippTPLData.contentSection.processCriteria
        let dataTableProcessCriteria = !ippOCVItems ? [] : ippOCVItems.map((value, index) => {
            const { outputCriteriaProcessValuationID, subCriteria } = value
            return [
                index += 1,
                outputCriteriaProcessValuationID,
                subCriteria.criteriaCategory ? subCriteria.criteriaCategory.bizparValue : '',
                subCriteria.criteriaExplanation
            ]
        })
        this.setState({ dataTableProcessCriteria, rawDataPerformanceCriteria: ippOCVItems })
    }

    componentDidMount() {
        if (this.props.type !== 'create') {
            this.getTable(this.props.dataConfig)
            this.getTableProcess(this.props.dataConfig)
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            this.getTable(this.props.dataConfig)
            this.setState({
                data: {
                    ...this.props.rawData,
                    ippTrxType: this.props.rawData.ippTrxType ? this.props.rawData.ippTrxType.bizparKey : '',
                    ippTrxDocDate: this.props.rawData.ippTrxDocDate ? M(this.props.rawData.ippTrxDocDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
                }
            })
        }
    }

    dataTablePlan = [
        ['1', 'AP-001', 'HASIL KERJA', 'PROJECT IMPROVEMENT'],
        ['2', 'AP-002', 'HASIL KERJA', 'ROUTINE ACTIVITIES'],
        ['3', 'AP-003', 'HASIL KERJA', 'SPECIAL ASSIGNMENT'],
    ]

    dataTableCriteria = [
        ['1', 'AP-001', 'Ananlysis & Decision Making', 'Membangun Pola Pikir Menyeluruh'],
        ['2', 'AP-002', 'Planning & Controlling', 'Menyusun Tahapan Percapaian'],
        ['3', 'AP-003', 'Managing Changes', 'mengidentifikasi Perlunya Perubahan'],
    ]

    columnsPlan = [
        "No",
        "Performance Plan ID",
        // "Criteria Name",
        "Component Category",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', 'Performance Plan', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', 'Performance Plan', tableMeta.rowIndex)}
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

    columnsApp = [
        "No",
        "Performance Plan ID",
        // "Criteria Name",
        "Component Category",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', 'Performance Appraisal Score', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', 'Performance Appraisal Score', tableMeta.rowIndex)}
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

    columnsCriteria = [
        "No",
        "Criteria ID",
        "Component Category",
        "Category Description",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', 'Criteria', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', 'Criteria', tableMeta.rowIndex)}
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
            case 'Performance Plan':
                switch (type) {
                    case 'edit':
                        this.setState({ editPerformancePlan: !this.state.editPerformancePlan })
                        break;
                    case 'view':
                        this.setState({ viewPerformancePlan: !this.state.viewPerformancePlan })
                        break;
                }
                break;
            case 'Performance Appraisal Score':
                switch (type) {
                    case 'edit':
                        this.setState({ editPerformanceAppraisalScore: !this.state.editPerformanceAppraisalScore })
                        break;
                    case 'view':
                        this.setState({ viewPerformanceAppraisalScore: !this.state.viewPerformanceAppraisalScore })
                        break;
                }
                break;
            case 'Criteria':
                switch (type) {
                    case 'edit':
                        this.setState({ editCriteria: !this.state.editCriteria })
                        break;
                    case 'view':
                        this.setState({ viewCriteria: !this.state.viewCriteria })
                        break;
                }
                break;
        }
        this.setState({ selectedIndex: index })
    }

    falseAll() {
        this.setState({
            editCriteria: false,
            viewCriteria: false,
            editPerformanceAppraisalScore: false,
            editPerformancePlan: false,
            viewPerformancePlan: false,
            viewPerformanceAppraisalScore: false
        })
    }

    renderHeader() {
        let { data, type } = this.state
        return (
            <div className={type !== 'create' ? "border-bottom" : "border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px"}>
                <div className="column-1">
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>IPP ID</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.ippTrxID}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Period</h4>
                            </div>
                        </div>
                        <CalendarPicker
                            date={data.ippTrxDocDate}
                            disabled={type === 'view' ? true : false}
                            onChange={e => this.setState({
                                data: {
                                    ...this.state.data,
                                    ippTrxDocDate: e
                                }
                            })} />
                        {/* <input
                            readOnly={type === "view" ? true : false}
                            style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                        // value={data.period}
                        // onChange={e => this.setState({ data: { ...data, period: e.target.value } })}
                        /> */}
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.ippTrxEmpName}
                        // onChange={e => this.setState({ data: { ...data, period: e.target.value } })}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Position</h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            title=' -- please select item --'
                            disabled
                            data={[
                                { bizparKey: 'MANAGER OF TALENT', bizparValue: 'MANAGER OF TALENT' },
                                { bizparKey: 'POSITION 2', bizparValue: 'POSITION 2' },
                                { bizparKey: 'POSITION 3', bizparValue: 'POSITION 3' },
                                { bizparKey: 'POSITION 4', bizparValue: 'POSITION 4' },
                            ]}
                            onChange={e => console.log(e)}
                            value={this.props.user.positionName}
                        />
                    </div>
                </div>

                <div className="column-2">
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Sub Golongan</h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            title=' -- please select item --'
                            disabled={type === "view" ? true : false}
                            data={[
                                { bizparKey: 'GOLONGAN 1', bizparValue: 'GOLONGAN 1' },
                                { bizparKey: 'GOLONGAN 2', bizparValue: 'GOLONGAN 2' },
                                { bizparKey: 'GOLONGAN 3', bizparValue: 'GOLONGAN 3' },
                                { bizparKey: 'GOLONGAN 4', bizparValue: 'GOLONGAN 4' },
                            ]}
                            onChange={e => console.log(e)}
                        // value={data.trainingExpenseCOA}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Division</h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            title=' -- please select item --'
                            disabled={type === "view" ? true : false}
                            data={[
                                { bizparKey: 'DIVISION 1', bizparValue: 'DIVISION 1' },
                                { bizparKey: 'DIVISION 2', bizparValue: 'DIVISION 2' },
                                { bizparKey: 'DIVISION 3', bizparValue: 'DIVISION 3' },
                                { bizparKey: 'DIVISION 4', bizparValue: 'DIVISION 4' },
                            ]}
                            onChange={e => console.log(e)}
                        // value={data.trainingExpenseCOA}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Department</h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            title=' -- please select item --'
                            disabled={type === "view" ? true : false}
                            data={[
                                { bizparKey: 'DEPARTMENT 1', bizparValue: 'DEPARTMENT 1' },
                                { bizparKey: 'DEPARTMENT 2', bizparValue: 'DEPARTMENT 2' },
                                { bizparKey: 'DEPARTMENT 3', bizparValue: 'DEPARTMENT 3' },
                                { bizparKey: 'DEPARTMENT 4', bizparValue: 'DEPARTMENT 4' },
                            ]}
                            onChange={e => console.log(e)}
                        // value={data.trainingExpenseCOA}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderCreate() {
        let { data, type } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                IPP - CREATE FORM
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
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(type, data)
                        }}>
                        {this.renderHeader()}
                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </button>
                                    ) : null}
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
        );
    }

    renderTable(type) {
        let columns, dataTable, title = ''
        switch (type) {
            case 'Performance Plan':
                columns = this.columnsPlan
                dataTable = this.state.dataTablePerformancePlan
                break;
            case 'Performance Appraisal Score':
                columns = this.columnsApp
                dataTable = this.state.dataTablePerformancePlan
                break;
            case 'Process Criteria':
                columns = this.columnsCriteria
                dataTable = this.state.dataTableProcessCriteria
                break;

        }
        return (
            <div className='padding-10px'>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={type}
                        subtitle={"lorem ipsum dolor"}
                        data={dataTable}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }

    handleSave(payload) {
        this.falseAll()
        let { data } = this.state
        let { ippTPLData } = this.props.dataConfig
        let { contentSection } = ippTPLData
        let { outputCriteria } = contentSection
        let { ippOCVItems } = outputCriteria
        let index = R.findIndex(R.propEq('outputCriteriaValuationID', payload.outputCriteriaValuationID))(ippOCVItems)
        if (index >= 0) {
            ippOCVItems[index] = payload
        }
        let ippTrxPayload = {
            ...this.props.dataConfig,
            ippTPLData: {
                ...ippTPLData,
                contentSection: {
                    ...contentSection,
                    outputCriteria:
                    {
                        ...outputCriteria,
                        ippOCVItems: ippOCVItems
                    }
                }
            }
        }
        data = {
            ...data,
            ippTrxPayload: JSON.stringify(ippTrxPayload)
        }
        this.props.onClickSave('edit', data)
    }

    handleSaveProcessCriteria(payload) {
        this.falseAll()
        let { data } = this.state
        let { ippTPLData } = this.props.dataConfig
        let { contentSection } = ippTPLData
        let { processCriteria } = contentSection
        let { ippOCVItems } = processCriteria
        let index = R.findIndex(R.propEq('outputCriteriaProcessValuationID', payload.outputCriteriaProcessValuationID))(ippOCVItems)
        if (index >= 0) {
            ippOCVItems[index] = payload
        }
        let ippTrxPayload = {
            ...this.props.dataConfig,
            ippTPLData: {
                ...ippTPLData,
                contentSection: {
                    ...contentSection,
                    processCriteria:
                    {
                        ...processCriteria,
                        ippOCVItems: ippOCVItems
                    }
                }
            }
        }
        data = {
            ...data,
            ippTrxPayload: JSON.stringify(ippTrxPayload)
        }
        this.props.onClickSave('edit', data)
    }

    parseDataTemplate(value) {
        if (value && !R.isEmpty(value)) {
            let { ippTPLData } = JSON.parse(value)
            let { contentSection } = ippTPLData
            let { outputCriteria } = contentSection
            let { ippOCVItems } = outputCriteria
            let rawDataPerfPlan = ippOCVItems
            return rawDataPerfPlan[this.state.selectedIndex]
        }
    }

    renderEdit() {
        let { data, type, editPerformancePlan, viewPerformancePlan, viewPerformanceAppraisalScore, editPerformanceAppraisalScore, editCriteria, viewCriteria } = this.state
        return (
            <div className="a-s-p-place active">
                {editPerformancePlan &&
                    <FormPerformancePlanEss
                        rawData={this.state.rawDataPerformancePlan[this.state.selectedIndex]}
                        rawDataValues={this.parseDataTemplate(data.ippTrxPayload)}
                        type='edit'
                        title='PERFORMANCE PLAN'
                        onClickSave={this.handleSave.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'Performance Plan')}
                    />}
                {editPerformanceAppraisalScore &&
                    <FormPerformancePlanEss
                        rawData={this.state.rawDataPerformancePlan[this.state.selectedIndex]}
                        rawDataValues={this.parseDataTemplate(data.ippTrxPayload)}
                        type='edit'
                        title='PERFORMANCE APPRAISAL SCORE'
                        onClickSave={this.handleSave.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'Performance Appraisal Score')}
                    />}
                {viewPerformancePlan &&
                    <FormPerformancePlanEss
                        rawData={this.state.rawDataPerformancePlan[this.state.selectedIndex]}
                        rawDataValues={this.parseDataTemplate(data.ippTrxPayload)}
                        type='view'
                        title='PERFORMANCE PLAN'
                        onClickClose={() => this.openPopUp('view', 'Performance Plan')}
                    />}
                {viewPerformanceAppraisalScore &&
                    <FormPerformancePlanEss
                        rawData={this.state.rawDataPerformancePlan[this.state.selectedIndex]}
                        rawDataValues={this.parseDataTemplate(data.ippTrxPayload)}
                        type='view'
                        title='PERFORMANCE APPRAISAL SCORE'
                        onClickClose={() => this.openPopUp('view', 'Performance Appraisal Score')}
                    />}
                {editCriteria &&
                    <FormCriteriaEss
                        rawDataValues={this.state.rawDataPerformanceCriteria[this.state.selectedIndex]}
                        type='edit'
                        onClickSave={this.handleSaveProcessCriteria.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'Criteria')}
                    />}
                {viewCriteria &&
                    <FormCriteriaEss
                        rawDataValues={this.state.rawDataPerformanceCriteria[this.state.selectedIndex]}
                        type='view'
                        onClickClose={() => this.openPopUp('view', 'Criteria')}
                    />}
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-chart-line"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    IPP - {type === "edit" ? "Edit" : "View"} Form
                                 </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.onClickClose}
                                className="btn btn-circle btn-grey"
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-mid border-top">
                    <div className="padding-10px">
                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cah"
                            />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-chart-line margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Header
                                         </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cah">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                {this.renderHeader()}
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cahp"
                            />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-chart-line margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Performance Plan
                                         </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cahp">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                {this.renderTable('Performance Plan')}
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cahps"
                            />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1" style={{ width: '140%' }}>
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-chart-line margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Performance Appraisal Score
                                         </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cahps">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                {this.renderTable('Performance Appraisal Score')}
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cahpsc"
                            />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-chart-line margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Process Criteria
                                         </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cahpsc">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                {this.renderTable('Process Criteria')}
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cahpscc"
                            />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fas fa-chart-line margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Performance Calculation
                                         </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cahpscc">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                {/* {this.renderHeader()} */}
                            </div>
                        </div>
                        <div className="padding-15px">
                            <div className="content-center">
                                {type !== "view" ? (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => this.props.onClickSave(type, data)}
                                    >
                                        <span>SAVE</span>
                                    </button>
                                ) : null}
                                {type !== "view" ? (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => this.props.onClickSave(type, data)}
                                    >
                                        <span>SAVE & SUBMIT</span>
                                    </button>
                                ) : null}
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
            </div>
        )
    }

    render() {
        let { type } = this.state
        return type === 'create' ? this.renderCreate() : this.renderEdit()
    }
}
export default formIppEss;
