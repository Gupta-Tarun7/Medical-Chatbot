$(document).ready(function () {

    const chatBox = $("#chatBox");
    const typing = $("#typing");
    const input = $("#message");
    const form = $("#chatForm");
    const sendBtn = $("#chatForm button");

    let isLoading = false;


    /* =====================================================
       AUTO SCROLL
       ===================================================== */

    function scrollBottom() {

        if (!chatBox.length) return;

        chatBox.stop().animate(
            {
                scrollTop: chatBox[0].scrollHeight
            },
            250
        );
    }


    /* =====================================================
       CURRENT TIME
       ===================================================== */

    function getTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHtml(text) {

        return $("<div>")
            .text(text)
            .html();
    }


    /* =====================================================
       FORMAT BOT RESPONSE
       ===================================================== */

    function formatBotResponse(text) {

        if (!text) {
            return "Sorry, I couldn't generate a response.";
        }

        let safeText = escapeHtml(text);

        /*
         * Convert markdown-style formatting
         */

        safeText = safeText.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );

        safeText = safeText.replace(
            /`([^`]+)`/g,
            "<code>$1</code>"
        );

        /*
         * Convert numbered lists
         */

        safeText = safeText.replace(
            /(?:^|\n)(\d+)\.\s+(.*?)(?=\n|$)/g,
            "<div class='response-list-item'><strong>$1.</strong> $2</div>"
        );

        /*
         * Convert bullet points
         */

        safeText = safeText.replace(
            /(?:^|\n)[-*]\s+(.*?)(?=\n|$)/g,
            "<div class='response-list-item'>• $1</div>"
        );

        /*
         * Convert line breaks
         */

        safeText = safeText.replace(/\n/g, "<br>");

        return safeText;
    }


    /* =====================================================
       USER MESSAGE
       ===================================================== */

    function addUserMessage(message) {

        const safeMessage = escapeHtml(message);

        chatBox.append(`
            <div class="user-message">

                <div class="message">
                    ${safeMessage}
                    <small>${getTime()}</small>
                </div>

                <div class="avatar user">
                    <i class="fa-solid fa-user"></i>
                </div>

            </div>
        `);

        scrollBottom();
    }


    /* =====================================================
       BOT MESSAGE
       ===================================================== */

    function addBotMessage(message) {

        const formattedMessage = formatBotResponse(message);

        chatBox.append(`
            <div class="bot-message">

                <div class="avatar bot">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div class="message">
                    ${formattedMessage}
                    <small>${getTime()}</small>
                </div>

            </div>
        `);

        scrollBottom();
    }


    /* =====================================================
       LOADING STATE
       ===================================================== */

    function setLoading(state) {

        isLoading = state;

        if (state) {

            typing.removeClass("hidden");

            input.prop("disabled", true);

            sendBtn.prop("disabled", true);

        } else {

            typing.addClass("hidden");

            input.prop("disabled", false);

            sendBtn.prop("disabled", false);

            input.focus();
        }

        scrollBottom();
    }


    /* =====================================================
       SEND MESSAGE
       ===================================================== */

    function sendMessage(message) {

        if (isLoading) return;

        message = message.trim();

        if (message === "") {
            input.focus();
            return;
        }

        addUserMessage(message);

        input.val("");

        setLoading(true);


        $.ajax({

            url: "/get",

            type: "POST",

            data: {
                msg: message
            },

            success: function (response) {

                setLoading(false);

                addBotMessage(response);

            },

            error: function (xhr) {

                setLoading(false);

                let errorMessage =
                    "⚠️ Unable to generate a response. Please try again.";

                /*
                 * If Flask returned a useful message,
                 * display it.
                 */

                if (
                    xhr.responseText &&
                    xhr.responseText.trim() !== ""
                ) {
                    console.error(
                        "Server response:",
                        xhr.responseText
                    );
                }

                addBotMessage(errorMessage);
            }

        });
    }


    /* =====================================================
       FORM SUBMIT
       ===================================================== */

    form.on("submit", function (e) {

        e.preventDefault();

        sendMessage(input.val());

    });


    /* =====================================================
       ENTER TO SEND
       ===================================================== */

    input.on("keydown", function (e) {

        /*
         * Enter = send
         *
         * Shift + Enter = new line
         */

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            form.trigger("submit");
        }

    });


    /* =====================================================
       SUGGESTED QUESTIONS
       ===================================================== */

    $(".suggestion").on("click", function () {

        const question = $(this).text().trim();

        if (!isLoading) {
            sendMessage(question);
        }

    });


    /* =====================================================
       CLEAR CHAT
       ===================================================== */

    $("#clearChat").on("click", function () {

        if (!confirm("Clear the conversation?")) {
            return;
        }

        chatBox.html(`
            <div class="bot-message">

                <div class="avatar bot">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>

                <div class="message">

                    👋 <strong>Hello!</strong>

                    <br><br>

                    I'm your Medical AI Assistant.

                    <br><br>

                    Ask me anything related to
                    medicine, diseases, symptoms,
                    or treatments.

                    <small>${getTime()}</small>

                </div>

            </div>
        `);

        input.val("");

        input.focus();

        scrollBottom();
    });


    /* =====================================================
       THEME TOGGLE
       ===================================================== */

    const body = $("body");

    const themeToggle = $("#themeToggle");

    const themeIcon = $("#themeToggle i");


    /*
     * Load saved theme
     */

    if (localStorage.getItem("theme") === "dark") {

        body.addClass("dark");

        themeIcon
            .removeClass("fa-moon")
            .addClass("fa-sun");
    }


    /*
     * Toggle theme
     */

    themeToggle.on("click", function () {

        body.toggleClass("dark");

        if (body.hasClass("dark")) {

            localStorage.setItem("theme", "dark");

            themeIcon
                .removeClass("fa-moon")
                .addClass("fa-sun");

        } else {

            localStorage.setItem("theme", "light");

            themeIcon
                .removeClass("fa-sun")
                .addClass("fa-moon");
        }

    });


    /* =====================================================
       INITIAL FOCUS
       ===================================================== */

    input.focus();

    scrollBottom();

});