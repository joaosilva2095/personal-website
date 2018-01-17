var root = $("html, body");

/**
 * Scroll event
 */
function scrollEvent() {
    var windowElement = $(window),
        bodyElement = $("body"),
        navigationElement = $("nav"),
        navbarAnchorElements = $("nav li");

    var lastAnchor = "#top",
        navDistance = navigationElement.offset().top,
        y = windowElement.scrollTop();

    stickyNavigation(navigationElement, bodyElement, y, navDistance);
    lastAnchor = highlightCurrentAnchor(navbarAnchorElements, y, navigationElement.height(), lastAnchor);

    // On resize
    windowElement.resize(function () {
        // Reset navigation bar
        navigationElement.removeClass("navbar-fixed-top");
        bodyElement.css("margin-top", 0);

        // Recalculate distance to top
        navDistance = $("nav").offset().top;

        stickyNavigation(navigationElement, bodyElement, y, navDistance);
        lastAnchor = highlightCurrentAnchor(navbarAnchorElements, y, navigationElement.height(), lastAnchor);
    });

    // On scroll
    windowElement.scroll(function () {
        y = windowElement.scrollTop();

        stickyNavigation(navigationElement, bodyElement, y, navDistance);
        lastAnchor = highlightCurrentAnchor(navbarAnchorElements, y, navigationElement.height(), lastAnchor);
    });
}

/**
 * Make the navigation bar sticky or not
 * @param navigationElement navigation bar element
 * @param bodyElement body element to add the margin
 * @param y current scroll position
 * @param distance distance to the top
 */
function stickyNavigation(navigationElement, bodyElement, y, distance) {
    if (y >= distance && !navigationElement.hasClass("navbar-fixed-top")) {
        navigationElement.addClass("navbar-fixed-top");
        bodyElement.css("margin-top", navigationElement.height());
    } else if (y < distance && navigationElement.hasClass("navbar-fixed-top")) {
        navigationElement.removeClass("navbar-fixed-top");
        bodyElement.css("margin-top", 0);
    }
}

/**
 * Highlight the current anchor in the navigation bar
 * @param navigationAnchorsElement element with all anchors of the navigation bar
 * @param y current scroll position
 * @param height height of the navigation bar
 * @param lastAnchor last anchor enabled
 * @return current anchor
 */
function highlightCurrentAnchor(navigationAnchorsElement, y, height, lastAnchor) {
    var navActiveElement = null, currentAnchor = null;
    navigationAnchorsElement.each(function () {
        var anchorId = $(this).children().attr("href"),
            target = $(anchorId).offset().top - height;

        // Update current active menu
        if (y >= target) {
            navActiveElement = $(this);
            currentAnchor = anchorId;
        }
    });

    // Apply classes to the current anchor
    if (navActiveElement === null)
        currentAnchor = "#top";
    if (lastAnchor !== currentAnchor) {
        // Update classes
        navigationAnchorsElement.removeClass("active", 200);

        if (navActiveElement !== null)
            navActiveElement.addClass("active", 200);

        // Added hash to browser
        if (history.replaceState)
            history.replaceState(null, "", currentAnchor);
        else
            location.hash = currentAnchor;
    }

    return currentAnchor;
}

/**
 * Enable smooth anchor scroll
 */
function smoothAnchor() {
    var smoothAnchorElements = $("a.js-smooth-scroll");

    smoothAnchorElements.click(function () {
        this.blur();
        var href = $.attr(this, "href");
        jumpToAnchor(href);
        return false;
    });
}

/**
 * Jump to an anchor
 * @param {string} anchor anchor to jump to
 */
function jumpToAnchor(anchor) {
    root.animate({
        scrollTop: $(anchor).offset().top - $("nav").height() + 1
    }, 500);
}

/**
 * Change the text of selected phone extension to its value
 */
function changeExtensionDisplay() {
    $("#ext").on("blur focus", function (e) {
        $(this.options).text(function () {
            return e.type === "focus" ? this.getAttribute("data-default-text") : "+" + this.value;
        });
    }).children().attr("data-default-text", function () {
        return this.textContent;
    }).end().on("change", function () {
        $(this).blur();
    }).blur();
}

/**
 * Submit the contact form
 */
function submitContact(event) {
    event.preventDefault();

    var resultMessageDiv = $("#submitResult");

    var $form = $(this);
    // Send message
    $.post(
        $form.attr("action"),
        $("form#contactForm").serialize(),
        function () {
            resultMessageDiv.find("a").after("<strong>Success!</strong>");
            resultMessageDiv.addClass("alert-success");
            resultMessageDiv.fadeIn("slow");
            $("#contactForm")[0].reset();
        }
    ).fail(function () {
        resultMessageDiv.find("a").after("<strong>Error!</strong> Your message could not be sent. Please try again.");
        resultMessageDiv.addClass("alert-danger");
        resultMessageDiv.fadeIn("slow");
    });
}

/**
 * Lookup images when opening modal to be unveiled
 */
function lookupImages() {
    $(window).on('shown.bs.modal', function() {
        $(window).trigger("lookup");
    });
}

/**
 * Setup the javascript
 */
function setup() {
    lookupImages();
    scrollEvent();
    smoothAnchor();
    changeExtensionDisplay();
    $("[data-toggle='tooltip']").tooltip();
    $("#contactForm").submit(submitContact);
    $('img').unveil(200);
}

$(document).ready(setup);