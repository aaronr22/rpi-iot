var SERVER = "https://rpi-iot.herokuapp.com/";
//var SERVER = "http://" + HOST + "/";

function doAjaxCall(method, cmd, params, fcn) {
    $.ajax(
        SERVER + cmd,
        {
            type: method,
            processData: true,
            data: params,
            dataType: "jsonp",
            success: function (result) {
                fcn(result)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Error1: " + errorThrown);
            }
        }
    );
}


$(() => {
    $("#submitBtn").click(function () {
        console.log('in submit');
        doAjaxCall("GET", "sendMessage", { tmp: "a" }, function (res) {
            console.log("success");
        });
    });
});