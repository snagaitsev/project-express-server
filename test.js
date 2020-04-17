module.exports = function(y, callback) {
    var x = 1;
    var t = {
        "val1": x
    };
    t.val2 = y;

    setTimeout(function(){
        callback()
    }, 5000);
    return t;
}