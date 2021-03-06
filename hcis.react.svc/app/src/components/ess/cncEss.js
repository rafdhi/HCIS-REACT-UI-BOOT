import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import { connect } from "react-redux";
import PopUp from "../pages/PopUpAlert";
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from "react-split-pane";
import { Redirect } from "react-router-dom";
import * as R from "ramda";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import FormCncEss from "./formCnc/formCncEss";
import Api from "../../Services/Api";
import M from 'moment'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

const dataDummy = [
    ['CNC-001', '2016', 'Julian Montoya', 'POSITION 1', 'INITIATE'],
    ['CNC-002', '2017', 'Julian Montoya', 'POSITION 2', 'APPROVED'],
    ['CNC-003', '2018', 'Julian Montoya', 'POSITION 3', 'APPROVED'],
    ['CNC-004', '2019', 'Julian Montoya', 'POSITION 4', 'APPROVED'],
]

class cncEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawData: [],
            dataTableCNC: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            auth: props.auth,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            sendState: "",
            defaultPayload: []
        };
        this.idleTimer = null;
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch();
            this.getDataCNC()
            this.getCNCTplByID('CNC-002')
        }
    }

    async getCNCTplByID(id) {
        let res = await Api.create('CFG').getCncById(id)
        if (res.data && res.data.status === 'S') {
            let dataConfig = res.data.data
            this.setState({ dataConfig })
        }
    }

    setDataConfig(value) {
        if (value.cncTrxPayload) {
            if (value.cncTrxPayload !== '') {
                return JSON.parse(value.cncTrxPayload)
            }
        } else return this.state.dataConfig
    }

    async getDataCNC() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }

        let res = await Api.create('PERFORMANCE_QRY').getCncEssAll(payload)
        if (res.data && res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableCNC = !res.data.data ? [] : res.data.data.map((value) => {
                const { cncTrxID, cncTrxEmpName, cncTrxDocDate, cncTrxStatus } = value
                return [
                    cncTrxID,
                    cncTrxDocDate,
                    cncTrxEmpName,
                    this.state.auth.user.positionName,
                    cncTrxStatus
                ]
            })
            this.setState({ dataTableCNC, rawData: res.data.data })
        } else alert(res.message)
    }

    async handleSave(type, value, index) {
        let res, payload = ''
        let { rawData } = this.state
        let { user } = this.props.auth
        payload = value && {
            ...value,
            cncTrxType: value.cncTrxType ? value.cncTrxType : '',
            cncTrxDocDate: value.cncTrxDocDate ? M(value.cncTrxDocDate).format('DD-MM-YYYY') : '',
        }
        switch (type) {
            case 'create':
                res = await Api.create('PERFORMANCE').postCncEss(payload)
                break;
            case 'edit':
                res = await Api.create('PERFORMANCE').updateCncEss(payload)
                break;
            case 'delete':
                payload = {
                    "cncTrxID": rawData[index].cncTrxID,
                    "updatedBy": user.employeeID
                }
                res = await Api.create('PERFORMANCE').deleteCncEss(payload)
                this.setState({ deleteVisible: false })
                break
        }

        if (res.data && res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataCNC()
        }
    }

    openPopUp(type, index) {
        this.clResizePane()
        switch (type) {
            case 'create':
                this.setState({ createVisible: !this.state.createVisible })
                break;
            case 'delete':
                this.setState({ deleteVisible: !this.state.deleteVisible, selectedIndex: index })
                break;
            case 'save':
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false, deleteVisible: false })
                break;
        }
    }

    logout() {
        this.props.authLogout();
        return <Redirect to={{ pathname: "/" }}></Redirect>;
    }

    onAction() {
        this.setState({ isTimedOut: false });
    }

    onActive() {
        this.setState({ isTimedOut: false });
    }

    onIdle() {
        const isTimedOut = this.state.isTimedOut;
        if (isTimedOut) {
            alert("Your session has timed out. Please log in again");
            this.logout();
        } else {
            this.idleTimer.reset();
            this.setState({ isTimedOut: true });
        }
    }

    opSidePage = (menu, index) => e => {
        e.preventDefault();
        this.setState({ editVisible: false, viewVisible: false });

        this.opResizePane();

        switch (menu) {
            case "slide-cnc":
                this.setState({ editVisible: true, selectedIndex: index });
                break;
            case "slide-cnc-view":
                this.setState({ viewVisible: true, selectedIndex: index });
                break;
            default:
                break;
        }
    };

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        });
    };

    clResizePane = () => {
        this.setState({
            slideBizpar: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        });
    };

    getMuiTheme = () => createMuiTheme(ct.customTable());

    columns = [
        "CNC ID",
        "Periode",
        "Name",
        "Position",
        {
            name: "Status",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === "INITIATE"
                                            ? "orange"
                                            : val === "APPROVED"
                                                ? "brown"
                                                : val === "" || val === null
                                                    ? null
                                                    : val === "REJECTED"
                                                        ? "#424242"
                                                        : "gray",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val}
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {String(tableMeta.rowData).includes("INITIATE") ?
                                <button
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={this.opSidePage("slide-cnc", tableMeta.rowIndex)}
                                    className='btnAct'
                                >
                                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button> :
                                <div />
                            }
                            {String(tableMeta.rowData).includes("INITIATE") ?
                                <button
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={() => this.openPopUp('delete', tableMeta.rowIndex)}
                                    className='btnAct'
                                >
                                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button> :
                                <div />
                            }
                            <button
                                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                className='btnAct'
                                onClick={this.opSidePage(
                                    "slide-cnc-view",
                                    tableMeta.rowIndex
                                )}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];


    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    render() {
        if (R.isNil(this.props.auth.user))
            return <Redirect to={{ pathname: "/" }}></Redirect>;
        let { rawData, selectedIndex, createVisible, editVisible, viewVisible } = this.state;
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: "calc(100vh - 50px)" }}
            >
                <div className="col-1"></div>
                <div className="col-2">
                    <IdleTimer
                        ref={ref => {
                            this.idleTimer = ref;
                        }}
                        element={document}
                        onActive={this.onActive.bind(this)}
                        onIdle={this.onIdle.bind(this)}
                        onAction={this.onAction.bind(this)}
                        debounce={250}
                        timeout={this.state.timeout}
                    />
                    <div>
                        <ResizeSlider
                            allowResize={this.state.allowResize}
                            defaultSize={this.state.defaultSize}
                            minSize={this.state.minSize}
                            maxSize={this.state.maxSize}
                            main={
                                <div>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="a-s-p-place a-s-p-content active">
                                        <div className="a-s-p-top">
                                            <div className="col-2 content-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-circle background-blue"
                                                    style={{ marginRight: 10 }}
                                                    onClick={() => this.openPopUp('create')}
                                                >
                                                    <i className="fa fa-1x fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="a-s-p-mid">
                                            <div className="padding-10px">
                                                <div className="app-open-close margin-bottom-20px">
                                                    <div className="app-open-close-content">
                                                        <MuiThemeProvider theme={getMuiTheme()}>
                                                            <MUIDataTable
                                                                title="Employee Self Service - Coaching & Counseling"
                                                                subtitle={'lorem ipsum dolor'}
                                                                data={this.state.dataTableCNC}
                                                                columns={this.columns}
                                                                options={options}
                                                            />
                                                        </MuiThemeProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            side={
                                <div className="a-s-p-side">
                                    {editVisible &&
                                        <FormCncEss
                                            type={'edit'}
                                            dataConfig={this.setDataConfig(this.state.rawData[this.state.selectedIndex])}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            user={this.props.auth.user}
                                            onClickSave={this.handleSave.bind(this)}
                                            onClickClose={() => this.clResizePane()}
                                        />}
                                    {viewVisible &&
                                        <FormCncEss
                                            type={'view'}
                                            dataConfig={this.setDataConfig(this.state.rawData[this.state.selectedIndex])}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            user={this.props.auth.user}
                                            onClickClose={() => this.clResizePane()}
                                        />}
                                </div>
                            }
                        />
                        {createVisible &&
                            <FormCncEss
                                type={'create'}
                                user={this.props.auth.user}
                                onClickSave={this.handleSave.bind(this)}
                                onClickClose={() => this.openPopUp('create')}
                            />}
                        {this.state.savePopUpVisible && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp('save')}
                            />
                        )}
                        {this.state.deleteVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp('delete', this.state.selectedIndex)}
                                onClickDelete={() => this.handleSave('delete', null, this.state.selectedIndex)}
                            />
                        )}
                    </div>
                </div>
            </SplitPaneSecond>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(cncEss);
