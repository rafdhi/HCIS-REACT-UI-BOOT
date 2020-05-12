import React, { Component } from "react";
import M from "moment";
import { connect } from "react-redux";

const dataCreate = {
  "ippTPLID": "",
  "ippTPLName": "",
  "ippTPLPhotoURL": "",
  "company": "",
  "ippTPLNotes": "",
  "ippTPLData": {
    "ippTPLDataID": "",
    "header": {
      "headerID": "",
      "headerComponents": []
    },
    "contentSection": {
      "mainContentID": "",
      "outputCriteria": {
        "ippOutputCriteriaValuationID": "",
        "ippOCVItems": [],
        "totalWeight": ''
      },
      "processCriteria": {
        "ippOutputCriteriaProcessValuationID": "",
        "ippOCVItems": [],
        "totalWeight": ''
      }
    },
    "computeSection": {
      "ippComputeSectionID": "",
      "computeItems": []
    },
    "signageSections": [
      {
        "ippSignageSectionID": "",
        "signs": []
      }
    ]
  },
  "ippTPLStatus": "ACTIVE",
  "ippTPLCreational": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": null,
    "modifiedDate": null
  }
}

class FormPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      data: props.rawData ? props.rawData : {
        ...dataCreate,
        ippTPLID: 'IPP-' + M(),
        company: props.auth.user.companyID,
        ippTPLData: {
          ...dataCreate.ippTPLData,
          ippTPLDataID: 'IPPD-' + M(),
          header: {
            ...dataCreate.ippTPLData.header,
            headerID: 'IPPH-' + M()
          },
          contentSection: {
            ...dataCreate.ippTPLData.contentSection,
            mainContentID: 'IPPM-' + M(),
            outputCriteria: {
              ...dataCreate.ippTPLData.contentSection.outputCriteria,
              ippOutputCriteriaValuationID: 'IPPO-' + M()
            },
            processCriteria: {
              ...dataCreate.ippTPLData.contentSection.processCriteria,
              ippOutputCriteriaProcessValuationID: 'IPPP-' + M()
            },
          },
          computeSection: {
            ...dataCreate.ippTPLData.computeSection,
            ippComputeSectionID: 'IPPC-' + M()
          },
          signageSections: [
            {
              ...dataCreate.ippTPLData.signageSections[0],
              ippSignageSectionID: 'IPPC-' + M()
            }
          ],
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawData !== prevProps.rawData) {
      this.setState({ data: this.props.rawData })
    }
  }

  renderFormCreate = () => {
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <form
            action="#"
            onSubmit={e => {
              e.preventDefault()
              data = {
                ...data,
                ippTPLCreational: {
                  ...data.ippTPLCreational,
                  createdBy: this.props.auth.user.employeeID
                }
              }
              this.props.onClickSave(data)
            }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">IPP Template - Create Form</div>
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
                      <h4>Template ID: {data.ippTPLID}</h4>
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
                            value={data.ippTPLName}
                            onChange={e => this.setState({ data: { ...data, ippTPLName: e.target.value } })}
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
                      value={data.ippTPLNotes}
                      onChange={e => this.setState({ data: { ...data, ippTPLNotes: e.target.value } })}
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
      </div>
    );
  };

  parseDataEdit(value) {
    let data = ''
    let { header, contentSection, computeSection, signageSections } = value.ippTPLData
    let { headerComponents } = header
    let { ippOCVItems } = contentSection.outputCriteria
    let ippOCVItemsProcessCriteria = contentSection.processCriteria.ippOCVItems
    let { computeItems } = computeSection
    let { signs } = signageSections[0]

    headerComponents = !headerComponents ? [] : headerComponents.map((value) => {
      const { headerDetailID, headerDetailComponent, headerDetailValue } = value
      return {
        headerDetailID: headerDetailID,
        headerDetailComponent: headerDetailComponent ? headerDetailComponent.bizparKey ? headerDetailComponent.bizparKey : headerDetailComponent : '',
        headerDetailValue: headerDetailValue
      }
    })

    ippOCVItems = !ippOCVItems ? [] : ippOCVItems.map((value) => {
      const { outputCriteriaValuationID, activityPlanSection, activityPlanWeightPerformance, activityPlanCategory, activityPlanDescription, activityPlanWeight,
        activityPlanUOM, activityPlanPerformanceByTime, activityPlanPerformanceAppraisalByTime, totalValue } = value
      let detail = !activityPlanPerformanceByTime ? [] : activityPlanPerformanceByTime.map((byTime) => {
        const { performancePlanID, performancePlanComponent, performancePlanValue } = byTime
        return {
          performancePlanID: performancePlanID,
          performancePlanComponent: performancePlanComponent ? performancePlanComponent.bizparKey ? performancePlanComponent.bizparKey : performancePlanComponent : '',
          performancePlanValue: performancePlanValue
        }
      })
      let detailAppraisal = !activityPlanPerformanceAppraisalByTime ? [] : activityPlanPerformanceAppraisalByTime.map((appraisal) => {
        const { activityPlanPerformanceAppraisalID, appraisalType, achievement, achievementValue, performanceValue } = appraisal
        let detailsPerfValue = !performanceValue ? [] : performanceValue.map((perfValue) => {
          const { appaItemID, appaItemComponent, appaItemValue } = perfValue
          return {
            appaItemComponent: appaItemComponent ? appaItemComponent.bizparKey ? appaItemComponent.bizparKey : appaItemComponent : '',
            appaItemID: appaItemID,
            appaItemValue: appaItemValue
          }
        })
        return {
          activityPlanPerformanceAppraisalID: activityPlanPerformanceAppraisalID,
          appraisalType: appraisalType ? appraisalType.bizparKey ? appraisalType.bizparKey : appraisalType : '',
          achievement: achievement ? achievement.bizparKey ? achievement.bizparKey : achievement : '',
          achievementValue: achievementValue,
          performanceValue: detailsPerfValue
        }
      })
      return {
        outputCriteriaValuationID: outputCriteriaValuationID,
        activityPlanSection: activityPlanSection ? activityPlanSection.bizparKey ? activityPlanSection.bizparKey : activityPlanSection : '',
        activityPlanCategory: activityPlanCategory ? activityPlanCategory.bizparKey ? activityPlanCategory.bizparKey : activityPlanCategory : '',
        activityPlanWeightPerformance: activityPlanWeightPerformance,
        activityPlanDescription: activityPlanDescription,
        activityPlanWeight: activityPlanWeight,
        activityPlanUOM: activityPlanUOM,
        totalValue: totalValue,
        activityPlanPerformanceByTime: detail,
        activityPlanPerformanceAppraisalByTime: detailAppraisal
      }
    })

    ippOCVItemsProcessCriteria = !ippOCVItemsProcessCriteria ? [] : ippOCVItemsProcessCriteria.map((value) => {
      const { outputCriteriaProcessValuationID, activityPlanSection, activityPlanWeightPerformance, subCriteria, ocpvAppraisalByTime } = value
      let parseSubCriteria = {
        outputCriteriaProcessValuationSubcriteriaID: subCriteria.outputCriteriaProcessValuationSubcriteriaID,
        criteriaExplanation: subCriteria.criteriaExplanation,
        criteriaCategory: subCriteria.criteriaCategory ? subCriteria.criteriaCategory.bizparKey ? subCriteria.criteriaCategory.bizparKey : subCriteria.criteriaCategory : '',
      }
      let detailsOcpvAppraisalByTime = !ocpvAppraisalByTime ? [] : ocpvAppraisalByTime.map((valueDetailSub) => {
        const { outputCriteriaProcessValuationAppraisalID, performanceWeight, performanceType, performanceValue } = valueDetailSub
        let detailsPerformanceValue = !performanceValue ? [] : performanceValue.map((valueDetailPerf) => {
          const { ocpvaItemID, ocpvaItemComponent, ocpvaItemValue } = valueDetailPerf
          return {
            ocpvaItemID: ocpvaItemID,
            ocpvaItemValue: ocpvaItemValue,
            ocpvaItemComponent: ocpvaItemComponent ? ocpvaItemComponent.bizparKey ? ocpvaItemComponent.bizparKey : ocpvaItemComponent : '',
          }
        })
        return {
          outputCriteriaProcessValuationAppraisalID: outputCriteriaProcessValuationAppraisalID,
          performanceWeight: performanceWeight,
          performanceType: performanceType ? performanceType.bizparKey ? performanceType.bizparKey : performanceType : '',
          performanceValue: detailsPerformanceValue
        }
      })
      return {
        outputCriteriaProcessValuationID: outputCriteriaProcessValuationID,
        activityPlanSection: activityPlanSection ? activityPlanSection.bizparKey ? activityPlanSection.bizparKey : activityPlanSection : '',
        activityPlanWeightPerformance: activityPlanWeightPerformance,
        subCriteria: parseSubCriteria,
        ocpvAppraisalByTime: detailsOcpvAppraisalByTime
      }
    })

    computeItems = !computeItems ? [] : computeItems.map((data) => {
      const { computeCriterias, computeID, computeType, gradePerformance, paYear } = data
      let details = !computeCriterias ? [] : computeCriterias.map((dataCrit) => {
        const { computeItemID, criteria, weight, value, totalValue } = dataCrit
        return {
          computeItemID: computeItemID,
          criteria: criteria ? criteria.bizparKey ? criteria.bizparKey : criteria : '',
          weight: weight,
          value: value,
          totalValue: totalValue
        }
      })
      return {
        computeID: computeID,
        computeType: computeType ? computeType.bizparKey ? computeType.bizparKey : computeType : '',
        gradePerformance: gradePerformance ? gradePerformance.bizparKey ? gradePerformance.bizparKey : gradePerformance : '',
        computeCriterias: details,
        paYear: paYear
      }
    })

    signs = !signs ? [] : signs.map((value) => {
      const { signageID, signType, signPics } = value
      let detailsSignPics = !signPics ? [] : signPics.map((values) => {
        const { signageItemID, category, items } = values
        let detailsItem = !items ? [] : items.map((valuess) => {
          const { signageSubItemID, signageSubItemComponent, signageSubItemValue } = valuess
          return {
            signageSubItemID: signageSubItemID,
            signageSubItemComponent: signageSubItemComponent ? signageSubItemComponent.bizparKey ? signageSubItemComponent.bizparKey : signageSubItemComponent : '',
            signageSubItemValue: signageSubItemValue
          }
        })
        return {
          signageItemID: signageItemID,
          category: category ? category.bizparKey ? category.bizparKey : category : '',
          items: detailsItem
        }
      })
      return {
        signageID: signageID,
        signType: signType ? signType.bizparKey ? signType.bizparKey : signType : '',
        signPics: detailsSignPics
      }
    })

    data = {
      ...value,
      company: value.company.esID,
      ippTPLCreational: {
        ...value.ippTPLCreational,
        modifiedBy: this.props.auth.user.employeeID,
        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss"),
      },
      ippTPLData: {
        ...value.ippTPLData,
        header: {
          ...header,
          headerComponents: headerComponents
        },
        contentSection: {
          ...contentSection,
          outputCriteria: {
            ...contentSection.outputCriteria,
            ippOCVItems: ippOCVItems
          },
          processCriteria: {
            ...contentSection.processCriteria,
            ippOCVItems: ippOCVItemsProcessCriteria
          }
        },
        computeSection: {
          ...computeSection,
          computeItems: computeItems
        },
        signageSections: [
          {
            ...signageSections[0],
            signs: signs
          }
        ]
      }
    }

    return data
  }

  renderFormEdit = () => {
    let { data } = this.state
    return (
      <form
        action="#"
        onSubmit={e => {
          e.preventDefault()
          // return console.log(JSON.stringify(this.parseDataEdit(data)))
          this.props.onClickSave(this.parseDataEdit(data));
        }}
      >
        <div>
          <div>
            <div className="margin-30px">
              <div
                className="image image-100px image-circle background-white border-all"
                style={{ margin: "auto" }}
              >
                <i className="icn fa fa-2x fa-image"></i>
              </div>
            </div>

            <div className="txt-site txt-13 txt-bold txt-main content-center">
              <input
                type="file"
                id="pick-image"
                style={{ display: "none" }}
              // onChange={this.handleChange.bind(this)}
              />
              <label htmlFor="pick-image">
                <div className="btn btn-div btn-grey-dark">
                  <i className="fa fa-1x fa-upload margin-right-10px"></i>
                  Pick Image
                </div>
              </label>
            </div>

            <div className="margin-15px">
              <div className="margin-bottom-20px">
                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                  <h4>Template ID: {data.ippTPLID}</h4>
                </div>
                <div className="margin-5px">
                  <p className="txt-site txt-11 txt-primary">
                    The IPP menu is to be used to create IPP template for
                    employee.
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
                        value={data.ippTPLName}
                        onChange={(e) => this.setState({ data: { ...data, ippTPLName: e.target.value } })}
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
                  value={data.ippTPLNotes}
                  onChange={(e) => this.setState({ data: { ...data, ippTPLNotes: e.target.value } })}
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

        <div className="margin-15px content-right">
          <button className="btn btn-blue" type="submit">
            SAVE
          </button>
        </div>

        <div className="border-bottom"></div>
      </form>
    );
  };

  render() {
    let { type } = this.props;
    return (
      <div>
        {type === "create" ? this.renderFormCreate() : this.renderFormEdit()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, null)(FormPerformance);
