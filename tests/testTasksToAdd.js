const listOfTasks = [
    "Clean the room",
    "Fishing",
    "Programming",
    "Hate your life",
    "Lie down and cry",
    "Question your life choices",
    "Disturb your teacher",
    "Annoy your teacher",
    "Snort some coke",
    "Smoke weed every day",
    "Watch some HAnime",
    "Watch some p-hub",
    "Drink some whiskey",
    "Shower",
    "Do homework",
    "Question your life choices again",
    "Hide a murder",
    "Complete your homework in time",
    "Study maybe? No",
    "Play some games",
    "Play some games again",
    "Play some games once again",
    "Get some friends",
    "Cry over the amount friends you got",
    "Suit up, and get a real job",
    "Drink some beer",
    "Go to school naked",
    "Wish that someone were dead",
    "Git gud",
    "Rob a bank",
    "Lie down, cry a little, cry a lot",
    "Watch Shrek",
    "Watch Shrek 2",
    "Watch Shrek 3",
    "Convert my faith to Church of Shrek",
    "Get some money by going to Malmskillnadsgatan and sell some ass",
    "Git gud, get gf",
    "Re-visit section M78 in Huddinge Sjukhus",
    "Shave my ass",
    "Move from home",
    "Get a life and git gud",
    "Make a shit ton of cash",
    "Buy Microsoft",
    "Listen to Initial D and run around the neighbourhood naked while having flour in the whole face",
    "Cry over VueJS",
    "Cry over ReactJS",
    "Cry over dynamic-typed programming languages",
    "Sell some ass to classmates",
    "Trade some ass? with classmates",
    "Sleep",
]

let taskArray = []

for(let task of listOfTasks) {
    let object = {
        title: task
    }
    taskArray.push(object);
}

module.exports = taskArray