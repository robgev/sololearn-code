import Storage from './storage';
import axios from 'axios';
import { loadMinimalUser } from '../actions/defaultActions';

export const AppDefaults = {
    host: 'http://api.sololearn.com/',
    //host: 'http://192.168.88.231:88/web/',
    downloadHost: 'https://api.sololearn.com/uploads/',
    clientID: 'Web.SoloLearn',
    courseClientID: '',
    version: '1.0.0.0',
    isMobile: false,
    width: 800
};

const Errors = {
    Unknown: 0,
    AuthenticationFailed: 1,
    DeviceRequired: 2,
    UserRequired: 3,
    InsufficientRights: 4,
    OperationFault: 5,
    ArgumentMissing: 6,
    EndpointNotFound: 7,
    NoConnection: { code: 0, name: 'NoConnection', data: null, isOperationFault: false }
}
    
const Faults = {
    None: 0,
    WrongCredentials: 1,
    NotActivated: 2,
    IncorrectEmail: 4,
    IncorrectName: 8,
    ExistingEmail: 16,
    IncorrectPassword: 32,
    DeviceNotFound: 64,
    SocialConflict: 128
}

class WS {
    constructor() {
        if(!WS.instance){
            WS.instance = this;
            this.Errors = Errors;
            this.Faults = Faults;
            this.App = AppDefaults;

            this.deviceUniqueID = null;
            this.appSessionID = null;
            this.isFirstRequest = true;
            this.initHandle = null;
            this.storage = new Storage();
            this.user = null;
        }

        this.authenticatePromise = null;

        return WS.instance;
    }
    
    //Saving deviceUniqueId to storage(localStorage)
    setUniqueID(uniqueID) {
        this.deviceUniqueID = uniqueID;
        this.storage.save('DeviceUniqueID', uniqueID)
    };

    //Saving sessionId to storage(localStorage)
    setSessionID(sessionID) {
        this.appSessionID = sessionID;
        this.storage.save(AppDefaults.clientID + 'SessionID', sessionID)
    };

    //Preparing for authentication
    initialize() {
        this.deviceUniqueID = this.storage.load('DeviceUniqueID');
        this.appSessionID = this.storage.load(AppDefaults.clientID + 'SessionID');
        return this.authenticate();
    }
    
    //Service authentication
    authenticate = function() {
        let that = this;
        let url = '/Ajax/GetSession';

        const data = {
            clientID: this.App.clientID,
            deviceID: this.deviceUniqueID,
            sessionID: this.appSessionID,
            appVersion: '0.0.0.1'
        }

        let formData = new FormData();

        for (var key in data) {
            formData.append(key, data[key]);
        }

        return this.authenticatePromise || (this.authenticatePromise = new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: url,
                data: formData
            })
            .then(response => {
                let respData = response.data;

                if (typeof respData.sessionId == 'string') {
                    that.setSessionID(respData.sessionId);
                }
                if (typeof respData.uniqueId == 'string') {
                    that.setUniqueID(respData.uniqueId);
                }

                let rawUser = respData.user;
                let user = {};
                for (let prop in rawUser) {
                    let camelCase = '';
                    if (prop.length <= 2) {
                        camelCase = prop.toLowerCase();
                    } else {
                        camelCase = prop.substr(0, 1).toLowerCase() + prop.substr(1);
                    }
                    user[camelCase] = rawUser[prop];
                }
                that.onUserUpdate(user);

                resolve();
                this.authenticatePromise = null;
                return true;
            })
            .catch(error => {
                let respData = error.data;

                alert("Session error");

                if (that.appSessionID) {
                    that.setSessionID('');
                }

                resolve();
                this.authenticatePromise = null;
                return false;
            });
        }));
    }

    //Making AJAX call to service function with specific data
    requestRaw(action, data, dontAuthenticate) {
        let that = this;
        let url = this.App.host + action;
        let emptyObject = {};

        return document.getElementById('service-frame').contentWindow.window.axios({
            method: 'POST',
            url: url, 
            data: JSON.stringify(data || emptyObject),
            headers: {
                'Content-type': 'application/json',
                'clientID': AppDefaults.clientID,
                'deviceID': this.deviceUniqueID,
                'sessionID': this.appSessionID
            }
        })
        .then(response => {
            let respData = response.data;

            respData.isSuccessful = true;
            respData.fault = Faults.None;

            if (typeof respData.error == 'object') {
                var error = respData.error;
                respData.isSuccessful = false;
                error.isOperationFault = (error.code == that.Errors.OperationFault)
                if (error.isOperationFault) {
                    respData.fault = error.data
                }
                return { error };
            }

            return respData;
        })
        .catch(error => {

            alert("Request error");

            return false;
        });
    }

    request = (action, data) => {
        let that = this;

        // console.log(that);

        if(that.isFirstRequest) {
            return this.initialize().then(() => {
                    that.isFirstRequest = false;
                    return that.requestRaw(action, data, false);
                },
                () => {
                    //TODO Error Popup
                }
            )
        }
        else {       
            return that.requestRaw(action, data, false);
        }

    }

    onUserUpdate = (user) => {
        // console.log(user);
        this.user = user;
    };
}

const Service = new WS();

export default Service;