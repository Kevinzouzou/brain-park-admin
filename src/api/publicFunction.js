let publicFunction = {
    toType(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    },
    filterNull(o) {
        for (var key in o) {
            if (o[key] === null) {
                delete o[key]
            }
            if (publicFunction.toType(o[key]) === 'string') {
                o[key] = o[key].trim()
            } else if (publicFunction.toType(o[key]) === 'object') {
                o[key] = publicFunction.filterNull(o[key])
            } else if (publicFunction.toType(o[key]) === 'array') {
                o[key] = publicFunction.filterNull(o[key])
            }
        }
        return o
    },
    // 删除对象里孩子为空的属性
    killChildren(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].children.length === 0) {
                delete data[i].children;
            } else {
                publicFunction.killChildren(data[i].children);
            }
        }
        return data;
    },
    deepCopy(object, beCopied) {
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
            } else if (
                Object.prototype.toString.call(beCopied[i]) ===
                '[object Null]'
            ) {
                object[i] = '';
            } else {
                object[i] = '';
            }
        }
        return object;
    }
}



export default publicFunction;