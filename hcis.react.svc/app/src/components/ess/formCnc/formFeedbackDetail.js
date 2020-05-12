import React, { Component } from "react";
import { prop } from "ramda";

class formFeedbackDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            data: props.rawData,
            descriptions: []
        }
    }

    componentDidMount() {
        this.setObjDesc()
    }

    setObjDesc() {
        let { data } = this.state
        let { feedbackItems } = data
        let descriptions = {
            desc1: '',
            desc2: '',
            desc3: '',
            desc4: '',
        }
        if (feedbackItems[0]) {
            descriptions = {
                desc1: feedbackItems[0].desc1,
                desc2: feedbackItems[0].desc2,
                desc3: feedbackItems[0].desc3,
                desc4: feedbackItems[0].desc4,
            }
        }
        this.setState({ descriptions })
    }

    onSave() {
        let { data, descriptions } = this.state
        let feedbacks = []
        feedbacks.push(descriptions)
        let payload = {
            ...data,
            feedbackItems: feedbacks
        }
        this.props.onClickSave(payload)
    }

    render() {
        let { data, type, descriptions } = this.state
        let title = type === 'edit' ? 'EDIT' : 'VIEW'
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
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
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                        <div className="column-1">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Feedback ID</h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={data.feedbackPerformanceID}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Feedback Type</h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={data.feedbackType ? data.feedbackType.bizparValue : ''}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Description 1 <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={type === "view" ? true : false}
                                    style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={descriptions.desc1}
                                    onChange={e => this.setState({ descriptions: { ...descriptions, desc1: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="column-2">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Description 2 <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={type === "view" ? true : false}
                                    style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={descriptions.desc2}
                                    onChange={e => this.setState({ descriptions: { ...descriptions, desc2: e.target.value } })}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Description 3 <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={type === "view" ? true : false}
                                    style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={descriptions.desc3}
                                    onChange={e => this.setState({ descriptions: { ...descriptions, desc3: e.target.value } })}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Description 4 <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={type === "view" ? true : false}
                                    style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    value={descriptions.desc4}
                                    onChange={e => this.setState({ descriptions: { ...descriptions, desc4: e.target.value } })}
                                />
                            </div>
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
                                        onClick={() => this.onSave()}
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
                </div>
            </div>
        )
    }
}

export default formFeedbackDetail