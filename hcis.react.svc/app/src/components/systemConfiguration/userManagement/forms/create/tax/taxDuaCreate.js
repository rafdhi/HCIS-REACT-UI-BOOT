import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../../modules/popup/DropDown'

class TaxDuaCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Tax Template Header
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="a-s-p-mid a-s-p-pad">
                            <div className="margin-bottom-5px display-flex-normal padding-15px border-bottom">
                                <i className="fa fa-lg fa-calendar margin-right-10px margin-top-5px"></i>
                                <h1 className="txt-site txt-18 txt-main ">Tax Template Header</h1>
                            </div>

                            <div className="display-flex-normal">
                                <div style={{ width: '49.99%' }} >
                                    <div className="padding-15px">
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>TID</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                <div className="card-date-picker">
                                                    <div className="double">
                                                        <input
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            placeholder="AUTO-GENERATED-00001"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Name</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                <div className="card-date-picker">
                                                    <div className="double">
                                                        <input
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            placeholder="AUTO-GENERATED-00001"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Periode Date</h3>
                                                <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                Period of time traction
                                            </div>
                                            <div className="margin-15px display-flex-normal">
                                                <input
                                                    type="time"
                                                    placeholder="Time"
                                                    className="txt txt-sekunder-color"
                                                />
                                                <div className="txt-site txt-11 txt-primary margin-top-10px margin-left-10px margin-right-10px">
                                                    To
													</div>
                                                <input
                                                    type="time"
                                                    placeholder="Time"
                                                    className="txt txt-sekunder-color"
                                                />
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Standard</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                {/* untuk contoh lihat configuration corporate time */}
                                                <DropDown 
                                                    title="-- please select holiday type --" 
                                                    onChange={(dt) => {
                                                        console.log(dt)
                                                    }}
                                                    data={[
                                                        { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                        { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                        { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                        { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                        { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                        { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                    ]} />
                                                {/* <select className="slc slc-sekunder">
                                                    <option value="">-- please select holiday type --</option>
                                                    <option>DJP</option>
                                                </select> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ width: '49.99%' }} >
                                    <div className="padding-15px">
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Activation</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                <label className="radio">
                                                    <input type="checkbox" name="all-day"
                                                    />
                                                    <span className="checkmark" />
                                                    <span className="txt-site txt-11 txt-bold txt-main">
                                                        Activate Now
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Default</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                <label className="radio">
                                                    <input type="checkbox" name="all-day"
                                                    />
                                                    <span className="checkmark" />
                                                    <span className="txt-site txt-11 txt-bold txt-main">
                                                        Activate Now
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>DJP Tax Template</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The date of current status
                                        </div>
                                            <div className="margin-15px">
                                                <div className="card-date-picker">
                                                    <div className="double">
                                                        <input
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            placeholder="TYPE_HOLDING"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="margin-bottom-30px">
                                            <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                                <h3>Note</h3>
                                                <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                            </div>
                                            <div className="txt-site txt-11 txt-primary margin-10px">
                                                The ID of Corporate Organisation Template
                                            </div>
                                            <div className="margin-15px">
                                                <div className="card-date-picker">
                                                    <textarea
                                                        row={10}
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder="Jln. Satrio"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-top padding-15px content-right">
                                <button
                                    type="button"
                                    onClick={this.props.onClickClose}
                                    className="btn btn-sekunder margin-right-10px">
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={this.props.onClickSave}
                                    className="btn btn-green">
                                    Save
                                </button>
                            </div>
                        </div>

                        <ReactTooltip />

                    </form>

                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}

export default TaxDuaCreate