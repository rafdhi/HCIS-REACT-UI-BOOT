import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from '../../../modules/popup/DropDown';
import FormFeedbackDetail from "./formFeedbackDetail";
import FormADESS from "./formADEss";
import M from 'moment'
import CalendarPicker from "../../../modules/popup/Calendar";
import * as R from 'ramda'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

const dataCreate = {
    "cncTrxID": '',
    "cncTrxName": '',
    "cncTrxEmpID": '',
    "cncTrxEmpName": '',
    "cncTrxDocDate": '',
    "cncTrxPayload": null,
    "cncTrxStatus": "INITIATE",
    "cncTrxType": '',
    "createdBy": '',
    "createdDate": '',
    "updatedBy": '',
    "updatedDate": '',
}

class formCncEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData ? {
                ...props.rawData,
                cncTrxType: props.rawData.cncTrxType ? props.rawData.cncTrxType.bizparKey : '',
                cncTrxDocDate: props.rawData.cncTrxDocDate ? M(props.rawData.cncTrxDocDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
            } : {
                    ...dataCreate,
                    cncTrxID: 'IPP-' + M(),
                    cncTrxEmpName: props.user.employeeName,
                    cncTrxEmpID: props.user.employeeID,
                    createdBy: props.user.employeeID,
                    createdDate: M().format('DD-MM-YYYY HH:mm:ss')
                },
            challengeItems: '', aspirationItems: ''
        }
    }

    getTableFeedback(dataConfig) {
        let { feedbackItems } = dataConfig.cncTPLData.contentSection.feebackSection
        let dataTableFeedback = !feedbackItems ? [] : feedbackItems.map((value, index) => {
            const { feedbackPerformanceID, feedbackType } = value
            return [
                index += 1,
                feedbackPerformanceID,
                feedbackType ? feedbackType.bizparValue : ''
            ]
        })
        this.setState({ dataTableFeedback, rawDataFeedback: feedbackItems })
    }

    getTableAD(dataConfig) {
        let { items } = dataConfig.cncTPLData.contentSection.areaDevelopmentSection
        let dataTableAD = !items ? [] : items.map((value, index) => {
            const { areaDevelopmentSectionItemID, areaDevelopmentSectionItemCategory } = value
            return [
                index += 1,
                areaDevelopmentSectionItemID,
                areaDevelopmentSectionItemCategory ? areaDevelopmentSectionItemCategory.bizparValue : ''
            ]
        })
        this.setState({ dataTableAD, rawDataAD: items })
    }

    setCA() {
        let { challengeItems, aspirationItems } = this.props.dataConfig.cncTPLData.contentSection.feebackSection
        this.setState({ challengeItems, aspirationItems })
    }

    componentDidMount() {
        let { type, dataConfig } = this.props
        if (type !== 'create') {
            this.getTableAD(dataConfig)
            this.getTableFeedback(dataConfig)
            this.setCA()
        }
    }

    componentDidUpdate(prevProps) {
        let { type, rawData, dataConfig } = this.props
        if (rawData !== prevProps.rawData) {
            if (type !== 'create') {
                this.getTableAD(dataConfig)
                this.getTableFeedback(dataConfig)
                this.setCA()
            }
        }
    }

    columnsFeedback = [
        "No",
        "Feedback ID",
        "Feedback Type",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', 'Feedback', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', 'Feedback', tableMeta.rowIndex)}
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

    columnsAD = [
        "No",
        "Area Development ID",
        "Area Development Type",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', 'Area Development', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', 'Area Development', tableMeta.rowIndex)}
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
            case 'Feedback':
                switch (type) {
                    case 'edit':
                        this.setState({ editFeedback: !this.state.editFeedback })
                        break;
                    case 'view':
                        this.setState({ viewFeedback: !this.state.viewFeedback })
                        break;
                }
                break;
            case 'Area Development':
                switch (type) {
                    case 'edit':
                        this.setState({ editAD: !this.state.editAD })
                        break;
                    case 'view':
                        this.setState({ viewAD: !this.state.viewAD })
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
            editAD: false,
            editFeedback: false,
            viewFeedback: false,
            viewAD: false
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
                                <h4>C&C ID</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.cncTrxID}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Period <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <CalendarPicker
                            date={data.cncTrxDocDate}
                            disabled={type === 'view' ? true : false}
                            onChange={e => this.setState({
                                data: {
                                    ...this.state.data,
                                    cncTrxDocDate: e
                                }
                            })} />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            readOnly={type === "view" ? true : false}
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.cncTrxEmpName}
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
                                <h4>Grade/Sub Grade <span style={{ color: "red" }}>*</span></h4>
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
                                <h4>Division <span style={{ color: "red" }}>*</span></h4>
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
                                <h4>Department <span style={{ color: "red" }}>*</span></h4>
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
                                C&C - CREATE FORM
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
            case 'Feedback':
                columns = this.columnsFeedback
                dataTable = this.state.dataTableFeedback
                break;
            case 'Area Development':
                columns = this.columnsAD
                dataTable = this.state.dataTableAD
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

    renderCA() {
        let { type, challengeItems, aspirationItems } = this.state
        // challengeItems = challengeItems.toString()
        // aspirationItems = aspirationItems.toString()
        return (
            <div>
                <div className="padding-15px">
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Challenge <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            readOnly={type === "view" ? true : false}
                            style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={challengeItems}
                            onChange={e => this.setState({ challengeItems: e.target.value })}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Aspiration <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <input
                            readOnly={type === "view" ? true : false}
                            style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={aspirationItems}
                            onChange={e => this.setState({ aspirationItems: e.target.value })}
                        />
                    </div>
                </div>

                <div className="padding-15px">
                    <div className="grid grid-2x">
                        <div className="col-1" />
                        <div className="col-2 content-right">
                            {type !== "view" ? (
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={() => {

                                        this.hansleSaveCA()
                                    }}
                                >
                                    <span>SAVE</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    hansleSaveCA() {
        let { data, challengeItems, aspirationItems } = this.state
        let { cncTPLData } = this.props.dataConfig
        let { contentSection } = cncTPLData
        let { feebackSection } = contentSection
        let cncTrxPayload = {
            ...this.props.dataConfig,
            cncTPLData: {
                ...cncTPLData,
                contentSection: {
                    ...contentSection,
                    feebackSection:
                    {
                        ...feebackSection,
                        challengeItems: challengeItems,
                        aspirationItems: aspirationItems
                    }
                }
            }
        }
        data = {
            ...data,
            cncTrxPayload: JSON.stringify(cncTrxPayload)
        }
        this.props.onClickSave('edit', data)
    }

    handleSaveFeedback(payload) {
        this.falseAll()
        let { data } = this.state
        let { cncTPLData } = this.props.dataConfig
        let { contentSection } = cncTPLData
        let { feebackSection } = contentSection
        let { feedbackItems } = feebackSection
        let index = R.findIndex(R.propEq('feebackSectionValuationID', payload.feebackSectionValuationID))(feedbackItems)
        if (index >= 0) {
            feedbackItems[index] = payload
        }
        let cncTrxPayload = {
            ...this.props.dataConfig,
            cncTPLData: {
                ...cncTPLData,
                contentSection: {
                    ...contentSection,
                    feebackSection:
                    {
                        ...feebackSection,
                        feedbackItems: feedbackItems
                    }
                }
            }
        }
        data = {
            ...data,
            cncTrxPayload: JSON.stringify(cncTrxPayload)
        }
        this.props.onClickSave('edit', data)
    }

    handleSaveAD(payload) {
        this.falseAll()
        let { data } = this.state
        let { cncTPLData } = this.props.dataConfig
        let { contentSection } = cncTPLData
        let { areaDevelopmentSection } = contentSection
        let { items } = areaDevelopmentSection
        let index = R.findIndex(R.propEq('areaDevelopmentSectionItemID', payload.areaDevelopmentSectionItemID))(items)
        if (index >= 0) {
            items[index] = payload
        }
        let cncTrxPayload = {
            ...this.props.dataConfig,
            cncTPLData: {
                ...cncTPLData,
                contentSection: {
                    ...contentSection,
                    areaDevelopmentSection:
                    {
                        ...areaDevelopmentSection,
                        items: items
                    }
                }
            }
        }
        data = {
            ...data,
            cncTrxPayload: JSON.stringify(cncTrxPayload)
        }
        this.props.onClickSave('edit', data)
    }

    renderEdit() {
        let { data, type, editFeedback, viewFeedback, viewAD, editAD, rawDataFeedback, rawDataAD } = this.state
        return (
            <div className="a-s-p-place active">
                {editFeedback &&
                    <FormFeedbackDetail
                        type='edit'
                        title='FEEDBACK'
                        rawData={rawDataFeedback[this.state.selectedIndex]}
                        onClickSave={this.handleSaveFeedback.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'Feedback')}
                    />}
                {viewFeedback &&
                    <FormFeedbackDetail
                        type='view'
                        title='FEEDBACK'
                        rawData={rawDataFeedback[this.state.selectedIndex]}
                        onClickClose={() => this.openPopUp('view', 'Feedback')}
                    />}

                {editAD &&
                    <FormADESS
                        rawData={rawDataAD[this.state.selectedIndex]}
                        type='edit'
                        title='AREA DEVELOPMENT'
                        onClickSave={this.handleSaveAD.bind(this)}
                        onClickClose={() => this.openPopUp('edit', 'Area Development')}
                    />}
                {viewAD &&
                    <FormADESS
                        rawData={rawDataAD[this.state.selectedIndex]}
                        type='view'
                        title='AREA DEVELOPMENT'
                        onClickClose={() => this.openPopUp('view', 'Area Development')}
                    />}

                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-certificate"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    C&C - {type === "edit" ? "Edit" : "View"} Form
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
                                        <i className="fas fa-certificate margin-right-5px"></i>
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
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Feedback
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
                                {this.renderTable('Feedback')}
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
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Challenge & Aspiration
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
                                {this.renderCA()}
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
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Feedback Competence
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
                                {/* Content */}
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
                                        <i className="fas fa-certificate margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">
                                            Area Development
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
                                {this.renderTable('Area Development')}
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
export default formCncEss;
