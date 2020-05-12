import React, { Component } from "react";
import M from "moment";
// import * as R from 'ramda'

class CreateTalent extends Component {
  constructor(props) {
    super(props);
    let { user } = this.props.auth
    this.state = {
      data: {
        "esID": user.companyID,
        "payload": [],
        "talentTPLCreational": {
          "createdBy": user.employeeID,
          "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
          "modifiedBy": user.employeeID,
          "modifiedDate": M().format('DD-MM-YYYY HH:mm:ss')
        },
        "talentTPLID": "TL-" + M(),
        "talentTPLName": "",
        "talentTPLPhotoURL": "",
        "talentTPLNotes": "",
        "talentTPLStatus": "ACTIVE"
      }
    };
  }

  render() {
    let { data } = this.state
    let { type } = this.props
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault()
              this.props.onClickSave(type, data);
            }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">Talent Template - Create Form</div>
              </div>
              <div className="col-2 content-right">
                <button
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>
            <div className="display-flex-normal">
              <div style={{ width: "35%" }}>
                <div className="padding-15px">
                  <div>
                    <div className="margin-30px">
                      <div
                        className="image image-100px image-circle background-white border-all"
                        style={{ margin: "auto" }}
                      >
                        <i className="icn fa fa-2x fa-image"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: "65%" }}>
                <div className="padding-15px">
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Template ID : {data.talentTPLID}</h4>
                    </div>
                    <div className="margin-15px">
                      <p className="txt-site txt-11 txt-primary">
                        Lorem Ipsum Dolor
                      </p>
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>
                        Template Name <span style={{ color: "red" }}>*</span>
                      </h4>
                    </div>
                    <div className="margin-15px">
                      <div className="card-date-picker">
                        <div className="double">
                          <input
                            type="text"
                            required
                            className="txt txt-sekunder-color"
                            placeholder=""
                            value={data.talentTPLName}
                            onChange={e => this.setState({ data: { ...data, talentTPLName: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Description</h4>
                      </div>
                    </div>
                    <textarea
                      type="text"
                      className="txt txt-sekunder-color"
                      rows={4}
                      placeholder={""}
                      value={data.talentTPLNotes}
                      onChange={e => this.setState({ data: { ...data, talentTPLNotes: e.target.value } })}
                    />
                  </div>
                  <div className="margin-bottom-20px">
                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                      <h4>Activation</h4>
                    </div>
                    <div className="margin-15px">
                      <label className="radio">
                        <input type="checkbox" checked={true} />
                        <span className="checkmark" />
                        <span className="txt-site txt-11 txt-bold txt-main">
                          Activate Now
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-bottom padding-15px content-right">
              <button className="btn btn-blue" type="submit">
                SAVE
              </button>
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}
export default CreateTalent;
