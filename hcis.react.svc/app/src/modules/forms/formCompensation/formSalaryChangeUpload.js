import React, { Component } from 'react'

class SalaryChangeUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                SALARY CHANGE - UPLOAD
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="border-bottom padding-15px grid-mobile-none gap-20px">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        ID Component
                                    </span>
                                </div>
                                <select className="cf-select slc slc-sekunder">
                                    <option value="">-- please select id component --</option>
                                    <option value="">ID 1</option>
                                </select>
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Change Type
                                    </span>
                                </div>
                                <select className="cf-select slc slc-sekunder">
                                    <option value="">-- please select change type --</option>
                                    <option value="">Promosi</option>
                                </select>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        File <span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-blue"
                                    onClick={this.props.onClickSave}> Upload </button>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Information
                                    </span>
                                </div>
                                <textarea
                                    rows={5}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="padding-15px">
                                <div className="grid grid-2x">
                                    <div className="col-1"></div>
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={this.props.onClickSave}>
                                            <span>SAVE</span>
                                        </button>
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
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SalaryChangeUpload