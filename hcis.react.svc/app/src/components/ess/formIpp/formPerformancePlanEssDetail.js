import React, { Component } from "react";

class FormPerformancePlanEssDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            dataConfig: props.dataConfig,
            valueFullYear: '',
            valueMidYear: '',
        }
    }

    setValue(value) {
        let valueFullYear = value.valueFullYear
        let valueMidYear = value.valueMidYear
        this.setState({ valueFullYear, valueMidYear })
    }

    componentDidMount() {
        this.setValue(this.props.performancePlanValueDTO)
    }

    render() {
        let { type, dataConfig, valueFullYear, valueMidYear } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                ACTIVITY PLAN - {title} FORM
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
                                    // value={dataConfig.ippID}
                                    />
                                </div> */}
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
                            </div>
                            <div className='column-2'>
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
                                        value={dataConfig.activityPlanWeight}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Unit of Measurement</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={dataConfig.activityPlanUOM === 3 ? 'MANHOURS' : dataConfig.activityPlanUOM === 2 ? 'MANDAY' : 'MANMONTH'}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Mid Year Target <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        required
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
                                            <h4>Full Year Target <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        required
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
                                            let { activityPlanPerformanceByTime } = dataConfig
                                            if (activityPlanPerformanceByTime) {
                                                activityPlanPerformanceByTime.map((value) => {
                                                    switch (value.performancePlanComponent.bizparKey) {
                                                        case 'IPPPERFPLAN-002':
                                                            value.performancePlanEmpValue = valueFullYear
                                                            break;
                                                        case 'IPPPERFPLAN-001':
                                                            value.performancePlanEmpValue = valueMidYear
                                                            break;
                                                    }
                                                })
                                            }
                                            let payload = {
                                                ...dataConfig,
                                                activityPlanPerformanceByTime: activityPlanPerformanceByTime

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
export default FormPerformancePlanEssDetail