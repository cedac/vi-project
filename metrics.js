var METRICS = {
    name: {
        code: "name",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 0
    },
    Continent: {
        code: "Continent",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 1
    },
    HOMICIDES: {
        code: "HOMICIDES",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 2
    },
    ARMY: {
        code: "ARMY",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 3
    },
    CRIME_PERCEPTION: {
        code: "CRIME_PERCEPTION",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 4
    },
    RANK: {
        code: "RANK",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 5
    },
    VIOLENT_CRIME: {
        code: "VIOLENT_CRIME",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 6
    },
    FOREIGN_RELATIONS: {
        code: "FOREIGN_RELATIONS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 7
    },
    UN_FUNDING: {
        code: "UN_FUNDING",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 8
    },
    POLICE: {
        code: "POLICE",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 9
    },
    WEAPON_ACCESS: {
        code: "WEAPON_ACCESS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 10
    },
    WEAPON_IMPORTS: {
        code: "WEAPON_IMPORTS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 11
    },
    POLITICAL_TERROR: {
        code: "POLITICAL_TERROR",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 12
    },
    INTERNAL_CONFLICTS: {
        code: "INTERNAL_CONFLICTS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 13
    },
    EXTERNAL_CONFLICTS: {
        code: "EXTERNAL_CONFLICTS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 14
    },
    TERRORISM_IMPACT: {
        code: "TERRORISM_IMPACT",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 15
    },
    POLITICAL_INSTABILITY: {
        code: "POLITICAL_INSTABILITY",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 16
    },
    REFUGEES: {
        code: "REFUGEES",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 17
    },
    WEAPON_EXPORTS: {
        code: "WEAPON_EXPORTS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 18
    },
    HEAVY_WEAPONS: {
        code: "HEAVY_WEAPONS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 19
    },
    EXTERNAL_DEATHS: {
        code: "EXTERNAL_DEATHS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 20
    },
    OVERALL: {
        code: "OVERALL",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 21
    },
    INTERNAL_CONFLICTS_INTENSITY: {
        code: "INTERNAL_CONFLICTS_INTENSITY",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 22
    },
    INTERNAL_DEATHS: {
        code: "INTERNAL_DEATHS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 23
    },
    MILITARY_EXPENDINTURE: {
        code: "MILITARY_EXPENDINTURE",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 24
    },
    JAIL: {
        code: "JAIL",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 25
    },
    VIOLENT_DEMONSTRATIONS: {
        code: "VIOLENT_DEMONSTRATIONS",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 26
    },
    GDPPC: {
        code: "GDPPC",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 27
    },
    INTERNET: {
        code: "INTERNET",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 28
    },
    POPULATION: {
        code: "POPULATION",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 29
    },
    UNEMPLOYMENT: {
        code: "UNEMPLOYMENT",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 30
    }
}

var METRICS_ARRAY = [];
for (var key in METRICS) {
    METRICS_ARRAY.push(METRICS[key])
}