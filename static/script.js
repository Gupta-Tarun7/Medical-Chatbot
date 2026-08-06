$(document).ready(function () {

    const chatBox = $("#chatBox");
    const typing = $("#typing");
    const input = $("#message");
    const form = $("#chatForm");
    const sendBtn = $("#chatForm button");

    let isLoading = false;

    // -----------------------------
    // Auto Scroll
    // -----------------------------
    function scrollBottom() {
        chatBox.stop().animate({
            scrollTop: chatBox[0].scrollHeight
        }, 300);
    }

    // -----------------------------
    // Current Time
    // -----------------------------
    function getTime() {
        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // -----------------------------
    // User Message
    // -----------------------------
    function addUserMessage(message) {

        chatBox.append(`
            <div class="user-message">

                <div class="message">
                    ${message}
                    <br>
                    <small>${getTime()}</small>
                </div>

                <div class="avatar user">
                    <i class="fa-solid fa-user"></i>
                </div>

            </div>
        `);

        scrollBottom();
    }

    // -----------------------------
    // Bot Message
    // -----------------------------
    function addBotMessage(message) {

        chatBox.html(`
        <div class="bot-message">
            <div class="avatar bot">
                <i class="fa-solid fa-user-doctor"></i>
            </div>

            <div class="message">
            👋 <strong>Hello!</strong><br><br>
            I'm your Medical AI Assistant.<br>
            Ask me anything related to medicine, diseases, symptoms or treatments.
            </div>
        </div>
`       );

        scrollBottom();
    }

    // -----------------------------
    // Loading State
    // -----------------------------
    function setLoading(state) {

        isLoading = state;

        if(state){

            typing.removeClass("hidden");

            input.prop("disabled", true);

            sendBtn.prop("disabled", true);

        }else{

            typing.addClass("hidden");

            input.prop("disabled", false);

            sendBtn.prop("disabled", false);

            input.focus();

        }

        scrollBottom();

    }

    // -----------------------------
    // Send Message
    // -----------------------------
    function sendMessage(message){

        if(isLoading) return;

        message = message.trim();

        if(message==="") return;

        addUserMessage(message);

        input.val("");

        setLoading(true);

        $.ajax({

            url:"/get",

            type:"POST",

            data:{
                msg:message
            },

            success:function(response){

                setLoading(false);

                addBotMessage(response);

            },

            error:function(xhr){

                setLoading(false);

                addBotMessage(
                    "⚠️ Unable to generate a response. Please try again."
                );

                console.error(xhr);

            }

        });

    }

    // -----------------------------
    // Form Submit
    // -----------------------------
    form.on("submit",function(e){

        e.preventDefault();

        sendMessage(input.val());

    });

    // -----------------------------
    // Press Enter to Send
    // -----------------------------
    input.on("keydown",function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            form.submit();

        }

    });

    // -----------------------------
    // Suggested Questions
    // -----------------------------
    $(".suggestion").click(function(){

        sendMessage($(this).text().trim());

    });

    // -----------------------------
    // Clear Chat
    // -----------------------------
    $("#clearChat").click(function(){

        if(!confirm("Clear the conversation?")) return;

        chatBox.html(`

            <div class="bot-message">

                <div class="avatar bot">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div class="message">

                    👋 <strong>Hello!</strong>

                    <br><br>

                    I'm your Medical AI Assistant.

                    <br>

                    Ask me anything related to medicine, diseases,
                    symptoms or treatments.

                </div>

            </div>

        `);

        input.focus();

    });

    // -----------------------------
    // Theme Toggle
    // -----------------------------
    const body = $("body");

    if(localStorage.getItem("theme")==="dark"){

        body.addClass("dark");

        $("#themeToggle i")
            .removeClass("fa-moon")
            .addClass("fa-sun");

    }

    $("#themeToggle").click(function(){

        body.toggleClass("dark");

        const icon=$("#themeToggle i");

        if(body.hasClass("dark")){

            localStorage.setItem("theme","dark");

            icon.removeClass("fa-moon")
                .addClass("fa-sun");

        }else{

            localStorage.setItem("theme","light");

            icon.removeClass("fa-sun")
                .addClass("fa-moon");

        }

    });

    // -----------------------------
    // Initial Focus
    // -----------------------------
    input.focus();

});