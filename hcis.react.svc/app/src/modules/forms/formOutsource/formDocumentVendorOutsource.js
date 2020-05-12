import React, { Component } from "react"
// import FileViewer from 'react-file-viewer'
// import DropDown from '../../popup/DropDown'
import UploadFile from '../../upload/upload'
import Api from '../../../Services/Api'

let defaultPayload = {
    "file": "",
    "templateFunction": "VENDOR",
    "templateModule": "MASTERDATA",
    "templateName": ""
}

class FormDocumentVendor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataDetail: defaultPayload,
            bizparDocument: props.bizparDocument,
            uploadStatus: '',
            percentage: '',
            result: '',
            url: ''
        }
    }

    async postTemplateMasterdataVendor(data) {
        console.log(data)
        let form = new FormData()
        form.append('file', data)
        form.append('templateFunction ', 'VENDOR')
        form.append('templateModule', 'MASTERDATA')
        form.append('templateName', 'test')
        let res = await Api.create('TEMPLATE').postTemplateMasterdataVendor(form)
        if (res && res.status === 200) {
            console.log('file', res)
        } else {
            alert(res.data.message)
        }
    }

    handleChange(event) {
        var url = event;
        // this.postTemplateMasterdataVendor(url)
        this.setState({ 
            dataDetail: {
                ...this.state.dataDetail,
                file: url
            }, 
            uploadStatus: 'idle', 
            percentage: '0' 
        })
    }

    render() {
        let {dataDetail} = this.state
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="popup-content-small background-white border-radius post-center">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Outsourcing List - Upload Document
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

                    <form 
                        action="#" 
                        onSubmit={(e) => { 
                            e.preventDefault()
                            this.props.onHandleUpload(this.state.dataDetail)
                        }}>

                        <div className="padding-15px border-bottom">
                            {/* <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Document Type <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <DropDown
                                    title="-- please select document type --"
                                    onChange={(dt) => {
                                        console.log(dt)
                                    }}
                                    type="bizpar"
                                    disabled={this.props.type === "view" ? true : false}
                                    data={this.props.bizparDocument}
                                    />
                            </div> */}

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Template Function <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={dataDetail.templateFunction}
                                    onChange={e => {
                                        this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                templateFunction: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Template Module <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={dataDetail.templateModule}
                                    onChange={e => {
                                        this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                templateModule: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Template Name <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={dataDetail.templateName}
                                    onChange={e => {
                                        this.setState({
                                            dataDetail: {
                                                ...this.state.dataDetail,
                                                templateName: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>File <span style={{ color: "red" }}>*format file (csv)</span></h4>
                                    </div>
                                </div>

                                <UploadFile
                                    type={this.state.uploadStatus}
                                    percentage={this.state.percentage}
                                    result={this.state.result}
                                    acceptedFiles={['csv']}
                                    disableButtonUpload={true}
                                    onHandle={(dt) => {
                                        this.handleChange(dt)
                                    }} />
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
            </div>
        )
    }
}

export default FormDocumentVendor