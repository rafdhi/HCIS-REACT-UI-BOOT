import React, { Component } from "react"
import M from 'moment'
import * as R from 'ramda'
import NumberFormat from 'react-number-format'
import CalendarPicker from '../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
    "applicantWorkExperienceID": "WE-" + Date.now(),
    "workExperience": "",
    "workExperienceCity": "",
    "workExperienceCompany": "",
    "workExperienceCompanyTelpNumber": "",
    "workExperienceContactPerson": "",
    "workExperienceDescription": "",
    "workExperienceEndDate": "",
    "workExperiencePosition": "",
    "workExperienceResignationReason": "",
    "workExperienceSalary": "",
    "workExperienceStartDate": "",
    "applicantWorkExperienceContactPersons": {
        "contactPersonName": "",
        "contactPersonPosition": "",
        "contactPersonTelpNumber": ""
    }
}

class FormMedical extends Component {
    constructor(props) {
        super(props)
        let { applicantDataWorkExp } = this.props

        this.state = {
            applicantDataWorkExp: applicantDataWorkExp ?
                {
                    ...applicantDataWorkExp,
                    workExperienceStartDate: M(applicantDataWorkExp.workExperienceStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    workExperienceEndDate: M(applicantDataWorkExp.workExperienceEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
                } : defaultPayload
        }
    }

    render() {
        return (
            <div className='app-popup app-popup-show'>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Medical Record – Create Form"
                                    : this.props.type === "update"
                                        ? "Medical Record – Edit Form"
                                        : "Medical Record – View Form"}
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
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        if (!R.isEmpty(this.state.applicantDataWorkExp.workExperienceStartDate) && !R.isEmpty(this.state.applicantDataWorkExp.workExperienceEndDate) && (this.state.applicantDataWorkExp.workExperienceEndDate < this.state.applicantDataWorkExp.workExperienceStartDate)) return alert('End Date Should be Greater Than Start Date.')
                        if (R.isEmpty(this.state.applicantDataWorkExp.workExperienceStartDate) ||
                            R.isEmpty(this.state.applicantDataWorkExp.workExperienceEndDate)) return alert('Date is Required')
                        this.props.onClickSave(this.state.applicantDataWorkExp)
                    }}
                    >  
                        <div className="padding-15px grid grid-2x grid-mobile-none gap-20px" >
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Medical ID <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={this.state.applicantDataWorkExp.workExperienceCompany}
                                        onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceCompany: e.target.value } })}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Disesase Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={this.state.applicantDataWorkExp.workExperienceDescription}
                                        onChange={e => this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, workExperienceDescription: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Hospital Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons.contactPersonTelpNumber}
                                        onChange={e => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, applicantWorkExperienceContactPersons: { ...this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons, contactPersonTelpNumber: e.target.value } } })
                                        }}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Year</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons.contactPersonTelpNumber}
                                        onChange={e => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ applicantDataWorkExp: { ...this.state.applicantDataWorkExp, applicantWorkExperienceContactPersons: { ...this.state.applicantDataWorkExp.applicantWorkExperienceContactPersons, contactPersonTelpNumber: e.target.value } } })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <Button
                                            state={this.props.sendState}
                                            style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 80, marginLeft: '379px' }}
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </Button>
                                    ) : null}
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.onClickClose()}
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
export default FormMedical;
