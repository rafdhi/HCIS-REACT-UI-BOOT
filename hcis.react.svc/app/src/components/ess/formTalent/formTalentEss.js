import React, { Component } from "react";
import M from 'moment'
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from "../../../modules/popup/Calendar";
import * as R from "ramda";
import FormEmpList from "./formEmpList";

const dataCreate = {
    "tlnTrxID": '',
    "tlnTrxName": '',
    "tlnTrxDocDate": '',
    "tlnTrxStatus": "INITIATE",
    "tlnTrxType": '',
    "createdBy": '',
    "createdDate": '',
    "updatedBy": '',
    "updatedDate": '',
}

class formTalentEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData ? {
                ...props.rawData,
                tlnTrxType: props.rawData.tlnTrxType ? props.rawData.tlnTrxType.bizparKey : '',
                tlnTrxDocDate: props.rawData.tlnTrxDocDate ? M(props.rawData.tlnTrxDocDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
            } : {
                    ...dataCreate,
                    tlnTrxID: 'TLN-' + M(),
                    tlnTrxEmpName: props.user.employeeName,
                    tlnTrxEmpID: props.user.employeeID,
                    createdBy: props.user.employeeID,
                    createdDate: M().format('DD-MM-YYYY HH:mm:ss')
                },
            position: { id: '', value: '' },
            directorate: { id: '', value: '' },
            templateRule: ''
        }
    }

    componentDidMount() {
        let { type } = this.props
        type !== 'create' && this.getTableEmp()
    }

    componentDidUpdate(prevProps) {
        let { rawData } = this.props
        if (rawData !== prevProps.rawData) {
            this.setState({
                data: {
                    ...rawData,
                    tlnTrxType: rawData.tlnTrxType ? rawData.tlnTrxType.bizparKey : '',
                    tlnTrxDocDate: rawData.tlnTrxDocDate ? M(rawData.tlnTrxDocDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
                }
            })
            if (rawData) {
                this.getTableEmp()
            }
        }
    }

    getTableEmp() {
        let { tlnTrxCandidateList } = this.props.rawData
        let dataTableEmp = !tlnTrxCandidateList ? [] : tlnTrxCandidateList.map((value, index) => {
            const { temEmpID, temEmpName, temCriteriaVal, temSkillVal, temAvgVal } = value
            return [
                index += 1,
                temEmpID,
                temEmpName,
                temCriteriaVal,
                temSkillVal,
                temAvgVal
            ]
        })
        this.setState({ dataTableEmp })
    }

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Criteria Similarity",
        "Skill Similarity",
        "Score",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                // onClick={() => this.openPopUp('view', 'Performance Plan', tableMeta.rowIndex)}
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

    setPosition(value) {
        let { rawDataPosition } = this.props
        console.log(rawDataPosition)
        let { position, directorate } = this.state
        let ouID = value
        let indexOuid = R.findIndex(R.propEq('ouid', ouID))(rawDataPosition)
        if (indexOuid >= 0) {
            let directorateID = rawDataPosition[indexOuid].ouparentID
            let index = R.findIndex(R.propEq('ouid', directorateID))(rawDataPosition)
            this.setState({
                directorate: {
                    id: directorateID,
                    value: index >= 0 ? rawDataPosition[index].ouposition.bizparValue : ''
                },
                position: { ...position, id: ouID }
            })
        }
    }

    renderMain() {
        let { data, type, position, directorate, templateRule } = this.state
        let { bizparPosition, bizparTemplate } = this.props
        let { payload } = this.props.dataConfig
        return (
            <div className={type !== 'create' ? "border-bottom" : "border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px"}>
                <div className="column-1">
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Talent ID</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.tlnTrxID}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Date <span style={{ color: 'red' }}>*</span> </h4>
                            </div>
                        </div>
                        <CalendarPicker
                            date={data.tlnTrxDocDate}
                            disabled={type === 'view' ? true : false}
                            onChange={e => this.setState({
                                data: {
                                    ...this.state.data,
                                    tlnTrxDocDate: e
                                }
                            })} />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Position ID</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={position.id}
                        // onChange={e => this.setState({ data: { ...data, period: e.target.value } })}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Position <span style={{ color: 'red' }}>*</span></h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            title=' -- please select position --'
                            disabled={type === 'view'}
                            data={bizparPosition}
                            onChange={e => this.setPosition(e)}
                        />
                    </div>
                </div>

                <div className="column-2">
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Directorat ID</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={directorate.id}
                        // onChange={e => this.setState({ data: { ...data, period: e.target.value } })}
                        />
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Directorat Position Name</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={directorate.value}
                        />

                    </div>
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Talent Rule Set</h4>
                            </div>
                        </div>
                        <DropDown
                            type='bizpar'
                            disabled={type === 'view'}
                            title=' -- please select rule --'
                            data={bizparTemplate}
                            onChange={e => this.setState({ templateRule: e })}
                            value={templateRule}
                        />
                    </div>
                </div>
            </div>
        )
    }

    renderExecute() {
        let { type, dataTableEmp } = this.state
        let title = type === 'view' ? 'VIEW FORM' : 'FORM'
        return (
            <FormEmpList
                type={type}
                title={title}
                empList={dataTableEmp}
                columns={this.columns}
                onClickClose={this.props.onClickClose}
            />
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
                                TALENT - CREATE FORM
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
                        {this.renderMain()}
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
        )
    }

    renderEdit() {
        let { type, data } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-chart-line"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    TALENT - {type === "edit" ? "EDIT" : "VIEW"} FORM
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
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(type, data)
                        }}>
                        <div className="padding-15px">
                            {this.renderMain()}
                        </div>
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
            </div>
        )
    }

    render() {
        let { type } = this.props
        return (
            type === 'create' ? this.renderCreate() : type === 'edit' ? this.renderEdit() : this.renderExecute()
        )
    }
}

export default formTalentEss