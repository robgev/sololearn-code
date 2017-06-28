//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { browserHistory } from 'react-router';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadDefaults } from '../../actions/defaultActions';
import { isLoaded, defaultsLoaded } from '../../reducers';

//Service
import Service from '../../api/service';

//Popups
import Popup from '../../api/popupService';

//Additional data and components (ACE Editor)
import brace from 'brace';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/csharp';
import 'brace/mode/ruby';
import 'brace/theme/chrome';  // Editor light theme
import 'brace/theme/monokai'; // Editor dark theme
import 'brace/ext/language_tools';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Material UI components
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';
import RunIcon from 'material-ui/svg-icons/av/play-arrow';
import InsertLink from 'material-ui/svg-icons/editor/insert-link';

//App defaults and utils
import texts from '../../defaults/texts';
import inputRegexes from '../../defaults/inputRegexes';
import externalResources from '../../defaults/externalResources';
import getSyles from '../../utils/styleConverter';

const aceEditorStyle = <Style
    scopeSelector=".ace_editor"
    rules={{
        font: "12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace",
        'div': {
            font: "12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
        }
    }}
/>

const aceLineStyle = <Style
    scopeSelector=".ace_line"
    rules={{
        font: "12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace",
        'span': {
            font: "12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
        }
    }}
/>

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
    },

    editor: {
        base: {
            width: '100%',
            height: '500px',
            transform: 'translateZ(0)'
        },
        
        hide: {
            display: 'none'
        }

    },

    toolbar: {
        base: {
            display: 'block',
            overflow: 'hidden'
        },

        hide: {
            display: 'none'
        },

        left: {
            float: 'left',
            overflow: 'hidden'
        },

        right: {
            float: 'right'
        }
    },

    languageFilter: {
        padding: '0 10px 10px 0',
        float: 'left',
        width: '200px'
    },

    codeAction: {
        base: {
        },

        save: {
            margin: '15px 0'
        },

        reset: {
            margin: '15px 0'
        },

        run: {
            margin: '15px 10px'
        }
    },

    webTab: {
        dark: {
            backgroundColor: '#2f3129',
            color: '#fff'
        },

        light: {
            backgroundColor: '#ebebeb',
            color: '#777'
        }
    },

    defaultTab: {
        base: {
            lineHeight: '48px',
            textAlign: 'right',
            padding: '0 15px 0 0',
            height: '48px',
            fontSize: '16px',
            fontWeight: 500,
            borderRadius: '4px 4px 0 0'
        },

        dark: {
            backgroundColor: '#2f3129',
            color: '#fff'
        },

        light: {
            backgroundColor: '#ebebeb',
            color: '#777'
        }
    },

    themeToggle: {
        float: 'left',
        width: '150px',
        margin: '20px 0 0 0'
    },

    themeToggleIcon: {
        fill: '#AED581'
    },

    outputHeader: {
        borderBottom: "1px solid #dedede",
        padding: '10px',
        fontSize: '17px',
        fontWeight: '500'
    },

    defaultOutputContainer: {
        base: {
            position: 'relative',
            width: '1000px',
            minHeight: '200px',
            margin: '20px auto',
            display: 'none'
        },

        show: {
            display: 'block'
        }
    },

    defaultOutput: {
        padding: '10px'
    },

    webOutput: {
        base: {
            position: 'relative',
            width: '100%',
        },

        show: {
            display: 'block'
        },

        hide: {
            display: 'none'
        }
    },

    webIframe: {
        width: '100%',
        height: '500px'
    },

    jsConsole: {
        base: {
            borderTop: '1px solid #dedede',
            height: '60px',
            padding: '5px 0px 0 10px',
            fontSize: '12px',
            wordWrap: 'break-word',
            overflowY: 'scroll'
        },

        hide: {
            display: 'none'
        }
    },

    jsConsoleLabel: {
        display: 'block',
        fontSize: '13px',
        margin: '0 0 3px 0',
        fontWeight: 500
    },

    logMessage: {
        margin: '0 0 3px 0',
        fontWeight: 500,
        color: '#B71C1C'
    },

    errorMessage: {
        color: '#424242'
    },

    popupContent: {
        width: '50%',
        maxWidth: 'none',
    },

    popupTitle: {
        padding: '15px 15px 0 15px',
        fontSize: '15px',
        fontWeight: 500
    },

    popupBody: {
        padding: '5px 15px 0 15px'
    },

    popupSubTitle: {
        fontSize: '13px',
        padding: '0px 15px 5px 0px'
    },

    charactersRemaining: {
        textAlign: 'right',
        fontSize: '13px'
    },

    codeStateToggle: {
        width: '95px',
        float: 'right',
        margin: '10px 0'
    },

    thumbOff: {
        backgroundColor: '#E0E0E0',
    },

    trackOff: {
        backgroundColor: '#BDBDBD',
    },

    thumbSwitched: {
        backgroundColor: '#AED581',
    },

    trackSwitched: {
        backgroundColor: '#9CCC65',
    },

    snackbar: {
        textAlign: 'center'
    },

    sourceFilter: {
        display: 'block',
        width: '150px',
        margin: '0 auto'
    }
}

const editorSettings = {
    html: {
        type: "web",
        name: "HTML",
        alias: "html",
        language: "web"
    },
    css: {
        type: "web",
        name: "CSS",
        alias: "css",
        language: "web"
    },
    javascript: {
        type: "web",
        name: "JS",
        alias: "js",
        language: "web"
    },
    c_cpp: {
        type: "default",
        name: "C++",
        alias: "cpp",
        language: "cpp"
    },
    csharp: {
        type: "default",
        name: "C#",
        alias: "cs",
        language: "cs"
    },
    java: {
        type: "default",
        name: "JAVA",
        alias: "java",
        language: "java"
    },
    python: {
        type: "default",
        name: "Python 3",
        alias: "py",
        language: "py"
    },
    php: {
        type: "combined",
        name: "PHP",
        alias: "php",
        language: "php"
    },
    ruby: {
        type: "default",
        name: "Ruby",
        alias: "rb",
        language: "rb"
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
            showOutput: false,
            isRunning: false,
            inputsPopupOpened: false,
            inputs: "",
            savePopupOpened: false,
            codeName: "",
            errorText: "",
            gettingCode: false,
            isPublic: false,
            isSaving: false,
            snackBarOpened: false,
            autoHideDuration: 0,
            externalSourcesPopupOpened: false,
            sourceUrl: "",
            selectedSource: "none"
        }

        this.aceEditor = null;
        this.sourceCode = "";
        this.cssCode = "";
        this.jsCode = "";
        this.userCodeData = null;       
        this.isUserCode = false;
        this.isCodeTemplate = false;

        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.resetEditorValue = this.resetEditorValue.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.runCode = this.runCode.bind(this);
        this.runCondeWitInputs = this.runCondeWitInputs.bind(this);
        this.saveCodeInternal = this.saveCodeInternal.bind(this);
        this.submitSave = this.submitSave.bind(this);
        this.addExternalSource = this.addExternalSource.bind(this);

        //Popups functionality
        this.handleInputsChange = this.handleInputsChange.bind(this);
        this.handleInputsPopupClose = this.handleInputsPopupClose.bind(this);
        this.handleCodeNameChange = this.handleCodeNameChange.bind(this);
        this.handleSavePopupClose = this.handleSavePopupClose.bind(this);
        this.handleCodeStateChange = this.handleCodeStateChange.bind(this);
        this.handleSourceFilterChange = this.handleSourceFilterChange.bind(this);
        this.handleSourceUrlChange = this.handleSourceUrlChange.bind(this);
        this.handleExternalSourcesPopupClose = this.handleExternalSourcesPopupClose.bind(this);
        this.handleExternalSourcesPopupOpen = this.handleExternalSourcesPopupOpen.bind(this);

        this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    }

    //Load editor with requirements
    loadEditor() {
        let sample = (!this.isUserCode && !this.isCodeTemplate) ? texts[this.state.mode] : this.sourceCode;
        let editorMode = "ace/mode/" + this.state.mode;
        let theme = "ace/theme/" + this.state.theme;

        this.aceEditor.session.setMode(editorMode);
        this.aceEditor.$blockScrolling = Infinity;
        this.aceEditor.setTheme(theme);
        this.aceEditor.setValue(sample, -1);
        this.aceEditor.session.setUseWrapMode(true);
        this.aceEditor.session.setUndoManager(new ace.UndoManager());
        this.aceEditor.setOptions({
            mode: editorMode,
            enableBasicAutocompletion: true,
            showPrintMargin: false
        });
    }

    //Change ACE Editor mode
    changeMode(code) {
        let editorMode = "ace/mode/" + this.state.mode;
        this.aceEditor.session.setMode(editorMode);
        this.aceEditor.setValue(code, -1);

        const link = this.isUserCode ? '/playground/' + this.userCodeData.publicID + '/' : '/playground/';

        browserHistory.push(link + editorSettings[this.state.mode].alias);
    }

    //Handle editor input language change
    handleLanguageChange(e, index, value) {
        let type = editorSettings[value].type;
        let language = editorSettings[value].language;
        this.cssCode = language == "web" ? texts["css"] : "";
        this.jsCode = "";

        //if is user code set up default values
        if(this.isUserCode && language == this.userCodeData.language) {
            this.sourceCode = this.userCodeData.sourceCode;
            this.cssCode = this.userCodeData.cssCode;
            this.jsCode = this.userCodeData.jsCode;
        }
        else {
            this.sourceCode = texts[value];
        }

        this.setState({
            mode: value,
            type: type,
            languageSelector: value,
            showOutput: false
        }, () => {
            this.changeMode(this.sourceCode);
        });
    }

    //Handle editor theme change
    handleThemeChange(e, isInputChecked) {
        const theme = isInputChecked ? "monokai" : "chrome";

        this.setState({ 
            theme: theme
        }, () => {
            this.aceEditor.setTheme("ace/theme/" + theme);
        });
    }

    //Change web tabs
    handleTabChange(mode) {
        let code = (mode == "html" || mode == "php") ? this.sourceCode : (mode == "css" ? this.cssCode : this.jsCode);

        this.setState({ 
            mode: mode,
            language: "html",
            showOutput: false
        }, () => {
            this.changeMode(code);
        });
    }

    //Keep editor value changes
    handleEditorChange() {
        const editorValue = this.aceEditor.getValue();

        if(this.state.type == "web") {
            switch(this.state.mode) {
                case "html":
                    this.sourceCode = editorValue;
                    break;
                case "css":
                    this.cssCode = editorValue;
                    break;
                case "javascript":
                    this.jsCode = editorValue;
                    break;
            }
        }
        else {
            this.sourceCode = editorValue;
        }
    }

    //Reset editor value
    resetEditorValue() {
        let selectedMode = this.state.mode;
        let language = editorSettings[this.state.mode].language;
        let sample = "";
        let userCodeOpened = this.isUserCode && language == this.userCodeData.language;

        if(selectedMode == "css") {
            this.cssCode = userCodeOpened ? this.userCodeData.cssCode : texts[this.state.mode];
            sample = this.cssCode;
        }
        else if(selectedMode == "javascript") {
            this.jsCode = userCodeOpened ? this.userCodeData.jsCode : texts[this.state.mode];
            sample = this.jsCode;
        }
        else {
            this.sourceCode = userCodeOpened ? this.userCodeData.sourceCode : texts[this.state.mode];
            sample = this.sourceCode;
        }

        this.aceEditor.setValue(sample, -1);
    }

    //Default settings
    setDefaultSettings() {
        this.sourceCode = "";
        this.cssCode = "";
        this.jsCode = "";

        this.setState({
            mode: "html",
            type: "web",
            theme: "monokai",
            languageSelector: "html",
            showOutput: false
        });

        browserHistory.push('/playground/html');
    }

    insertToHead(source, value) {
        let htmlCode = source;
        let headEnd = htmlCode.indexOf("</head>");

        if(headEnd == -1){
            let htmlStart = htmlCode.indexOf("<html>");
            if(htmlStart == -1){
                htmlCode = "<html>\n" + htmlCode + "</html>";
                htmlStart = 0;
            }

            htmlStart += 7; // Shift <html>

            htmlCode = htmlCode.substring(0, htmlStart) + "\t<head>\n\t</head>\n" + htmlCode.substring(htmlStart);
            headEnd = htmlStart + 8; // Shift <head>
        }
        else {      
            for (let i = headEnd - 1; i >= 0; i--) {
                if(/[ \f\r\t\v]/.test(htmlCode[i])) {
                    headEnd--;
                }
                else break;
            }
        }

        let sourceCode = htmlCode.substring(0, headEnd) + "\t\t" + value + htmlCode.substring(headEnd);

        return sourceCode;
    }

    //Combine html,css and js
    getStructurizeWebCode() {
        return this.insertToHead(this.sourceCode, "<style>" + this.cssCode + "</style>" + "<script>" + this.jsCode + "</script>");  
    }

    //Check if source code contains input requests
    checkForInput(lanugage) {
        // Doing some work with source code...
        if (lanugage == "py") {
            let codeBlock = this.sourceCode.replace(/(([^'"])(#)|(^#))((.*)$)/gm, ''); //$2
            let inputRegex = inputRegexes[lanugage];
            return inputRegex.test(codeBlock);
        }
        else if (lanugage == "rb") {
            var codeBlock = this.sourceCode.replace(/(\=begin(\n[\s\S]*?)\=end)|(([^'"])(#)|(^#))((.*)$)/gm, '');
            let inputRegex = inputRegexes[lanugage];
            return inputRegex.test(codeBlock);
        }
        else {
            let codeBlock = this.sourceCode.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
            let inputRegex = inputRegexes[lanugage];
            return inputRegex.test(codeBlock);
        }
    }

    runCode() {
        this.clearOutput();

        let lanugage = editorSettings[this.state.mode].language;

        if (this.state.type == "web") {
            this.setState({ 
                showOutput: true, 
                isRunning: true,
                mode: null 
            });

            let response = this.getStructurizeWebCode();

            //Save compiled data
            this.compileCode(response, lanugage, "");              
            //Show output
            this.showOutput(lanugage, response); 
        }
        else if (this.state.type == "combined") {
            this.setState({ 
                showOutput: true, 
                isRunning: true,
                mode: null 
            });

            //Save compiled data
            this.compileCode(this.sourceCode, lanugage, "").then((response) => {
                //Show output
                this.showOutput(lanugage, response.output); 
            }); 
        }
        else {
            if(this.checkForInput(lanugage)) {
                this.setState({ inputsPopupOpened: true });
            }
            else {
                this.setState({ 
                    showOutput: true,
                    isRunning: true
                });

                //Save compiled data
                this.compileCode(this.sourceCode, lanugage, "").then((response) => {            
                    //Show output
                    this.showOutput(lanugage, response.output); 
                }); 
            }
        }
    }

    runCondeWitInputs() {
        let lanugage = editorSettings[this.state.mode].language;

        this.setState({ 
            showOutput: true,
            isRunning: true,
            inputsPopupOpened: false
        });

        this.compileCode(this.sourceCode, lanugage, this.state.inputs).then((response) => {  
            this.setState({ 
                inputs: ""
            });
            //Show output
            this.showOutput(lanugage, response.output); 
        }); 
    }

    compileCode(sourceCode, language, input) {
        return Service.request("Playground/CompileCode", { code: sourceCode, language: language, input: input });
    }

    //Show output
    showOutput(lanugage, output) {
        if(lanugage == "web") {
            let frame = document.getElementById("output-frame");
            let iWindow = frame.contentWindow;

            iWindow.console.log = function () {
                let consoleOutput = "";
                for (let i = 0; i < arguments.length; i++) {
                    let current = arguments[i];
                    if (typeof current == 'string' || typeof current == 'number' || typeof current == 'boolean') consoleOutput += arguments[i] + " ";
                }                                  

                let outputHTML = consoleOutput.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
                let logMessage = document.querySelector("#js-console .log-message");
                logMessage.append(outputHTML);
            }

            let innerScript = 'window.onerror = function (msg, url, line, col, error) {' +
                                   'var lineText = line == 0 ? "" : "<br /><span>Line: " + (line) + "</span>";' +
                                   'var errorMessage = msg + lineText;' +
                                   'window.parent.document.querySelector("#js-console .error-message").innerHTML = errorMessage;' +
                                   'return false;' +
                               '}';

            let iDoc = frame.contentDocument;

            iDoc.write("<script>" + innerScript + "</script>");

            iDoc.write(output);
            iDoc.close();
        }
        else if(lanugage == "php") {
            let frame = document.getElementById("output-frame");
            let iWindow = frame.contentWindow;
            let iDoc = frame.contentDocument;
            iDoc.write(output);
            iDoc.close();
        }
        else {
            output = output.replace(/</g, '&lt;')
                           .replace(/>/g, '&gt;');
            let message = output != "" ? output : "No output.";

            document.querySelector(".default-output").innerHTML = message;
        }

        this.setState({ isRunning: false });
    }

    //Clear output
    clearOutput() {
        document.querySelector(".default-output").innerHTML = "";
        document.querySelector("#js-console .error-message").innerHTML = "";
        document.querySelector("#js-console .log-message").innerHTML = "";


        //TODO Check
        //const webOutputFrame = document.getElementById("output-frame");
        //document.getElementById("output-frame").contentDocument.body.innerHTML = ""
    }

    //Handle input parameters change
    handleInputsChange(e) {
        this.setState({ 
            inputs: e.target.value
        });
    }

    handleInputsPopupClose() {
        this.setState({
            inputsPopupOpened: false,
            inputs: ""
        });
    }

    handleSavePopupOpen() {
        this.setState({ savePopupOpened: true });
    }

    
    handleSavePopupClose() {
        this.setState({
            savePopupOpened: false,
            codeName: "",
            errorText: "",
            isPublic: false
        });
    }

    //Handle code name input change
    handleCodeNameChange(e) {
        if(e.target.value.length == 0) {
            this.setState({
                codeName: e.target.value,
                errorText: texts.codeNameError
            })
        } 
        else {
            this.setState({ 
                codeName: e.target.value,
                errorText: ""
            })
        }
    }

    //Handle code state toggle change(state: public or private)
    handleCodeStateChange(e, isInputChecked) {
        this.setState({ isPublic: isInputChecked });
    }

    getCodeTemplate() {
        const that = this;
        const params = this.props.params;
        this.setState({ gettingCode: true });

        //Link requires saved code
        Service.request("Playground/GetCodeSample", { id: parseInt(params.secondary) }).then((response) => {
            const codeTemplate = response.code;
            this.sourceCode = codeTemplate.sourceCode;
            this.cssCode = codeTemplate.cssCode;
            this.jsCode = codeTemplate.jsCode;
            this.isCodeTemplate = true;
            let isMatched = false;
            let isWeb = false;

            Object.keys(editorSettings).forEach((key, index) => {
                let value = editorSettings[key];

                if(params.primary == value.alias) {
                    isMatched = true;
                    isWeb = value.alias == "html" || value.alias == "css" || value.alias == "js";

                    that.setState({
                        mode: key,
                        type: value.type,
                        theme: "monokai",
                        languageSelector: isWeb ? "html" : key
                    });

                    browserHistory.push('/playground/' + value.alias + '/' + params.secondary);
                }
            });
            if(!isMatched) {
                browserHistory.push('/playground/html/' + params.secondary);
            }

            this.loadEditor();
            this.setState({ gettingCode: false });

        }).catch((error) => {
            console.log(error);
        });
    }

    //Get user saved code
    getUserCode() {
        const params = this.props.params;
        this.setState({ gettingCode: true });

        //Link requires saved code
        Service.request("Playground/GetCode", { publicId: params.primary }).then((response) => {
            const userCode = response.code;
            this.sourceCode = userCode.sourceCode;
            this.cssCode = userCode.cssCode;
            this.jsCode = userCode.jsCode;
            this.isUserCode = true;
            this.userCodeData = userCode;
            let isWeb = false;

            //Check language of user code for setting up correct link
            Object.keys(editorSettings).some((key, index) => {
                let value = editorSettings[key];

                if(userCode.language == value.language) {
                    browserHistory.push('/playground/' + userCode.publicID + '/' + value.alias);
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

            this.loadEditor();
            this.setState({ gettingCode: false });

        }).catch((error) => {
            console.log(error);
        });
    }

    saveCodeInternal(codeId) {
        return Service.request("Playground/SaveCode", 
            { 
                id: codeId, 
                language: editorSettings[this.state.mode].language, 
                name: this.state.codeName, 
                code: this.sourceCode,
                cssCode: this.cssCode,
                jsCode: this.jsCode,
                isPublic: this.state.isPublic
            });
    }

    save(createNewCode) {
        if(createNewCode) {
            this.handleSavePopupOpen();
        }
        else {
            if(this.isUserCode && this.userCodeData.userID == 24379) { // MY USERID
                this.setState({
                    isSaving: true,
                    snackBarOpened: true
                });

                this.saveCodeInternal(this.userCodeData.id).then((response) => {
                    this.setState({
                        isSaving: false,
                        autoHideDuration: 3000
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
            else {
                this.handleSavePopupOpen();
            }
        }
    }

    submitSave() {
        if(this.state.codeName == "") {
            this.setState({ errorText: texts.codeNameError });
            return;
        }

        this.saveCodeInternal(0).then((response) => {
            const code = response.code;
            this.handleInputsPopupClose();

            let url = 'http://www.sololearn.com:16680/playground/' + code.publicID + '/' + code.language; //TODO CHANGE TO SOLOLEARN's URL
            window.location = url;

        }).catch((error) => {
            console.log(error);
        });
    }

    //Handle saving snackbar close
    handleSnackBarClose = (reason) => {
        if (reason == 'clickaway') return; 
        this.setState({ 
            snackBarOpened: false,
            autoHideDuration: 0
        });
    }

    handleExternalSourcesPopupOpen() {
        this.setState({ externalSourcesPopupOpened: true });
    }

    handleExternalSourcesPopupClose() {
        this.setState({
            externalSourcesPopupOpened: false,
            selectedSource: "none",
            sourceUrl: ""
        });
    }

    //Choose external library
    handleSourceFilterChange(e, index, value) {
        let sourceUrl = value == "none" ? "" : externalResources[value];

        this.setState({
            selectedSource: value,
            sourceUrl: sourceUrl
        })
    }

    handleSourceUrlChange(e) {
        this.setState({ sourceUrl: e.target.value });
    }

    addExternalSource() {
        this.sourceCode = this.insertToHead(this.sourceCode, "<script src=\""+ this.state.sourceUrl + "\">" + this.jsCode + "</script> \n");
        if(this.state.mode == "html") {
            this.aceEditor.setValue(this.sourceCode, -1);
        }
        this.handleExternalSourcesPopupClose();
    }

    generateTabs() {
        if (this.state.type == "web") {
            return (
                <Tabs value={this.state.mode} inkBarStyle={this.state.theme == "monokai" ? {background: '#dedede'} : {background: '#777'}}>
                    <Tab label="HTML" style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={() => this.handleTabChange("html")} value={"html"}/>
                    <Tab label="CSS" style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={() => this.handleTabChange("css")} value={"css"}/>
                    <Tab label="JS"  style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={() => this.handleTabChange("javascript")} value={"javascript"}/>
                    <Tab label="OUTPUT"  style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={this.runCode} value={null}/>
                </Tabs>       
            );
        }
        else if (this.state.type == "combined") {
            return (
                <Tabs value={this.state.mode} inkBarStyle={this.state.theme == "monokai" ? {background: '#dedede'} : {background: '#777'}}>
                    <Tab label="PHP" style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={() => this.handleTabChange("php")} value={"php"}/>
                    <Tab label="OUTPUT"  style={this.state.theme == "monokai" ? styles.webTab.dark : styles.webTab.light} onClick={this.runCode} value={null}/>
                </Tabs>   
            );
        }
        else {
            return (
                <div style={this.state.theme == "monokai" ? [styles.defaultTab.base, styles.defaultTab.dark] : [styles.defaultTab.base, styles.defaultTab.light]}>
                    {editorSettings[this.state.mode].name}
                </div>
            );
        }
    }

    render() {
        const showWebOutput = (this.state.showOutput && (this.state.type == "web" || this.state.type == "combined"));
        const saveSubmitEnabled = this.state.errorText.length == 0;
        const addSourceEnabled = this.state.sourceUrl.length > 0;

        const savePopupActions = [
          <FlatButton
            label="Submit"
            primary={saveSubmitEnabled}
            disabled={!saveSubmitEnabled}
            onTouchTap={this.submitSave}
          />,
        ];

        const inputsPopupActions = [
          <FlatButton
            label="Submit"
            primary={true}
            onTouchTap={this.runCondeWitInputs}
          />,
        ];

         const libraryPopupActions = [
          <FlatButton
            label="Add"
            primary={addSourceEnabled}
            disabled={!addSourceEnabled}
            onTouchTap={this.addExternalSource}
          />,
        ];

        return (
            <div id="playground-container">
                {this.state.gettingCode && <LoadingOverlay />}

                <Paper id="playground" style={!this.state.gettingCode ? styles.playground.base : styles.playground.hide}>
                    {aceEditorStyle}
                    {aceLineStyle}
                    <div className="tabs" style={styles.tabs}>
                        {this.generateTabs()}
                    </div>
                    <div id="editor" ref="editor" style={!showWebOutput ? styles.editor.base : [styles.editor.base, styles.editor.hide]}></div>
                    <div className="web-output" style={(this.state.showOutput && (this.state.type == "web" || this.state.type == "combined")) ? [styles.webOutput.base, styles.webOutput.show] : [styles.webOutput.base, styles.webOutput.hide]}>
                        {(this.state.isRunning && (this.state.type == "web" || this.state.type == "combined")) && <LoadingOverlay />}
                        <iframe id="output-frame" frameBorder="0" style={styles.webIframe}></iframe>
                        <div id="js-console" style={this.state.type == "web" ? styles.jsConsole.base : styles.jsConsole.hide}>
                            <label style={styles.jsConsoleLabel}>JavaScript Console</label>
                            <div className="log-message" style={styles.logMessage}></div>
                            <div className="error-message" style={styles.errorMessage}></div>
                        </div>
                    </div>
                    <div id="toolbar" style={!showWebOutput ? styles.toolbar.base : [styles.toolbar.base, styles.toolbar.hide]}>
                        <div className="left" style={styles.toolbar.left}>
                            <DropDownMenu value={this.state.languageSelector} onChange={this.handleLanguageChange} style={styles.languageFilter}>
                                <MenuItem value={"html"} primaryText="HTML/CSS/JS" />
                                <MenuItem value={"c_cpp"} primaryText="C++" />
                                <MenuItem value={"csharp"} primaryText="C#" />
                                <MenuItem value={"java"} primaryText="Java" />
                                <MenuItem value={"python"} primaryText="Python 3" />
                                <MenuItem value={"php"} primaryText="PHP" />
                                <MenuItem value={"ruby"} primaryText="Ruby" />
                            </DropDownMenu>
                            <Checkbox
                              label="Dark Theme"
                              labelPosition="left"
                              checked={this.state.theme == "monokai"}
                              style={styles.themeToggle}
                              iconStyle={styles.themeToggleIcon}
                              onCheck={this.handleThemeChange}
                            />
                            { this.state.type == "web" && <FlatButton label="External Resources" labelPosition="before" style={styles.codeAction.run} icon={<InsertLink />} onClick={this.handleExternalSourcesPopupOpen}/> }
                        </div>
                        <div className="right" style={styles.toolbar.right}>
                            <FlatButton label="Save" style={styles.codeAction.save} default={!this.state.isSaving} disabled={this.state.isSaving} onClick={() => { this.save(false) }} />
                            <FlatButton label="Save As" style={styles.codeAction.save} default={!this.state.isSaving} disabled={this.state.isSaving} onClick={() => { this.save(true) }} />
                            <FlatButton label="Reset" style={styles.codeAction.reset} onClick={this.resetEditorValue} />
                            <RaisedButton label="Run" labelPosition="before" style={styles.codeAction.run} secondary={!this.state.isRunning && !this.isSaving} disabled={this.state.isRunning || this.isSaving} icon={<RunIcon />} onClick={this.runCode}/>
                        </div>
                    </div>
                </Paper>
                <Paper className="default-output-container" style={(this.state.showOutput && this.state.type == "default") ? getSyles(styles.defaultOutputContainer.base, styles.defaultOutputContainer.show) : styles.defaultOutputContainer.base}>
                    {(this.state.isRunning && this.state.type == "default") && <LoadingOverlay size={30} />}
                    <div style={styles.outputHeader}>Output: </div>
                    <pre className="default-output" style={styles.defaultOutput}></pre>
                </Paper>
                { 
                    this.state.inputsPopupOpened && 
                    <Dialog
                        title={texts.inputsPopupTitle}
                        contentStyle={styles.popupContent}
                        titleStyle={styles.popupTitle}
                        bodyStyle={styles.popupBody}
                        actions={inputsPopupActions}
                        modal={false}
                        open={this.state.inputsPopupOpened}
                        onRequestClose={this.handleInputsPopupClose}
                    >
                        <p style={styles.popupSubTitle}>{texts.savePopupSubTitle}</p>
                        <TextField id="inputs" style={styles.inputStyle} multiLine={true} fullWidth={true} value={this.state.inputs} maxLength={100} onChange={this.handleInputsChange}/>
                        <p style={styles.charactersRemaining}>{this.state.inputs.length}/100</p>
                    </Dialog>
                }
                { 
                    this.state.savePopupOpened && 
                    <Dialog
                        title={texts.savePopupTitle}
                        contentStyle={styles.popupContent}
                        titleStyle={styles.popupTitle}
                        bodyStyle={styles.popupBody}
                        actions={savePopupActions}
                        modal={false}
                        open={this.state.savePopupOpened}
                        onRequestClose={this.handleSavePopupClose}
                    >
                        <p style={styles.popupSubTitle}>{texts.savePopupSubTitle}</p>
                        <TextField id="codeName" style={styles.inputStyle} fullWidth={true} value={this.state.codeName} hintText={"Code Name:"} maxLength={100} errorText={this.state.errorText} onChange={this.handleCodeNameChange}/>
                        <p style={styles.charactersRemaining}>{this.state.codeName.length}/100</p>
                        <Toggle
                            label="Public:"
                            defaultToggled={this.state.isPublic}
                            style={styles.codeStateToggle}
                            thumbStyle={styles.thumbOff}
                            trackStyle={styles.trackOff}
                            thumbSwitchedStyle={styles.thumbSwitched}
                            trackSwitchedStyle={styles.trackSwitched}
                            onToggle={this.handleCodeStateChange}
                        />
                    </Dialog>
                }
                { 
                    this.state.externalSourcesPopupOpened && 
                    <Dialog
                        title={texts.externalSourcePopupTitle}
                        contentStyle={styles.popupContent}
                        titleStyle={styles.popupTitle}
                        bodyStyle={styles.popupBody}
                        actions={libraryPopupActions}
                        modal={false}
                        open={this.state.externalSourcesPopupOpened}
                        onRequestClose={this.handleExternalSourcesPopupClose}
                    >
                        <p style={styles.popupSubTitle}>{texts.externalSourcePopupSubTitle}</p>
                        <DropDownMenu value={this.state.selectedSource} onChange={this.handleSourceFilterChange} style={styles.sourceFilter}>
                            <MenuItem value={"none"} primaryText="None" />
                            <MenuItem value={"jquery"} primaryText="jQuery" />
                            <MenuItem value={"jqueryui"} primaryText="jQuery UI" />
                        </DropDownMenu>
                        <TextField id="inputs" style={styles.inputStyle} fullWidth={true} hintText="External resource url" disabled={this.state.selectedSource != "none"} value={this.state.sourceUrl} maxLength={100} onChange={this.handleSourceUrlChange}/>
                    </Dialog>
                }
                <Snackbar
                    open={this.state.snackBarOpened}
                    message={this.state.isSaving ? "Saving..." : "Saved"}
                    style={styles.snackbar}
                    autoHideDuration={this.state.autoHideDuration}
                    onRequestClose={this.handleSnackBarClose}
              />
            </div>
        );
    }

    componentWillMount() {
        let that = this;
        let isWeb = false;
        let sourceCode = "";
        let cssCode = "";
        let jsCode = "";
        const params = this.props.params;

        if(typeof params.primary === 'undefined' && typeof params.secondary === 'undefined') {
            this.setDefaultSettings();
        }
        else {
            if(params.primary.length != 12) {
                if(isNaN(parseInt(params.secondary))) {
                    let isMatched = false;

                    Object.keys(editorSettings).forEach((key, index) => {
                        let value = editorSettings[key];

                        if(params.primary == value.alias) {
                            isMatched = true;
                            isWeb = value.alias == "html" || value.alias == "css" || value.alias == "js";

                            if(isWeb) {
                                sourceCode = texts["html"];
                                cssCode = texts["css"];
                                jsCode = texts["javascript"];
                            }

                            that.sourceCode = sourceCode,
                            that.cssCode = cssCode,
                            that.jsCode = jsCode,

                            that.setState({
                                mode: key,
                                type: value.type,
                                theme: "monokai",
                                languageSelector: isWeb ? "html" : key
                            });

                            browserHistory.push('/playground/' + value.alias);
                        }
                    });

                    if(!isMatched) {
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

    //Add event listeners after component mounts and creacts ACE editor
    componentDidMount() {
        const node = findDOMNode(this.refs.editor);
        this.aceEditor = ace.edit(node);
        this.aceEditor.renderer.setScrollMargin(2, 0);
        this.aceEditor.addEventListener('change', this.handleEditorChange);

        //Get default codes
        if(!this.state.gettingCode) {
            this.loadEditor();
        }
    }
    
    //Remove event listeners after component unmounts
    componentWillUnmount() {
        this.aceEditor.removeEventListener('change', this.handleEditorChange);
    }
}

export default Radium(Playground);