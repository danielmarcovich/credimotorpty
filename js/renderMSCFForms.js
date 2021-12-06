var success_message;
var error_message;

function FormRender(tokenId) {
    let miscript = document.currentScript;
    let formData;
    let token = getParam('id');
    let env = getParam('env');
    let url = getUrlI(env);
    new getForm(url, token);

    function getForm(url, token) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let resp = JSON.parse(this.responseText);
                let $renderContainer = '<form class="form-group" id=' + token + '><form/>';
                miscript.insertAdjacentHTML('beforebegin', $renderContainer);
                formData = JSON.parse(resp.fields.replace(/&quot;/g, '"'));
                let formRenderOpts = {
                    dataType: 'xml',
                    formData
                };

                message = JSON.parse(resp.messages.replace(/&quot;/g, '"'));
                
                if(resp.hasOwnProperty("messages")){
                    success_message = message.success_message;
                
                } else{
                    success_message = 'Su mensaje ha sido enviado!';
                }

                if(resp.hasOwnProperty("messages")){
                    error_message = message.error_message;
                
                }else{
                    error_message = 'Ha ocurrido un problema';
                }
                
                document.getElementById(token).insertAdjacentHTML('beforeend', render(formData));
                document.getElementById(token).insertAdjacentHTML('beforeend', `<input type="hidden" name="token" value="${token}"/>`);
                const form = document.getElementById(token);
                form.addEventListener('submit', function(event) {
                    event.preventDefault();
                    sendForm(url, token);
                });
            };
        };
        xhttp.open("GET", url + "/api/websites/forms/get/" + token, true);
        xhttp.send();
    }

    function sendForm(url, token) {
        event.preventDefault()
        let formElement = document.getElementById(token);
        let data = new FormData(formElement)
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url + "/api/websites/forms/send");
        xhr.onload = function() {
            if (xhr.status == 200) {
                document.getElementById(token).reset();
                sendNotification('Enviado');
            } else {
                ErrorNotification('Error');
            }
        }
        xhr.send(new FormData(formElement));
    }

    function getParam(name) {
        let param = name;
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        let regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
        let results = regex.exec(miscript.src);
        return results[1]
    }

    function getUrlI(env) {
        if (env === 'p') {
            return "https://api.msclics.com";
        }
        if (env === 'e') {
            return "https://dev-api.msclics.com";
        }
        if (env === 'l') {
            return "http://127.0.0.1:8000";
        }
    }

    function sendNotification(message) {
        var element = document.getElementById("success-msclics-form");
        element.style.display = 'block';

        setTimeout(function() {
            element.style.display = 'none';
        }, 8000); // <-- time in milliseconds
    }

    function ErrorNotification(message) {
        var element = document.getElementById("warning-msclics-form");
        element.style.display = 'block';

        setTimeout(function() {
            element.style.display = 'none';
        }, 8000); // <-- time in milliseconds
    }

    function render(content) {
        let formContent = '';
        content.forEach(function(item) {
            console.log(insertInput(item))
            let strHTML = `<div class="fb-text form-group">` + `${insertLabel(item) + insertInput(item)}</div>`
            formContent += strHTML;
        });

        let messages = ` 
                <div class="container-msclics-form">
                  <div id="success-msclics-form" class="notification-msclics-form success-msclics-form">
                    <span class="notification-close-msclics-form">&times;</span>
                    <h3 class="notification-title-msclics-form">`+ success_message +`</h3>
                    <!-- <p class="notification-message-msclics-form">`+ success_message +`</p> -->
                  </div>

                  <div id="warning-msclics-form" class="notification-msclics-form warning-msclics-form">
                    <span class="notification-close-msclics-form">&times;</span>
                    <h3 class="notification-title-msclics-form">`+ error_message +`</h3>
                   <!-- <p class="notification-message-msclics-form">`+ error_message +`</p> -->
                  </div>

                  <div class="notification-msclics-form info-msclics-form">
                    <span class="notification-close-msclics-form">&times;</span>
                    <h3 class="notification-title-msclics-form">Intente nuevamente</h3>
                    <p class="notification-message-msclics-form">Intente nuevamente</p>
                  </div>
                </div>`;

        formContent += messages;
        return formContent;
    }

    function insertInput(item) {
        switch (item.type) {
            case 'text':
                return `<input type="${item.subtype}" class="form-control ${item.className}" name="${item.name}" placeholder="${item.placeholder}" id="${item.name}" required=${item.required && "required"} aria-required="true">`;
                break;
            case 'date':
                return `<div class="input-group date" data-provide="datepicker">
                            <input type="text" class="${item.className}" placeholder="mm.dd.yyyy">
                            <div class="input-group-addon">
                                <span class="glyphicon glyphicon-th"></span>
                            </div>
                        </div>`;
                break;
            case 'hidden':
                return `<input type="${item.subtype}" class="${item.className}" name="${item.name}" placeholder="${item.placeholder}" id="${item.name}" required=${item.required && "required"} aria-required="true">`;
                break;
            case 'number':
                return `<input type="${item.subtype}" class="${item.className}" name="${item.name}" placeholder="${item.placeholder}" id="${item.name}" required=${item.required && "required"} aria-required="true">`;
                break;
            case 'textarea':
                return `<textarea  class="form-control ${item.className}" name="${item.name}" placeholder="${item.placeholder}" id="${item.name}" required=${item.required && "required"} ></textarea>`;
                break;
            case 'select':
                return `<select  class="${item.className}" name="${item.name}" id="${item.name}" required=${item.required && "required"} >
                            <option value="" disabled="disabled" selected>${item.placeholder}</option>
                        ` + returnOptionSelect(item) + `</select>`;
                break;
            case 'checkbox-group':
                return `<div  class="checkbox-group" >` + returnOptionCheckbox(item) + `</div>`;
                break;
            case 'radio-group':
                return `<div  class="radio-group" >` + returnOptionRadio(item) + `</div>`;
                break;
            case 'paragraph':
                return `<div> <p id="${item.name}" class"${item.className}" >${item.label} </p></div>`;
                break;
            case 'button':
                return `<button type="${item.subtype}"  class="${item.className} " name="${item.name}" id="${item.name}" >${item.label}</button>`;
                break;
            case 'submit':
                return `<button type="${item.subtype}"  class="${item.className} " name="${item.name}" id="${item.name}" >${item.label}</button>`;
                break;
        }
    }

    function insertLabel(item) {
        switch (item.type) {
            case 'button':
                return '';
                break;
            case 'hidden':
                return '';
                break;
            case 'submit':
                return '';
                break;
            case 'paragraph':
                return '';
                break;
            default:
                return `<label for=${item.name} class="fb-text-` + `
                    label">${item.label}${item.required ? "<span class=fb-required>*</span>" : ''}</label>`;
                break;
        }
    }

    function returnOptionSelect(item) {
        let formContent = '';
        item.values.forEach(function(op) {
            let optHTML = `<option value="${op.value}">` + `${op.label}</option>`;
            // ${op.selected ? 'selected' : ''}
            formContent += optHTML;
        });
        return formContent;
    }

    function returnOptionCheckbox(item) {
        let formContent = '';
        item.values.forEach(function(op) {
            let optHTML = `<div class="fb-checkbox-inline"><input name="${op.name}" id="${op.name}" aria-required="true" value="${op.value}" type="checkbox" ${op.selected ? 'checked' : ''}><label for="${op.name}">${op.label}</label></div>`
            formContent += optHTML;
        });
        return formContent;
    }

    function returnOptionRadio(item) {
        let formContent = '';
        item.values.forEach(function(op) {
            let optHTML = `<div class="fb-radio-inline"><input name="${op.name}" id="${op.name}" aria-required="true" value="${op.value}" type="radio" ${op.selected ? 'checked' : ''} ><label for="${op.name}">${op.label}</label></div>`
            formContent += optHTML;
        });
        return formContent;
    }

    function init() {
        $('.input-group.date').datepicker({format: "mm.dd.yyyy"});
    }

    window.onload = init;

};
new FormRender();

var link = document.createElement( "link" );
link.href = 'https://cdn-msclics.s3.amazonaws.com/assets/css/msclics-form.css';
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";

document.getElementsByTagName("head")[0].appendChild(link);

document.addEventListener('click', function(event) {
    if (!event.target.matches('.notification-close-msclics-form')) return;
    console.log('hola', event.target.offsetParent);
    element = event.target.offsetParent;
    element.style.display = 'none';
}, false);