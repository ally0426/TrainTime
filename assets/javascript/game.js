// Initialize Firebase
var config = {
    apiKey: "AIzaSyBZFuHAmzWrSBOEgSbVQdlqVZNDNKK6hjI",
    authDomain: "train-4d644.firebaseapp.com",
    databaseURL: "https://train-4d644.firebaseio.com",
    projectId: "train-4d644",
    storageBucket: "train-4d644.appspot.com",
    messagingSenderId: "428207897181"
};

firebase.initializeApp(config);

// create initial train data in db
var trainData = firebase.database();

// button click event to add trains
$("#add-train-btn").on("click", function () {
    // grab user inputs and set variables
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // create local temporary object to hold train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    // upload train data object to db using push function
    trainData.ref().push(newTrain);

    // log to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // alert
    alert("New Train Added!");

    // empty the input areas
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    // prevent trying to reload the page
    return false;
});

trainData.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    // store info into variables
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFirstTrain = childSnapshot.val().firstTrain;
    var tFrequency = childSnapshot.val().frequency;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0].minutes(timeArr[1]));
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrial;

    // if the first train is later than the current time, send arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // to calculate the minutes til arrival, take the current time and subtract the firstTrain time and
        // find the modulus between the difference and the frequency
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainer = differenceTime % tFrequency;
        tMinutes = tFrequency - tRemainder;

        // to calculate the arrival time, add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    // log to console
    console.log("tMinutes: ", tMinutes);
    console.log("tArrival: ", tArrival);

    // add each train's data into table
    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});


