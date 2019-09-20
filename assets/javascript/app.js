// We'll put some global variables here.
let trainNameText = "";
let destinationText = "";
let firstTrainTimeText = "";
let frequencyText = "";
var numberCheck;

// We use document ready to make sure no javascript tries to fire before the page has fully loaded.
$(document).ready(function(){
    // Configuring Firebase
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
    
    // As part of our auto-update feature, we need a value that is unique to each train that we can refer to as we create new pieces of data. That way, we can refer to that number later when we update. That value is "trainIndex" and is obtained from Firebase. Here we grab that value to use in the next function.
    database.ref().on("value", function(snapshot) {
        var numberCheckValues = snapshot.val();
        numberCheck = numberCheckValues.trainIndex;
    })

    // This is an event listener looking for clicks on our form submit button. It takes the user data, saves it as variables and then sends them to Firebase for storage.
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

        // Here we update trainIndex, increasing it by one and sending the new value to Firebase. This will insure that the next train entered will get its own unique ID number.
        numberCheck++;
        database.ref().update({
            trainIndex: numberCheck
        });
    });

    // Here we have a event listener that we use to display the data from Firebase in our table.
    database.ref("/trains").on("child_added", function(snapshot) {
        trainSnapshot = snapshot.val();
        var newRow = $("<tr>").attr({"data-id":trainSnapshot.id,"data-first-train":trainSnapshot.firstTime,"data-frequency":trainSnapshot.frequency});
        var colName = $("<td scope='col'>").text(trainSnapshot.name);
        var colDestination = $("<td scope='col'>").text(trainSnapshot.destination);
        var colFrequency = $("<td scope='col'>").text(trainSnapshot.frequency);
        // The next seven lines of code are based on the exercises we did in class (Modul 7, exercise 21).
        var firstTimeConverted = moment(trainSnapshot.firstTime, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % trainSnapshot.frequency;
        var tMinutesTillTrain = trainSnapshot.frequency - tRemainder;
        // Note in colMinTill and colNextArrival how we take the id number we set early and build it into the id of these td elements so we can update them later using a for loop.
        var colMinTill = $("<td scope='col' id='" + trainSnapshot.id + "min'>").text(tMinutesTillTrain);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var colNextArrival = $("<td scope='col' id='" + trainSnapshot.id + "arrival'>").text(moment(nextTrain).format("hh:mm"));
        newRow.append(colName).append(colDestination).append(colFrequency).append(colNextArrival).append(colMinTill);
        $("#trainData").append(newRow);
    });

    // This setInterval is what we use to update the minutes until the next train and next train arrival time every minute.
    var updateInterval = setInterval(updateTimes,60000);

    function updateTimes() {
        for (var i = 0; i < numberCheck; i++) {
            var refreshFirstTime = $("tr[data-id='" + i + "']").attr("data-first-train");
            var refreshFrequency = $("tr[data-id='" + i + "']").attr("data-frequency");
            var firstTimeConverted = moment(refreshFirstTime, "HH:mm").subtract(1, "years");
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            var tRemainder = diffTime % refreshFrequency;
            var tMinutesTillTrain = refreshFrequency - tRemainder;
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            $("#" + i + "min").text(tMinutesTillTrain);
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            $("#" + i + "arrival").text(moment(nextTrain).format("hh:mm"));
        };
    }; 
});