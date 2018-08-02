import Storage from './storage';

export const AppDefaults = {
	baseUrl: 'http://localhost:2525',
	downloadHost: 'https://api.sololearn.com/uploads/',
};

class Service {
	constructor() {
		this.accessToken = null;
		this.getSessionPromise = null;
		this.accessToken = null;
		this.accessTokenExpireTime = 0;
	}
	setAccessToken = (accessToken, expiresIn) => {
		this.accessToken = accessToken;
		// Date.now() returns timestamp in miliseconds
		this.accessTokenExpireTime = Date.now() + (expiresIn * 1000);
	}
	_request = (url, options) =>
		fetch(url, { ...options, credentials: 'include' })
			.then(res => res.json())
			.then((res) => {
				if (res.error) {
					throw res.error;
				}
				return res;
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
		return user;
	}

	request = async (url, body = {}) => {
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
		});
	}

	getSession = (locale = Storage.load('locale') || 'en') => {
		if (this.getSessionPromise === null) {
			this.getSessionPromise = this._getSession(locale)
				.then((res) => {
					this.getSessionPromise = null;
					return res; // Need to read in index.js file to see if getSession returned a user
				});
		}
		return this.getSessionPromise;
	}
}

export default new Service();
