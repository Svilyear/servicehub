function calculateTimeRemaining(endTime) {
    var now = new Date().getTime();
    var timeRemaining = endTime - now;

    var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return {
        days: days,
        hours: hours,
        minutes: minutes
    };
}

function startCountdown() {
    var launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 200);  // Add 200 days
    launchDate.setHours(launchDate.getHours() + 19); // Add 19 hours

    var interval = setInterval(function () {
        var timeRemaining = calculateTimeRemaining(launchDate);

        if (timeRemaining.days < 0) {
            clearInterval(interval);
            document.getElementById('time').textContent = "Launched!";
        } else {
            document.getElementById('time').textContent = 
                timeRemaining.days + "d " + 
                timeRemaining.hours + "h " + 
                timeRemaining.minutes + "m ";
        }
    }, 1000);
}

startCountdown();  // Start the countdown when the page loads