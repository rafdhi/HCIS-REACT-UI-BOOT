import React, { Component } from "react"
import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'
import M from 'moment'

let defaultPayload = {
    "employeeID": "",
    "loanAmount": 0,
    "loanApprovalDate": "",
    "loanID": "",
    "loanInstallmentAmount": 0,
    "loanReason": "",
    "loanRequestDate": "",
    "loanStatus": "ACTIVE",
    "loanTenor": 0,
    "loanType": "",
    "updatedBy": "",
    "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
}

class formEditLoan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataDetail: props.payload ? {
                ...props.payload,
                loanApprovalDate: props.payload.loanApprovalDate ? M(props.payload.loanApprovalDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
                loanRequestDate: props.payload.loanRequestDate ? M(props.payload.loanRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD") : null,
                updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                updatedBy: "SYSTEM"
            } : {
                ...defaultPayload
            },
            dataStatistic: [],
            dataTable: [],
        }
    }

    bizparStatus = [
        { bizparKey: 'ACTIVE', bizparValue: 'ACTIVE' },
        { bizparKey: 'INACTIVE', bizparValue: 'INACTIVE' },
    ]

    bizparType = [
        // { bizparKey: 'APPROVED', bizparValue: 'APPROVED' },
        // { bizparKey: 'REJECTED', bizparValue: 'REJECTED' },
        // { bizparKey: 'WAITING_APPROVAL', bizparValue: 'WAITING APPROVAL' },
        // { bizparKey: 'REVISED', bizparValue: 'REVISED' },
        // { bizparKey: 'INITIATE', bizparValue: 'INITIATE' }
        { bizparKey: 'PAYCAT-002-PAYTYP-008', bizparValue: 'PAYCAT-002-PAYTYP-008' }
    ]

    componentDidMount() {
        // console.log(this.state.dataDetail)
    }

    componentDidUpdate() {
        // console.log(this.state.dataDetail)
    }

    render() {
        let {dataDetail, dataStatistic, visibleProgress} = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "update"
                                    ? "Loan - Edit Form"
                                    : "Loan - View Form"}
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
                            this.props.onClickSave(this.state.dataDetail)
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                {this.props.type !== "create" ? (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Loan ID</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={dataDetail.loanID}
                                        />
                                    </div>
                                ) : null}

                                {this.props.type !== "create" ? (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee ID</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={dataDetail.employeeID}
                                        />
                                    </div>
                                ) : null}
                                
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Approval Date</h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        date={dataDetail.loanApprovalDate}
                                        disabled={this.props.type === 'view' ? true : false}
                                        onChange={e => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanApprovalDate: e
                                            }
                                        })} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Request Date</h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        date={dataDetail.loanRequestDate}
                                        disabled={this.props.type === 'view' ? true : false}
                                        onChange={e => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanRequestDate: e
                                            }
                                        })} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Reason</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={dataDetail.loanReason}
                                        onChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanReason: dt.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Status</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- INITIATE--"
                                        value={dataDetail.loanStatus}
                                        disabled={this.props.type === "view" ? true : false}
                                        onChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanStatus: dt
                                            }
                                        })}
                                        type='bizpar'
                                        data={this.bizparStatus}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Type</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- INITIATE--"
                                        value={dataDetail.loanType}
                                        disabled={this.props.type === "view" ? true : false}
                                        onChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanType: dt
                                            }
                                        })}
                                        type='bizpar'
                                        data={this.bizparType}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Tenor</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        // thousandSeparator={true}
                                        required
                                        value={dataDetail.loanTenor}
                                        onValueChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanTenor: dt.formattedValue
                                            }
                                        })} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Ammount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataDetail.loanAmount}
                                        onValueChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanAmount: dt.formattedValue
                                            }
                                        })} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Installment Ammount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataDetail.loanInstallmentAmount}
                                        onValueChange={(dt) => this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                loanInstallmentAmount: dt.formattedValue
                                            }
                                        })} />
                                </div>

                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
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
                                        className="btn btn-blue"
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
            </div>
        );
    }
}
export default formEditLoan;
