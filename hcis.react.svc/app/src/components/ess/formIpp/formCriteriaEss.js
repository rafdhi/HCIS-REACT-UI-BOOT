import React, { Component } from "react";
import * as R from "ramda";

class FormCriteriaEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawDataValues,
            valueMidYear: '',
            valueFullYear: '',
            valueMidYearHead: '',
            valueFullYearHead: '',

        }
    }

    componentDidMount() {
        this.setDataValue()
    }

    setDataValue() {
        let valueMidYear, valueFullYear, valueFullYearHead, valueMidYearHead = ''
        let { ocpvAppraisalByTime } = this.state.data
        if (!R.isEmpty(ocpvAppraisalByTime)) {
            if (!R.isEmpty(ocpvAppraisalByTime[0].performanceValue)) {
                valueFullYear = ocpvAppraisalByTime[0].performanceValue[0].ocpvaItemEmpValue
                valueFullYearHead = ocpvAppraisalByTime[0].performanceValue[0].ocpvaItemValue
            }
            if (!R.isEmpty(ocpvAppraisalByTime[1].performanceValue)) {
                valueMidYear = ocpvAppraisalByTime[1].performanceValue[0].ocpvaItemEmpValue
                valueMidYearHead = ocpvAppraisalByTime[0].performanceValue[0].ocpvaItemValue
            }
        }
        this.setState({ valueMidYear, valueFullYear })
    }

    render() {
        let { type, data, valueMidYear, valueFullYear, valueFullYearHead, valueMidYearHead } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                PROCESS CRITERIA - {title} FORM
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
                        <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Criteria ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.outputCriteriaProcessValuationID}
                                    />
                                </div>
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
                                        value={data.subCriteria.criteriaCategory ? data.subCriteria.criteriaCategory.bizparValue : ''}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Weight</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.activityPlanWeightPerformance}
                                    />
                                </div>
                            </div>
                            <div className='column-2'>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Category Description</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        rows={4}
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.subCriteria.criteriaExplanation}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className='column-1'>
                                <div className="margin-bottom-20px">
                                    EMPLOYEE
                                  </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Mid Year Score</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={type === 'view'}
                                        style={{ backgroundColor: type === 'view' && "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueMidYear}
                                        onChange={e => this.setState({ valueMidYear: e.target.value })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Full Year Score</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={type === 'view'}
                                        style={{ backgroundColor: type === 'view' && "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueFullYear}
                                        onChange={e => this.setState({ valueFullYear: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className='column-2'>
                                <div className="margin-bottom-20px">
                                    HEAD
                            </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Mid Year Score</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueMidYearHead}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Full Year Score</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueFullYearHead}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => {
                                            let { ocpvAppraisalByTime } = data
                                            if (ocpvAppraisalByTime) {
                                                ocpvAppraisalByTime[0].performanceValue[0].ocpvaItemEmpValue = valueFullYear
                                                ocpvAppraisalByTime[1].performanceValue[0].ocpvaItemEmpValue = valueMidYear
                                                ocpvAppraisalByTime[0].performanceValue[0].ocpvaItemValue = valueFullYearHead
                                                ocpvAppraisalByTime[1].performanceValue[0].ocpvaItemValue = valueMidYearHead
                                            }
                                            let payload = {
                                                ...data,
                                                ocpvAppraisalByTime: ocpvAppraisalByTime

                                            }
                                            this.props.onClickSave(payload)
                                        }}
                                    >
                                        <span>SAVE</span>
                                    </button>
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
export default FormCriteriaEss