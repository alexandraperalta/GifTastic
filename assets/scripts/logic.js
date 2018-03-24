var topics = ["Happy", "Yes", "No", "WTF", "Confused", "Facepalm"];

$(document).ready(function () {
    //create the buttons from what's in the topics array
    populateButtons();
    $("#submit-new-feel").off("click");
    $("#submit-new-feel").on("click", function(){
        var newFeel = $("#newFeel").val();
        if(newFeel != ""){
            //move new reaction to the buttons array and repopulate buttons
            topics.push(newFeel);
            populateButtons();
        }        
    });
});

function populateButtons(){
    //first remove the stuff in there already
    $("#reactionBtns").html("");
    //creating buttons for all objects in topics array
    for (var i = 0; i < topics.length; i++) {
        var currentReaction = topics[i];
        var btn = $("<button>");
        btn.attr({
            "data-reaction": currentReaction,
            "class": "btn btn-success btnFeel",
            "status": "unclicked"
        });
        btn.text(currentReaction);
        $("#reactionBtns").append(btn);
    }
    //create the clickable events for the buttons
    $("button").off("click");
    $("button").on("click", function () {
        //on click, query api and grab gifs
        var reaction = $(this).attr("data-reaction");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            reaction + "&api_key=NQE4OcxtBSIwFeIIYKYR5dwwAIpN8I4d&limit=10";

        if ($(this).attr("status") === "unclicked") {
            $(this)
                .addClass("clicked")
                .attr({ "status": "clicked" })
            // Performing an AJAX request with the queryURL
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                // After data comes back from the request
                .then(function (response) {
                    console.log(response.data);
                    // storing the data from the AJAX request in the results variable
                    var results = response.data;
                    //create a panel just for this reaction
                    var feelPanel = $("<div>");
                    feelPanel.attr({
                        "id": reaction + "Panel",
                        "class" : "panel panel-danger"
                    });
                    //create a panel header for this reaction and append
                    var panelHeader = $("<div>");
                    panelHeader.html("<h3 class='panel-title'>"+reaction+"</h3>");
                    panelHeader.addClass("panel-heading")
                    feelPanel.append(panelHeader);
                    //create a panel body
                    var panelBody = $("<div>");
                    panelBody.addClass("panel-body");
                    feelPanel.append(panelBody);
                    // Looping through each result item (each gif)
                    for (var i = 0; i < results.length; i++) {
                        // Creating and storing a div tag
                        var reactionDiv = $("<div>");
                        reactionDiv.attr("class", "imageDiv ")
                        // Creating a div tag with the result item's rating
                        var ratingLabel = $("<div>").text("Rating: " + results[i].rating.toUpperCase());
                        ratingLabel.attr("class", "rating");
                        // Creating and storing an image tag
                        var reactionImage = $("<img>");
                        // Setting the src attribute of the image to a property pulled off the result item
                        reactionImage.attr({
                            'class': "reactionGif",
                            'data-state': "still",
                            'data-still': results[i].images.fixed_height_still.url,
                            'data-animate': results[i].images.fixed_height.url,
                            'src': results[i].images.fixed_height_still.url
                        });
                        // Appending the label and image tag to the reactionDiv            
                        reactionDiv.append(reactionImage, ratingLabel);
                        // Prependng the reactionDiv to the HTML page in the feel panel then to
                        // "#gifs-appear-here" div
                        panelBody.append(reactionDiv);
                        $("#gifs-appear-here").prepend(feelPanel);
                    }
                });
            $('#gifs-appear-here').off("click");
            $("#gifs-appear-here").on("click", ".reactionGif", function () {
                // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
                var state = $(this).attr("data-state");
                /* If the clicked image's state is still, update its src attribute to what its data-animate value is.
                 Then, set the image's data-state to animate
                 Else set src to the data-still value*/
                if (state === "still") {
                    $(this).attr("src", $(this).attr("data-animate"));
                    $(this).attr("data-state", "animate");
                } else {
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }
            });
            //set button to currently clicked
            $(this).attr("status", "clicked");
        }//if button is already active make it inactive and hide the gifs panel
        else {
            $(this).removeClass("clicked");
            $(this).attr({ "status": "unclicked" });
            $("#" + $(this).attr("data-reaction") + "Panel").remove();
        }
    });
}
