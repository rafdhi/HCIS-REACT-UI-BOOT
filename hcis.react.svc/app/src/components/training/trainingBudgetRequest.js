import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import TrainingBudgetCreateForm from './trainingBudgetCreateForm'
import Api from '../../Services/Api'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TrainingBudgetRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            formEditVisible: false,
            formViewVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            rawData: [],
            dataTable: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch()
            this.getData()
        }
    }

    handleDelete = async () => {
        let { rawData, selectedIndex } = this.state
        let payload = { "trainingBudgetID": rawData[selectedIndex].trainingBudgetID }
        let response = await Api.create("TRAINING").deleteTrainingBudget(payload)
        if (response.data) {
            if (response.data.status === "S") {
                this.setState({ deletePopUpVisible: false })
                this.getData()
            } else alert("Failed: " + response.data.message)
        } else alert("Failed, Please Try Again")
    }

    logout() {
        this.props.authLogout()
        return <Redirect to={{ pathname: "/" }} ></Redirect>
    }

    onIdle() {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            alert("Your session has timed out. Please log in again")
            this.logout()
        } else {
            this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    startFetch = () => this.LoadingBar.continousStart()

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
    }

    async getData() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }
        let response = await Api.create('TRAINING_QUERY').getTrainingBudget(payload)
        if (response.data) {
            if (response.data.status === "S") {
                this.onFinishFetch()
                let dataTable = response.data.data.map((value) => {
                    const { trainingBudgetID, trainingBudgetName, trainingBudgetPeriod, trainingBudget, trainingBudgetRemainingBudget, trainingBudgetType, trainingBudgetDescription, trainingBudgetStatus } = value
                    return [trainingBudgetID, trainingBudgetName, trainingBudgetPeriod, trainingBudget, trainingBudgetRemainingBudget, trainingBudgetType, trainingBudgetDescription, trainingBudgetStatus]
                })
                this.setState({ dataTable, rawData: response.data.data })
            } else alert("Failed: " + response.data.message)
        } else alert("Failed, Please Try Again.")
    }

    postData = async (data) => {
        let { auth } = this.props
        data = {
            ...data,
            trainingBudget: (!R.isEmpty(data.trainingBudget) || !R.isNil(data.trainingBudget)) ? String(data.trainingBudget).split(",").join("") : data.trainingBudget,
            trainingBudgetRemainingBudget: (!R.isEmpty(data.trainingBudgetRemainingBudget) || !R.isNil(data.trainingBudgetRemainingBudget)) ? String(data.trainingBudgetRemainingBudget).split(",").join("") : data.trainingBudgetRemainingBudget,
            createdBy: auth.user.employeeID,
            updated: auth.user.employeeID
        }
        let response = await Api.create('TRAINING').postTrainingBudget(data)
        if (response.data) {
            if (response.data.status === "S") {
                this.setState({ formCreateVisible: false, savePopUpVisible: true })
                this.getData()
            } else alert("Failed: " + response.data.message)
        } else alert("Failed, Please Try Again.")
    }

    updateData = async (data) => {
        let { auth } = this.props
        data = {
            ...data,
            trainingBudget: (!R.isEmpty(data.trainingBudget) || !R.isNil(data.trainingBudget)) ? String(data.trainingBudget).split(",").join("") : data.trainingBudget,
            trainingBudgetRemainingBudget: (!R.isEmpty(data.trainingBudgetRemainingBudget) || !R.isNil(data.trainingBudgetRemainingBudget)) ? String(data.trainingBudgetRemainingBudget).split(",").join("") : data.trainingBudgetRemainingBudget,
            createdBy: auth.user.employeeID,
            updated: auth.user.employeeID
        }
        let response = await Api.create('TRAINING').putTrainingBudget(data)
        if (response.data) {
            if (response.data.status === "S") {
                this.clResizePane()
                this.setState({ savePopUpVisible: true })
                this.getData()
            } else alert("Failed: " + response.data.message)
        } else alert("Failed, Please Try Again.")
    }

    clResizePane = () => {
        this.setState({
            formEditVisible: false,
            formViewVisible: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            formEditVisible: false,
            formViewVisible: false,
            selectedIndex,
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })

        switch (menu) {
            case 'slide-view':
                this.setState({ formViewVisible: true, selectedIndex })
                break
            case 'slide-edit':
                this.setState({ formEditVisible: true, selectedIndex })
                break
            default:
                break
        }

    }

    columns = [
        "Training Budget ID",
        "Training Budget Name",
        "Period",
        "Training Budget",
        "Remaining Budget",
        "Training Budget Type",
        "Description",
        {
            name: "Status",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: val => {
                    return (
                        <div>
                            <i className="fa fa-lw fa-circle" style={{ color: val === "ACTIVE" ? "green" : "red", marginRight: 10, padding: "5px" }} />
                            {val}
                        </div>
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-edit", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openPopUp("delete", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-view", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    openPopUp = (type, index) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
                this.clResizePane()
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
                break
            case "create":
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                this.clResizePane()
                break
            default:
                break
        }
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formEditVisible, formViewVisible, deletePopUpVisible, savePopUpVisible, timeout, minSize, maxSize, allowResize, defaultSize, selectedIndex, formCreateVisible, dataTable, rawData } = this.state
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: 'calc(100vh - 50px)' }}>
                <div className="col-1 backgorund-white"></div>
                <div className="col-2 background-white">
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={() => this.setState({ isTimedOut: false })}
                        onIdle={this.onIdle.bind(this)}
                        onAction={() => this.setState({ isTimedOut: false })}
                        debounce={250}
                        timeout={timeout} />
                    <div>
                        <ResizeSlider
                            allowResize={allowResize}
                            defaultSize={defaultSize}
                            minSize={minSize}
                            maxSize={maxSize}
                            main={(
                                <div className='a-s-p-mid no-header'>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className='padding-10px grid grid-2x'>
                                        <div className='column-1'></div>
                                        <div className='column-2 content-right'>
                                            <button
                                                type="button"
                                                onClick={() => this.openPopUp("create")}
                                                className="btn btn-circle background-blue"
                                            >
                                                <i className="fa fa-lg fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Training Budget'
                                                subtitle={'lorem ipsum dolor'}
                                                data={dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {formCreateVisible && (
                                        <TrainingBudgetCreateForm
                                            type={"create"}
                                            onClickClose={() => this.openPopUp("create")}
                                            onClickSave={this.postData.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {formEditVisible && (
                                        <TrainingBudgetCreateForm
                                            type={"edit"}
                                            data={rawData[selectedIndex]}
                                            onClickClose={() => this.clResizePane()}
                                            onClickSave={this.updateData.bind(this)}
                                        />
                                    )}

                                    {formViewVisible && (
                                        <TrainingBudgetCreateForm
                                            type={"view"}
                                            data={rawData[selectedIndex]}
                                            onClickClose={() => this.clResizePane()}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("save")}
                            />
                        )}
                        {deletePopUpVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("delete")}
                                onClickDelete={() => this.handleDelete()}
                            />
                        )}
                    </div>
                </div>
            </SplitPaneSecond>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingBudgetRequest)