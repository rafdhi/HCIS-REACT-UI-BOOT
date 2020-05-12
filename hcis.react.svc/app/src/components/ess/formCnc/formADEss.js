import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormADESS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData
        }
    }

    componentDidMount() {
        this.getTable()
        this.setValue()
    }

    setValue() {
        let { data } = this.state
        let { areaDevelopmentSectionItems } = data
        let periodeAssignment, targetKompetensi, targetAktivitas, actual = ''
        if (areaDevelopmentSectionItems) {
            areaDevelopmentSectionItems.map((value) => {
                switch (value.areaDevelopmentSectionSubItemComponent.bizparKey) {
                    case 'CNCAREADEVCATITM-001':
                        this.setState({ periodeAssignment: value.areaDevelopmentSectionSubItemValue })
                        break
                    case 'CNCAREADEVCATITM-002':
                        this.setState({ targetKompetensi: value.areaDevelopmentSectionSubItemValue })
                        break
                    case 'CNCAREADEVCATITM-003':
                        this.setState({ targetAktivitas: value.areaDevelopmentSectionSubItemValue })
                        break
                    case 'CNCAREADEVCATITM-004':
                        this.setState({ actual: value.areaDevelopmentSectionSubItemValue })
                        break
                }
            })
        }
        else this.setState({ periodeAssignment, targetKompetensi, targetAktivitas, actual })
    }

    handleSave() {
        let { data, periodeAssignment, targetKompetensi, targetAktivitas, actual } = this.state
        let { areaDevelopmentSectionItems } = data
        if (areaDevelopmentSectionItems) {
            areaDevelopmentSectionItems.map((value) => {
                switch (value.areaDevelopmentSectionSubItemComponent.bizparKey) {
                    case 'CNCAREADEVCATITM-001':
                        value.areaDevelopmentSectionSubItemValue = periodeAssignment
                        break
                    case 'CNCAREADEVCATITM-002':
                        value.areaDevelopmentSectionSubItemValue = targetKompetensi
                        break
                    case 'CNCAREADEVCATITM-003':
                        value.areaDevelopmentSectionSubItemValue = targetAktivitas
                        break
                    case 'CNCAREADEVCATITM-004':
                        value.areaDevelopmentSectionSubItemValue = actual
                        break
                }
                return areaDevelopmentSectionItems
            })
        }
        data = { ...data, areaDevelopmentSectionItems: areaDevelopmentSectionItems }
        this.props.onClickSave(data)
    }

    getTable() {
        let { data } = this.state
        let dataTableAD = [
            ['1',
                data.areaDevelopmentSectionItemCategory ? data.areaDevelopmentSectionItemCategory.bizparValue : '',
                data.areaDevelopmentSectionItemDescription]
        ]

        this.setState({ dataTableAD })
    }

    dataTable = [
        ['1', 'Special Assignment (Penugasan Kerja Khusus)', 'Penugasan Kerja Khusus Part 1'],
        ['2', 'Special Assignment (Penugasan Kerja Khusus)', 'Penugasan Kerja Khusus Part 2'],
    ]

    columns = [
        "No",
        "Area Development Type",
        "Description",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.type !== 'view' &&
                                <button
                                    onClick={() => this.openPopUp('edit', tableMeta.rowIndex)}
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            }
                            <button
                                onClick={() => this.openPopUp('view', tableMeta.rowIndex)}
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

    openPopUp(type, index) {
        switch (type) {
            case 'edit':
                this.setState({ editVisible: !this.state.editVisible, index })
                break;
            case 'view':
                this.setState({ viewVisible: !this.state.viewVisible, index })
                break;
        }
    }

    renderPopup(type) {
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        let { periodeAssignment, targetKompetensi, targetAktivitas, actual } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-mikro background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                DEVELOPMENT - {title} FORM
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={() => this.openPopUp(type)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="border-bottom padding-15px">
                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Periode Assignment <span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <input
                                readOnly={type === "view" ? true : false}
                                style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                value={periodeAssignment}
                                onChange={e => this.setState({ periodeAssignment: e.target.value })}
                            />
                        </div>
                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Target Kompetensi <span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <input
                                readOnly={type === "view" ? true : false}
                                style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                value={targetKompetensi}
                                onChange={e => this.setState({ targetKompetensi: e.target.value })}
                            />
                        </div>
                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Target Aktivitas <span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <input
                                readOnly={type === "view" ? true : false}
                                style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                value={targetAktivitas}
                                onChange={e => this.setState({ targetAktivitas: e.target.value })}
                            />
                        </div>
                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Actual <span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>
                            <input
                                readOnly={type === "view" ? true : false}
                                style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                value={actual}
                                onChange={e => this.setState({ actual: e.target.value })}
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
                                        onClick={() => this.handleSave()}
                                    >
                                        <span>SAVE</span>
                                    </button>
                                ) : null}
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => this.openPopUp(type)}
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
        let { data, type, viewVisible, editVisible } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    {editVisible && this.renderPopup('edit')}
                    {viewVisible && this.renderPopup('view')}
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
                    <div className='padding-10px'>
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={'AREA DEVELOPMENT - DETAIL'}
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTableAD}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormADESS