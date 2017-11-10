jQuery(document).ready(function() {
    /*========================================
    =            LOAD STATIC DATA            =
    ========================================*/
    var roster = '';
    var teamStats = {};
    var bioData = {};
    var playerSpotlightCounter = 6;
    var date = new Date();
    var rosterYear = date.getFullYear();
    var roster = [{
        "fn": "Kadeem",
        "ln": "Allen",
        "pid": 1628443,
        "num": "45",
        "pos": "G",
        "dob": "1993-01-15",
        "ht": "6-3",
        "wt": 200,
        "y": 0,
        "hcc": "ArizonaUSA/USA"
    }, {
        "fn": "Jabari",
        "ln": "Bird",
        "pid": 1628444,
        "num": "26",
        "pos": "G",
        "dob": "1994-07-03",
        "ht": "6-6",
        "wt": 198,
        "y": 0,
        "hcc": "California/USA"
    }, {
        "fn": "Daniel",
        "ln": "Theis",
        "pid": 1628464,
        "num": "27",
        "pos": "F-C",
        "dob": "1992-04-04",
        "ht": "6-9",
        "wt": 243,
        "y": 0,
        "hcc": "Germany/Germany"
    }, {
        "fn": "Terry",
        "ln": "Rozier",
        "pid": 1626179,
        "num": "12",
        "pos": "G",
        "dob": "1994-03-17",
        "ht": "6-2",
        "wt": 190,
        "y": 2,
        "hcc": "Louisville/USA"
    }, {
        "fn": "Gordon",
        "ln": "Hayward",
        "pid": 202330,
        "num": "20",
        "pos": "F",
        "dob": "1990-03-23",
        "ht": "6-8",
        "wt": 226,
        "y": 7,
        "hcc": "Butler/USA"
    }, {
        "fn": "Jaylen",
        "ln": "Brown",
        "pid": 1627759,
        "num": "7",
        "pos": "G-F",
        "dob": "1996-10-24",
        "ht": "6-7",
        "wt": 225,
        "y": 1,
        "hcc": "California/USA"
    }, {
        "fn": "Aron",
        "ln": "Baynes",
        "pid": 203382,
        "num": "46",
        "pos": "C",
        "dob": "1986-12-09",
        "ht": "6-10",
        "wt": 260,
        "y": 5,
        "hcc": "Washington State/Australia"
    }, {
        "fn": "Marcus",
        "ln": "Smart",
        "pid": 203935,
        "num": "36",
        "pos": "G",
        "dob": "1994-03-06",
        "ht": "6-4",
        "wt": 220,
        "y": 3,
        "hcc": "Oklahoma State/USA"
    }, {
        "fn": "Guerschon",
        "ln": "Yabusele",
        "pid": 1627824,
        "num": "30",
        "pos": "F",
        "dob": "1995-12-17",
        "ht": "6-8",
        "wt": 260,
        "y": 0,
        "hcc": "France/France"
    }, {
        "fn": "Al",
        "ln": "Horford",
        "pid": 201143,
        "num": "42",
        "pos": "F-C",
        "dob": "1986-06-03",
        "ht": "6-10",
        "wt": 245,
        "y": 10,
        "hcc": "Florida/Domincan Republic"
    }, {
        "fn": "Kyrie",
        "ln": "Irving",
        "pid": 202681,
        "num": "11",
        "pos": "G",
        "dob": "1992-03-23",
        "ht": "6-3",
        "wt": 193,
        "y": 6,
        "hcc": "Duke/Australia"
    }, {
        "fn": "Marcus",
        "ln": "Morris",
        "pid": 202694,
        "num": "13",
        "pos": "F",
        "dob": "1989-09-02",
        "ht": "6-9",
        "wt": 235,
        "y": 6,
        "hcc": "Kansas/USA"
    }, {
        "fn": "Abdel",
        "ln": "Nader",
        "pid": 1627846,
        "num": "28",
        "pos": "F",
        "dob": "1993-09-25",
        "ht": "6-6",
        "wt": 230,
        "y": 0,
        "hcc": "Egypt/Egypt"
    }, {
        "fn": "Jayson",
        "ln": "Tatum",
        "pid": 1628369,
        "num": "0",
        "pos": "F",
        "dob": "1998-03-03",
        "ht": "6-8",
        "wt": 205,
        "y": 0,
        "hcc": "Duke/USA"
    }, {
        "fn": "Shane",
        "ln": "Larkin",
        "pid": 203499,
        "num": "8",
        "pos": "G",
        "dob": "1992-10-02",
        "ht": "5-11",
        "wt": 175,
        "y": 3,
        "hcc": "Miami (Fla.)/USA"
    }, {
        "fn": "Semi",
        "ln": "Ojeleye",
        "pid": 1628400,
        "num": "37",
        "pos": "F",
        "dob": "1994-12-05",
        "ht": "6-7",
        "wt": 235,
        "y": 0,
        "hcc": "Southern Methodist/USA"
    }];
    var teamStats = {
            "tpsts": {
                "tid": 1610612738,
                "pl": [{
                    "pos": "F-C",
                    "pid": "201143",
                    "ln": "Horford",
                    "fn": "Al",
                    "avg": {
                        "gp": 11,
                        "gs": 11,
                        "min": 31.9,
                        "fgp": 0.531,
                        "tpp": 0.474,
                        "ftp": 0.821,
                        "oreb": 1.5,
                        "dreb": 7.7,
                        "reb": 9.2,
                        "ast": 4.7,
                        "stl": 0.6,
                        "blk": 0.7,
                        "tov": 2.5,
                        "pf": 1.8,
                        "pts": 14.6
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 11,
                        "min": 351,
                        "fgm": 60,
                        "fga": 113,
                        "tpm": 18,
                        "tpa": 38,
                        "ftm": 23,
                        "fta": 28,
                        "oreb": 16,
                        "dreb": 85,
                        "reb": 101,
                        "ast": 52,
                        "stl": 7,
                        "blk": 8,
                        "tov": 28,
                        "pf": 20,
                        "pts": 161
                    }
                }, {
                    "pos": "F",
                    "pid": "202330",
                    "ln": "Hayward",
                    "fn": "Gordon",
                    "avg": {
                        "gp": 1,
                        "gs": 1,
                        "min": 5.0,
                        "fgp": 0.5,
                        "tpp": 0.0,
                        "ftp": 0.0,
                        "oreb": 0.0,
                        "dreb": 1.0,
                        "reb": 1.0,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 1.0,
                        "pts": 2.0
                    },
                    "tot": {
                        "gp": 1,
                        "gs": 1,
                        "min": 5,
                        "fgm": 1,
                        "fga": 2,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 0,
                        "dreb": 1,
                        "reb": 1,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 1,
                        "pts": 2
                    }
                }, {
                    "pos": "G",
                    "pid": "202681",
                    "ln": "Irving",
                    "fn": "Kyrie",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 33.4,
                        "fgp": 0.446,
                        "tpp": 0.321,
                        "ftp": 0.884,
                        "oreb": 0.5,
                        "dreb": 2.8,
                        "reb": 3.3,
                        "ast": 5.7,
                        "stl": 2.1,
                        "blk": 0.3,
                        "tov": 2.1,
                        "pf": 2.3,
                        "pts": 22.0
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 401,
                        "fgm": 100,
                        "fga": 224,
                        "tpm": 26,
                        "tpa": 81,
                        "ftm": 38,
                        "fta": 43,
                        "oreb": 6,
                        "dreb": 34,
                        "reb": 40,
                        "ast": 68,
                        "stl": 25,
                        "blk": 4,
                        "tov": 25,
                        "pf": 28,
                        "pts": 264
                    }
                }, {
                    "pos": "F",
                    "pid": "202694",
                    "ln": "Morris",
                    "fn": "Marcus",
                    "avg": {
                        "gp": 3,
                        "gs": 2,
                        "min": 22.0,
                        "fgp": 0.424,
                        "tpp": 0.273,
                        "ftp": 0.889,
                        "oreb": 0.3,
                        "dreb": 3.7,
                        "reb": 4.0,
                        "ast": 1.3,
                        "stl": 1.3,
                        "blk": 0.0,
                        "tov": 0.3,
                        "pf": 2.3,
                        "pts": 13.0
                    },
                    "tot": {
                        "gp": 3,
                        "gs": 2,
                        "min": 66,
                        "fgm": 14,
                        "fga": 33,
                        "tpm": 3,
                        "tpa": 11,
                        "ftm": 8,
                        "fta": 9,
                        "oreb": 1,
                        "dreb": 11,
                        "reb": 12,
                        "ast": 4,
                        "stl": 4,
                        "blk": 0,
                        "tov": 1,
                        "pf": 7,
                        "pts": 39
                    }
                }, {
                    "pos": "C",
                    "pid": "203382",
                    "ln": "Baynes",
                    "fn": "Aron",
                    "avg": {
                        "gp": 12,
                        "gs": 8,
                        "min": 19.3,
                        "fgp": 0.515,
                        "tpp": 0.0,
                        "ftp": 0.68,
                        "oreb": 2.1,
                        "dreb": 3.7,
                        "reb": 5.8,
                        "ast": 1.0,
                        "stl": 0.3,
                        "blk": 0.7,
                        "tov": 0.8,
                        "pf": 2.5,
                        "pts": 7.1
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 8,
                        "min": 232,
                        "fgm": 34,
                        "fga": 66,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 17,
                        "fta": 25,
                        "oreb": 25,
                        "dreb": 44,
                        "reb": 69,
                        "ast": 12,
                        "stl": 3,
                        "blk": 8,
                        "tov": 10,
                        "pf": 30,
                        "pts": 85
                    }
                }, {
                    "pos": "G",
                    "pid": "203499",
                    "ln": "Larkin",
                    "fn": "Shane",
                    "avg": {
                        "gp": 10,
                        "gs": 0,
                        "min": 9.6,
                        "fgp": 0.241,
                        "tpp": 0.231,
                        "ftp": 0.833,
                        "oreb": 0.1,
                        "dreb": 0.9,
                        "reb": 1.0,
                        "ast": 1.5,
                        "stl": 0.3,
                        "blk": 0.0,
                        "tov": 0.3,
                        "pf": 0.8,
                        "pts": 2.2
                    },
                    "tot": {
                        "gp": 10,
                        "gs": 0,
                        "min": 96,
                        "fgm": 7,
                        "fga": 29,
                        "tpm": 3,
                        "tpa": 13,
                        "ftm": 5,
                        "fta": 6,
                        "oreb": 1,
                        "dreb": 9,
                        "reb": 10,
                        "ast": 15,
                        "stl": 3,
                        "blk": 0,
                        "tov": 3,
                        "pf": 8,
                        "pts": 22
                    }
                }, {
                    "pos": "G",
                    "pid": "203935",
                    "ln": "Smart",
                    "fn": "Marcus",
                    "avg": {
                        "gp": 10,
                        "gs": 1,
                        "min": 29.7,
                        "fgp": 0.307,
                        "tpp": 0.326,
                        "ftp": 0.7,
                        "oreb": 1.4,
                        "dreb": 3.2,
                        "reb": 4.6,
                        "ast": 5.4,
                        "stl": 1.7,
                        "blk": 0.4,
                        "tov": 2.2,
                        "pf": 2.5,
                        "pts": 9.7
                    },
                    "tot": {
                        "gp": 10,
                        "gs": 1,
                        "min": 297,
                        "fgm": 31,
                        "fga": 101,
                        "tpm": 14,
                        "tpa": 43,
                        "ftm": 21,
                        "fta": 30,
                        "oreb": 14,
                        "dreb": 32,
                        "reb": 46,
                        "ast": 54,
                        "stl": 17,
                        "blk": 4,
                        "tov": 22,
                        "pf": 25,
                        "pts": 97
                    }
                }, {
                    "pos": "G",
                    "pid": "1626179",
                    "ln": "Rozier",
                    "fn": "Terry",
                    "avg": {
                        "gp": 12,
                        "gs": 0,
                        "min": 24.2,
                        "fgp": 0.372,
                        "tpp": 0.315,
                        "ftp": 0.8,
                        "oreb": 0.8,
                        "dreb": 4.4,
                        "reb": 5.2,
                        "ast": 2.3,
                        "stl": 1.3,
                        "blk": 0.1,
                        "tov": 0.6,
                        "pf": 1.3,
                        "pts": 9.4
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 0,
                        "min": 290,
                        "fgm": 42,
                        "fga": 113,
                        "tpm": 17,
                        "tpa": 54,
                        "ftm": 12,
                        "fta": 15,
                        "oreb": 9,
                        "dreb": 53,
                        "reb": 62,
                        "ast": 27,
                        "stl": 15,
                        "blk": 1,
                        "tov": 7,
                        "pf": 16,
                        "pts": 113
                    }
                }, {
                    "pos": "G-F",
                    "pid": "1627759",
                    "ln": "Brown",
                    "fn": "Jaylen",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 31.7,
                        "fgp": 0.447,
                        "tpp": 0.382,
                        "ftp": 0.596,
                        "oreb": 1.2,
                        "dreb": 5.6,
                        "reb": 6.8,
                        "ast": 1.0,
                        "stl": 0.9,
                        "blk": 0.2,
                        "tov": 1.5,
                        "pf": 2.7,
                        "pts": 14.8
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 380,
                        "fgm": 63,
                        "fga": 141,
                        "tpm": 21,
                        "tpa": 55,
                        "ftm": 31,
                        "fta": 52,
                        "oreb": 14,
                        "dreb": 67,
                        "reb": 81,
                        "ast": 12,
                        "stl": 11,
                        "blk": 2,
                        "tov": 18,
                        "pf": 32,
                        "pts": 178
                    }
                }, {
                    "pos": "F",
                    "pid": "1627824",
                    "ln": "Yabusele",
                    "fn": "Guerschon",
                    "avg": {
                        "gp": 5,
                        "gs": 0,
                        "min": 3.4,
                        "fgp": 0.5,
                        "tpp": 0.4,
                        "ftp": 1.0,
                        "oreb": 0.8,
                        "dreb": 0.4,
                        "reb": 1.2,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.4,
                        "pf": 0.4,
                        "pts": 2.8
                    },
                    "tot": {
                        "gp": 5,
                        "gs": 0,
                        "min": 17,
                        "fgm": 5,
                        "fga": 10,
                        "tpm": 2,
                        "tpa": 5,
                        "ftm": 2,
                        "fta": 2,
                        "oreb": 4,
                        "dreb": 2,
                        "reb": 6,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 2,
                        "pf": 2,
                        "pts": 14
                    }
                }, {
                    "pos": "F",
                    "pid": "1627846",
                    "ln": "Nader",
                    "fn": "Abdel",
                    "avg": {
                        "gp": 7,
                        "gs": 0,
                        "min": 6.9,
                        "fgp": 0.375,
                        "tpp": 0.2,
                        "ftp": 0.0,
                        "oreb": 0.3,
                        "dreb": 0.6,
                        "reb": 0.9,
                        "ast": 0.4,
                        "stl": 0.3,
                        "blk": 0.1,
                        "tov": 0.6,
                        "pf": 0.6,
                        "pts": 1.9
                    },
                    "tot": {
                        "gp": 7,
                        "gs": 0,
                        "min": 48,
                        "fgm": 6,
                        "fga": 16,
                        "tpm": 1,
                        "tpa": 5,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 2,
                        "dreb": 4,
                        "reb": 6,
                        "ast": 3,
                        "stl": 2,
                        "blk": 1,
                        "tov": 4,
                        "pf": 4,
                        "pts": 13
                    }
                }, {
                    "pos": "F",
                    "pid": "1628369",
                    "ln": "Tatum",
                    "fn": "Jayson",
                    "avg": {
                        "gp": 12,
                        "gs": 12,
                        "min": 29.8,
                        "fgp": 0.5,
                        "tpp": 0.529,
                        "ftp": 0.833,
                        "oreb": 1.2,
                        "dreb": 4.8,
                        "reb": 6.0,
                        "ast": 1.8,
                        "stl": 0.8,
                        "blk": 0.9,
                        "tov": 1.7,
                        "pf": 2.3,
                        "pts": 13.5
                    },
                    "tot": {
                        "gp": 12,
                        "gs": 12,
                        "min": 357,
                        "fgm": 52,
                        "fga": 104,
                        "tpm": 18,
                        "tpa": 34,
                        "ftm": 40,
                        "fta": 48,
                        "oreb": 14,
                        "dreb": 58,
                        "reb": 72,
                        "ast": 22,
                        "stl": 9,
                        "blk": 11,
                        "tov": 20,
                        "pf": 27,
                        "pts": 162
                    }
                }, {
                    "pos": "F",
                    "pid": "1628400",
                    "ln": "Ojeleye",
                    "fn": "Semi",
                    "avg": {
                        "gp": 11,
                        "gs": 0,
                        "min": 15.8,
                        "fgp": 0.4,
                        "tpp": 0.391,
                        "ftp": 0.75,
                        "oreb": 0.5,
                        "dreb": 1.3,
                        "reb": 1.7,
                        "ast": 0.2,
                        "stl": 0.4,
                        "blk": 0.0,
                        "tov": 0.4,
                        "pf": 1.0,
                        "pts": 3.5
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 0,
                        "min": 174,
                        "fgm": 12,
                        "fga": 30,
                        "tpm": 9,
                        "tpa": 23,
                        "ftm": 6,
                        "fta": 8,
                        "oreb": 5,
                        "dreb": 14,
                        "reb": 19,
                        "ast": 2,
                        "stl": 4,
                        "blk": 0,
                        "tov": 4,
                        "pf": 11,
                        "pts": 39
                    }
                }, {
                    "pos": "G",
                    "pid": "1628443",
                    "ln": "Allen",
                    "fn": "Kadeem",
                    "avg": {
                        "gp": 0,
                        "gs": 0,
                        "min": 0.0,
                        "fgp": 0.0,
                        "tpp": 0.0,
                        "ftp": 0.0,
                        "oreb": 0.0,
                        "dreb": 0.0,
                        "reb": 0.0,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 0.0,
                        "pts": 0.0
                    },
                    "tot": {
                        "gp": 0,
                        "gs": 0,
                        "min": 0,
                        "fgm": 0,
                        "fga": 0,
                        "tpm": 0,
                        "tpa": 0,
                        "ftm": 0,
                        "fta": 0,
                        "oreb": 0,
                        "dreb": 0,
                        "reb": 0,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 0,
                        "pts": 0
                    }
                }, {
                    "pos": "G",
                    "pid": "1628444",
                    "ln": "Bird",
                    "fn": "Jabari",
                    "avg": {
                        "gp": 2,
                        "gs": 0,
                        "min": 8.0,
                        "fgp": 0.0,
                        "tpp": 0.0,
                        "ftp": 0.6,
                        "oreb": 0.0,
                        "dreb": 0.5,
                        "reb": 0.5,
                        "ast": 0.0,
                        "stl": 0.0,
                        "blk": 0.0,
                        "tov": 0.0,
                        "pf": 0.5,
                        "pts": 1.5
                    },
                    "tot": {
                        "gp": 2,
                        "gs": 0,
                        "min": 16,
                        "fgm": 0,
                        "fga": 1,
                        "tpm": 0,
                        "tpa": 1,
                        "ftm": 3,
                        "fta": 5,
                        "oreb": 0,
                        "dreb": 1,
                        "reb": 1,
                        "ast": 0,
                        "stl": 0,
                        "blk": 0,
                        "tov": 0,
                        "pf": 1,
                        "pts": 3
                    }
                }, {
                    "pos": "F-C",
                    "pid": "1628464",
                    "ln": "Theis",
                    "fn": "Daniel",
                    "avg": {
                        "gp": 11,
                        "gs": 1,
                        "min": 13.5,
                        "fgp": 0.583,
                        "tpp": 0.25,
                        "ftp": 0.786,
                        "oreb": 1.7,
                        "dreb": 2.3,
                        "reb": 4.0,
                        "ast": 0.5,
                        "stl": 0.3,
                        "blk": 0.8,
                        "tov": 1.3,
                        "pf": 2.9,
                        "pts": 4.9
                    },
                    "tot": {
                        "gp": 11,
                        "gs": 1,
                        "min": 149,
                        "fgm": 21,
                        "fga": 36,
                        "tpm": 1,
                        "tpa": 4,
                        "ftm": 11,
                        "fta": 14,
                        "oreb": 19,
                        "dreb": 25,
                        "reb": 44,
                        "ast": 5,
                        "stl": 3,
                        "blk": 9,
                        "tov": 14,
                        "pf": 32,
                        "pts": 54
                    }
                }],
                "ta": "BOS",
                "tn": "Celtics",
                "tc": "Boston"
            }
        }
        // LOAD ROSTER (AND GET YEAR)
        /*    jQuery.ajax({
                url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics_roster.json',
                async: false,
                success: function(data) {
                    roster = data.t.pl;
                },
                error: function() {
                    rosterYear--;
                    jQuery.ajax({
                        url: "http://data.nba.com/data/v2015/json/mobile_teams/nba/" + rosterYear + "/teams/celtics_roster.json",
                        async: false,
                        success: function(data) {
                            roster = data.t.pl;
                        }
                    });
                }
            });
            // LOAD TEAM STATS
            jQuery.ajax({
                url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics/player_averages_02.json',
                async: false,
                success: function(data) {
                    for (var i = 0; i < data.tpsts.pl.length; i++) {
                        teamStats[data.tpsts.pl[i].pid] = data.tpsts.pl[i]
                    }
                },
                error: function() {
                    rosterYear--;
                    jQuery.ajax({
                        url: 'http://data.nba.com/data/v2015/json/mobile_teams/nba/' + rosterYear + '/teams/celtics/player_averages_02.json',
                        async: false,
                        success: function(data) {
                            for (var i = 0; i < data.tpsts.pl.length; i++) {
                                teamStats[data.tpsts.pl[i].pid] = data.tpsts.pl[i]
                            }
                        }
                    });
                }
            });*/
    bioData = '';
    /*	jQuery.getJSON('http://io.cnn.net/nba/nba/.element/media/2.0/teamsites/celtics/misc/bioObj.json?', function(data) {
    	    bioData = data;
    	});*/
    /*    playerSpotlight(roster, bioData, teamStats);
        var playerCounter = 2;
        setInterval(function() {
            jQuery('.player-spotlight').css('right', '0%');
            setTimeout(function() {
                jQuery('.player-spotlight').css('right', '100%');
            }, 2000);
            setTimeout(function() {
                jQuery('.player-spotlight').hide();
                jQuery('.player-spotlight').css('right', '-100%');
            }, 5000);
            setTimeout(function() {
                jQuery('.player-spotlight').show();
                jQuery('.player-spotlight .player-wrap').removeClass("active");
                jQuery('.player-spotlight .player-wrap:nth-child(' + playerCounter + ')').addClass("active");
                if (playerCounter == roster.length) {
                    playerCounter = 1;
                } else {
                    playerCounter++;
                }
            }, 9000)
        }, 10000);*/
    /*=================================================
    =            SOCIAL => PLAYERSPOTLIGHT            =
    =================================================*/
    playerSpotlight(roster, null, teamStats, playerSpotlightCounter);
});
/*======================================
=            MISC FUNCTIONS            =
======================================*/
function playerAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
}
/*========================================
=            PLAYER SPOTLIGHT            =
========================================*/


function playerSpotlight(roster, bioObj, teamStats, playerSpotlightCounter) {
    /* 1 - WHITE LINE HORIZTONAL */
    setTimeout(function() {
            jQuery('.white-line.horizontal').addClass('transition');
        }, 500)
        /* 2a - WHITE LINE VERTICAL */
    setTimeout(function() {
            jQuery('.social-top .white-line.vertical:nth-child(odd)').addClass('transition');
            jQuery('.social-bottom .white-line.vertical:nth-child(even)').addClass('transition');
        }, 800)
        /* 2b - WHITE LINE VERTICAL */
    setTimeout(function() {
        jQuery('.social-top .white-line.vertical:nth-child(even)').addClass('transition');
        jQuery('.social-bottom .white-line.vertical:nth-child(odd)').addClass('transition');
    }, 1000)
    setTimeout(function() {
            jQuery('.social-top, .social-bottom').fadeOut(100);
            jQuery('.player-box-wrap').fadeTo(100, 1);
        }, 1200)
        /* 4 - APPEND HEADSHOTS */
    setTimeout(function() {
            jQuery('.player-box-wrap, .player-box').addClass("transition");
            var delay = 0;
            for (i = 0; i < roster.length; i++) {
                var headshot = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/' + roster[i].pid + '.png';
                jQuery('.player-box:nth-child(' + (i + 1) + ')').append('<img src="' + headshot + '"/>');
                jQuery('.player-box:nth-child(' + (i + 1) + ')').data('data-pid',roster[i].pid);
                jQuery('.player-box img').on("error", function() {
                    jQuery(this).attr('src', 'https://i.cdn.turner.com/nba/nba/.element/media/2.0/teamsites/celtics/media/generic-player-light_600x438.png');
                });
                jQuery('.player-box:nth-child(' + (i + 1) + ') img').delay(delay).fadeTo(300, 1);
                delay += 30;
            }
        }, 1300)
        /* 5 - SELECT A PLAYER */
    setTimeout(function() {
        jQuery('.player-box').addClass('transition-2');
        jQuery('.player-box:nth-child(' + playerSpotlightCounter + ')').addClass('selected');
        jQuery('.player-box').not('.replacement.selected').delay(500).fadeTo(100,0);
        if (selectedPlayerCouner < 16){
                playerSpotlightCounter++;
            }
            else {
                playerSpotlightCounter = 0;
            }
        }, 2000)
    setTimeout(function() {
        jQuery('.block-wrap.social').addClass('transition-3');
        jQuery('.player-box.replacement.selected').addClass('transition-3');
        }, 3000)
}
/*==================================
=            HIGHLIGHTS            =
==================================*/
function highlights() {};
/*====================================
=            STAT LEADERS            =
====================================*/
function statLeaders() {};
/*==============================
=            SOCIAL            =
==============================*/
function social(roster) {};
/*==================================
=            MOBILE APP            =
==================================*/
function mobileApp() {};
/*=================================
=            STANDINGS            =
=================================*/
function standings() {};
/*=========================================
=            AROUND THE LEAGUE            =
=========================================*/
function aroundTheLeague() {};