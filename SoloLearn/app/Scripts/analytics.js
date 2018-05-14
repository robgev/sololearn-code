/*
    Setup FB analytics
*/
window.fbAsyncInit = function () {
	FB.init({
		appId: '153040644900826',
		xfbml: true,
		version: 'v2.12',
	});
};

(function (d, s, id) {
	let js,
		fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement(s); js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk/debug.js'; // "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
