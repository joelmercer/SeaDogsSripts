//Change this to the three letter code of your team
var myTeam = "snb";

var allTeams = JSON.parse('{"snb":"8","mon":"1","hal":"5","cap":"3","bat":"2","vic":"17","cha":"7","blb":"19","que":"9","sha":"13","chi":"10","bac":"16","rou":"11","vdo":"15","dru":"14","rim":"18","she":"60","gat":"12"}');

var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&team_id=" + allTeams[myTeam.toLowerCase()];
var req = new Request(url);
var json = await req.loadJSON();
var allGames = json["SiteKit"]["Schedule"];

var teams = [];
var gameStats = [];
var gameClock = "";
var tie = false;

var speak = "Speaking Error.";
var html = "HTML Error.";
 
var todayDateTime = new Date();
var todayDate = new Date(todayDateTime.getFullYear(), todayDateTime.getMonth(), todayDateTime.getDate(), 0, 0, 0);

for(var game of allGames) {

  var gameSplit = game["date_played"].split("-");
  var timeSplit  = game["schedule_time"].split(":");
 
  if(game["timezone"] == "Canada/Eastern") {
    timeSplit[0]++;
  }

  var gameTime = (timeSplit[0] - 12) + ":" + timeSplit[1] + "PM";
 
  var gameDate = new Date(gameSplit[0], (gameSplit[1]-1), gameSplit[2], 0, 0, 0);

  if(gameDate >= todayDate) {

    teams["homeTeam"] = game["home_team_city"] + " " + game["home_team_nickname"];
    teams["awayTeam"] = game["visiting_team_city"] + " " + game["visiting_team_nickname"];
    game["home_goal_count"] = parseInt(game["home_goal_count"]);
    game["visiting_goal_count"] = parseInt(game["visiting_goal_count"]);

    if(game["home_goal_count"] > game["visiting_goal_count"]) {

      teams["winning"] = teams["homeTeam"];
      teams["winningScore"] = game["home_goal_count"];
      teams["losing"] = teams["awayTeam"];
      teams["losingScore"] = game["visiting_goal_count"];

    } else if(game["home_goal_count"] < game["visiting_goal_count"]) {

      teams["winning"] = teams["awayTeam"];
      teams["winningScore"] = game["visiting_goal_count"];
      teams["losing"] = teams["homeTeam"];
      teams["losingScore"] = game["home_goal_count"];

    } else {

      if(game["started"] == "1") {

        teams["verb"] = "and";
        teams["scorePreText"] = " are tied at ";
        teams["scoreText"] = game["home_goal_count"].toString();
        tie = true;
      }

      teams["winning"] = teams["homeTeam"];
      teams["winningScore"] = game["home_goal_count"];
      teams["losing"] = teams["awayTeam"];
      teams["losingScore"] = game["visiting_goal_count"];
    }

    if(game["final"] == "1" || game["started"] == "1") {

      var url = "http://cluster.leaguestat.com/feed/index.php?feed=gc&key=f322673b6bcae299&client_code=lhjmq&game_id=" + game["game_id"] + "&lang_code=en&fmt=json&tab=clock";
      var req = new Request(url);  
      var json = await req.loadJSON();
      gameStats = json["GC"]["Clock"];

      teams["homeSOG"] = 0;
      teams["awaySOG"] = 0;
      for(var key in gameStats["shots_on_goal"]["home"]) {
        teams["homeSOG"] += Number(gameStats["shots_on_goal"]["home"][key]);
      }
      for(var key in gameStats["shots_on_goal"]["visiting"]) {
        teams["awaySOG"] += Number(gameStats["shots_on_goal"]["visiting"][key]);
      }

      if(!tie) {
        teams["scorePreText"] = " by a score of ";
        teams["scoreText"] = teams["winningScore"] + " to " + teams["losingScore"];
      }
   
      if(game["final"] == "1") {

        switch (game["game_status"]) {
          case "Final":
            teams["finalPeriod"] = " in regulation";
            break;
          case "Final OT":
            teams["finalPeriod"] = " in overtime";
            break;
          case "Final OT2":
            teams["finalPeriod"] = " in the second overtime";
            break;
          case "Final OT3":
            teams["finalPeriod"] = " in the third overtime";
            break;
          case "Final OT4":
            teams["finalPeriod"] = " in the fourth overtime";
            break;
          case "Final SO":
            teams["finalPeriod"] = " in a shootout";
            break;
        }

        teams["verb"] = "defeated";
        teams["currentGame"] = teams["finalPeriod"] + " today at " + game["venue_name"];

      } else if(game["final"] == "0" && game["started"] == "1") {

        if(!tie) {
          teams["verb"] = "are leading";
        }

        switch (game["period_trans"]) {
          case "1":
            teams["finalPeriod"] = "the 1st";
            break;
          case "2":
            teams["finalPeriod"] = "the 2nd";
            break;
          case "3":
            teams["finalPeriod"] = "the 3rd";
            break;
          case "OT1":
            teams["finalPeriod"] = "overtime";
            break;
          case "OT2":
            teams["finalPeriod"] = "the second overtime";
            break;
          case "SO":
            teams["finalPeriod"] = "a shootout";
            break;
        }
        
        gameClock = game["game_clock"].split(":");
        teams["currentGame"] = " in " + teams["finalPeriod"] + " with " + gameClock[1] + " minutes and " + gameClock[2] + " seconds left on the clock";
      }

    } else if(game["final"] == "0" && game["started"] == "0") {

      teams["verb"] = "play";

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

      teams["scorePreText"] = "";
      teams["scoreText"] = "";
      teams["gameDate"] = day + game["date"];
      teams["currentGame"] = " at " + gameTime + " on " + teams["gameDate"] + " at " + game["venue_name"];
    } 

    speak = "The " + teams["winning"] + " " + teams["verb"] + " the " + teams["losing"] + teams["scorePreText"] + teams["scoreText"] + teams["currentGame"] + ".";
    
    html = "<html>";
    html += "<head></head>";
    html += "<body>";
    html += "<table style='width:100%'>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 20px'>Home</td>";
    html += "<td></td>";
    html += "<td style='text-align:center; font-size: 20px'>Away</td></tr>";
    html += "<tr>";
    html += "<td><img style='display: block; margin: 0 auto' src='http://assets.leaguestat.com/lhjmq/logos/168x127/" + game["home_team"] + ".png' /></td>";
    html += "<td style='text-align:center; font-size: 40px'>" + teams["gameDate"] + "</td>";
    html += "<td><img style='display: block; margin: 0 auto' src='http://assets.leaguestat.com/lhjmq/logos/168x127/" + game["visiting_team"] + ".png' /></td>";
    html += "</tr>";
    html += "<tr>";
    html += "<td style='text-align:center; font-size: 20px'>" + teams["homeTeam"] + "</td>";
    html += "<td style='text-align:center; font-size: 40px'>" + game["game_status"] + "</td>";
    html += "<td style='text-align:center; font-size: 20px'>" + teams["awayTeam"] + "</td>";
    html += "</tr>";

    if(game["final"] == "1" || game["started"] == "1") {
      html += "<tr>";
      html += "<td style='text-align:center; font-size: 75px'>" + game["home_goal_count"].toString() + "</td>";
      html += "<td style='text-align:center; font-size: 40px'></td>";
      html += "<td style='text-align:center; font-size: 75px'>" + game["visiting_goal_count"].toString() + "</td>";
      html += "</tr>";
    }

    if(Object.keys(gameStats).length > 0) {
      html += "<tr>";
      html += "<td style='text-align:center; font-size: 30px'>SOG: " + teams["homeSOG"].toString() + "</td>";
      html += "<td style='text-align:center; font-size: 30px'></td>";
      html += "<td style='text-align:center; font-size: 30px'>SOG: " + teams["awaySOG"].toString() + "</td>";
      html += "</tr>";
      html += "<tr>";
      html += "<td style='text-align:center; font-size: 30px'>PP: " + gameStats["power_play"]["goals"]["home"].toString() + "/" + gameStats["power_play"]["total"]["home"].toString() + "</td>";
      html += "<td style='text-align:center; font-size: 30px'></td>";
      html += "<td style='text-align:center; font-size: 30px'>PP: " + gameStats["power_play"]["goals"]["visiting"].toString() + "/" + gameStats["power_play"]["total"]["visiting"].toString() + "</td>";
      html += "</tr>";
    }

    html += "</table>";
    html += "</body>";
    html += "</html>";
    break;
  }
}

WebView.loadHTML(html, null, new Size(0, 100))

console.log(speak);

if (config.runsWithSiri) {
  Speech.speak(speak)
}
