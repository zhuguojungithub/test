export const isMobile = () => {
    return window.screen.width < 768
}

// 解析search查询字符串
export const getQueryStringArgs = (search) => {
    var qs = (search.length > 0 ? search.substring(1) : ""),
        items = qs.length ? qs.split("&") : [],
        args = {},
        item = null,
        name = null,
        value = null;

    for (var i = 0, len = items.length; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

// 包装查询字符串 
export const addQueryStringArg = (url, name, value) => {
    url += (url.indexOf("?") == -1 ? "?" : "&");
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

// 将错误框滚动到可视区域
export const intoError = () => {
    const hasError = document.querySelector('.has-error')
    if (hasError) hasError.scrollIntoView()
}

// 数组去重
export const filterHandle = (arr, id) => {
    const len = arr.length, list = []
    for (let i = 0; i < len; i++) {
        let bool = true
        for (let j = 0, length = list.length; j < length; j++) {
            if (arr[i][id] === list[j][id]) {
                bool = false
                break
            }
        }
        if (bool) {
            list.push(arr[i])
        }
    }
    return list
}

export const getIndex = (id) => {
    const { list } = this.state
    const len = list.length
    for (let i = 0; i < len; i++) {
        if (list[i].mc_id === id) {
            return i
        }
    }
    return -1
}