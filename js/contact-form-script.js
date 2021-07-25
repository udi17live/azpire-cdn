// (function($){"use strict";$("#contactForm").validator().on("submit",function(event){if(event.isDefaultPrevented()){formError();submitMSG(false,"Did you fill in the form properly?");}else{event.preventDefault();submitForm();}});function submitForm(){var name=$("#name").val();var email=$("#email").val();var msg_subject=$("#msg_subject").val();var phone_number=$("#phone_number").val();var message=$("#message").val();$.ajax({type:"POST",url:"assets/php/form-process.php",data:"name="+name+"&email="+email+"&msg_subject="+msg_subject+"&phone_number="+phone_number+"&message="+message,success:function(text){if(text=="success"){formSuccess();}else{formError();submitMSG(false,text);}}});}
// function formSuccess(){$("#contactForm")[0].reset();submitMSG(true,"Message Submitted!")}
// function formError(){$("#contactForm").removeClass().addClass('animate__animated animate__shakeX').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){$(this).removeClass();});}
// function submitMSG(valid,msg){if(valid){var msgClasses="h4 submit-post-info tada animated text-success";}else{var msgClasses="h4 submit-post-info text-danger";}
// $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);}}(jQuery));


(function ($) {
    "use strict";
    $("#contactForm")
        .validator()
        .on("submit", function (event) {
            if (event.isDefaultPrevented()) {
                formError();
                submitMSG(false, "Did you fill in the form properly?");
            } else {
                event.preventDefault();
                submitForm();
            }
        });
    async function submitForm() {
        var name = $("#name").val();
        var email = $("#email").val();
        var msg_subject = $("#msg_subject").val();
        var phone_number = $("#phone_number").val();
        var message = $("#message").val();

        var text_body= "name=" + name + "&email=" + email + "&msg_subject=" + msg_subject + "&phone_number=" + phone_number + "&message=" + message;


        var html_body = await fetch('https://azpirehosting.xyz/cdn/cdn-new/email_templates/contact-form-template.html')
        .then(response => response.text())
        .then(html => {
            var replace_data_var = ["name", "email", "phone_number", "msg_subject", "message"];
            var replace_data_with = [name, email, phone_number, msg_subject, message];

            for(var i = 0; i < replace_data_var.length; i++) {
                html = html.replace(new RegExp('{{' + replace_data_var[i] + '}}', 'gi'), replace_data_with[i]);
            }

           return html;
        });
        
        var payload = {
            "api_key": 'api-0DD72BDCE5B811EBB766F23C91C88F4E',
            "to": ["Azpire Hosting <info@azpirehosting.info>"],
            "sender": "Contact Form <crons@azpirehosting.info>",
            "subject": msg_subject,
            "text_body": text_body,
            "html_body": html_body,
            "custom_headers": [
                {
                    "header": "Reply-To",
                    "value": `${name} <${email}>`
                }
            ],
            "attachments": []
        }

        $.ajax({
            type: "POST",
            url: "https://api.smtp2go.com/v3/email/send",
            headers: {
                "Content-Type":"application/json"
            },
            data: JSON.stringify(payload),
            success: function (text) {
                console.log(text);
                if (text.data.succeeded == 1) {
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false, text);
                }
            },
        });
    }
    function formSuccess() {
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!");
    }
    function formError() {
        $("#contactForm")
            .removeClass()
            .addClass("animate__animated animate__shakeX")
            .one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                $(this).removeClass();
            });
    }
    function submitMSG(valid, msg) {
        if (valid) {
            var msgClasses = "h4 submit-post-info tada animated text-success";
        } else {
            var msgClasses = "h4 submit-post-info text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
})(jQuery);
