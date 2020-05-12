import React, { Component } from "react";

class FormPerformanceAppraisalScoreEssDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            dataConfig: props.dataConfig,
        }
    }

    setValue(value) {
        let valueFullYear = value.valueFullYear
        let valueMidYear = value.valueMidYear
        let valueMidYearHead = value.valueMidYearHead
        let valueFullYearHead = value.valueFullYearHead
        this.setState({ valueFullYear, valueMidYear, valueMidYearHead, valueFullYearHead })
    }

    componentDidMount() {
        this.setValue(this.props.performancePlanValueDTO)
    }

    render() {
        let { dataConfig, type, valueFullYear, valueMidYear, valueFullYearHead, valueMidYearHead } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                PERFORMANCE APPRAISAL SCORE - {title} FORM
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
                                        value={dataConfig.outputCriteriaValuationID}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
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
                                        value={dataConfig.ippID}
                                    />
                                </div>
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
                                        style={{ backgroundColor: type === 'view' && "#E6E6E6" }}
                                        readOnly={type === 'view'}
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
                                        value={dataConfig.activityPlanCategory ? dataConfig.activityPlanCategory.bizparValue : ''}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Activity Plan</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={dataConfig.activityPlanSection}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    HEAD
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Mid Year Achievement</h4>
                                        </div>
                                    </div>
                                    <input

                                        style={{ backgroundColor: type === 'view' && "#E6E6E6" }}
                                        readOnly={type === 'view'}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueMidYearHead}
                                        onChange={e => this.setState({ valueMidYearHead: e.target.value })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Full Year Achievement</h4>
                                        </div>
                                    </div>
                                    <input

                                        readOnly={type === 'view'}
                                        style={{ backgroundColor: type === 'view' && "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={valueFullYearHead}
                                        onChange={e => this.setState({ valueFullYearHead: e.target.value })}
                                    />
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
                                    // value={data.ippID}
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
                                            let { activityPlanPerformanceAppraisalByTime } = dataConfig
                                            if (activityPlanPerformanceAppraisalByTime !== []) {
                                                activityPlanPerformanceAppraisalByTime.map((value) => {
                                                    switch (value.achievement.bizparKey) {
                                                        case 'IPPPERFAPPACH-002':
                                                            value.achievementEmpValue = valueFullYear
                                                            value.achievementValue = valueFullYearHead
                                                            break;
                                                        case 'IPPPERFAPPACH-001':
                                                            value.achievementEmpValue = valueMidYear
                                                            value.achievementValue = valueMidYearHead
                                                            break;
                                                    }
                                                })
                                            }
                                            let payload = {
                                                ...dataConfig,
                                                activityPlanPerformanceAppraisalByTime: activityPlanPerformanceAppraisalByTime

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
export default FormPerformanceAppraisalScoreEssDetail