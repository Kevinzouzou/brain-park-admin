let publicFunction = {
    toType: function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    },
    filterNull: function (o) {
        for (var key in o) {
            if (o[key] === null) {
                delete o[key]
            }
            if (toType(o[key]) === 'string') {
                o[key] = o[key].trim()
            } else if (toType(o[key]) === 'object') {
                o[key] = filterNull(o[key])
            } else if (toType(o[key]) === 'array') {
                o[key] = filterNull(o[key])
            }
        }
        return o
    },
    deepCopy: function (object, beCopied) {
        for (let i in object) {
            if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object String]'
            ) {
                object[i] = beCopied[i];
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Number]'
            ) {
                object[i] = beCopied[i];
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Object]'
            ) {
                publicFunction.deepCopy(object[i], beCopied[i]);
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Undefined]'
            ) {
                object[i] = object[i];
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Boolean]'
            ) {
                object[i] = beCopied[i];
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Array]'
            ) {
                object[i] = beCopied[i];
            } else {
                object[i] = '';
            }
        }
        return object;
    }
}

 

export default publicFunction;
 