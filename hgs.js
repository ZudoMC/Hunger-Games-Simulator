const HGS_FLAG = 1;

/*
 Game state
 */

let gameSettings = {
    "hgs_flag":1,
    "name": "Hunger Games",
    "tributes": [],
    "log": [],
    "eventTypes": {
        "fatal": [
            {"message":"{0} swallows an ancient scroll which contains an ancient bug curse that eats them from the inside outwards.", "count": 1, "dead": [0]}, // Thanks, Beth!
            {"message":"{0} trips over a cliff edge.", "count": 1, "dead": [0]},
            {"message":"{0} drinks tainted water and dies.", "count": 1, "dead": [0]},
            {"message":"{0} switched to Hanzo (was Mercy)", "count": 1, "dead": [0]},
            {"message":"{0} gets voted off the show, and is sniped from a distance.", "count": 1, "dead": [0]},
            {"message":"The Terminator travels from the future to kill {0}.", "count": 1, "dead": [0]},
            {"message":"{0} resorts to cannibalism, not realising they are feeding off of themselves.", "count": 1, "dead": [0]},
            {"message":"{0} and {1} get into a fight. {0} triumphantly kills {1}.", "count": 2, "dead": [1]},
            {"message":"{0} and {1} get into a fight. {1} triumphantly kills {0}.", "count": 2, "dead": [0]},
            {"message":"{0} throws a knife at {1}, killing them.", "count": 2, "dead": [1]},
            {"message":"{0} begs {1} to kill them. {1} reluctantly obliges.", "count": 2, "dead": [0]},
            {"message":"{0} kills {1} with their own weapon.", "count": 2, "dead": [1]},
            {"message":"{0} and {1} start fighting. {1} kills {0}, but passes away due to blood loss.", "count": 2, "dead": [0, 1]},
            {"message":"{0} and {1} meet, share resources, start a campfire, ponder deep thoughts before ultimately driving themselves insane and killing themselves.", "count": 2, "dead": [0, 1]},
            {"message":"{0}, {1} and {2} encounter each other. {0} kills {1}, but is taken down by {2}.", "count": 3, "dead": [0, 1]},
            {"message":"{0} and {1} work together to drown {2}.", "count": 3, "dead": [2]}
        ],
        "nonFatal": [
            {"message":"{0} goes hunting.", "count": 1},
            {"message":"{0} ponders their existence.", "count": 1},
            {"message":"{0} injures themself.", "count": 1},
            {"message":"{0} explores the arena.", "count": 1},
            {"message":"{0} fishes.", "count": 1},
            {"message":"{0} camouflages themself in a bush.", "count": 1},
            {"message":"{0} makes a wooden spear.", "count": 1},
            {"message":"{0} discovers a cave.", "count": 1},
            {"message":"{0} collects fruit from a tree.", "count": 1},
            {"message":"{0} receives a knife from a sponsor.", "count": 1},
            {"message":"{0} receives water from a sponsor.", "count": 1},
            {"message":"{0} receives a first-aid kit from a sponsor.", "count": 1},
            {"message":"{0} receives food from a sponsor.", "count": 1},
            {"message":"{0} tries to catch up on some sleep.", "count": 1},
            {"message":"{0} builds a shelter.", "count": 1},
            {"message":"{0} practices fighting.", "count": 1},
            {"message":"{0} thinks about their family.", "count": 1},
            {"message":"{0} tries to spear fish with a trident.", "count": 1},
            {"message":"{0} scares {1} off.", "count": 2},
            {"message":"{0} runs away when {1} isn't looking.", "count": 2},
            {"message":"{0} follows {1} around for a while.", "count": 2},
            {"message":"{0} steals supplies from {1}.", "count": 2},
            {"message":"{0} attacks {1}, but they escape.", "count": 2},
            {"message":"{0} works together with {1}.", "count": 2},
            {"message":"{0} begs {1} to kill them. They refuse, keeping {0} alive.", "count": 2},
            {"message":"{0} scares {1} off.", "count": 2},
            {"message":"{0} runs into {1} in a clearing. They agree to spare each other for now.", "count": 2},
            {"message":"{0} overhears {1} talking to someone in the distance.", "count": 2},
            {"message":"{0} overhears {1} and {2} talking in the distance.", "count": 2},
            {"message":"{0} helps {1} with their wounds.", "count": 2},
            {"message":"{0} and {1} hunt for other tributes.", "count": 2},
            {"message":"{0}, {1} and {2} hunt for other tributes.", "count": 3},
            {"message":"{0}, {1}, {2} and {3} hunt for other tributes.", "count": 4},
            {"message":"{0}, {1}, {2} and {3} break out into a chorus of \"One Day More\".", "count": 4},
            {"message":"{0}, {1}, {2} and {3} break out into a chorus of \"Do You Hear The People Sing?\".", "count": 4},
            {"message":"{0}, {1}, {2}, {3} and {4} hunt for other tributes.", "count": 5},
        ]
    }
};

let autoSimulate = false;
let dontSave = false;
let fileReader = new FileReader();

/*
 Import and export
 */

function gameExport() {
    return btoa(JSON.stringify(gameSettings));
}

function gameImport(settings) {
    try {
        let newSettings = JSON.parse(atob(settings));
        if (newSettings.hgs_flag === HGS_FLAG) {
            return newSettings;
        } else {
            alert("Not a valid save file.");
            console.warn("Save file missing HGS flag");
            return gameSettings;
        }
    } catch (e) {
        alert("Not a valid save file.");
        console.warn("Exception when loading save file", e);
        return gameSettings;
    }
}

function downloadSaveFile() {
    let el = document.createElement("a");
    el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(gameExport()));
    el.setAttribute("download", "Save File - " + gameSettings.name + ".txt");
    el.click();
}

function loadSaveFile() {
    let el = document.createElement("input");
    el.setAttribute("type", "file");
    el.addEventListener("change", () => {
        fileReader.readAsText(el.files[0]);
    });
    el.click();
}

fileReader.addEventListener("load", () => {
   gameSettings = gameImport(fileReader.result);
   updateUI();
});

/*
 String functions
 */

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        let str = this.toString();
        if (arguments.length) {
            let t = typeof arguments[0];
            let key;
            let args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };

function stripHTML(str) {
    let el = document.createElement("div");
    el.innerHTML = str;
    return el.innerText;
}

/*
 Generator functions
 */

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createTribute(district, male) {
    return {
        "name": "District " + district + " " + (male ? "Male" : "Female"),
        "gender": (male ? "M" : "F"),
        "alive": true,
        "_uuid": uuidv4()
    }
}

/*
 Search and update functions
 */
function findTribute(uuid) {

}

function livingTributes() {
    return gameSettings.tributes.filter(t => t.alive);
}

function randomTributes(n) {
    let living = livingTributes();
    living = living.sort(() => 0.5 - Math.random());
    return living.slice(0, n)
}

function getEvent(fatal) {
    let list = gameSettings.eventTypes[fatal ? "fatal" : "nonFatal"];
    list = list.filter(e => e.count <= livingTributes().length);
    return list[Math.floor(Math.random() * list.length)];
}

function setTributeAlive(uuid, alive) {
    for (let tributeNum in gameSettings.tributes) {
        if (gameSettings.tributes[tributeNum]._uuid == uuid) {
            gameSettings.tributes[tributeNum].alive = alive;
        }
    }
}

/*
 Debug functions
 */

function disableAutoSave() {
    localStorage.setItem("DEBUG_autosave_disabled", true);
}

/*
 Load game
 */

if (localStorage.getItem("hgs_game")) {
    gameSettings = gameImport(localStorage.getItem("hgs_game"));
} else {
    let male = true;
    for (let i = 0; i < 24; i++) {
        gameSettings.tributes.push(createTribute(Math.floor((i / 2) + 1), male));
        male = !male;
    }
}

/*
 Save game
 */

window.onbeforeunload = function () {
    if (!localStorage.getItem("DEBUG_autosave_disabled") && !dontSave) {
        localStorage.setItem("hgs_game", gameExport(gameSettings));
    }
};

/*
 UI
 */

function updateUI() {
    $("#game-name").text(gameSettings.name);

    $("#game-tributes").html("");
    for (let tributeNum in gameSettings.tributes) {
        let tribute = gameSettings.tributes[tributeNum];
        $("#game-tributes").append(`<div class="list-group-item ${tribute.alive ? "list-group-item-success" : "list-group-item-danger"}" id="tribute.${tribute._uuid}">${tribute.name}</div>`);
    }

    $("#game-log").html("");
    for (let logID in gameSettings.log) {
        $("#game-log").append(gameSettings.log[logID]);
    }
}

/*
 Game functionality
 */

function loop() {
    if (gameSettings.log.length === 0) {
        gameSettings.log.unshift(`<div class="alert alert-info">Let the games begin!</div>`);
    }
    let fatal = (Math.floor(Math.random() * 3) === 1);

    if (livingTributes().length === 1) {
        gameSettings.log.unshift(`<div class="alert alert-info"><strong>${livingTributes()[0].name}</strong> is the winner!</div>`);
        autoSimulate = false;
    } else if (livingTributes().length < 1) {
        gameSettings.log.unshift(`<div class="alert alert-info">The games end with no single winner.</div>`);
        autoSimulate = false;
    } else {
        console.group("Arena Event");

        let event = getEvent(fatal);

        console.log(event);
        let tributesInvolved = randomTributes(event.count);
        let tributesInvolvedText;

        console.log(tributesInvolved);

        tributesInvolvedText = tributesInvolved.map(t => "<strong>" + t.name + "</strong>");

        if (fatal) {
            for (let trib in tributesInvolved) {
                let tribute = tributesInvolved[trib];
                if (event.dead.indexOf(parseInt(trib)) !== -1) {
                    setTributeAlive(tribute._uuid, false);
                }
            }
        }

        gameSettings.log.unshift(`<div class="alert ${fatal ? "alert-danger" : "alert-success"}">${event.message.formatUnicorn(tributesInvolvedText)}</div>`);

        console.groupEnd();
    }

    if (autoSimulate) {
        loop();
    } else {
        updateUI();
    }
}

$(function () {
    updateUI();

    $("#game-simulate").click(function () {
        loop();
    });

    $("#game-auto").click(function () {
        autoSimulate = true;
        loop();
    });

    $("#game-reset").click(function () {
        for (let tributeID in gameSettings.tributes) {
            gameSettings.tributes[tributeID].alive = true;
        }
        $("#game-log").html("");
        gameSettings.log = [];
        updateUI();
    });

    $("#game-reset-hard").click(function () {
        if (confirm("Are you sure you want to hard reset? All of your custom settings will be lost!")) {
            dontSave = true;
            gameSettings = {};
            localStorage.removeItem("hgs_game");
            window.location.reload();
        }
    });

    $("#game-edit-tributes").click(function () {
        $("#tributes-editor").html("");
        for (let tributeID in gameSettings.tributes) {
            $("#tributes-editor").append(`<p><input type="text" class="form-control tribute-name" placeholder="${gameSettings.tributes[tributeID].name}" data-tribute="${gameSettings.tributes[tributeID]._uuid}"></p>`);
        }
        $("#tributesModal").modal("show");
    });

    $("#tributes-submit").click(function () {
        for (let tributeID in gameSettings.tributes) {
            let newName = stripHTML($(".tribute-name[data-tribute=\"" + gameSettings.tributes[tributeID]._uuid + "\"]").val());
            if (newName != "") {
                gameSettings.tributes[tributeID].name = newName;
            }
        }
        $("#tributesModal").modal("hide");
        updateUI();
    });

    $("#game-import").click(function () {
        loadSaveFile();
    });

    $("#game-export").click(function () {
        downloadSaveFile();
    });

    $("#game-name").click(function () {
       let newName = prompt("Enter the new name.");
       if (newName && newName.length > 0) {
           gameSettings.name = newName;
           updateUI();
       } else if (newName) {
           alert("That name is too short.");
       }
    });
});
