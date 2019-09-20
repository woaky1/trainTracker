// We'll put some global variables here.
let trainNameText = "";
let destinationText = "";
let firstTrainTimeText = "";
let frequencyText = "";
var numberCheck;

$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyBF3_Tfv6mJKwrZhok3aCLTekOVmCQkRAw",
        authDomain: "traintracker-96482.firebaseapp.com",
        databaseURL: "https://traintracker-96482.firebaseio.com",
        projectId: "traintracker-96482",
        storageBucket: "",
        messagingSenderId: "400661139958",
        appId: "1:400661139958:web:6d6917253d25a5d029f7d7"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    
    database.ref().on("value", function(snapshot) {
        console.log(snapshot.val());
        var numberCheckValues = snapshot.val();
        numberCheck = numberCheckValues.trainIndex;
        console.log("numberCheck: " + numberCheck);
    })

    $("#submitBtn").on("click", function(event){
        event.preventDefault();
        trainNameText = $("#trainNameInput").val().trim();
        destinationText = $("#destinationInput").val().trim();
        firstTrainTimeText = $("#firstTrainTimeInput").val().trim();
        frequencyText = $("#frequencyInput").val().trim();
        var trainInfo = {
            name: trainNameText,
            destination: destinationText,
            firstTime: firstTrainTimeText,
            frequency: frequencyText,
            id: numberCheck
        };

        database.ref("/trains").push(trainInfo);
        numberCheck++;
        database.ref().update({
            trainIndex: numberCheck
        });
    });

    database.ref("/trains").on("child_added", function(snapshot) {
        trainSnapshot = snapshot.val();
        console.log(trainSnapshot);
        var newRow = $("<tr>").attr({"data-id":trainSnapshot.id,"data-first-train":trainSnapshot.firstTime,"data-frequency":trainSnapshot.frequency});
        var colName = $("<td scope='col'>").text(trainSnapshot.name);
        var colDestination = $("<td scope='col'>").text(trainSnapshot.destination);
        var colFrequency = $("<td scope='col'>").text(trainSnapshot.frequency);
        // The next seven lines of code are based on the exercises we did in class (Modul 7, exercise 21).
        var firstTimeConverted = moment(trainSnapshot.firstTime, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % trainSnapshot.frequency;
        var tMinutesTillTrain = trainSnapshot.frequency - tRemainder;
        var colMinTill = $("<td scope='col'>").text(tMinutesTillTrain);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var colNextArrival = $("<td scope='col'>").text(moment(nextTrain).format("hh:mm"));
        newRow.append(colName).append(colDestination).append(colFrequency).append(colNextArrival).append(colMinTill);
        $("#trainData").append(newRow);
    });

    var updateInterval = setInterval(updateTimes,5000);

    function updateTimes() {
        for (var i = 0; i < numberCheck; i++) {
            var refreshFirstTime = $("tr[data-id='" + i + "']").attr("data-first-train");
            var refreshFrequency = $("tr[data-id='" + i + "']").attr("data-frequency");
            console.log(refreshFirstTime + refreshFrequency);
            // var firstTimeConverted = moment(refreshSnapshot.firstTime, "HH:mm").subtract(1, "years");
            // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            // var tRemainder = diffTime % refreshSnapshot.frequency;
            // var tMinutesTillTrain = refreshSnapshot.frequency - tRemainder;
            // $("#" + refreshSnapshot.id + "min").text(tMinutesTillTrain);
            // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            // $("#" + refreshSnapshot.id + "arrival").text(moment(nextTrain).format("hh:mm"));
        };
    }; 
});