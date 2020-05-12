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
import FormTalentEss from "./formTalent/formTalentEss";
import Api from "../../Services/Api";
import M from 'moment'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class talentEss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawData: [],
            dataTableTalent: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            auth: props.auth,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            sendState: "",
            defaultPayload: [],
            bizparPosition: [],
            bizparTemplate: [],
            rawDataPosition: []
        };
        this.idleTimer = null;
    }

    async getTalentTplByID(id) {
        let res = await Api.create('CFG').getCorporateTalentByID(id)
        if (res.data && res.data.status === 'S') {
            let dataConfig = res.data.data
            this.setState({ dataConfig })
        }
    }

    async getDataPosition() {
        let response = await Api.create('ES').getTplJson(this.state.auth.user.companyID)
        if (response && response.data && response.data.status === "S") {
            let bizparPosition = !response.data.data ? [] : response.data.data.map((value) => {
                const { ouid, ouposition } = value
                return { bizparKey: ouid, bizparValue: ouposition ? ouposition.bizparValue : '' }
            })
            this.setState({ bizparPosition, rawDataPosition: response.data.data })
        }
    }

    async getTemplateTalent() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }
        let bizparTemplate = []
        let res = await Api.create('CFG').getAllCorporateTalent(payload)
        if (res.data.status === 'S') {
            let rawData = res.data.data
            rawData && rawData.map((value) => {
                const { talentTPLStatus } = value
                if (talentTPLStatus === 'ACTIVE') {
                    bizparTemplate.push(value)
                }
            })
            bizparTemplate = !bizparTemplate ? [] : bizparTemplate.map((value) => {
                const { talentTPLID, talentTPLName } = value
                return { bizparKey: talentTPLID, bizparValue: talentTPLName }
            })
            this.setState({ bizparTemplate })
        }
        else { this.setState({ bizparTemplate: [] }) }
    }

    async getDataTalent() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }
        let res = await Api.create('PERFORMANCE_QRY').getTalentEssAll(payload)
        if (res.data && res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableTalent = !res.data.data ? [] : res.data.data.map((value) => {
                const { tlnTrxID, tlnTrxDocDate, tlnTrxStatus } = value
                return [
                    tlnTrxID,
                    tlnTrxDocDate,
                    this.state.auth.user.positionName,
                    'RULE SET',
                    tlnTrxStatus
                ]
            })
            this.setState({ dataTableTalent, rawData: res.data.data })
        } else alert(res.message)
    }

    async handleSave(type, value, index) {
        let res, payload = ''
        let { rawData } = this.state
        let { user } = this.props.auth
        payload = value && {
            ...value,
            tlnTrxType: value.tlnTrxType ? value.tlnTrxType : '',
            tlnTrxDocDate: value.tlnTrxDocDate ? M(value.tlnTrxDocDate).format('DD-MM-YYYY') : '',
        }
        switch (type) {
            case 'create':
                res = await Api.create('PERFORMANCE').postTalentEss(payload)
                break;
            case 'edit':
                payload = payload && {
                    ...payload,
                    "updatedBy": user.employeeID,
                    "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
                }
                res = await Api.create('PERFORMANCE').updateTalentEss(payload)
                break;
            case 'delete':
                payload = {
                    "tlnTrxID": rawData[index].tlnTrxID,
                    "updatedBy": user.employeeID
                }
                res = await Api.create('PERFORMANCE').deleteTalentEss(payload)
                this.setState({ deleteVisible: false })
                break
        }

        if (res.data && res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataTalent()
        }
    }

    openPopUp(type, index) {
        this.clResizePane()
        switch (type) {
            case 'create':
                this.setState({ createVisible: !this.state.createVisible })
                break;
            case 'view':
                this.setState({ editVisible: false, viewVisible: !this.state.viewVisible, selectedIndex: index })
                break;
            case 'execute':
                this.setState({ editVisible: false, executeVisible: !this.state.executeVisible, selectedIndex: index })
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
            case "slide-talent":
                this.setState({ editVisible: true, selectedIndex: index });
                break;
            case "slide-talent-view":
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
        "Talent ID",
        "Date",
        "Position",
        "Talent Rule Set",
        // {
        //     name: "Status",
        //     options: {
        //         customBodyRender: val => {
        //             return (
        //                 <div>
        //                     <i
        //                         className="fa fa-lw fa-circle"
        //                         style={{
        //                             color:
        //                                 val === "INITIATE"
        //                                     ? "orange"
        //                                     : val === "APPROVED"
        //                                         ? "brown"
        //                                         : val === "" || val === null
        //                                             ? null
        //                                             : val === "REJECTED"
        //                                                 ? "#424242"
        //                                                 : "gray",
        //                             marginRight: 10,
        //                             padding: "5px"
        //                         }}
        //                     />
        //                     {val}
        //                 </div>
        //             );
        //         }
        //     }
        // },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {String(tableMeta.rowData).includes("INITIATE") ?
                                <button
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={this.opSidePage("slide-talent", tableMeta.rowIndex)}
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
                                onClick={() => this.openPopUp('view', tableMeta.rowIndex)}
                            >
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            {String(tableMeta.rowData).includes("INITIATE") ?
                                <button
                                    style={{ marginRight: 15, backgroundColor: 'transparent' }}
                                    onClick={() => this.openPopUp('execute', tableMeta.rowIndex)}
                                    className='btnAct'
                                >
                                    <i className="fa fa-cog" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button> :
                                <div />
                            }
                        </div>
                    );
                }
            }
        }
    ];


    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch();
            this.getDataTalent()
            this.getTemplateTalent()
            this.getDataPosition()
            this.getTalentTplByID('TL-1582101198124')
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
        let { executeVisible, createVisible, editVisible, viewVisible } = this.state;
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
                                                                title="Employee Self Service - Talent"
                                                                subtitle={'lorem ipsum dolor'}
                                                                data={this.state.dataTableTalent}
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
                                        <FormTalentEss
                                            type={'edit'}
                                            bizparPosition={this.state.bizparPosition}
                                            bizparTemplate={this.state.bizparTemplate}
                                            dataConfig={this.state.dataConfig}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            user={this.props.auth.user}
                                            rawDataPosition={this.state.rawDataPosition}
                                            onClickSave={this.handleSave.bind(this)}
                                            onClickClose={() => this.clResizePane()}
                                        />}
                                </div>
                            }
                        />
                        {createVisible &&
                            <FormTalentEss
                                type={'create'}
                                bizparPosition={this.state.bizparPosition}
                                bizparTemplate={this.state.bizparTemplate}
                                dataConfig={this.state.dataConfig}
                                user={this.props.auth.user}
                                rawDataPosition={this.state.rawDataPosition}
                                onClickSave={this.handleSave.bind(this)}
                                onClickClose={() => this.openPopUp('create')}
                            />}
                        {viewVisible &&
                            <FormTalentEss
                                type={'view'}
                                bizparPosition={this.state.bizparPosition}
                                bizparTemplate={this.state.bizparTemplate}
                                dataConfig={this.state.dataConfig}
                                rawDataPosition={this.state.rawDataPosition}
                                rawData={this.state.rawData[this.state.selectedIndex]}
                                user={this.props.auth.user}
                                onClickClose={() => this.openPopUp('view', this.state.selectedIndex)}
                            />}
                        {executeVisible &&
                            <FormTalentEss
                                type={'execute'}
                                bizparPosition={this.state.bizparPosition}
                                bizparTemplate={this.state.bizparTemplate}
                                dataConfig={this.state.dataConfig}
                                rawDataPosition={this.state.rawDataPosition}
                                rawData={this.state.rawData[this.state.selectedIndex]}
                                user={this.props.auth.user}
                                onClickClose={() => this.openPopUp('execute', this.state.selectedIndex)}
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

export default connect(mapStateToProps, mapDispatchToProps)(talentEss);