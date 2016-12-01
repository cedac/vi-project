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
        name: "Homicides",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 2
    },
    ARMY: {
        code: "ARMY",
        name: "Army Personnel",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 3
    },
    CRIME_PERCEPTION: {
        code: "CRIME_PERCEPTION",
        name: "Crime Perception",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 4
    },
    RANK: {
        code: "RANK",
        name: "Rank",
        five: false,
        max: 0,
        min: 0,
        sort: -1,
        index: 5
    },
    VIOLENT_CRIME: {
        code: "VIOLENT_CRIME",
        name: "Violent Crime",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 6
    },
    FOREIGN_RELATIONS: {
        code: "FOREIGN_RELATIONS",
        name: "Foreign Relations",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 7
    },
    UN_FUNDING: {
        code: "UN_FUNDING",
        name: "UN Funding",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 8
    },
    POLICE: {
        code: "POLICE",
        name: "Police Personnel",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 9
    },
    WEAPON_ACCESS: {
        code: "WEAPON_ACCESS",
        name: "Access to Weapons",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 10
    },
    WEAPON_IMPORTS: {
        code: "WEAPON_IMPORTS",
        name: "Weapon Importation",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 11
    },
    POLITICAL_TERROR: {
        code: "POLITICAL_TERROR",
        name: "Political Terror",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 12
    },
    INTERNAL_CONFLICTS: {
        code: "INTERNAL_CONFLICTS",
        name: "Internal Cnflicts",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 13
    },
    EXTERNAL_CONFLICTS: {
        code: "EXTERNAL_CONFLICTS",
        name: "External Conflicts",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 14
    },
    TERRORISM_IMPACT: {
        code: "TERRORISM_IMPACT",
        name: "Terrorism Impact",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 15
    },
    POLITICAL_INSTABILITY: {
        code: "POLITICAL_INSTABILITY",
        name: "Political Instability",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 16
    },
    REFUGEES: {
        code: "REFUGEES",
        name: "Fleeing Refugees",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 17
    },
    WEAPON_EXPORTS: {
        code: "WEAPON_EXPORTS",
        name: "Weapon Exportation",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 18
    },
    HEAVY_WEAPONS: {
        code: "HEAVY_WEAPONS",
        name: "Heavy Weapons",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 19
    },
    EXTERNAL_DEATHS: {
        code: "EXTERNAL_DEATHS",
        name: "Deaths in Ext. Conflict",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 20
    },
    OVERALL: {
        code: "OVERALL",
        name: "Overall",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 21
    },
    INTERNAL_CONFLICTS_INTENSITY: {
        code: "INTERNAL_CONFLICTS_INTENSITY",
        name: "Int. Conflict Intensity",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 22
    },
    INTERNAL_DEATHS: {
        code: "INTERNAL_DEATHS",
        name: "Deaths in Int. Conflicts",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 23
    },
    MILITARY_EXPENDINTURE: {
        code: "MILITARY_EXPENDINTURE",
        name: "Military Expenditure",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 24
    },
    JAIL: {
        code: "JAIL",
        name: "People Incarcerated",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 25
    },
    VIOLENT_DEMONSTRATIONS: {
        code: "VIOLENT_DEMONSTRATIONS",
        name: "Violent Demonstration",
        five: true,
        max: 0,
        min: 0,
        sort: -1,
        index: 26
    },
    GDPPC: {
        code: "GDPPC",
        name: "GDP per Capita",
        five: false,
        // how to get the maximum:
        // d3.max(d3.values(d).map(d => d.GDPPC).map(d => d3.max(d3.values(d))))
        // > 102910.435039364
        scale: d3.scaleLinear().domain([0,102910.435039364]).range([5,1]),
        max: 0,
        min: 0,
        sort: -1,
        index: 27
    },
    INTERNET: {
        code: "INTERNET",
        name: "Access to Internet",
        five: false,
        scale: d3.scaleLinear().domain([0,100]).range([5,1]),
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
        name: "Unemployment",
        five: false,
        scale: d3.scaleLinear().domain([0,100]).range([1,5]),
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