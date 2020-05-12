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
import FormIppEss from "./formIpp/formIppEss";
import Api from "../../Services/Api";
import M from 'moment'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class ippEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawData: [],
            dataTableIPP: [],
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

    async getIPPTplByID(id) {
        let res = await Api.create('CFG').getIppTplById(id)
        if (res.data && res.data.status === 'S') {
            let dataConfig = res.data.data
            this.setState({ dataConfig })
        }
    }

    setDataConfig(value) {
        if (value.ippTrxPayload) {
            if (value.ippTrxPayload !== '') {
                return JSON.parse(value.ippTrxPayload)
            }
        } else return this.state.dataConfig
    }

    async getDataIPP() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }

        let res = await Api.create('PERFORMANCE_QRY').getIppEssAll(payload)
        if (res.data && res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableIPP = !res.data.data ? [] : res.data.data.map((value) => {
                const { ippTrxID, ippTrxEmpName, ippTrxDocDate, ippTrxStatus } = value
                return [
                    ippTrxID,
                    ippTrxDocDate,
                    ippTrxEmpName,
                    this.state.auth.user.positionName,
                    ippTrxStatus
                ]
            })
            this.setState({ dataTableIPP, rawData: res.data.data })
        } else alert(res.message)
    }

    async handleSave(type, value, index) {
        let res, payload = ''
        let { rawData } = this.state
        let { user } = this.props.auth
        payload = value && {
            ...value,
            ippTrxType: value.ippTrxType ? value.ippTrxType : '',
            ippTrxDocDate: value.ippTrxDocDate ? M(value.ippTrxDocDate).format('DD-MM-YYYY') : '',
        }
        switch (type) {
            case 'create':
                res = await Api.create('PERFORMANCE').postIppEss(payload)
                break;
            case 'edit':
                res = await Api.create('PERFORMANCE').updateIppEss(payload)
                break;
            case 'delete':
                payload = {
                    "ippTrxID": rawData[index].ippTrxID,
                    "updatedBy": user.employeeID
                }
                res = await Api.create('PERFORMANCE').deleteIppEss(payload)
                this.setState({ deleteVisible: false })
                break
        }

        if (res.data && res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataIPP()
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
            case "slide-ipp":
                this.setState({ editVisible: true, selectedIndex: index });
                break;
            case "slide-ipp-view":
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
        "IPP ID",
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
                                    onClick={this.opSidePage("slide-ipp", tableMeta.rowIndex)}
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
                                    "slide-ipp-view",
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


    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch();
            this.getDataIPP()
            this.getIPPTplByID('IPP-1581495654871')
        }
    }

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
                                                                title="Employee Self Service - Individual Performance Plan"
                                                                subtitle={'lorem ipsum dolor'}
                                                                data={this.state.dataTableIPP}
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
                                        <FormIppEss
                                            type={'edit'}
                                            dataConfig={this.setDataConfig(this.state.rawData[this.state.selectedIndex])}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            user={this.props.auth.user}
                                            onClickSave={this.handleSave.bind(this)}
                                            onClickClose={() => this.clResizePane()}
                                        />}
                                    {viewVisible &&
                                        <FormIppEss
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
                            <FormIppEss
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

export default connect(mapStateToProps, mapDispatchToProps)(ippEss);
