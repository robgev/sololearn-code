const inputRegexes = {
	c_cpp: /(cin\s*>>)|(cin\.getline\s*\([a-zA-Z]*,[0-9]*(,[a-zA-Z]*)?\))|((std::)?getline\s*\((std::)?(cin))/,
	csharp: /(Console)[\s\S]*Read(Line)?[\s\S]*\(/,
	java: /((Scanner[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(next))|((InputStreamReader[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(read(Line)?[\s\S]*\())/,
	python: /([^a-zA-Z_0-9]input[\s\S]*\()|(^input[\s\S]*\()/,
	ruby: /([^a-zA-Z_0-9]gets)/, // ,
	// "swift": /\breadLine\b\(/
};

export default inputRegexes;
