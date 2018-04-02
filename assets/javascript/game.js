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
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    // create local temporary object to hold train data
    var newTrain = {
        trainName: trainName,
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

    // console log 
    console.log("New Train Added!");

    // empty the input areas
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    // prevent trying to reload the page
    return false;
});

trainData.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // store info into variables
    var tName = childSnapshot.val().TrainName;
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


// Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Let's use our brain first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Let's use our brain first)
    // It would be 3:21 -- 5 minutes away

    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

    // // Assumptions
    // var tFrequency = 3;

    // // Time is 3:30 AM
    // var firstTime = "03:30";

    // // First Time (pushed back 1 year to make sure it comes before current time)
    // var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // console.log(firstTimeConverted);

    // // Current Time
    // var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // // Difference between the times
    // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // // Time apart (remainder)
    // var tRemainder = diffTime % tFrequency;
    // console.log(tRemainder);

    // // Minute Until Train
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // // Next Train
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
