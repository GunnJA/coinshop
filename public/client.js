let $nextButt = $("#nextButt");
let $logButt = $("#logButt");
let $outButt = $("#outButt");
let $signButt = $("#signButt");
let $userField = $("#username");
let $passField = $("#password");
let $passDiv = $("#passwordDiv");
let $signForm = $("#signForm");
let $pollNextButt = $("#pollNextButt");
let $pollName = $("#pollName");
let $option1Input = $("#option1Input");
let $option2Input = $("#option2Input");
let $optionsDiv = $("#optionsDiv");
let $pollCreateButt = $("#pollCreateButt");
let $pollAddButt = $("#pollAddButt");
let $pollSpace = $("#pollSpace");
let $existingSpace = $("#existingSpace");
let $newOptionDiv = $("#newOptionDiv");
let $optionAddInput = $("#optionAddInput");
let $newPollDiv = $("#newPollDiv");
let userVar;

$( window ).load(function() {
   //let pollshareRoute = `${window.location.pathname}${window.location.search}`;
   let obj = $("#existingSpace").data("key");
   if (obj) {
        console.log("pollspace",obj);
        pollObjDisplay(obj);
   }
});

function loginSuccess(user) {
    $("#chartContainer").empty();
    $("#pollSpace").empty();
    $("#existingSpace").empty();
    $("#logFormDiv").toggle();
    $("#newPoll").toggle();
    $("#outButt").toggle();
    $("body").prepend(`<p id="loggedIn">(logged in as ${user})</p>`);
    showPolls(user);
    userVar = user;
    
}

function logoutSuccess() {
    $("#logFormDiv").toggle();
    $("#newPoll").toggle();
    $("#outButt").toggle();
    $("#chartContainer").empty();
    $("#pollSpace").empty();
    $("#existingSpace").empty();
    $("#loggedIn").remove();
    $("#username").val("");
    $("#password").val("");
    userVar = undefined;
}

function showPolls(user) {
    let getStr;
    let userDesc;
    let hide;
    if (user) {
        getStr = `/existing?user=${user}`;
        userDesc = user;
        hide = "";
    } else {
        getStr = "/existing";
        userDesc = "all users";
        hide = "hidden";
    }
    console.log("getstr",getStr);
    $.get(getStr, function(data) {
        if (data.length > 0) {
            let itemID = data.length;
            let newHTML = `<ul id="polls">polls by ${userDesc}<br>`;
            $.each(data, function(key, value) {
                itemID -= 1;
                let item = data[itemID];
                newHTML += `<li id="${itemID}poll"><button class="editButt" data-key="${item.name}" id="${itemID}editButt">${item.name}</button>`
                newHTML += `<button class="delButt" data-key="${item.name}" id="${itemID}delButt" ${hide}>Delete</button></li>`
            });
            $existingSpace.append(newHTML);
        }
    });
}

function optionsPop() {
    console.log("optionsPop");
    if ($option1Input.val().length >= 1 && $option2Input.val().length >= 1) {
        $pollCreateButt.prop("disabled", false);
    } else {
        $pollCreateButt.prop("disabled", true);
    }
}

function modOption(user,pollName,option) {
    return new Promise(function(resolve,reject) {
        console.log("modoption",option);
        $.post(`/modify?user=${user}&name=${pollName}&option=${option}`, function(response) {
            if (response.error) {
                window.alert(response.error);
            } else {
                resolve(response);
            }
        });
    });
}

function pollObjDisplay(obj) {
    let linkName = obj.name.replace(/\s+/g,"%20");
    let newHTML = `Share URL:<input type="text" class="shareURL" value="https://testingpollapp.herokuapp.com/pollshare?name=${linkName}"></input>`;
    newHTML += `<ul id="poll" data-key="${obj.name}">${obj.name}<br>`;
    let itemID = 0;
    $.each(obj.options, function(key, value) {
        itemID += 1;
        newHTML += `<li id="${itemID}li"><button class="voteButt" data-key="${key}" id="${itemID}Butt">Vote</button>${key} - ${value}</li>`
    });
    if (userVar) {
        newHTML += `New Option:<input type="text" id="optionAddInput" class="option"><br>`
        newHTML += `<button type="submit" class="addOption" data-key="${obj.name}">Create</button>`
    }
    $pollSpace.empty();
    $pollSpace.append(newHTML);
    chartBuilder(obj);
}

function chartBuilder(obj) {
    let dataPoints = [];
    $.each(obj.options, function(key, value) {
        dataPoints.push({ label: key, y: value});
        });
	let chart = new CanvasJS.Chart("chartContainer", {
		title:{
			text: obj.name              
		},
		data: [              
		{
			// Change type to "doughnut", "line", "splineArea", etc.
			type: "column",
			dataPoints
		}
		]
	});
	chart.render();
}

// Sign in
$signButt.on('click', function(event) {
    event.preventDefault();
    let userEntry = $("#usernameNew").val();
    let passEntry = $("#passwordNew").val();
    $.get(`/signup?user=${userEntry}&pass=${passEntry}`, function(obj) {
        if (obj.loggedIn === true) {
            loginSuccess(userEntry);
        } else {
            console.log("signup error");
        }
    });
});

// Login
$logButt.on('click', function(event) {
    event.preventDefault();
    let userEntry = $("#username").val();
    let passEntry = $("#password").val();
    $.get(`/login?user=${userEntry}&pass=${passEntry}`, function(obj) {
        if (obj.loggedIn) {
            loginSuccess(userEntry);
        } else {
            window.alert("incorrect password");
            $passfield.val("");
            console.log("login error");
        }
    });
});

// New User
$("#altButt").on('click', function(event) {
    event.preventDefault();
    $("#signForm").toggle();
    $("#logForm").toggle();
    if ($(this).hasClass("new")) {
        $(this).toggleClass("new").toggleClass("existing").text("Existing User?");
    } else {
        $(this).toggleClass("new").toggleClass("existing").text("New User?");
    }
});


// Logout
$outButt.on('click', function(event) {
    event.preventDefault();
    $.get('/logout', function(obj) {
        if (obj.loggedIn === false) {
            logoutSuccess();
        } else {
            console.log("logout error");
        }
    });
});

// Create Poll
$pollNextButt.on('click', function(event) {
    event.preventDefault();
    if ($pollName.val().length > 0) {
        let pollName = $pollName.val();
        $.get(`/new?user=${userVar}&name=${pollName}`, function(valid) {
            if (valid.existing) {
                window.alert(`${pollName} already exists, choose another name`);
            } else {
                $optionsDiv.toggle();
                $pollName.prop("disabled", true);
            }
        });
    } else {
        window.alert("Need to name your poll son.")
    }
});

$(".option").on("change",optionsPop);
//$(".option").on("change",newOptionPop);

// Create initial options
$pollCreateButt.on('click', function(event) {
    event.preventDefault();
    let pollName = $pollName.val();
    let option1 = $option1Input.val();
    let option2 = $option2Input.val();
    modOption(userVar,pollName,option1).then(function() {
        modOption(userVar,pollName,option2).then(function(obj) {
            pollObjDisplay(obj);
         });
    });
    $newOptionDiv.toggle();
    $optionsDiv.toggle();
    $newPollDiv.toggle();
});

// Add Option
$pollAddButt.on('click', function(event) {
    event.preventDefault();
    let pollName = $pollName.val();
    let option = $optionAddInput.val();
    modOption(userVar,pollName,option).then(function(obj) {
        console.log("polladdbutt",obj);
            pollObjDisplay(obj);
            $optionAddInput.val("");
    });
});

// Vote/add option
$("#pollSpace").on('click', 'button', function(event) {
    event.preventDefault();
    let $this = $(this);
    if ($this.hasClass("addOption")) {
        let option = $("#optionAddInput").val();
        let pollName = $(this).data("key");
        console.log("option", option);
        modOption(userVar,pollName,option).then(function(obj) {
            console.log("polladdbutt",obj);
            pollObjDisplay(obj);
            $optionAddInput.val("");
        });
    } else if ($this.hasClass("voteButt")) {
        let pollName = $(this).parent().parent().data("key");
        let option = $(this).data("key");
        console.log("option",option, "name", pollName);
        $.get(`/vote?name=${pollName}&option=${option}`, function(obj) {
            console.log("pollspace",obj);
            pollObjDisplay(obj);
            $(".voteButt").toggle();
        });
    }
})

// Select/delete Poll
$("#existingSpace").on('click', 'button', function(event) {
    event.preventDefault();
    let $this = $(this);
    let pollName = $this.data("key");
    console.log(pollName);
    if ($this.hasClass("editButt")) {
        $.get(`/poll?name=${pollName}`, function(obj) {
            console.log("pollspace",obj);
            pollObjDisplay(obj);
        });
    } else {
        $.get(`/delpoll?name=${pollName}&user=${userVar}`, function(obj) {
            console.log("delpoll",obj);
            if (obj.delete === true) {
                $this.parent().remove();
            }
        });
    }
})

// show polls
$("#allPollsButt").on('click', function(event) {
    event.preventDefault();
    console.log("pressed");
    showPolls();
});
