// We'll put some global variables here.
let trainName;
let destination;
let firstTrainTime;
let frequency;

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


    $("#submitBtn").on("click", function(event){
        event.preventDefault();
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstTrainTime = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        console.log(trainName + " " + destination + " " + firstTrainTime + " " + frequency);
    });

});