(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var rosterObj = {
    celtics: {
        roster: {},
        leaders: {
            pts: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            ast: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            reb: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']]
        }
    },
    away: {
        roster: {},
        leaders: {
            pts: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            ast: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']],
            reb: [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']]
        }
    }
};
// LOCAL
var feeds = {
    todaysScores: 'http://localhost:8888/data/mobile-stats-feed/todays_scores.json',
    celticsRoster: 'http://localhost:8888/data/mobile-stats-feed/celtics_roster.json',
    awayRoster: function awayRoster(awayTn) {
        return 'http://localhost:8888/data/mobile-stats-feed/away_roster.json';
    },
    bioData: 'http://localhost:8888/data/bio-data.json',
    playercard: function playercard(pid) {
        return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-' + pid + '.json';
    },
    playercardAway: function playercardAway(pid) {
        return 'http://localhost:8888/data/mobile-stats-feed/playercards/playercard-202330.json';
    },
    gamedetail: function gamedetail(gid) {
        return 'http://localhost:8888/data/mobile-stats-feed/gamedetail.json';
    },
    standings: 'http://localhost:8888/data/mobile-stats-feed/standings.json',
    leagueLeaders: 'http://localhost:8888/data/league_leaders.json'
};
// ONLINE
/*var feeds = {
    todaysScores: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/00_todays_scores.json',
    celticsRoster: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/celtics_roster.json',
    awayRoster: function(awayTn){
        return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/teams/' + awayTn + '_roster.json';
    },
    bioData: 'http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/json/bio-data.json',
    playercard: function(pid){
        return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
    },
    playercardAway: function(pid){
        return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/players/playercard_' + pid + '_02.json';
    },
    gamedetail: function(gid) {
        return 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/scores/gamedetail/' + gid + '_gamedetail.json';
    },
    standings: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/2017/00_standings.json',
    leagueLeaders: 'http://stats.nba.com/stats/homepagev2?GameScope=Season&LeagueID=00&PlayerOrTeam=Player&PlayerScope=All+Players&Season=2017-18&SeasonType=Regular+Season&StatType=Traditional&callback=?'
};*/
var gameStarted = false;
var playerSpotlightCounter = 1;
jQuery(document).ready(function () {
    var gid = '';
    var awayTeam = '';
    var awayTn = '';
    var date = new Date();
    var leftWrapCounter = false;
    jQuery.ajax({
        url: feeds.todaysScores,
        async: false,
        success: function success(todaysScoresData) {
            for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                    // TRANSITIONS
                    var _cycle = function _cycle() {
                        mobileApp(); // DURATION: 25s
                        setTimeout(function () {
                            leaders(gid);
                        }, 25000);
                        setTimeout(social, 69000);
                        /*                        setTimeout(function(){
                                                    playerSpotlight(rosterObj);
                                                }, 79000);*/
                    };

                    //CHANGE THIS
                    awayTeam = todaysScoresData.gs.g[i].v.ta;
                    awayTn = todaysScoresData.gs.g[i].v.tn.toLowerCase();
                    gid = todaysScoresData.gs.g[i].gid;
                    loadRosterData(awayTeam, awayTn);
                    scoresInit(todaysScoresData);
                    standingsInit(awayTeam);
                    /*                    mobileAppInit();*/
                    leagueLeaders();
                    leftWrap();
                    _cycle();
                    setInterval(_cycle, 85000);
                }
            }
        }
    });
    // loadRosterData(); ONLY ONCE
    /*    setTimeout(leaders(gid, gameStarted), 400);*/
});

function cycle() {}
/*======================================
=            MISC FUNCTIONS            =
======================================*/
function playerAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

function generateTimeline(selectedPlayer) {
    // APPEND: TIMELINE
    var seasonsPlayed = rosterObj.celtics.roster[selectedPlayer].stats.sa.length;
    var timelineHTML = '';
    var seasonYearHTML = '';
    for (var i = 0; i < seasonsPlayed; i++) {
        var teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].ta;
        var traded = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl.length;
        var segmentInner = "";
        var title = "";
        var seasonYearText = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].val;
        if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta) {
            // If this is a new team, start the team wrap.
            title = teamAbbreviation;
        }
        if (traded) {
            for (var x = 0; x < traded; x++) {
                var gpTot = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].gp;
                var gp = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].gp;
                var gpPercentage = Math.round(gp / gpTot * 100);
                teamAbbreviation = rosterObj.celtics.roster[selectedPlayer].stats.sa[i].spl[x].ta;
                if (i === 0 || teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i - 1].ta && teamAbbreviation !== rosterObj.celtics.roster[selectedPlayer].stats.sa[i + 1].ta) {
                    // If this is a new team, start the team wrap.
                    title = teamAbbreviation;
                } else {
                    title = "";
                }
                segmentInner += '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" style="" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + '</p></div>';
            }
        } else {
            segmentInner = '<div data-season-year="' + seasonYearText + '" data-team="' + teamAbbreviation + '" class="segment-inner ' + teamAbbreviation + '-bg"><p>' + title + '</p></div>';
        }
        timelineHTML += '<div class="segment">' + segmentInner + '</div>';
        seasonYearHTML += '<div class="segment"><p>' + seasonYearText + '</p></div>';
    }
    jQuery(".timeline-wrap").html('<div class="timeline appended">' + timelineHTML + '</div><div class="season-year appended">' + seasonYearHTML + '</div>');
}

function createIndex(keys, array) {
    var newArr = keys.map(function (item) {
        return array.indexOf(item);
    });
    return newArr;
}

function round(number) {
    if (typeof number !== "number" || number == undefined) {
        return number;
    } else {
        return number.toFixed(1);
    }
}
/*==================================
=            INITIALIZE            =
==================================*/
function checkGameStatus() {
    if (!gameStarted) {
        jQuery.ajax({
            url: feeds.todaysScores,
            async: false,
            success: function success(todaysScoresData) {
                var gid = '';
                for (var i = 0; i < todaysScoresData.gs.g.length; i++) {
                    if (todaysScoresData.gs.g[i].h.ta == 'BOS') {
                        if (todaysScoresData.gs.g[i] !== 1) {
                            gameStarted = true;
                        }
                    }
                }
            }
        });
    }
    return true;
};
/*============================================================
=            LOAD ROSTER INFO (build rosterObj)              =
============================================================*/
function loadRosterData(awayTeam, awayTn) {
    var roster = '';
    jQuery.ajax({
        url: feeds.celticsRoster,
        async: false,
        success: function success(data) {
            roster = data;
            for (var property in roster.t) {
                if (property !== 'pl') {
                    rosterObj.celtics[property] = roster.t[property];
                }
            }
        },
        error: function error() {}
    });
    var awayRoster = '';
    jQuery.ajax({
        url: feeds.awayRoster(awayTn),
        async: false,
        success: function success(data) {
            awayRoster = data;
            for (var property in awayRoster.t) {
                if (property !== 'pl') {
                    rosterObj.away[property] = awayRoster.t[property];
                }
            }
        },
        error: function error() {}
    });
    var bioData = '';
    jQuery.ajax({
        url: feeds.bioData,
        async: false,
        success: function success(data) {
            bioData = data;
        },
        error: function error() {}
    });
    for (var i = 0; i < roster.t.pl.length; i++) {
        var pid = roster.t.pl[i].pid;
        rosterObj.celtics.roster[pid] = roster.t.pl[i];
        for (var property in bioData[pid]) {
            rosterObj.celtics.roster[pid].bio = bioData[pid];
        };
        jQuery.ajax({
            url: feeds.playercard(pid),
            async: false,
            success: function success(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca.sa[data.pl.ca.sa.length - 1];
                } else {
                    rosterObj.celtics.roster[pid].stats = data.pl.ca;
                }
            },
            error: function error() {}
        });
    }
    for (var i = 0; i < awayRoster.t.pl.length; i++) {
        var pid = awayRoster.t.pl[i].pid;
        rosterObj.away.roster[pid] = awayRoster.t.pl[i];
        jQuery.ajax({
            url: feeds.playercardAway(pid), // CHANGE PID
            async: false,
            success: function success(data) {
                if (data.pl.ca.hasOwnProperty('sa')) {
                    rosterObj.away.roster[pid].stats = data.pl.ca.sa[data.pl.ca.sa.length - 1];
                } else {
                    rosterObj.away.roster[pid].stats = data.pl.ca;
                }
            },
            error: function error() {}
        });
    }
    for (var team in rosterObj) {
        for (var player in rosterObj[team].roster) {
            for (var stat in rosterObj[team].leaders) {
                rosterObj[team].leaders[stat].push([rosterObj[team].roster[player].fn.toUpperCase(), rosterObj[team].roster[player].ln.toUpperCase(), rosterObj[team].roster[player].stats[stat], rosterObj[team].roster[player].pid]);
            }
        }
    }
    for (var team in rosterObj) {
        for (var stat in rosterObj[team].leaders) {
            rosterObj[team].leaders[stat].sort(function (a, b) {
                return b[2] - a[2];
            });
        }
    }
    console.log('SORTED:');
    console.log(rosterObj);
};

function statsNotAvailable(pid) {
    rosterObj[pid].stats = {};
    rosterObj[pid].stats.sa = [{}];
    rosterObj[pid].stats.hasStats = false;
    var caIndex = ['gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'nostats'];
    var saIndex = ['tid', 'val', 'gp', 'gs', 'min', 'fgp', 'tpp', 'ftp', 'oreb', 'dreb', 'reb', 'ast', 'stl', 'blk', 'tov', 'pf', 'pts', 'spl', 'ta', 'tn', 'tc'];
    for (var i = 0; i < saIndex.length; i++) {
        rosterObj[pid].stats.sa[0][saIndex[i]] = "N/A";
        if (i === 1) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = playerCardYear.toString().substr(2, 2) + "-" + (playerCardYear + 1).toString().substr(2, 2);
        }
        if (i === 17) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = [];
        }
        if (i === 18) {
            rosterObj[pid].stats.sa[0][saIndex[i]] = 'BOS';
        }
    }
    for (var i = 0; i < caIndex.length; i++) {
        rosterObj[pid].stats[caIndex[i]] = "N/A";
        if (i === 15) {
            rosterObj[pid].stats[caIndex[i]] = true;
        }
    }
};

function loadGameDetail(gid) {};

function loadAwayTeamData() {}
/*==================================
=            RIGHT WRAP            =
==================================*/
function playerSpotlight(rosterObj) {
    /* 1 - WHITE LINE HORIZTONAL */
    setTimeout(function () {
        jQuery('.white-line.horizontal').addClass('transition-1');
    }, 500);
    setTimeout(function () {
        jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition-1');
    }, 800);
    /* 2b - WHITE LINE VERTICAL */
    setTimeout(function () {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition-1');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition-1');
    }, 1000);
    /* 3 - GENERATE AND REVEAL PLAYER BOXES */
    setTimeout(function () {
        jQuery('.social-top, .social-bottom').addClass('transition-1');
        jQuery('.player-box-wrap').addClass('transition-1');
    }, 1200);
    /* 4 - APPEND HEADSHOTS */
    setTimeout(function () {
        jQuery('.player-box-wrap').addClass('transition-2');
        jQuery('.player-box').addClass('transition-1');
        var delay = 0;
        var forinCounter = 0;
        for (var player in rosterObj.celtics.roster) {
            var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj.celtics.roster[player].pid + '.png';
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').append('<img class="appended headshot" src="' + headshot + '"/>');
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ')').attr('data-pid', rosterObj.celtics.roster[player].pid);
            jQuery('.player-box img').on("error", function () {
                jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
            });
            jQuery('.player-box:nth-child(' + (forinCounter + 1) + ') img').delay(delay).fadeTo(300, 1);
            delay += 30;
            forinCounter++;
        }
    }, 3000);
    /* 5 - PLAYER SELECT */
    var selectedPlayer = '';
    setTimeout(function () {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').addClass('selected');
        selectedPlayer = jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').attr('data-pid');
        jQuery('.player-box').not('.replacement.selected').delay(500).addClass('transition-4');
    }, 4000);
    /* 6 - PLAYER BOX EXPAND */
    setTimeout(function () {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
    }, 5000);
    /* 7 - SPOTLIGHT HTML */
    setTimeout(function () {
        generateTimeline(selectedPlayer);
        jQuery('.player-box.replacement.selected').clone().appendTo('.block-wrap.player-spotlight .top-wrap');
        jQuery('.player-spotlight .selected').addClass('.appended');
        jQuery('.block-wrap.player-spotlight').addClass('transition-1');
        jQuery('.block-wrap.social').addClass('transition-1');
        var stats = rosterObj.celtics.roster[selectedPlayer].stats;
        jQuery('.player-spotlight .top-wrap .player-top').append('<img class="silo appended" src="http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/media/silo-466x591-' + rosterObj.celtics.roster[selectedPlayer].pid + '.png" /><div class="top appended"><div class="player-name-wrap"><p class="player-name"><span>' + rosterObj.celtics.roster[selectedPlayer].fn.toUpperCase() + '</span> <br> ' + rosterObj.celtics.roster[selectedPlayer].ln.toUpperCase() + '</p></div><p class="player-number">' + rosterObj.celtics.roster[selectedPlayer].num + '</br><span>' + rosterObj.celtics.roster[selectedPlayer].pos + '</span></p></div><div class="middle appended"><ul class="info clearfix"><li><p>AGE<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + playerAge(rosterObj.celtics.roster[selectedPlayer].dob) + '</span></p></li><li><p>HT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].ht + '</span></p></li><li><p>WT<span class="sm-hide">:&nbsp;</span> </br><span class="info-value">' + rosterObj.celtics.roster[selectedPlayer].wt + '</span></p></li></ul></div><div class="bottom full clearfix sm-hide appended"><table class="averages"><tr class="averages-labels"><td><p>GP</p></td><td><p>PPG</p></td><td><p>RPG</p></td><td><p>APG</p></td></tr><tr class="averages-season"><td class="gp"><p></p></td><td class="pts"><p></p></td><td class="reb"><p></p></td><td class="ast"><p></p></td></tr></table></div>');
        jQuery(".player-spotlight .averages-season").html('<td class="appended"><p>' + stats.sa[0].gp + '</p></td><td class="appended"><p>' + stats.sa[0].pts + '</p></td><td class="appended"><p>' + stats.sa[0].reb + '</p></td><td class="appended"><p>' + stats.sa[0].ast + '</p></td>');
        jQuery('.player-spotlight .player-name').fadeTo(200, 1);
        var playerFacts = rosterObj.celtics.roster[selectedPlayer].bio.personal;
        for (var i = 0; i < 3; i++) {
            var factIndex = Math.floor(Math.random() * playerFacts.length);
            jQuery('.player-spotlight .bottom-wrap').append('<div class="dyk-box appended"><p>' + playerFacts[factIndex] + '</p></div>');
        };
        jQuery('.player-spotlight .bottom-wrap').addClass('transition-1');
        setTimeout(function () {
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(2)').addClass('transition-2');
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-1');
        }, 1000);
        setTimeout(function () {
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(3)').addClass('transition-2');
            jQuery('.player-spotlight .bottom-wrap .dyk-box:nth-of-type(4)').addClass('transition-1');
        }, 1500);
    }, 6000);
    /* 8 - SPOTLIGHT SLIDE IN */
    setTimeout(function () {
        jQuery('.player-spotlight .player-top .player-name, .player-spotlight .player-name-wrap, .player-spotlight .headshot, .player-spotlight .info, .player-spotlight .silo, .player-spotlight .averages, .player-spotlight .player-number').addClass('transition-1');
        setTimeout(function () {
            jQuery('.block-wrap.player-spotlight .player-box').remove();
        }, 4000);
        if (playerSpotlightCounter < 16) {
            playerSpotlightCounter++;
        } else {
            playerSpotlightCounter = 0;
        }
    }, 7000);
    /* 9 - SPOTLIGHT SLIDE OUT */
    setTimeout(function () {
        jQuery('.player-spotlight .bottom-wrap, .player-spotlight .top-wrap').addClass('transition-2');
    }, 8000);
    /* 10 - DONE. REMOVE */
    setTimeout(function () {
        jQuery(' .player-spotlight .appended').remove();
        jQuery(' .player-spotlight .selected').removeClass('selected');
        for (var i = 1; i < 10; i++) {
            jQuery('.right-wrap .transition-' + i).removeClass('transition-' + i);
        }
    }, 9000);
}

function leaders(gid, gameStarted) {
    jQuery('.leaders').addClass('active');
    var gameDetail = '';
    var detailAvailable = false;
    var leadersTitle = 'SEASON LEADERS';
    if (checkGameStatus()) {
        leadersTitle = 'GAME LEADERS';
        jQuery.ajax({
            url: feeds.gamedetail(gid),
            async: false,
            success: function success(data) {
                var teamLineScore = ["hls", "vls"];
                for (var x = 0; x < teamLineScore.length; x++) {
                    var stats = data.g[teamLineScore[x]];
                    var team = '';
                    if (stats.ta === 'BOS') {
                        team = 'celtics';
                    } else {
                        team = 'away';
                    }
                    for (var stat in rosterObj[team].leaders) {
                        rosterObj[team].leaders[stat] = [['--', '--', 0, '--'], ['--', '--', 0, '--'], ['--', '--', 0, '--']];
                    }
                    for (var p = 0; p < stats.pstsg.length; p++) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].push([stats.pstsg[p].fn.toUpperCase(), stats.pstsg[p].ln.toUpperCase(), stats.pstsg[p][stat], stats.pstsg[p].pid]);
                        }
                        rosterObj[team].leaders[stat].sort(function (a, b) {
                            return a[2] - b[2];
                        });
                    }
                    for (var team in rosterObj) {
                        for (var stat in rosterObj[team].leaders) {
                            rosterObj[team].leaders[stat].sort(function (a, b) {
                                return b[2] - a[2];
                            });
                        }
                    }
                    console.log('SORTED:');
                    console.log(rosterObj);
                }
            }
        });
    }
    jQuery('.leaders-title').html(leadersTitle);
    for (var team in rosterObj) {
        for (var i = 0; i < 3; i++) {
            for (var stat in rosterObj[team].leaders) {
                // LEADER STAT VALUE
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .stat').html('<span class="appended ' + rosterObj[team].ta + '">' + rosterObj[team].leaders[stat][i][2] + '</span> ' + stat.toUpperCase());
                // LEADER NAME
                if (rosterObj[team].leaders[stat][i][0].length + rosterObj[team].leaders[stat][i][1].length >= 15) {
                    rosterObj[team].leaders[stat][i][0] = rosterObj[team].leaders[stat][i][0].substr(0, 1) + '.';
                }
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .name').html('<span class="appended">' + rosterObj[team].leaders[stat][i][0] + '</span> ' + rosterObj[team].leaders[stat][i][1]);
                // LEADER HEADSHOT
                jQuery('.leader-section:nth-of-type(' + (i + 2) + ') .' + stat + '.' + team + ' .headshot').attr('src', 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + rosterObj[team].leaders[stat][i][3] + '.png');
            }
        }
    }
    setTimeout(function () {
        jQuery('.leaders, .leaders .block-inner').addClass('transition-1');
    }, 100);
    setTimeout(function () {
        jQuery('.leaders .leader-section').addClass('transition-1');
        jQuery('.leader-subsection.bottom p:nth-of-type(1)').addClass('transition-1');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
    }, 1100);
    setTimeout(function () {
        jQuery('.leaders .leader-section').addClass('transition-2');
        jQuery('.leaders .block-inner').addClass('transition-2');
    }, 2100);
    var transitionCounter = 1;
    setTimeout(function () {
        var _loop = function _loop(_i) {
            setTimeout(function (numberString) {
                jQuery('.leaders .leader-section .leader-stat-wrap').addClass('transition-' + _i);
                jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.celtics.ta + '-bg');
                jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.away.ta + '-bg');
                if (transitionCounter % 2 == 0) {
                    setTimeout(function () {
                        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
                        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
                        jQuery('.leader-subsection.bottom p').removeClass('transition-1');
                        jQuery('.leaders .leader-section .underline').addClass('transition-' + _i / 2);
                        jQuery('.leader-subsection.bottom p:nth-of-type(' + (_i - _i / 2 + 1) + ')').addClass('transition-1'); // lol
                    }, 200);
                }
                transitionCounter++;
            }, 7000 * _i);
        };

        for (var _i = 1; _i < 6; _i++) {
            _loop(_i);
        }
    }, 2100);
    setTimeout(function () {
        jQuery('.leaders .leader-section, .leaders .leader-subsection').addClass('transition-3');
    }, 44100);
    setTimeout(function () {
        jQuery('.leaders').addClass('transition-2');
    }, 44100);
    setTimeout(function () {
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').removeClass(rosterObj.away.ta + '-bg');
        jQuery('.leaders .leader-section .underline, .leaders .leader-subsection.top').addClass(rosterObj.celtics.ta + '-bg');
        jQuery('.leaders').removeClass('active');
        jQuery('.leaders .appended').remove();
        for (var i = 1; i < 10; i++) {
            jQuery('.leaders .transition-' + i + ', .leaders.transition-' + i).removeClass('transition-' + i);
        }
    }, 45000);
};

function social() {
    jQuery('.social .text-wrap, .social .underline').removeClass('transition-1');
    jQuery('.social').addClass('active');
    setTimeout(function () {
        jQuery('.social .text-wrap, .social .underline').addClass('transition-1');
    }, 15000);
    setTimeout(function () {
        jQuery('.social .appended').remove();
        jQuery('.social .selected').removeClass('selected');
        jQuery('.social').removeClass('active');
    }, 15000);
};
/*function mobileAppInit() {
    var counter = 1;
    setInterval(function() {
        jQuery('.app .bottom-wrap img').removeClass('active');
        jQuery('.app .feature-list p').removeClass('active');
        jQuery('.app .feature-list p:nth-of-type(' + counter + ')').addClass('active');
        jQuery('.app .bottom-wrap img:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 5) {
            counter = 1;
        } else {
            counter++;
        }
    }, 2000);
};
*/
function mobileApp() {
    jQuery('.app .block-inner').removeClass('transition-1');
    jQuery('.app').addClass('active');
    var counter = 1;
    var rotateScreens = setInterval(function () {
        jQuery('.app .bottom-wrap img').removeClass('active');
        jQuery('.app .feature-list p').removeClass('active');
        jQuery('.app .feature-list p:nth-of-type(' + counter + ')').addClass('active');
        jQuery('.app .bottom-wrap img:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 5) {
            counter = 1;
        } else {
            counter++;
        }
    }, 4000);
    rotateScreens;
    setTimeout(function () {
        jQuery('.app .block-inner').addClass('transition-1');
    }, 24000);
    setTimeout(function () {
        jQuery('.app').removeClass('active');
        clearInterval(rotateScreens);
    }, 25000);
};
/*=================================
=            LEFT WRAP            =
=================================*/
function leftWrap() {
    setInterval(function () {
        if (jQuery('.left-wrap .standings').hasClass('transition-1')) {
            jQuery('.left-wrap .standings').removeClass('transition-1');
        } else {
            jQuery('.left-wrap .standings').addClass('transition-1');
        }
        if (jQuery('.left-wrap .scores-and-leaders').hasClass('transition-1')) {
            jQuery('.left-wrap .scores-and-leaders').removeClass('transition-1');
            updateLeagueScores();
        } else {
            jQuery('.left-wrap .scores-and-leaders').addClass('transition-1');
        }
    }, 50000);
}

function standingsInit(awayTeam) {
    jQuery.ajax({
        url: feeds.standings,
        async: false,
        success: function success(standingsData) {
            for (var i = 0; i < standingsData.sta.co.length; i++) {
                for (var x = 0; x < standingsData.sta.co[i].di.length; x++) {
                    for (var t = 0; t < standingsData.sta.co[i].di[x].t.length; t++) {
                        var conferences = ['.east', '.west'];
                        var place = standingsData.sta.co[i].di[x].t[t].see;
                        var seed = '';
                        var activeStatus = '';
                        if (standingsData.sta.co[i].di[x].t[t].see <= 8) {
                            seed = standingsData.sta.co[i].di[x].t[t].see;
                        }
                        if (standingsData.sta.co[i].di[x].t[t].ta == 'BOS') {
                            activeStatus = 'active';
                        }
                        if (standingsData.sta.co[i].di[x].t[t].ta == awayTeam) {
                            activeStatus = 'active-away';
                        }
                        var rowHTML = '<div class="place">' + seed + '</div><div class="logo-wrap"><img class="logo" src=http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/' + standingsData.sta.co[i].di[x].t[t].ta + '.svg></div><div class="team + ' + standingsData.sta.co[i].di[x].t[t].ta + '">' + standingsData.sta.co[i].di[x].t[t].ta + '</div><div class="wins">' + standingsData.sta.co[i].di[x].t[t].w + '</div><div class="losses">' + standingsData.sta.co[i].di[x].t[t].l + '</div><div class="games-behind">' + standingsData.sta.co[i].di[x].t[t].gb + '</div>';
                        jQuery(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').html(rowHTML);
                        jQuery(conferences[i] + ' > div:nth-child(' + (place + 1) + ')').addClass(activeStatus);
                    }
                }
            }
        }
    });
};

function scoresInit(todaysScoresData) {
    var liveScores = todaysScoresData.gs.g;
    if (liveScores.length != 0) {
        var seasonType = '';
        if (liveScores[0].gid.substr(0, 3) == '001') {
            seasonType = 'pre';
        } else if (liveScores[0].gid.substr(0, 3) == '004') {
            seasonType = 'post';
        }
        if (liveScores.length > 1 || liveScores.length == 1 && liveScores[0].h.ta != 'BOS') {
            var statusCodes = ['1st Qtr', '2nd Qtr', '3rd Qtr', '4th Qtr', '1st OT', '2nd OT', '3rd OT', '4th OT', '5th OT', '6th OT', '7th OT', '8th OT', '9th OT', '10th OT'];
            var scoresHTML = '';
            var added = 0;
            for (var i = liveScores.length - 1; i >= 0; i--) {
                if (liveScores[i].h.ta !== 'BOS' && i < 11) {
                    added++;
                    var vScore = '';
                    var hScore = '';
                    var vResult = '';
                    var hResult = '';
                    if (liveScores[i].st != 1) {
                        vScore = liveScores[i].v.s;
                        hScore = liveScores[i].h.s;
                    }
                    var sText = liveScores[i].stt;
                    if (statusCodes.indexOf(liveScores[i].stt) !== -1) {
                        sText = liveScores[i].stt + ' - ' + liveScores[i].cl;
                    }
                    if (liveScores[i].st == 3 && vScore < hScore) {
                        vResult = 'loser';
                    } else if (liveScores[i].st == 3 && hScore < vScore) {
                        hResult = 'loser';
                    }
                    scoresHTML += '<div class="score-wrap"><div class="score-status">' + sText + '</div><div class="' + liveScores[i].v.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].v.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].v.tc.toUpperCase() + ' ' + liveScores[i].v.tn.toUpperCase() + ' <div class="score-num ' + vResult + '">' + vScore + '</div></div><div class="' + liveScores[i].h.ta + '"><img src="http://stats.nba.com/media/img/teams/logos/' + liveScores[i].h.ta.toUpperCase() + '_logo.svg"> ' + liveScores[i].h.tc.toUpperCase() + ' ' + liveScores[i].h.tn.toUpperCase() + ' <div class="score-num ' + hResult + '">' + hScore + '</div></div></div>';
                }
            }
            jQuery('.scores').empty().append(scoresHTML);
        }
        if (added < 5) {
            jQuery('.league-leaders').show();
        } else {
            jQuery('.league-leaders').hide();
        }
    }
}

function updateLeagueScores() {
    jQuery.ajax({
        url: feeds.todaysScores,
        async: false,
        success: function success(data) {
            scoresInit(data);
        }
    });
}

function leagueLeaders() {
    var leagueLeadersHTML = '<div class="title"><p>LEAGUE LEADERS</p><p>PTS</p><p>REB</p><p>AST</p><p>STL</p><p>BLK</p></div>';
    var statType = '';
    var dataIndex = ["RANK", "PLAYER_ID", "PLAYER", "TEAM_ID", "TEAM_ABBREVIATION"];
    jQuery.ajax({
        url: feeds.leagueLeaders,
        dataType: 'jsonp',
        async: false,
        success: function success(data) {
            var leadersData = data.resultSets;
            for (var i = 0; i < leadersData.length; i++) {
                var index = createIndex(dataIndex, leadersData[i].headers);
                var rows = '';
                if (["PTS", "REB", "AST", "STL", "BLK"].indexOf(leadersData[i].headers[8]) !== -1) {
                    for (var x = 0; x < leadersData[i].rowSet.length; x++) {
                        var n = leadersData[i].rowSet[x][2].split(' ');
                        var fn = n[0].toUpperCase();
                        var ln = n[1].toUpperCase();
                        rows += '<div class="row"><div class="left"><div class="place">' + leadersData[i].rowSet[x][0] + '</div><div class="logo-wrap"><img class="logo" src="http://stats.nba.com/media/img/teams/logos/' + leadersData[i].rowSet[x][4] + '_logo.svg"/></div><div class="name"><span>' + fn + '</span> ' + ln + '</div></div><div class="right"><div class="value">' + round(leadersData[i].rowSet[x][8]) + '</div></div></div>';
                    }
                    leagueLeadersHTML += '<div class="league-leaders-wrap">' + rows + '</div>';
                }
            }
            jQuery('.league-leaders').empty().append(leagueLeadersHTML);
        }
    });
    var counter = 2;
    setInterval(function () {
        jQuery('.league-leaders-wrap, .league-leaders .title p').removeClass('active');
        jQuery('.league-leaders-wrap:nth-of-type(' + counter + '), .league-leaders .title p:nth-of-type(' + counter + ')').addClass('active');
        if (counter == 6) {
            counter = 2;
        } else {
            counter++;
        }
    }, 10000);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29uY291cnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFlBQVk7QUFDWixhQUFTO0FBQ0wsZ0JBQVEsRUFESDtBQUVMLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMsQ0FEQTtBQU1MLGlCQUFLLENBQ0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FEQyxFQUVELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBRkMsRUFHRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUhDLENBTkE7QUFXTCxpQkFBSyxDQUNELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBREMsRUFFRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQUZDLEVBR0QsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FIQztBQVhBO0FBRkosS0FERztBQXFCWixVQUFNO0FBQ0YsZ0JBQVEsRUFETjtBQUVGLGlCQUFTO0FBQ0wsaUJBQUssQ0FDRCxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsQ0FBYixFQUFnQixJQUFoQixDQURDLEVBRUQsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLENBQWIsRUFBZ0IsSUFBaEIsQ0FGQyxFQUdELENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxDQUFiLEVBQWdCLElBQWhCLENBSEMs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VSxDQUFkO0FBQ0EsZ0JBQVksWUFBVztBQUNuQixlQUFPLGdEQUFQLEVBQXlELFdBQXpELENBQXFFLFFBQXJFO0FBQ0EsZUFBTyxzQ0FBc0MsT0FBdEMsR0FBZ0QsMENBQWhELEdBQTZGLE9BQTdGLEdBQXVHLEdBQTlHLEVBQW1ILFFBQW5ILENBQTRILFFBQTVIO0FBQ0EsWUFBSSxXQUFXLENBQWYsRUFBa0I7QUFDZCxzQkFBVSxDQUFWO0FBQ0gsU0FGRCxNQUVPO0FBQ0g7QUFDSDtBQUNKLEtBUkQsRUFRRyxLQVJIO0FBU0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJvc3Rlck9iaiA9IHtcbiAgICBjZWx0aWNzOiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfSxcbiAgICBhd2F5OiB7XG4gICAgICAgIHJvc3Rlcjoge30sXG4gICAgICAgIGxlYWRlcnM6IHtcbiAgICAgICAgICAgIHB0czogW1xuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYXN0OiBbXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ11cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZWI6IFtcbiAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddLFxuICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxufTtcbi8vIExPQ0FMXG52YXIgZmVlZHMgPSB7XG4gICAgdG9kYXlzU2NvcmVzOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvdG9kYXlzX3Njb3Jlcy5qc29uJyxcbiAgICBjZWx0aWNzUm9zdGVyOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvY2VsdGljc19yb3N0ZXIuanNvbicsXG4gICAgYXdheVJvc3RlcjogZnVuY3Rpb24oYXdheVRuKSB7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvYXdheV9yb3N0ZXIuanNvbic7XG4gICAgfSxcbiAgICBiaW9EYXRhOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvYmlvLWRhdGEuanNvbicsXG4gICAgcGxheWVyY2FyZDogZnVuY3Rpb24ocGlkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2RhdGEvbW9iaWxlLXN0YXRzLWZlZWQvcGxheWVyY2FyZHMvcGxheWVyY2FyZC0nICsgcGlkICsgJy5qc29uJztcbiAgICB9LFxuICAgIHBsYXllcmNhcmRBd2F5OiBmdW5jdGlvbihwaWQpIHtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9wbGF5ZXJjYXJkcy9wbGF5ZXJjYXJkLTIwMjMzMC5qc29uJztcbiAgICB9LFxuICAgIGdhbWVkZXRhaWw6IGZ1bmN0aW9uKGdpZCkge1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL21vYmlsZS1zdGF0cy1mZWVkL2dhbWVkZXRhaWwuanNvbic7XG4gICAgfSxcbiAgICBzdGFuZGluZ3M6ICdodHRwOi8vbG9jYWxob3N0Ojg4ODgvZGF0YS9tb2JpbGUtc3RhdHMtZmVlZC9zdGFuZGluZ3MuanNvbicsXG4gICAgbGVhZ3VlTGVhZGVyczogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9kYXRhL2xlYWd1ZV9sZWFkZXJzLmpzb24nXG59O1xuLy8gT05MSU5FXG4vKnZhciBmZWVkcyA9IHtcbiAgICB0b2RheXNTY29yZXM6ICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvc2NvcmVzLzAwX3RvZGF5c19zY29yZXMuanNvbicsXG4gICAgY2VsdGljc1Jvc3RlcjogJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy90ZWFtcy9jZWx0aWNzX3Jvc3Rlci5qc29uJyxcbiAgICBhd2F5Um9zdGVyOiBmdW5jdGlvbihhd2F5VG4pe1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy90ZWFtcy8nICsgYXdheVRuICsgJ19yb3N0ZXIuanNvbic7XG4gICAgfSxcbiAgICBiaW9EYXRhOiAnaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvanNvbi9iaW8tZGF0YS5qc29uJyxcbiAgICBwbGF5ZXJjYXJkOiBmdW5jdGlvbihwaWQpe1xuICAgICAgICByZXR1cm4gJ2h0dHA6Ly9kYXRhLm5iYS5jb20vZGF0YS92MjAxNS9qc29uL21vYmlsZV90ZWFtcy9uYmEvMjAxNy9wbGF5ZXJzL3BsYXllcmNhcmRfJyArIHBpZCArICdfMDIuanNvbic7XG4gICAgfSxcbiAgICBwbGF5ZXJjYXJkQXdheTogZnVuY3Rpb24ocGlkKXtcbiAgICAgICAgcmV0dXJuICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvcGxheWVycy9wbGF5ZXJjYXJkXycgKyBwaWQgKyAnXzAyLmpzb24nO1xuICAgIH0sXG4gICAgZ2FtZWRldGFpbDogZnVuY3Rpb24oZ2lkKSB7XG4gICAgICAgIHJldHVybiAnaHR0cDovL2RhdGEubmJhLmNvbS9kYXRhL3YyMDE1L2pzb24vbW9iaWxlX3RlYW1zL25iYS8yMDE3L3Njb3Jlcy9nYW1lZGV0YWlsLycgKyBnaWQgKyAnX2dhbWVkZXRhaWwuanNvbic7XG4gICAgfSxcbiAgICBzdGFuZGluZ3M6ICdodHRwOi8vZGF0YS5uYmEuY29tL2RhdGEvdjIwMTUvanNvbi9tb2JpbGVfdGVhbXMvbmJhLzIwMTcvMDBfc3RhbmRpbmdzLmpzb24nLFxuICAgIGxlYWd1ZUxlYWRlcnM6ICdodHRwOi8vc3RhdHMubmJhLmNvbS9zdGF0cy9ob21lcGFnZXYyP0dhbWVTY29wZT1TZWFzb24mTGVhZ3VlSUQ9MDAmUGxheWVyT3JUZWFtPVBsYXllciZQbGF5ZXJTY29wZT1BbGwrUGxheWVycyZTZWFzb249MjAxNy0xOCZTZWFzb25UeXBlPVJlZ3VsYXIrU2Vhc29uJlN0YXRUeXBlPVRyYWRpdGlvbmFsJmNhbGxiYWNrPT8nXG59OyovXG52YXIgZ2FtZVN0YXJ0ZWQgPSBmYWxzZTtcbmxldCBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMTtcbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdpZCA9ICcnO1xuICAgIHZhciBhd2F5VGVhbSA9ICcnO1xuICAgIHZhciBhd2F5VG4gPSAnJztcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGxlZnRXcmFwQ291bnRlciA9IGZhbHNlO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy50b2RheXNTY29yZXMsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2RheXNTY29yZXNEYXRhLmdzLmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHsgLy9DSEFOR0UgVEhJU1xuICAgICAgICAgICAgICAgICAgICBhd2F5VGVhbSA9IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZ1tpXS52LnRhO1xuICAgICAgICAgICAgICAgICAgICBhd2F5VG4gPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0udi50bi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBnaWQgPSB0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0uZ2lkO1xuICAgICAgICAgICAgICAgICAgICBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKTtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgc3RhbmRpbmdzSW5pdChhd2F5VGVhbSk7XG4gICAgICAgICAgICAgICAgICAgIC8qICAgICAgICAgICAgICAgICAgICBtb2JpbGVBcHBJbml0KCk7Ki9cbiAgICAgICAgICAgICAgICAgICAgbGVhZ3VlTGVhZGVycygpO1xuICAgICAgICAgICAgICAgICAgICBsZWZ0V3JhcCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUUkFOU0lUSU9OU1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjeWNsZSgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vYmlsZUFwcCgpOyAvLyBEVVJBVElPTjogMjVzXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlYWRlcnMoZ2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoc29jaWFsLCA2OTAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDc5MDAwKTsqL1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN5Y2xlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNldEludGVydmFsKGN5Y2xlLCA4NTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gbG9hZFJvc3RlckRhdGEoKTsgT05MWSBPTkNFXG4gICAgLyogICAgc2V0VGltZW91dChsZWFkZXJzKGdpZCwgZ2FtZVN0YXJ0ZWQpLCA0MDApOyovXG59KTtcblxuZnVuY3Rpb24gY3ljbGUoKSB7fVxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIE1JU0MgRlVOQ1RJT05TICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gcGxheWVyQWdlKGRvYikge1xuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGJpcnRoRGF0ZSA9IG5ldyBEYXRlKGRvYik7XG4gICAgdmFyIGFnZSA9IHRvZGF5LmdldEZ1bGxZZWFyKCkgLSBiaXJ0aERhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICByZXR1cm4gYWdlO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVRpbWVsaW5lKHNlbGVjdGVkUGxheWVyKSB7XG4gICAgLy8gQVBQRU5EOiBUSU1FTElORVxuICAgIHZhciBzZWFzb25zUGxheWVkID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYS5sZW5ndGg7XG4gICAgdmFyIHRpbWVsaW5lSFRNTCA9ICcnO1xuICAgIHZhciBzZWFzb25ZZWFySFRNTCA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2Vhc29uc1BsYXllZDsgaSsrKSB7XG4gICAgICAgIHZhciB0ZWFtQWJicmV2aWF0aW9uID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS50YTtcbiAgICAgICAgdmFyIHRyYWRlZCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uc3BsLmxlbmd0aDtcbiAgICAgICAgdmFyIHNlZ21lbnRJbm5lciA9IFwiXCI7XG4gICAgICAgIHZhciB0aXRsZSA9IFwiXCI7XG4gICAgICAgIHZhciBzZWFzb25ZZWFyVGV4dCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0udmFsO1xuICAgICAgICBpZiAoaSA9PT0gMCB8fCB0ZWFtQWJicmV2aWF0aW9uICE9PSByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnN0YXRzLnNhW2kgLSAxXS50YSkgeyAvLyBJZiB0aGlzIGlzIGEgbmV3IHRlYW0sIHN0YXJ0IHRoZSB0ZWFtIHdyYXAuXG4gICAgICAgICAgICB0aXRsZSA9IHRlYW1BYmJyZXZpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRyYWRlZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0cmFkZWQ7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBncFRvdCA9IHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uc3RhdHMuc2FbaV0uZ3A7XG4gICAgICAgICAgICAgICAgdmFyIGdwID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGxbeF0uZ3A7XG4gICAgICAgICAgICAgICAgdmFyIGdwUGVyY2VudGFnZSA9IE1hdGgucm91bmQoKGdwIC8gZ3BUb3QpICogMTAwKTtcbiAgICAgICAgICAgICAgICB0ZWFtQWJicmV2aWF0aW9uID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpXS5zcGxbeF0udGE7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgfHwgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpIC0gMV0udGEgJiYgdGVhbUFiYnJldmlhdGlvbiAhPT0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cy5zYVtpICsgMV0udGEpIHsgLy8gSWYgdGhpcyBpcyBhIG5ldyB0ZWFtLCBzdGFydCB0aGUgdGVhbSB3cmFwLlxuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IHRlYW1BYmJyZXZpYXRpb247XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWdtZW50SW5uZXIgKz0gJzxkaXYgZGF0YS1zZWFzb24teWVhcj1cIicgKyBzZWFzb25ZZWFyVGV4dCArICdcIiBkYXRhLXRlYW09XCInICsgdGVhbUFiYnJldmlhdGlvbiArICdcIiBzdHlsZT1cIlwiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICsgdGVhbUFiYnJldmlhdGlvbiArICctYmdcIj48cD4nICsgdGl0bGUgKyAnPC9wPjwvZGl2Pic7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWdtZW50SW5uZXIgPSAnPGRpdiBkYXRhLXNlYXNvbi15ZWFyPVwiJyArIHNlYXNvblllYXJUZXh0ICsgJ1wiIGRhdGEtdGVhbT1cIicgKyB0ZWFtQWJicmV2aWF0aW9uICsgJ1wiIGNsYXNzPVwic2VnbWVudC1pbm5lciAnICsgdGVhbUFiYnJldmlhdGlvbiArICctYmdcIj48cD4nICsgdGl0bGUgKyAnPC9wPjwvZGl2Pic7XG4gICAgICAgIH1cbiAgICAgICAgdGltZWxpbmVIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2VnbWVudFwiPicgKyBzZWdtZW50SW5uZXIgKyAnPC9kaXY+JztcbiAgICAgICAgc2Vhc29uWWVhckhUTUwgKz0gJzxkaXYgY2xhc3M9XCJzZWdtZW50XCI+PHA+JyArIHNlYXNvblllYXJUZXh0ICsgJzwvcD48L2Rpdj4nO1xuICAgIH1cbiAgICBqUXVlcnkoXCIudGltZWxpbmUtd3JhcFwiKS5odG1sKCc8ZGl2IGNsYXNzPVwidGltZWxpbmUgYXBwZW5kZWRcIj4nICsgdGltZWxpbmVIVE1MICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJzZWFzb24teWVhciBhcHBlbmRlZFwiPicgKyBzZWFzb25ZZWFySFRNTCArICc8L2Rpdj4nKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5kZXgoa2V5cywgYXJyYXkpIHtcbiAgICB2YXIgbmV3QXJyID0ga2V5cy5tYXAoaXRlbSA9PiBhcnJheS5pbmRleE9mKGl0ZW0pKTtcbiAgICByZXR1cm4gbmV3QXJyO1xufVxuXG5mdW5jdGlvbiByb3VuZChudW1iZXIpIHtcbiAgICBpZiAodHlwZW9mIG51bWJlciAhPT0gXCJudW1iZXJcIiB8fCBudW1iZXIgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci50b0ZpeGVkKDEpO1xuICAgIH1cbn1cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIElOSVRJQUxJWkUgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmZ1bmN0aW9uIGNoZWNrR2FtZVN0YXR1cygpIHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24odG9kYXlzU2NvcmVzRGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBnaWQgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvZGF5c1Njb3Jlc0RhdGEuZ3MuZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9kYXlzU2NvcmVzRGF0YS5ncy5nW2ldLmgudGEgPT0gJ0JPUycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2RheXNTY29yZXNEYXRhLmdzLmdbaV0gIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPSAgICAgICAgICAgIExPQUQgUk9TVEVSIElORk8gKGJ1aWxkIHJvc3Rlck9iaikgICAgICAgICAgICAgID1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBsb2FkUm9zdGVyRGF0YShhd2F5VGVhbSwgYXdheVRuKSB7XG4gICAgdmFyIHJvc3RlciA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5jZWx0aWNzUm9zdGVyLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHJvc3RlciA9IGRhdGE7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiByb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljc1twcm9wZXJ0eV0gPSByb3N0ZXIudFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIHZhciBhd2F5Um9zdGVyID0gJyc7XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB1cmw6IGZlZWRzLmF3YXlSb3N0ZXIoYXdheVRuKSxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBhd2F5Um9zdGVyID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGF3YXlSb3N0ZXIudCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gJ3BsJykge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheVtwcm9wZXJ0eV0gPSBhd2F5Um9zdGVyLnRbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICB2YXIgYmlvRGF0YSA9ICcnO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5iaW9EYXRhLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGJpb0RhdGEgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgIH0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IHJvc3Rlci50LnBsW2ldLnBpZDtcbiAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0gPSByb3N0ZXIudC5wbFtpXTtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gYmlvRGF0YVtwaWRdKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbcGlkXS5iaW8gPSBiaW9EYXRhW3BpZF07XG4gICAgICAgIH07XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMucGxheWVyY2FyZChwaWQpLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnBsLmNhLmhhc093blByb3BlcnR5KCdzYScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYS5zYVsoZGF0YS5wbC5jYS5zYS5sZW5ndGggLSAxKV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BpZF0uc3RhdHMgPSBkYXRhLnBsLmNhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhd2F5Um9zdGVyLnQucGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBpZCA9IGF3YXlSb3N0ZXIudC5wbFtpXS5waWQ7XG4gICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdID0gYXdheVJvc3Rlci50LnBsW2ldO1xuICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICB1cmw6IGZlZWRzLnBsYXllcmNhcmRBd2F5KHBpZCksIC8vIENIQU5HRSBQSURcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5wbC5jYS5oYXNPd25Qcm9wZXJ0eSgnc2EnKSkge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmouYXdheS5yb3N0ZXJbcGlkXS5zdGF0cyA9IGRhdGEucGwuY2Euc2FbKGRhdGEucGwuY2Euc2EubGVuZ3RoIC0gMSldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvc3Rlck9iai5hd2F5LnJvc3RlcltwaWRdLnN0YXRzID0gZGF0YS5wbC5jYTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF0ucHVzaChbcm9zdGVyT2JqW3RlYW1dLnJvc3RlcltwbGF5ZXJdLmZuLnRvVXBwZXJDYXNlKCksIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5sbi50b1VwcGVyQ2FzZSgpLCByb3N0ZXJPYmpbdGVhbV0ucm9zdGVyW3BsYXllcl0uc3RhdHNbc3RhdF0sIHJvc3Rlck9ialt0ZWFtXS5yb3N0ZXJbcGxheWVyXS5waWRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYlsyXSAtIGFbMl07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZygnU09SVEVEOicpO1xuICAgIGNvbnNvbGUubG9nKHJvc3Rlck9iaik7XG59O1xuXG5mdW5jdGlvbiBzdGF0c05vdEF2YWlsYWJsZShwaWQpIHtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cyA9IHt9O1xuICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhID0gW3t9XTtcbiAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5oYXNTdGF0cyA9IGZhbHNlO1xuICAgIHZhciBjYUluZGV4ID0gWydncCcsICdncycsICdtaW4nLCAnZmdwJywgJ3RwcCcsICdmdHAnLCAnb3JlYicsICdkcmViJywgJ3JlYicsICdhc3QnLCAnc3RsJywgJ2JsaycsICd0b3YnLCAncGYnLCAncHRzJywgJ25vc3RhdHMnXTtcbiAgICB2YXIgc2FJbmRleCA9IFsndGlkJywgJ3ZhbCcsICdncCcsICdncycsICdtaW4nLCAnZmdwJywgJ3RwcCcsICdmdHAnLCAnb3JlYicsICdkcmViJywgJ3JlYicsICdhc3QnLCAnc3RsJywgJ2JsaycsICd0b3YnLCAncGYnLCAncHRzJywgJ3NwbCcsICd0YScsICd0bicsICd0YyddO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2FJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9IHBsYXllckNhcmRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKDIsIDIpICsgXCItXCIgKyAocGxheWVyQ2FyZFllYXIgKyAxKS50b1N0cmluZygpLnN1YnN0cigyLCAyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMTcpIHtcbiAgICAgICAgICAgIHJvc3Rlck9ialtwaWRdLnN0YXRzLnNhWzBdW3NhSW5kZXhbaV1dID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDE4KSB7XG4gICAgICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0cy5zYVswXVtzYUluZGV4W2ldXSA9ICdCT1MnO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FJbmRleC5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3N0ZXJPYmpbcGlkXS5zdGF0c1tjYUluZGV4W2ldXSA9IFwiTi9BXCI7XG4gICAgICAgIGlmIChpID09PSAxNSkge1xuICAgICAgICAgICAgcm9zdGVyT2JqW3BpZF0uc3RhdHNbY2FJbmRleFtpXV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gbG9hZEdhbWVEZXRhaWwoZ2lkKSB7fTtcblxuZnVuY3Rpb24gbG9hZEF3YXlUZWFtRGF0YSgpIHt9XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBSSUdIVCBXUkFQICAgICAgICAgICAgPVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5mdW5jdGlvbiBwbGF5ZXJTcG90bGlnaHQocm9zdGVyT2JqKSB7XG4gICAgLyogMSAtIFdISVRFIExJTkUgSE9SSVpUT05BTCAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLndoaXRlLWxpbmUuaG9yaXpvbnRhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCA1MDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC10b3AgLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKGV2ZW4pJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIH0sIDgwMCk7XG4gICAgLyogMmIgLSBXSElURSBMSU5FIFZFUlRJQ0FMICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCAud2hpdGUtbGluZS52ZXJ0aWNhbDpudGgtY2hpbGQoZXZlbiknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbC1ib3R0b20gLndoaXRlLWxpbmUudmVydGljYWw6bnRoLWNoaWxkKG9kZCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTAwMCk7XG4gICAgLyogMyAtIEdFTkVSQVRFIEFORCBSRVZFQUwgUExBWUVSIEJPWEVTICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsLXRvcCwgLnNvY2lhbC1ib3R0b20nKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMjAwKTtcbiAgICAvKiA0IC0gQVBQRU5EIEhFQURTSE9UUyAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gtd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIGRlbGF5ID0gMDtcbiAgICAgICAgdmFyIGZvcmluQ291bnRlciA9IDA7XG4gICAgICAgIGZvciAodmFyIHBsYXllciBpbiByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXIpIHtcbiAgICAgICAgICAgIHZhciBoZWFkc2hvdCA9ICdodHRwczovL2FrLXN0YXRpYy5jbXMubmJhLmNvbS93cC1jb250ZW50L3VwbG9hZHMvaGVhZHNob3RzL25iYS9sYXRlc3QvMTA0MHg3NjAvJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltwbGF5ZXJdLnBpZCArICcucG5nJztcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmFwcGVuZCgnPGltZyBjbGFzcz1cImFwcGVuZGVkIGhlYWRzaG90XCIgc3JjPVwiJyArIGhlYWRzaG90ICsgJ1wiLz4nKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3g6bnRoLWNoaWxkKCcgKyAoZm9yaW5Db3VudGVyICsgMSkgKyAnKScpLmF0dHIoJ2RhdGEtcGlkJywgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3BsYXllcl0ucGlkKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3ggaW1nJykub24oXCJlcnJvclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBqUXVlcnkodGhpcykuYXR0cignc3JjJywgJ2h0dHBzOi8vaS5jZG4udHVybmVyLmNvbS9uYmEvbmJhLy5lbGVtZW50L21lZGlhLzIuMC90ZWFtc2l0ZXMvY2VsdGljcy9tZWRpYS9nZW5lcmljLXBsYXllci1saWdodF82MDB4NDM4LnBuZycpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItYm94Om50aC1jaGlsZCgnICsgKGZvcmluQ291bnRlciArIDEpICsgJykgaW1nJykuZGVsYXkoZGVsYXkpLmZhZGVUbygzMDAsIDEpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMzA7XG4gICAgICAgICAgICBmb3JpbkNvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH0sIDMwMDApO1xuICAgIC8qIDUgLSBQTEFZRVIgU0VMRUNUICovXG4gICAgdmFyIHNlbGVjdGVkUGxheWVyID0gJyc7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSArICcpJykuYWRkQ2xhc3MoJ3NlbGVjdGVkJyk7XG4gICAgICAgIHNlbGVjdGVkUGxheWVyID0galF1ZXJ5KCcucGxheWVyLWJveDpudGgtY2hpbGQoJyArIChwbGF5ZXJTcG90bGlnaHRDb3VudGVyKSArICcpJykuYXR0cignZGF0YS1waWQnKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLWJveCcpLm5vdCgnLnJlcGxhY2VtZW50LnNlbGVjdGVkJykuZGVsYXkoNTAwKS5hZGRDbGFzcygndHJhbnNpdGlvbi00Jyk7XG4gICAgfSwgNDAwMCk7XG4gICAgLyogNiAtIFBMQVlFUiBCT1ggRVhQQU5EICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5zb2NpYWwnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0zJyk7XG4gICAgfSwgNTAwMCk7XG4gICAgLyogNyAtIFNQT1RMSUdIVCBIVE1MICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VuZXJhdGVUaW1lbGluZShzZWxlY3RlZFBsYXllcik7XG4gICAgICAgIGpRdWVyeSgnLnBsYXllci1ib3gucmVwbGFjZW1lbnQuc2VsZWN0ZWQnKS5jbG9uZSgpLmFwcGVuZFRvKCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpO1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5zZWxlY3RlZCcpLmFkZENsYXNzKCcuYXBwZW5kZWQnKTtcbiAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0JykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5ibG9jay13cmFwLnNvY2lhbCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgdmFyIHN0YXRzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5zdGF0cztcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAudG9wLXdyYXAgLnBsYXllci10b3AnKS5hcHBlbmQoJzxpbWcgY2xhc3M9XCJzaWxvIGFwcGVuZGVkXCIgc3JjPVwiaHR0cDovL2lvLmNubi5uZXQvbmJhL25iYS8uZWxlbWVudC9tZWRpYS8yLjAvdGVhbXNpdGVzL2NlbHRpY3MvbWVkaWEvc2lsby00NjZ4NTkxLScgKyByb3N0ZXJPYmouY2VsdGljcy5yb3N0ZXJbc2VsZWN0ZWRQbGF5ZXJdLnBpZCArICcucG5nXCIgLz48ZGl2IGNsYXNzPVwidG9wIGFwcGVuZGVkXCI+PGRpdiBjbGFzcz1cInBsYXllci1uYW1lLXdyYXBcIj48cCBjbGFzcz1cInBsYXllci1uYW1lXCI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZm4udG9VcHBlckNhc2UoKSArICc8L3NwYW4+IDxicj4gJyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubG4udG9VcHBlckNhc2UoKSArICc8L3A+PC9kaXY+PHAgY2xhc3M9XCJwbGF5ZXItbnVtYmVyXCI+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ubnVtICsgJzwvYnI+PHNwYW4+JyArIHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0ucG9zICsgJzwvc3Bhbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cIm1pZGRsZSBhcHBlbmRlZFwiPjx1bCBjbGFzcz1cImluZm8gY2xlYXJmaXhcIj48bGk+PHA+QUdFPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcGxheWVyQWdlKHJvc3Rlck9iai5jZWx0aWNzLnJvc3RlcltzZWxlY3RlZFBsYXllcl0uZG9iKSArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPkhUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5odCArICc8L3NwYW4+PC9wPjwvbGk+PGxpPjxwPldUPHNwYW4gY2xhc3M9XCJzbS1oaWRlXCI+OiZuYnNwOzwvc3Bhbj4gPC9icj48c3BhbiBjbGFzcz1cImluZm8tdmFsdWVcIj4nICsgcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS53dCArICc8L3NwYW4+PC9wPjwvbGk+PC91bD48L2Rpdj48ZGl2IGNsYXNzPVwiYm90dG9tIGZ1bGwgY2xlYXJmaXggc20taGlkZSBhcHBlbmRlZFwiPjx0YWJsZSBjbGFzcz1cImF2ZXJhZ2VzXCI+PHRyIGNsYXNzPVwiYXZlcmFnZXMtbGFiZWxzXCI+PHRkPjxwPkdQPC9wPjwvdGQ+PHRkPjxwPlBQRzwvcD48L3RkPjx0ZD48cD5SUEc8L3A+PC90ZD48dGQ+PHA+QVBHPC9wPjwvdGQ+PC90cj48dHIgY2xhc3M9XCJhdmVyYWdlcy1zZWFzb25cIj48dGQgY2xhc3M9XCJncFwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInB0c1wiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cInJlYlwiPjxwPjwvcD48L3RkPjx0ZCBjbGFzcz1cImFzdFwiPjxwPjwvcD48L3RkPjwvdHI+PC90YWJsZT48L2Rpdj4nKTtcbiAgICAgICAgalF1ZXJ5KFwiLnBsYXllci1zcG90bGlnaHQgLmF2ZXJhZ2VzLXNlYXNvblwiKS5odG1sKCc8dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5ncCArICc8L3A+PC90ZD48dGQgY2xhc3M9XCJhcHBlbmRlZFwiPjxwPicgKyBzdGF0cy5zYVswXS5wdHMgKyAnPC9wPjwvdGQ+PHRkIGNsYXNzPVwiYXBwZW5kZWRcIj48cD4nICsgc3RhdHMuc2FbMF0ucmViICsgJzwvcD48L3RkPjx0ZCBjbGFzcz1cImFwcGVuZGVkXCI+PHA+JyArIHN0YXRzLnNhWzBdLmFzdCArICc8L3A+PC90ZD4nKTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAucGxheWVyLW5hbWUnKS5mYWRlVG8oMjAwLCAxKTtcbiAgICAgICAgdmFyIHBsYXllckZhY3RzID0gcm9zdGVyT2JqLmNlbHRpY3Mucm9zdGVyW3NlbGVjdGVkUGxheWVyXS5iaW8ucGVyc29uYWw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZmFjdEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcGxheWVyRmFjdHMubGVuZ3RoKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwJykuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZHlrLWJveCBhcHBlbmRlZFwiPjxwPicgKyBwbGF5ZXJGYWN0c1tmYWN0SW5kZXhdICsgJzwvcD48L2Rpdj4nKTtcbiAgICAgICAgfTtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5ib3R0b20td3JhcCAuZHlrLWJveDpudGgtb2YtdHlwZSgyKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLnBsYXllci1zcG90bGlnaHQgLmJvdHRvbS13cmFwIC5keWstYm94Om50aC1vZi10eXBlKDMpJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAgLmR5ay1ib3g6bnRoLW9mLXR5cGUoNCknKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0sIDE1MDApO1xuICAgIH0sIDYwMDApO1xuICAgIC8qIDggLSBTUE9UTElHSFQgU0xJREUgSU4gKi9cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItdG9wIC5wbGF5ZXItbmFtZSwgLnBsYXllci1zcG90bGlnaHQgLnBsYXllci1uYW1lLXdyYXAsIC5wbGF5ZXItc3BvdGxpZ2h0IC5oZWFkc2hvdCwgLnBsYXllci1zcG90bGlnaHQgLmluZm8sIC5wbGF5ZXItc3BvdGxpZ2h0IC5zaWxvLCAucGxheWVyLXNwb3RsaWdodCAuYXZlcmFnZXMsIC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItbnVtYmVyJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgalF1ZXJ5KCcuYmxvY2std3JhcC5wbGF5ZXItc3BvdGxpZ2h0IC5wbGF5ZXItYm94JykucmVtb3ZlKCk7XG4gICAgICAgIH0sIDQwMDApO1xuICAgICAgICBpZiAocGxheWVyU3BvdGxpZ2h0Q291bnRlciA8IDE2KSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyKys7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwbGF5ZXJTcG90bGlnaHRDb3VudGVyID0gMDtcbiAgICAgICAgfVxuICAgIH0sIDcwMDApO1xuICAgIC8qIDkgLSBTUE9UTElHSFQgU0xJREUgT1VUICovXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcucGxheWVyLXNwb3RsaWdodCAuYm90dG9tLXdyYXAsIC5wbGF5ZXItc3BvdGxpZ2h0IC50b3Atd3JhcCcpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICB9LCA4MDAwKTtcbiAgICAvKiAxMCAtIERPTkUuIFJFTU9WRSAqL1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnIC5wbGF5ZXItc3BvdGxpZ2h0IC5hcHBlbmRlZCcpLnJlbW92ZSgpO1xuICAgICAgICBqUXVlcnkoJyAucGxheWVyLXNwb3RsaWdodCAuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5yaWdodC13cmFwIC50cmFuc2l0aW9uLScgKyBpKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0nICsgaSk7XG4gICAgICAgIH1cbiAgICB9LCA5MDAwKTtcbn1cblxuZnVuY3Rpb24gbGVhZGVycyhnaWQsIGdhbWVTdGFydGVkKSB7XG4gICAgalF1ZXJ5KCcubGVhZGVycycpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB2YXIgZ2FtZURldGFpbCA9ICcnO1xuICAgIHZhciBkZXRhaWxBdmFpbGFibGUgPSBmYWxzZTtcbiAgICB2YXIgbGVhZGVyc1RpdGxlID0gJ1NFQVNPTiBMRUFERVJTJztcbiAgICBpZiAoY2hlY2tHYW1lU3RhdHVzKCkpIHtcbiAgICAgICAgbGVhZGVyc1RpdGxlID0gJ0dBTUUgTEVBREVSUyc7XG4gICAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgICAgIHVybDogZmVlZHMuZ2FtZWRldGFpbChnaWQpLFxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciB0ZWFtTGluZVNjb3JlID0gW1wiaGxzXCIsIFwidmxzXCJdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGVhbUxpbmVTY29yZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdHMgPSBkYXRhLmdbdGVhbUxpbmVTY29yZVt4XV07XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZWFtID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0cy50YSA9PT0gJ0JPUycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlYW0gPSAnY2VsdGljcyc7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFtID0gJ2F3YXknO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsnLS0nLCAnLS0nLCAwLCAnLS0nXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbJy0tJywgJy0tJywgMCwgJy0tJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgWyctLScsICctLScsIDAsICctLSddXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgc3RhdHMucHN0c2cubGVuZ3RoOyBwKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHN0YXQgaW4gcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XS5wdXNoKFtzdGF0cy5wc3RzZ1twXS5mbi50b1VwcGVyQ2FzZSgpLCBzdGF0cy5wc3RzZ1twXS5sbi50b1VwcGVyQ2FzZSgpLCBzdGF0cy5wc3RzZ1twXVtzdGF0XSwgc3RhdHMucHN0c2dbcF0ucGlkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYVsyXSAtIGJbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0ZWFtIGluIHJvc3Rlck9iaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3RhdCBpbiByb3N0ZXJPYmpbdGVhbV0ubGVhZGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYlsyXSAtIGFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NPUlRFRDonKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocm9zdGVyT2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBqUXVlcnkoJy5sZWFkZXJzLXRpdGxlJykuaHRtbChsZWFkZXJzVGl0bGUpO1xuICAgIGZvciAodmFyIHRlYW0gaW4gcm9zdGVyT2JqKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBzdGF0IGluIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgLy8gTEVBREVSIFNUQVQgVkFMVUVcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc2VjdGlvbjpudGgtb2YtdHlwZSgnICsgKGkgKyAyKSArICcpIC4nICsgc3RhdCArICcuJyArIHRlYW0gKyAnIC5zdGF0JykuaHRtbCgnPHNwYW4gY2xhc3M9XCJhcHBlbmRlZCAnICsgcm9zdGVyT2JqW3RlYW1dLnRhICsgJ1wiPicgKyByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVsyXSArICc8L3NwYW4+ICcgKyBzdGF0LnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBOQU1FXG4gICAgICAgICAgICAgICAgaWYgKHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLmxlbmd0aCArIHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzFdLmxlbmd0aCA+PSAxNSkge1xuICAgICAgICAgICAgICAgICAgICByb3N0ZXJPYmpbdGVhbV0ubGVhZGVyc1tzdGF0XVtpXVswXSA9IHJvc3Rlck9ialt0ZWFtXS5sZWFkZXJzW3N0YXRdW2ldWzBdLnN1YnN0cigwLCAxKSArICcuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcubGVhZGVyLXNlY3Rpb246bnRoLW9mLXR5cGUoJyArIChpICsgMikgKyAnKSAuJyArIHN0YXQgKyAnLicgKyB0ZWFtICsgJyAubmFtZScpLmh0bWwoJzxzcGFuIGNsYXNzPVwiYXBwZW5kZWRcIj4nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMF0gKyAnPC9zcGFuPiAnICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bMV0pO1xuICAgICAgICAgICAgICAgIC8vIExFQURFUiBIRUFEU0hPVFxuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlci1zZWN0aW9uOm50aC1vZi10eXBlKCcgKyAoaSArIDIpICsgJykgLicgKyBzdGF0ICsgJy4nICsgdGVhbSArICcgLmhlYWRzaG90JykuYXR0cignc3JjJywgJ2h0dHBzOi8vYWstc3RhdGljLmNtcy5uYmEuY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy9oZWFkc2hvdHMvbmJhL2xhdGVzdC8xMDQweDc2MC8nICsgcm9zdGVyT2JqW3RlYW1dLmxlYWRlcnNbc3RhdF1baV1bM10gKyAnLnBuZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMsIC5sZWFkZXJzIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICB9LCAxMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgxKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAubGVhZGVyLXNlY3Rpb24gLnVuZGVybGluZSwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uLnRvcCcpLmFkZENsYXNzKHJvc3Rlck9iai5jZWx0aWNzLnRhICsgJy1iZycpO1xuICAgIH0sIDExMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5ibG9jay1pbm5lcicpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTInKTtcbiAgICB9LCAyMTAwKTtcbiAgICB2YXIgdHJhbnNpdGlvbkNvdW50ZXIgPSAxO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKG51bWJlclN0cmluZykge1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC5sZWFkZXItc3RhdC13cmFwJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5yZW1vdmVDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zaXRpb25Db3VudGVyICUgMiA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykuYWRkQ2xhc3Mocm9zdGVyT2JqLmNlbHRpY3MudGEgKyAnLWJnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcCcpLnJlbW92ZUNsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0nICsgKGkgLyAyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXItc3Vic2VjdGlvbi5ib3R0b20gcDpudGgtb2YtdHlwZSgnICsgKGkgLSAoaSAvIDIpICsgMSkgKyAnKScpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTsgLy8gbG9sXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25Db3VudGVyKys7XG4gICAgICAgICAgICB9LCA3MDAwICogaSk7XG4gICAgICAgIH1cbiAgICB9LCAyMTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiwgLmxlYWRlcnMgLmxlYWRlci1zdWJzZWN0aW9uJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMycpO1xuICAgIH0sIDQ0MTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzJykuYWRkQ2xhc3MoJ3RyYW5zaXRpb24tMicpO1xuICAgIH0sIDQ0MTAwKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC5sZWFkZXItc2VjdGlvbiAudW5kZXJsaW5lLCAubGVhZGVycyAubGVhZGVyLXN1YnNlY3Rpb24udG9wJykucmVtb3ZlQ2xhc3Mocm9zdGVyT2JqLmF3YXkudGEgKyAnLWJnJyk7XG4gICAgICAgIGpRdWVyeSgnLmxlYWRlcnMgLmxlYWRlci1zZWN0aW9uIC51bmRlcmxpbmUsIC5sZWFkZXJzIC5sZWFkZXItc3Vic2VjdGlvbi50b3AnKS5hZGRDbGFzcyhyb3N0ZXJPYmouY2VsdGljcy50YSArICctYmcnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZGVycyAuYXBwZW5kZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWFkZXJzIC50cmFuc2l0aW9uLScgKyBpICsgJywgLmxlYWRlcnMudHJhbnNpdGlvbi0nICsgaSkucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tJyArIGkpO1xuICAgICAgICB9XG4gICAgfSwgNDUwMDApO1xufTtcblxuZnVuY3Rpb24gc29jaWFsKCkge1xuICAgIGpRdWVyeSgnLnNvY2lhbCAudGV4dC13cmFwLCAuc29jaWFsIC51bmRlcmxpbmUnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgalF1ZXJ5KCcuc29jaWFsJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCAudGV4dC13cmFwLCAuc29jaWFsIC51bmRlcmxpbmUnKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMTUwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLnNvY2lhbCAuYXBwZW5kZWQnKS5yZW1vdmUoKTtcbiAgICAgICAgalF1ZXJ5KCcuc29jaWFsIC5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgICBqUXVlcnkoJy5zb2NpYWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSwgMTUwMDApO1xufTtcbi8qZnVuY3Rpb24gbW9iaWxlQXBwSW5pdCgpIHtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBqUXVlcnkoJy5hcHAgLmZlYXR1cmUtbGlzdCBwOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYm90dG9tLXdyYXAgaW1nOm50aC1vZi10eXBlKCcgKyBjb3VudGVyICsgJyknKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGlmIChjb3VudGVyID09IDUpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgPSAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICB9XG4gICAgfSwgMjAwMCk7XG59O1xuKi9cbmZ1bmN0aW9uIG1vYmlsZUFwcCgpIHtcbiAgICBqUXVlcnkoJy5hcHAgLmJsb2NrLWlubmVyJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgIGpRdWVyeSgnLmFwcCcpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICB2YXIgY291bnRlciA9IDE7XG4gICAgdmFyIHJvdGF0ZVNjcmVlbnMgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWcnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHAnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuZmVhdHVyZS1saXN0IHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcuYXBwIC5ib3R0b20td3JhcCBpbWc6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNSkge1xuICAgICAgICAgICAgY291bnRlciA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCA0MDAwKTtcbiAgICByb3RhdGVTY3JlZW5zO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCAuYmxvY2staW5uZXInKS5hZGRDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgfSwgMjQwMDApO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmFwcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChyb3RhdGVTY3JlZW5zKTtcbiAgICB9LCAyNTAwMCk7XG59O1xuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj0gICAgICAgICAgICBMRUZUIFdSQVAgICAgICAgICAgICA9XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZnVuY3Rpb24gbGVmdFdyYXAoKSB7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmhhc0NsYXNzKCd0cmFuc2l0aW9uLTEnKSkge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVmdC13cmFwIC5zdGFuZGluZ3MnKS5yZW1vdmVDbGFzcygndHJhbnNpdGlvbi0xJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnN0YW5kaW5ncycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoalF1ZXJ5KCcubGVmdC13cmFwIC5zY29yZXMtYW5kLWxlYWRlcnMnKS5oYXNDbGFzcygndHJhbnNpdGlvbi0xJykpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlZnQtd3JhcCAuc2NvcmVzLWFuZC1sZWFkZXJzJykucmVtb3ZlQ2xhc3MoJ3RyYW5zaXRpb24tMScpO1xuICAgICAgICAgICAgdXBkYXRlTGVhZ3VlU2NvcmVzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBqUXVlcnkoJy5sZWZ0LXdyYXAgLnNjb3Jlcy1hbmQtbGVhZGVycycpLmFkZENsYXNzKCd0cmFuc2l0aW9uLTEnKTtcbiAgICAgICAgfVxuICAgIH0sIDUwMDAwKTtcbn1cblxuZnVuY3Rpb24gc3RhbmRpbmdzSW5pdChhd2F5VGVhbSkge1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5zdGFuZGluZ3MsXG4gICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oc3RhbmRpbmdzRGF0YSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdGFuZGluZ3NEYXRhLnN0YS5jby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGkubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdCA9IDA7IHQgPCBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50Lmxlbmd0aDsgdCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29uZmVyZW5jZXMgPSBbJy5lYXN0JywgJy53ZXN0J107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGxhY2UgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWVkID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWN0aXZlU3RhdHVzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS5zZWUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQgPSBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnNlZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhID09ICdCT1MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RhdHVzID0gJ2FjdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhbmRpbmdzRGF0YS5zdGEuY29baV0uZGlbeF0udFt0XS50YSA9PSBhd2F5VGVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVN0YXR1cyA9ICdhY3RpdmUtYXdheSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm93SFRNTCA9ICc8ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgc2VlZCArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9nby13cmFwXCI+PGltZyBjbGFzcz1cImxvZ29cIiBzcmM9aHR0cDovL2kuY2RuLnR1cm5lci5jb20vbmJhL25iYS9hc3NldHMvbG9nb3MvdGVhbXMvcHJpbWFyeS93ZWIvJyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udGEgKyAnLnN2Zz48L2Rpdj48ZGl2IGNsYXNzPVwidGVhbSArICcgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJ1wiPicgKyBzdGFuZGluZ3NEYXRhLnN0YS5jb1tpXS5kaVt4XS50W3RdLnRhICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJ3aW5zXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0udyArICc8L2Rpdj48ZGl2IGNsYXNzPVwibG9zc2VzXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0ubCArICc8L2Rpdj48ZGl2IGNsYXNzPVwiZ2FtZXMtYmVoaW5kXCI+JyArIHN0YW5kaW5nc0RhdGEuc3RhLmNvW2ldLmRpW3hdLnRbdF0uZ2IgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuaHRtbChyb3dIVE1MKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeShjb25mZXJlbmNlc1tpXSArICcgPiBkaXY6bnRoLWNoaWxkKCcgKyAocGxhY2UgKyAxKSArICcpJykuYWRkQ2xhc3MoYWN0aXZlU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZnVuY3Rpb24gc2NvcmVzSW5pdCh0b2RheXNTY29yZXNEYXRhKSB7XG4gICAgdmFyIGxpdmVTY29yZXMgPSB0b2RheXNTY29yZXNEYXRhLmdzLmc7XG4gICAgaWYgKGxpdmVTY29yZXMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgdmFyIHNlYXNvblR5cGUgPSAnJztcbiAgICAgICAgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDAxJykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwcmUnO1xuICAgICAgICB9IGVsc2UgaWYgKGxpdmVTY29yZXNbMF0uZ2lkLnN1YnN0cigwLCAzKSA9PSAnMDA0Jykge1xuICAgICAgICAgICAgc2Vhc29uVHlwZSA9ICdwb3N0JztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl2ZVNjb3Jlcy5sZW5ndGggPiAxIHx8IChsaXZlU2NvcmVzLmxlbmd0aCA9PSAxICYmIGxpdmVTY29yZXNbMF0uaC50YSAhPSAnQk9TJykpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXNDb2RlcyA9IFsnMXN0IFF0cicsICcybmQgUXRyJywgJzNyZCBRdHInLCAnNHRoIFF0cicsICcxc3QgT1QnLCAnMm5kIE9UJywgJzNyZCBPVCcsICc0dGggT1QnLCAnNXRoIE9UJywgJzZ0aCBPVCcsICc3dGggT1QnLCAnOHRoIE9UJywgJzl0aCBPVCcsICcxMHRoIE9UJ107XG4gICAgICAgICAgICB2YXIgc2NvcmVzSFRNTCA9ICcnO1xuICAgICAgICAgICAgdmFyIGFkZGVkID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBsaXZlU2NvcmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpdmVTY29yZXNbaV0uaC50YSAhPT0gJ0JPUycgJiYgaSA8IDExKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2U2NvcmUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhTY29yZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdlJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaFJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGl2ZVNjb3Jlc1tpXS5zdCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2U2NvcmUgPSBsaXZlU2NvcmVzW2ldLnYucztcbiAgICAgICAgICAgICAgICAgICAgICAgIGhTY29yZSA9IGxpdmVTY29yZXNbaV0uaC5zO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzQ29kZXMuaW5kZXhPZihsaXZlU2NvcmVzW2ldLnN0dCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzVGV4dCA9IGxpdmVTY29yZXNbaV0uc3R0ICsgJyAtICcgKyBsaXZlU2NvcmVzW2ldLmNsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXZlU2NvcmVzW2ldLnN0ID09IDMgJiYgdlNjb3JlIDwgaFNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2UmVzdWx0ID0gJ2xvc2VyJztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaXZlU2NvcmVzW2ldLnN0ID09IDMgJiYgaFNjb3JlIDwgdlNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoUmVzdWx0ID0gJ2xvc2VyJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzY29yZXNIVE1MICs9ICc8ZGl2IGNsYXNzPVwic2NvcmUtd3JhcFwiPjxkaXYgY2xhc3M9XCJzY29yZS1zdGF0dXNcIj4nICsgc1RleHQgKyAnPC9kaXY+PGRpdiBjbGFzcz1cIicgKyBsaXZlU2NvcmVzW2ldLnYudGEgKyAnXCI+PGltZyBzcmM9XCJodHRwOi8vc3RhdHMubmJhLmNvbS9tZWRpYS9pbWcvdGVhbXMvbG9nb3MvJyArIGxpdmVTY29yZXNbaV0udi50YS50b1VwcGVyQ2FzZSgpICsgJ19sb2dvLnN2Z1wiPiAnICsgbGl2ZVNjb3Jlc1tpXS52LnRjLnRvVXBwZXJDYXNlKCkgKyAnICcgKyBsaXZlU2NvcmVzW2ldLnYudG4udG9VcHBlckNhc2UoKSArICcgPGRpdiBjbGFzcz1cInNjb3JlLW51bSAnICsgdlJlc3VsdCArICdcIj4nICsgdlNjb3JlICsgJzwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCInICsgbGl2ZVNjb3Jlc1tpXS5oLnRhICsgJ1wiPjxpbWcgc3JjPVwiaHR0cDovL3N0YXRzLm5iYS5jb20vbWVkaWEvaW1nL3RlYW1zL2xvZ29zLycgKyBsaXZlU2NvcmVzW2ldLmgudGEudG9VcHBlckNhc2UoKSArICdfbG9nby5zdmdcIj4gJyArIGxpdmVTY29yZXNbaV0uaC50Yy50b1VwcGVyQ2FzZSgpICsgJyAnICsgbGl2ZVNjb3Jlc1tpXS5oLnRuLnRvVXBwZXJDYXNlKCkgKyAnIDxkaXYgY2xhc3M9XCJzY29yZS1udW0gJyArIGhSZXN1bHQgKyAnXCI+JyArIGhTY29yZSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpRdWVyeSgnLnNjb3JlcycpLmVtcHR5KCkuYXBwZW5kKHNjb3Jlc0hUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhZGRlZCA8IDUpIHtcbiAgICAgICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzJykuc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxlYWd1ZVNjb3JlcygpIHtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogZmVlZHMudG9kYXlzU2NvcmVzLFxuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHNjb3Jlc0luaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbGVhZ3VlTGVhZGVycygpIHtcbiAgICB2YXIgbGVhZ3VlTGVhZGVyc0hUTUwgPSAnPGRpdiBjbGFzcz1cInRpdGxlXCI+PHA+TEVBR1VFIExFQURFUlM8L3A+PHA+UFRTPC9wPjxwPlJFQjwvcD48cD5BU1Q8L3A+PHA+U1RMPC9wPjxwPkJMSzwvcD48L2Rpdj4nO1xuICAgIHZhciBzdGF0VHlwZSA9ICcnO1xuICAgIHZhciBkYXRhSW5kZXggPSBbXCJSQU5LXCIsIFwiUExBWUVSX0lEXCIsIFwiUExBWUVSXCIsIFwiVEVBTV9JRFwiLCBcIlRFQU1fQUJCUkVWSUFUSU9OXCJdO1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdXJsOiBmZWVkcy5sZWFndWVMZWFkZXJzLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb25wJyxcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICB2YXIgbGVhZGVyc0RhdGEgPSBkYXRhLnJlc3VsdFNldHM7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlYWRlcnNEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gY3JlYXRlSW5kZXgoZGF0YUluZGV4LCBsZWFkZXJzRGF0YVtpXS5oZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB2YXIgcm93cyA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChbXCJQVFNcIiwgXCJSRUJcIiwgXCJBU1RcIiwgXCJTVExcIiwgXCJCTEtcIl0uaW5kZXhPZihsZWFkZXJzRGF0YVtpXS5oZWFkZXJzWzhdKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBsZWFkZXJzRGF0YVtpXS5yb3dTZXQubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuID0gbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzJdLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBuWzBdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG4gPSBuWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3dzICs9ICc8ZGl2IGNsYXNzPVwicm93XCI+PGRpdiBjbGFzcz1cImxlZnRcIj48ZGl2IGNsYXNzPVwicGxhY2VcIj4nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzBdICsgJzwvZGl2PjxkaXYgY2xhc3M9XCJsb2dvLXdyYXBcIj48aW1nIGNsYXNzPVwibG9nb1wiIHNyYz1cImh0dHA6Ly9zdGF0cy5uYmEuY29tL21lZGlhL2ltZy90ZWFtcy9sb2dvcy8nICsgbGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzRdICsgJ19sb2dvLnN2Z1wiLz48L2Rpdj48ZGl2IGNsYXNzPVwibmFtZVwiPjxzcGFuPicgKyBmbiArICc8L3NwYW4+ICcgKyBsbiArICc8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicmlnaHRcIj48ZGl2IGNsYXNzPVwidmFsdWVcIj4nICsgcm91bmQobGVhZGVyc0RhdGFbaV0ucm93U2V0W3hdWzhdKSArICc8L2Rpdj48L2Rpdj48L2Rpdj4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxlYWd1ZUxlYWRlcnNIVE1MICs9ICc8ZGl2IGNsYXNzPVwibGVhZ3VlLWxlYWRlcnMtd3JhcFwiPicgKyByb3dzICsgJzwvZGl2Pic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMnKS5lbXB0eSgpLmFwcGVuZChsZWFndWVMZWFkZXJzSFRNTCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgY291bnRlciA9IDI7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIGpRdWVyeSgnLmxlYWd1ZS1sZWFkZXJzLXdyYXAsIC5sZWFndWUtbGVhZGVycyAudGl0bGUgcCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgalF1ZXJ5KCcubGVhZ3VlLWxlYWRlcnMtd3JhcDpudGgtb2YtdHlwZSgnICsgY291bnRlciArICcpLCAubGVhZ3VlLWxlYWRlcnMgLnRpdGxlIHA6bnRoLW9mLXR5cGUoJyArIGNvdW50ZXIgKyAnKScpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gNikge1xuICAgICAgICAgICAgY291bnRlciA9IDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICB9LCAxMDAwMCk7XG59Il19
