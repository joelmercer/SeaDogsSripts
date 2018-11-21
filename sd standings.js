//Change this to the three letter code of your team
var myTeam = "snb";

var url = url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=statviewtype&type=standings&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&stat=conference&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
var allTeams = json["SiteKit"]["Statviewtype"];

var allDivisions = ["6", "7", "12", "16"];
var overallRankedTeams = [];
var divisionRankedTeams = [];
var conferenceRank = "";
var divisionRank = "";
var overallRank = "";
var speak = "";
var html = "<html><head>";
    
html = "</head><body><table style='width:100%'>";
html += "<tr style='border: 1px solid black;'>";
html += "<td></td>";
html += "<td style='border: 1px solid black; border: 1px solid black;text-align:center; font-size: 15px'> Team </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Overall </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Conference </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Division </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Wins </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Losses </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> OT Losses </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> SO Losses </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Points </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> PP </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Games Played </td>";
html += "</tr>";

for(var division of allDivisions) {

  var url = url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=statviewtype&type=standings&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&stat=d_" + division + "&fmt=json";
  var req = new Request(url);
  var json = await req.loadJSON();
  var allDivisionTeams = json["SiteKit"]["Statviewtype"];

  for(var divisionTeams of allDivisionTeams) {

    if(String(divisionTeams["team_code"]).toLowerCase() == myTeam.toLowerCase()) {
      if(divisionTeams["rank"] == "1") {
        divisionRank = "1st";
      } else if(divisionTeams["rank"] == "2") {
        divisionRank = "2nd";
      } else if(divisionTeams["rank"] == "3") {
        divisionRank = "3rd";
      } else  {
        divisionRank = divisionTeams["rank"] + "th";
      }

    }

    divisionRankedTeams[divisionTeams["overall_rank"]] = divisionTeams["rank"];
  }

}

for(var team of allTeams) {

  if(team["overall_rank"] > 0) {
    overallRankedTeams[team["overall_rank"]-1] = team;
  }

  allDivisions[team["division_id"]] = team["division_id"];

  if(String(team["team_code"]).toLowerCase() == myTeam.toLowerCase()) {

    if(team["overall_rank"] == "1") {
      overallRank = "1st";
    } else if(team["overall_rank"] == "2") {
      overallRank = "2nd";
    } else if(team["overall_rank"] == "3") {
      overallRank = "3rd";
    } else  {
      overallRank = team["overall_rank"] + "th";
    }

    if(team["rank"] == "1") {
      conferenceRank = "1st";
    } else if(team["rank"] == "2") {
      conferenceRank = "2nd";
    } else if(team["rank"] == "3") {
      conferenceRank = "3rd";
    } else  {
      conferenceRank = team["rank"] + "th";
    }

    speak = "The Sea dogs are currently ranked " + overallRank + " overall, " + conferenceRank + " in the " + team["conference_name"] + ", " + divisionRank + " in the " + team["divisname"];
    speak += ", with " + team["wins"] + " wins, " + team["losses"] + " losses, " + team["ot_losses"] + " overtime losses, and " + team["shootout_losses"] + " shootout losses. Giving them " + team["points"] + " points, and a " + (team["percentage_full"] * 100).toFixed(2) + "% points percentage in " + team["games_played"] + " games.";

  }
}

for(var overallTeam of overallRankedTeams) {

  html += "<tr style='border: 1px solid black;'>";
  html += "<td style='border: 1px solid black;''><img style='transform: scale(0.5);' src='http://assets.leaguestat.com/lhjmq/logos/168x127/" + overallTeam["team_id"] + ".png' /></td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["team_name"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["overall_rank"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["rank"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + divisionRankedTeams[overallTeam["overall_rank"]] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["wins"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["losses"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["ot_losses"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["shootout_losses"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["points"] + " </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + (overallTeam["percentage_full"] * 100).toFixed(2) + "% </td>";
  html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + overallTeam["games_played"] + " </td>";
  html += "</tr>";
}

html += "</table></body></html>";

WebView.loadHTML(html, null, new Size(0, 150));
console.log(speak);

if (config.runsWithSiri) {
  Speech.speak(speak)
}
