function Facade() {

    function getAjax() {
        var ajax;

        if(window.XMLHttpRequest) {
            ajax = new XMLHttpRequest();
        } else {
            ajax = new ActiveXObject("Microsoft.XMLHTTP");   
        }

        return ajax;
    }

    this.getResult = function(action, params, successCallback) {
        var ajax = getAjax();
    
        ajax.open(action, params, true);

        ajax.onreadystatechange = function() {
            if(ajax.readyState === 4 && ajax.status === 200) {
                successCallback(ajax.responseText);
            }
        }

        ajax.send();
    };

    return this;
}