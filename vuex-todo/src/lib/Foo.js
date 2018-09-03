let i = 0;

const getCount = function() {
    return i;
}

const addCount = function() {
    i ++;
    return i;
}

export { getCount, addCount }