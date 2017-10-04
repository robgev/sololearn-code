//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//Service
import Service from '../../api/service';

//Additional components
import Editor from './Editor';
import PlaygroundTabs from './PlaygroundTabs';
import Toolbar from './Toolbar';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Paper from 'material-ui/Paper';

//App defaults and utils
import texts from '../../defaults/texts';
import editorSettings from '../../defaults/playgroundEditorSettings';

const styles = {
    playground: {
        base: {
            width: '1000px',
            margin: '20px auto 0',
            overflo: 'hidden'
        },

        hide: {
            display: 'none'
        }
    }
}

class Playground extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "html",
            type: "web",
            theme: "monokai",
            languageSelector: "html",
            isGettingCode: false,
            isSaving: false,
            isRunning: false,
            showOutput: false
        }
        this.sourceCode = "";
        this.cssCode = "";
        this.jsCode = "";
        this.userCodeData = null;
        this.isUserCode = false;
        this.isCodeTemplate = false;
    }

    //Default settings
    setDefaultSettings = () => {
        this.sourceCode = "";
        this.cssCode = "";
        this.jsCode = "";

        this.setState({
            mode: "html",
            type: "web",
            theme: "monokai",
            languageSelector: "html"
        });

        browserHistory.replace('/playground/html');
    }

    getCodeTemplate = () => {
        const that = this;
        const params = this.props.params;
        this.setState({ isGettingCode: true });

        //Link requires saved code
        Service.request("Playground/GetCodeSample", { id: parseInt(params.secondary) })
            .then((response) => {
                const codeTemplate = response.code;

                this.sourceCode = codeTemplate.sourceCode;
                this.cssCode = codeTemplate.cssCode;
                this.jsCode = codeTemplate.jsCode;
                this.isCodeTemplate = true;

                let isMatched = false;
                let isWeb = false;

                for (let key in editorSettings){
                    let value = editorSettings[key];

                    if (params.primary == value.alias) {
                        isMatched = true;
                        isWeb = value.alias == "html" || value.alias == "css" || value.alias == "js";

                        that.setState({
                            mode: key,
                            type: value.type,
                            theme: "monokai",
                            languageSelector: isWeb ? "html" : key
                        });

                        browserHistory.replace('/playground/' + value.alias + '/' + params.secondary);
                    }
                }

                if (!isMatched) {
                    browserHistory.replace('/playground/html/' + params.secondary);
                }

                this.setState({ isGettingCode: false });

            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Get user saved code
    getUserCode = () => {
        const params = this.props.params;
        this.setState({ isGettingCode: true });

        //Link requires saved code
        Service.request("Playground/GetCode", { publicId: params.primary }).then((response) => {
            console.log(response)
            const userCode = response.code;

            this.sourceCode = userCode.sourceCode;
            this.cssCode = userCode.cssCode;
            this.jsCode = userCode.jsCode;
            this.isUserCode = true
            this.userCodeData = userCode;

            let isWeb = false;

            //Check language of user code for setting up correct link
            Object.keys(editorSettings).some(key => {
                let value = editorSettings[key];
                if (userCode.language == value.language) {
                    browserHistory.replace('/playground/' + userCode.publicID + '/' + value.alias);
                    isWeb = value.alias == "html" || value.alias == "css" || value.alias == "js";

                    this.setState({
                        mode: key,
                        type: value.type,
                        theme: "monokai",
                        languageSelector: isWeb ? "html" : key
                    });

                    return userCode.language == value.language;
                }
            });

            this.setState({ isGettingCode: false });

        }).catch((error) => {
            console.log(error);
        });
    }

    //Change web tabs
    handleTabChange = (mode) => {
        console.log(this);
        let code = (mode == "html" || mode == "php") ? this.sourceCode : (mode == "css" ? this.cssCode : this.jsCode);

        this.setState({
            mode: mode,
            language: "html",
            showOutput: false
        }, () => {
            //this.changeMode(code);
        });
    }

    render() {
        const { showOutput, mode, type, theme, isGettingCode, languageSelector, isSaving, isRunning } = this.state;
        const showWebOutput = (showOutput && (type == "web" || type == "combined"));

        if (isGettingCode) {
            return <LoadingOverlay />;
        }

        return (
            <div id="playground-container">
                <Paper id="playground" style={styles.playground.base}>
                    <PlaygroundTabs 
                        mode={mode}
                        theme={theme}
                        type={type}
                        handleTabChange={this.handleTabChange}
                    />
                    <Editor
                        mode={mode}
                        theme={theme}
                        type={type}
                        isGettingCode={isGettingCode}
                        sourceCode={this.sourceCode}
                        cssCode={this.cssCode}
                        jsCode={this.jsCode}
                        userCodeData={this.userCodeData}
                        isUserCode={this.isUserCode}
                        isCodeTemplate={this.isCodeTemplate}
                        ref={(child) => { this._child = child; }}
                    />
                    <Toolbar
                        theme={theme}
                        type={type}
                        languageSelector={languageSelector}
                        showWebOutput={showWebOutput}
                        isSaving={isSaving}
                        isRunning={isRunning} />
                </Paper>
            </div>
        );
    }

    componentDidMount() {
        let that = this;
        let isWeb = false;
        let sourceCode = "";
        let cssCode = "";
        let jsCode = "";
        const params = this.props.params;

        //If link not requires code template or user code then redirecting to playground with html language active
        if (typeof params.primary === 'undefined' && typeof params.secondary === 'undefined') {
            this.setDefaultSettings();
        }
        else {
            //If link primary parameter's length is not 12 then there are two options: 1.language 2.code template id
            if (params.primary.length != 12) {
                if (isNaN(parseInt(params.secondary))) {
                    let isMatched = false;

                    Object.keys(editorSettings).forEach((key, index) => {
                        let value = editorSettings[key];

                        if (params.primary == value.alias) {
                            isMatched = true;
                            isWeb = value.alias == "html" || value.alias == "css" || value.alias == "js";

                            if (isWeb) {
                                sourceCode = texts["html"];
                                cssCode = texts["css"];
                                jsCode = texts["javascript"];
                            }

                            that.sourceCode = sourceCode;
                            that.cssCode = cssCode;
                            that.jsCode = jsCode;

                            that.setState({
                                mode: key,
                                type: value.type,
                                theme: "monokai",
                                languageSelector: isWeb ? "html" : key
                            });

                            browserHistory.replace('/playground/' + value.alias);
                        }
                    });

                    if (!isMatched) {
                        this.setDefaultSettings();
                    }
                }
                else {
                    this.getCodeTemplate();
                }
            }
            else {
                this.getUserCode();
            }
        }
    }
}

export default Playground;