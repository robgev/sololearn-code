const inputRegexes = {
    "cpp": /(cin\s*>>)|(cin\.getline\s*\([a-zA-Z]*,[0-9]*(,[a-zA-Z]*)?\))|((std::)?getline\s*\((std::)?(cin))/,
    "cs": /(Console)[\s\S]*Read(Line)?[\s\S]*\(/,
    "java": /((Scanner[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(next))|((InputStreamReader[\s\S]*\([\s\S]*System\.in[\s\S]*\))[\s\S]*(read(Line)?[\s\S]*\())/,
    "py": /([^a-zA-Z_0-9]input[\s\S]*\()|(^input[\s\S]*\()/,
    "rb": /([^a-zA-Z_0-9]gets)///,
    //"swift": /\breadLine\b\(/
}

export default inputRegexes