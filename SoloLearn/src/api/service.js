import Storage from './storage';

export const AppDefaults = {
	baseUrl: '',
	downloadHost: 'https://api.sololearn.com/uploads',
};

class Service {
	constructor() {
		this.getSessionPromise = null;
		this.getAPITokenPromise = null;
		this.accessToken = null;
		this.apiAccessToken = null;
		this.accessTokenExpireTime = 0;
		this.apiAccessTokenExpireTime = 0;
		this.locale = Storage.load('locale') || 'en';
	}
	setAccessToken = (accessToken, expiresIn) => {
		this.accessToken = accessToken;
		// Date.now() returns timestamp in miliseconds
		this.accessTokenExpireTime = Date.now() + (expiresIn * 1000);
	}
	setLocale = (locale) => {
		this.locale = locale;
	}
	_request = (url, options, appendPayload) =>
		fetch(url, { ...options, credentials: 'include' })
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return appendPayload ? { ...res, ...appendPayload } : res;
			})
			.catch((e) => {
				console.error(e);
				throw e;
			})

	_getSession = async (locale) => {
		const { accessToken, expiresIn, user } = await this._request(
			`${AppDefaults.baseUrl}/Ajax/GetSession?locale=${locale}`,
			{
				method: 'POST',
			},
		);
		this.setAccessToken(accessToken, expiresIn);
		this.getAPIToken();
		return user;
	}

	getAPIToken = () => {
		if (this.getAPITokenPromise === null) {
			this.getAPITokenPromise = this.request('GetMessengerAccessToken', { dev: true })
				.then(res => this.setApiAccessToken(res.accessToken))
				.finally(() => {
					this.getAPITokenPromise = null;
				});
		}
		return this.getAPITokenPromise;
	}

	setApiAccessToken = (apiAccessToken) => {
		this.apiAccessToken = apiAccessToken;
		this.apiAccessTokenExpireTime = Date.now() + (3600 * 1000);
	}

	fileRequest = async (url, data) => {
		if (
			this.accessToken === null
			|| Date.now() > this.accessTokenExpireTime) {
			await this.getSession();
		}
		return this._request(`${AppDefaults.baseUrl}/api/${url}`, {
			method: 'POST',
			body: data,
			headers: {
				'Content-type': 'application/octet-stream',
				Authorization: `Bearer ${this.accessToken}`,
			},
		});
	}

	request = async (url, body = {}, appendPayload) => {
		if (
			this.accessToken === null
			|| Date.now() > this.accessTokenExpireTime) {
			await this.getSession();
		}
		return this._request(`${AppDefaults.baseUrl}/api/${url}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
		}, appendPayload);
	}

	requestApi = async (url) => {
		if (
			this.apiAccessToken === null
			|| Date.now() > this.apiAccessTokenExpireTime) {
			await this.getAPIToken();
		}
		return this._request(`${AppDefaults.baseUrl}/api2/${url}`, {
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${this.apiAccessToken}`,
			},
		});
	}

	imageRequest = async (url, body = {}) => {
		if (
			this.accessToken === null
			|| Date.now() > this.accessTokenExpireTime) {
			await this.getSession();
		}
		const options = {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'application/json',
				Authorization: `Bearer ${this.accessToken}`,
			},
			credentials: 'include',
		};
		return fetch(`${AppDefaults.baseUrl}/api/${url}`, options)
			.then(res => res.blob())
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res;
			})
			.catch((e) => {
				console.error(e);
				throw e;
			});
	}

	getSession = () => {
		if (this.getSessionPromise === null) {
			this.getSessionPromise = this._getSession(this.locale)
				.then((res) => {
					this.getSessionPromise = null;
					return res; // Need to read in index.js file to see if getSession returned a user
				});
		}
		return this.getSessionPromise;
	}
}

export default new Service();
