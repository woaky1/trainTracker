// We'll put some global variables here.
let trainName;
let destination;
let firstTrainTime;
let frequency;

$(document).ready(function(){
    $("#submitBtn").on("click", function(event){
        event.preventDefault();
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        console.log(trainName + " " + destination + " " + firstTrainTime + " " + frequency);
    });

});