const EnumNameMapper = function () {
    let map = {};
    for (let name in this) {
        map['m' + this[name]] = name[0].toLocaleLowerCase() + name.substr(1);
    }

    this.getName = function (val) {
        return map['m' + val];
    };
}

export default EnumNameMapper;