import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LinearProgress from '@material-ui/core/LinearProgress'
import DropDown from '../../modules/popup/DropDown'
import CalendarPicker from '../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'
import M from 'moment'
import Api from '../../Services/Api'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

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
                loanRequestDate: M(props.payload.loanRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                updatedBy: "SYSTEM"
            } : {
                ...defaultPayload
            },
            dataStatistic: [],
            dataTable: [],
            visibleProgress: false
        }
    }

    columns = [
        "No",
        "Loan ID",
        "Loan Amount",
        "Loan Tenor",
        "Name",
        "Description",
        "Loan Installment",
        "Total Paid Amount",
        "Total Paid Tenor",
        "Unpaid Amount",
        "Total Unpaid Tenor"
    ]

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
        let dataDetail = this.state.dataDetail
        if (dataDetail) {
            this.getDataStatistic(dataDetail.employeeID)
        }
    }

    componentDidUpdate() {
        // console.log(this.state.dataDetail)
    }

    async getDataStatistic(employeeID) {
        this.setState({visibleProgress: !this.state.visibleProgress})

        let responseStatistic = {
            "loanStatisticID": "",
            "loanStatisticEmpID": "",
            "loanStatisticEmpName": "",
            "loanStatisticEmpBaseSalary": "",
            "loanStatisticEmpPosition": "",
            "loanStatisticCurrentDate": "",
            "loanStatisticCurrentCommitment": "",
            "loanStatisticCurrentInstallment": "",
            "loanStatisticCurrentDSR": "",
            "loanStatisticAvailableLoanAmount": "",
            "loanStatisticLoanInfoItems": []
        }
        let response = await Api.create("LOAN_QUERY").getAllLoanStatisticByEmpid(employeeID)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data
            responseStatistic = {
                ...responseStatistic,
                loanStatisticID: dataTable.loanStatisticID,
                loanStatisticEmpID: dataTable.loanStatisticEmpID,
                loanStatisticEmpName: dataTable.loanStatisticEmpName,
                loanStatisticEmpBaseSalary: dataTable.loanStatisticEmpBaseSalary,
                loanStatisticEmpPosition: dataTable.loanStatisticEmpPosition,
                loanStatisticCurrentDate: dataTable.loanStatisticCurrentDate,
                loanStatisticCurrentCommitment: dataTable.loanStatisticCurrentCommitment,
                loanStatisticCurrentInstallment: dataTable.loanStatisticCurrentInstallment,
                loanStatisticCurrentDSR: dataTable.loanStatisticCurrentDSR,
                loanStatisticAvailableLoanAmount: dataTable.loanStatisticAvailableLoanAmount,
                loanStatisticLoanInfoItems: dataTable.loanStatisticLoanInfoItems
            }
            this.setState({visibleProgress: !this.state.visibleProgress})
        } else {
            responseStatistic = {
                ...responseStatistic
            }
        }

        let dataTable = responseStatistic.loanStatisticLoanInfoItems.map((value, index) => {
            let {
                loanInfoLoanID, 
                loanInfoLoanAmount, 
                loanInfoLoanTenor, 
                loanInfoName, 
                loanInfoDescription, 
                loanInfoLoanInstallment,
                loanInfoTotalPaidAmount,
                loanInfoTotalPaidTenor,
                loanInfoUnpaidAmount,
                loanInfoTotalUnpaidTenor
            } = value

            return [
                index += 1,
                loanInfoLoanID,
                loanInfoLoanAmount,
                loanInfoLoanTenor,
                loanInfoName,
                loanInfoDescription,
                loanInfoLoanInstallment,
                loanInfoTotalPaidAmount,
                loanInfoTotalPaidTenor,
                loanInfoUnpaidAmount,
                loanInfoTotalUnpaidTenor
            ]

        })

        console.log(response.data.data)
        this.setState({dataTable, dataStatistic: responseStatistic})
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
                                Loan - Statistic
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

                    {visibleProgress && <LinearProgress style={{height: '3px'}} />}

                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Statistic ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={dataStatistic.loanStatisticID}
                                    />
                                </div>
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
                                        value={dataStatistic.loanStatisticEmpID}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={dataStatistic.loanStatisticEmpName}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Base Salary</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataStatistic.loanStatisticEmpBaseSalary}
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current DSR</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataStatistic.loanStatisticCurrentDSR}
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Commitment</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataStatistic.loanStatisticCurrentCommitment}
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Installment/Month</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataStatistic.loanStatisticCurrentInstallment}
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Available Loan Ammount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        value={dataStatistic.loanStatisticAvailableLoanAmount}
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px border-bottom">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title={'Loan Statistic Loan Info Items'}
                                    subtitle={'Loan Statistic Loan Info Items'}
                                    data={this.state.dataTable}
                                    columns={this.columns}
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
