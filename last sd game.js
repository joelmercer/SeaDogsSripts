//Change this to the three letter code of your team
var myTeam = "snb";

var allTeams = JSON.parse('{"snb":"8","mon":"1","hal":"5","cap":"3","bat":"2","vic":"17","cha":"7","blb":"19","que":"9","sha":"13","chi":"10","bac":"16","rou":"11","vdo":"15","dru":"14","rim":"18","she":"60","gat":"12"}');

var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&team_id=" + allTeams[myTeam.toLowerCase()];
var req = new Request(url);
var json = await req.loadJSON();
var allGames = json["SiteKit"]["Schedule"];

var speak = "";
var html = "";
 
for(var game of allGames.reverse()) {

  if(game["final"] == "1") {
    url = "http://cluster.leaguestat.com/feed/index.php?feed=gc&key=f322673b6bcae299&client_code=lhjmq&game_id=" + game["game_id"] + "&lang_code=en&fmt=json&tab=clock";
    req = new Request(url);
    json = await req.loadJSON();
    var gameStats = json["GC"]["Clock"];
 
    var homeSOG = 0;
    var awaySOG = 0;
    for(var key in gameStats["shots_on_goal"]["home"]) {
      homeSOG += Number(gameStats["shots_on_goal"]["home"][key]);
    }
    for(var key in gameStats["shots_on_goal"]["visiting"]) {
      awaySOG += Number(gameStats["shots_on_goal"]["visiting"][key]);
    }

    var finalPeriod = "";
    switch (game["game_status"]) {
      case "Final":
        finalPeriod = " in regulation";
        break;
      case "Final OT":
        finalPeriod = " in overtime";
        break;
      case "Final OT2":
        finalPeriod = " in the second overtime";
        break;
      case "Final OT3":
        finalPeriod = " in the third overtime";
        break;
      case "Final OT4":
        finalPeriod = " in the fourth overtime";
        break;
      case "Final SO":
        finalPeriod = " in a shootout";
        break;
    }

    var homeTeam = game["home_team_city"] + " " + game["home_team_nickname"];
    var awayTeam = game["visiting_team_city"] + " " + game["visiting_team_nickname"];
    var won = "";
    var wonScore = "";
    var lost = "";
    var lostScore = "";
    if(game["home_goal_count"] > game["visiting_goal_count"]) {
      won = homeTeam;
      wonScore = game["home_goal_count"];
      lost = awayTeam;
      lostScore = game["visiting_goal_count"];
    } else {
      won = awayTeam;
      wonScore = game["visiting_goal_count"];
      lost = homeTeam;
      lostScore = game["home_goal_count"];
    }

    var gameSplit = game["date_played"].split("-");
    var timeSplit  = game["schedule_time"].split(":");
    if(game["timezone"] == "Canada/Eastern") {
      timeSplit[0]++;
    }

    var gameDate = new Date(gameSplit[0], (gameSplit[1]-1), gameSplit[2], timeSplit[0], timeSplit[1], timeSplit[2]);
    var day = "";
    switch (gameDate.getDay()) {
      case 0:
        day = "Sunday ";
        break;
      case 1:
        day = "Monday ";
        break;
      case 2:
        day = "Tuesday ";
        break;
      case 3:
        day = "Wednesday ";
        break;
      case 4:
        day = "Thursday ";
        break;
      case 5:
        day = "Friday ";
        break;
      case 6:
        day = "Saturday ";
    }

    speak = won + " defeated the " + lost + " by a score of " + wonScore + " to " + lostScore + finalPeriod + " on " +  day + game["date"]  + " at " + game["venue_name"];
        
    var homeTeamImage = "<img style='display: block; margin: 0 auto' src='http://assets.leaguestat.com/lhjmq/logos/168x127/" + game["home_team"] + ".png' />"
    var awayTeamImage = "<img style='display: block; margin: 0 auto' src='http://assets.leaguestat.com/lhjmq/logos/168x127/" + game["visiting_team"] + ".png' />"
    
    html = "<html>";
    html += "<head></head>";
    html += "<body>";
    html += "<table style='width:100%'>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 20px'>Home</td>";
    html += "<td style='text-align:center; font-size: 20px'></td>";
    html += "<td style='text-align:center; font-size: 20px'>Away</td></tr>";
    html += "<tr>";
    html += "<th>" + homeTeamImage + "</th>";
    html += "<th></th>";
    html += "<th>" + awayTeamImage + "</th>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 20px'>" + homeTeam + "</td>";
    html += "<td style='text-align:center; font-size: 50px'>" + game["game_status"] + "</td>";
    html += "<td style='text-align:center; font-size: 20px'>" + awayTeam + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 75px'>" + game["home_goal_count"] + "</td>";
    html += "<td style='text-align:center; font-size: 20px'></td>";
    html += "<td style='text-align:center; font-size: 75px'>" + game["visiting_goal_count"] + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 30px'>SOG: " + homeSOG + "</td>";
    html += "<td style='text-align:center; font-size: 30px'></td>";
    html += "<td style='text-align:center; font-size: 30px'>SOG: " + awaySOG + "</td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 30px'>PP: " + gameStats["power_play"]["goals"]["home"] + "/" + gameStats["power_play"]["total"]["home"] + "</td>";
    html += "<td style='text-align:center; font-size: 30px'></td>";
    html += "<td style='text-align:center; font-size: 30px'>PP: " + gameStats["power_play"]["goals"]["visiting"] + "/" + gameStats["power_play"]["total"]["visiting"] + "</td>";
    html += "</tr>";
    html += "</table>";
    html += "</body>";
    html += "</html>";
    break;
  }
}

WebView.loadHTML(html, null, new Size(0, 150));
console.log(speak);

if (config.runsWithSiri) {
  Speech.speak(speak)
}
