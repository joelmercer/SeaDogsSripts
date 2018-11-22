var html = "<html><head></head><body><table style='width:100%'>";
html += "<tr style='border: 1px solid black;'>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Draft Team </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Draft Year </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Draft Round </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Draft Pick </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Received From </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> In Exchange For </td>";
html += "<td style='border: 1px solid black; text-align:center; font-size: 15px'> Transaction Date </td>";
html += "</tr>";

var teamAbv = JSON.parse('{"snb":"8","mon":"1","hal":"5","cap":"3","bat":"2","vic":"17","cha":"7","blb":"19","que":"9","sha":"13","chi":"10","bac":"16","rou":"11","vdo":"15","dru":"14","rim":"18","she":"60","gat":"12"}');
var teamCode = JSON.parse('{"8":"snb","1":"mon","5":"hal","3":"cap","2":"bat","17":"vic","7":"cha","19":"blb","9":"que","13":"sha","10":"chi","16":"bac","11":"rou","15":"vdo","14":"dru","18":"rim","60":"she","12":"gat"}');

var allTeamPicks = new Array();
var teamTranscations = new Array();
var teams = ["snb","mon","hal","cap","bat","vic","cha","blb","que","sha","chi","bac","rou","vdo","dru","rim","she","gat"];
var years = ["year-2019", "year-2020", "year-2021"];

for(var team of teams) {
	allTeamPicks[team] = [];
	teamTranscations[team] = [];
	for(var year of years) {
		allTeamPicks[team][year] = [];
		teamTranscations[team][year] = [];
		for(var i = 1; i < 15; i++) {
			var round = "round-" + i;
			allTeamPicks[team][year][round] = [];
			allTeamPicks[team][year][round][team] = "";
			teamTranscations[team][year][round] = [];
			teamTranscations[team][year][round][team] = "";
		}
	}
}

var allTranscations = [];

var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=transactions&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&season_id=184&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
allTranscations.push(json["SiteKit"]["Transactions"]);

var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=transactions&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&season_id=186&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
allTranscations.push(json["SiteKit"]["Transactions"]);


var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=transactions&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&season_id=187&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
allTranscations.push(json["SiteKit"]["Transactions"]);


var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=transactions&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&season_id=189&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
allTranscations.push(json["SiteKit"]["Transactions"]);


var url = "http://lscluster.hockeytech.com/feed/?feed=modulekit&view=transactions&key=f322673b6bcae299&fmt=json&client_code=lhjmq&lang=en&season_id=190&fmt=json";
var req = new Request(url);
var json = await req.loadJSON();
allTranscations.push(json["SiteKit"]["Transactions"]);

for(var transactions of allTranscations) {
	for(var transcation of transactions) {

		var team1 = transcation["team1_id"];
		var team2 = transcation["team2_id"];
		for(var pick of transcation["picks"]) {
			if(team1 == pick["team_id"]) {
				if(pick["team_code"]) {
					var orginalTeam = pick["team_code"].toLowerCase();
				} else {
					var orginalTeam = teamCode[team1];
				}
				var toTeam = teamCode[team2];
				var fromTeam = teamCode[team1];
				var year = "year-" + pick["draft_year"];
				var round = "round-" + pick["draft_round"];
				
				if(parseInt(pick["draft_year"]) >= 2019) {
					allTeamPicks[orginalTeam][year][round][orginalTeam] = null;
					allTeamPicks[toTeam][year][round][orginalTeam] = teamCode[team1];
					teamTranscations[toTeam][year][round][fromTeam] = transcation["id"];
				}		

			} else {

				if(pick["team_code"]) {
					var orginalTeam = pick["team_code"].toLowerCase();
				} else {
					var orginalTeam = teamCode[team2];
				}
				var toTeam = teamCode[team1];
				var fromTeam = teamCode[team2];
				var year = "year-" + pick["draft_year"];
				var round = "round-" + pick["draft_round"];

				if(parseInt(pick["draft_year"]) >= 2019) {
					allTeamPicks[orginalTeam][year][round][orginalTeam] = null;
					allTeamPicks[toTeam][year][round][orginalTeam] = teamCode[team2];
					teamTranscations[toTeam][year][round][fromTeam] = transcation["id"];
				}
			}
		}
		for(var players of transcation["players"]) {

		}
	}
}

for(var team of teams) {
	for(var year of years) {
		for(var i = 1; i < 15; i++) {
			var round = "round-" + i;
			for(var pickTeam of teams) {
				if(allTeamPicks[team][year][round][pickTeam] != null) {
					var receivedFrom = allTeamPicks[team][year][round][pickTeam]
					html += "<tr style='border: 1px solid black;'>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + team + " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + year.substr(5); + " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + i + " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + pickTeam + " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + receivedFrom + " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> ";
					var transcationDate = "";
					for(var transactions of allTranscations) {
						for(var transcation of transactions) {
							if(teamTranscations[team][year][round][receivedFrom] == transcation["id"]) {
								transcationDate = transcation["transaction_date"];
								var team1 = transcation["team1_id"];
								var team2 = transcation["team2_id"];
								for(var pick of transcation["picks"]) {
									if(team1 == pick["team_id"]) {
										if(team == teamCode[pick["team_id"]]) {
											if(pick["team_code"]) {
												var orginalTeam = pick["team_code"].toLowerCase();
											} else {
												var orginalTeam = teamCode[team1];
											}
											html += "RD_" + pick["draft_round"] + ", " + pick["draft_year"] + " (" + orginalTeam + ") </br>";
										}
									} else {
										if(team == teamCode[pick["team_id"]]) {
											if(pick["team_code"]) {
												var orginalTeam = pick["team_code"].toLowerCase();
											} else {
												var orginalTeam = teamCode[team2];
											}
											html += "RD_" + pick["draft_round"] + ", " + pick["draft_year"] + " (" + orginalTeam + ") </br>";
										}
									}
								}
								for(var player of transcation["players"]) {
									if(team != teamCode[player["team_id"]]) {
										html += player["first_name"] + " " + player["last_name"] + "</br>";
									}
								}
							}
						}
					}
					html += " </td>";
					html += "<td style='border: 1px solid black; text-align:center; font-size: 20px'> " + transcationDate + " </td>";
					html += "</tr>";
				}
			}
		}
	}
}

html += "</table></body></html>";

WebView.loadHTML(html, null, new Size(0, 100))

console.log(html);
