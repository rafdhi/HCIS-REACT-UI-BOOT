import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import M from 'moment'
import uuid from 'uuid'

const defaultPayload = {
    "createdBy": "",
    "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
    "recordID": uuid.v1(),
    "trainingBudget": 0,
    "trainingBudgetDescription": "",
    "trainingBudgetID": "",
    "trainingBudgetName": "",
    "trainingBudgetPeriod": 0,
    "trainingBudgetRemainingBudget": 0,
    "trainingBudgetStatus": "ACTIVE",
    "trainingBudgetType": "TECH",
    "updatedBy": "",
    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
}

class TrainingBudgetCreateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
            data: props.data ? props.data : { ...defaultPayload, trainingBudgetID: "TRNB-" + M() }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) return this.setState({ data: this.props.data })
    }

    renderForm() {
        let { data, type } = this.state
        return (
            <div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Budget ID</h4>
                        </div>
                    </div>
                    <input
                        style={{ backgroundColor: "#E6E6E6" }}
                        readOnly
                        className="txt txt-sekunder-color"
                        type="text"
                        value={data.trainingBudgetID}
                    ></input>
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Budget Name <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <input
                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                        readOnly={type === 'view'}
                        className="txt txt-sekunder-color"
                        type="text"
                        required
                        onChange={(e) => this.setState({ data: { ...data, trainingBudgetName: e.target.value } })}
                        value={data.trainingBudgetName}
                    ></input>
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Period <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <input
                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                        readOnly={type === 'view'}
                        className="txt txt-sekunder-color"
                        type="text"
                        required
                        onChange={e => {
                            if (isNaN(e.target.value)) return true
                            this.setState({ data: { ...data, trainingBudgetPeriod: e.target.value } })
                        }}
                        value={data.trainingBudgetPeriod}
                    ></input>
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Budget <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <NumberFormat
                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                        className="txt txt-sekunder-color"
                        thousandSeparator={true}
                        value={data.trainingBudget}
                        required
                        onValueChange={(e) => this.setState({ data: { ...data, trainingBudget: e.formattedValue } })} />
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Remaining Budget <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <NumberFormat
                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                        className="txt txt-sekunder-color"
                        thousandSeparator={true}
                        value={data.trainingBudgetRemainingBudget}
                        required
                        onValueChange={(e) => this.setState({ data: { ...data, trainingBudgetRemainingBudget: e.formattedValue } })} />
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Budget Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <input
                        style={{ backgroundColor: "#E6E6E6" }}
                        readOnly
                        className="txt txt-sekunder-color"
                        type="text"
                        required
                        value={data.trainingBudgetType}
                    ></input>
                </div>
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Description</h4>
                        </div>
                    </div>
                    <textarea
                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                        readOnly={type === 'view'}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        rows={4}
                        onChange={e => this.setState({ data: { ...data, trainingBudgetDescription: e.target.value } })}
                        value={data.trainingBudgetDescription}
                    />
                </div>
                {this.renderFooter()}
            </div >
        )
    }

    renderFooter() {
        let { type } = this.state
        return (
            <div className="padding-15px">
                <div className="grid">
                    <div className="content-right">
                        {type !== 'view' && (
                            <button
                                className="btn btn-blue"
                                type="submit">
                                <span>SUBMIT</span>
                            </button>
                        )}
                        <button
                            style={{ marginLeft: "15px" }}
                            className="btn btn-primary"
                            type="button"
                            onClick={this.props.onClickClose}>
                            <span>CLOSE</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        let { data, type } = this.state
        return (
            type === "create" ?
                <div className="app-popup app-popup-show">
                    <div className="padding-top-20px" />
                    <div className="popup-content-small background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    Training Budget - Create Form
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={this.props.onClickClose}>
                                    <i className="fa fa-lg fa-times" />
                                </button>
                            </div>
                        </div>
                        <div className="padding-15px">
                            <form action="#" onSubmit={(e) => {
                                e.preventDefault()
                                this.props.onClickSave(data)
                            }}>
                                <div className="display-flex-normals">
                                    {this.renderForm()}
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="padding-bottom-20px" />
                </div> :
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: '140%' }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-tasks "></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        Training Budget  - {type === "view" ? "View Form" : "Edit Form"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={this.props.onClickClose}>
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(data)
                    }}>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="display-flex-normals margin-bottom-10px">
                                <div className="padding-top-15px padding-bottom-15px">
                                    {this.renderForm()}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        )
    }
}

export default TrainingBudgetCreateForm 