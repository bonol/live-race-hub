export class Racer {
    constructor(id, raceId, name, raceLane) {
        this.id = id;
        this.raceId = raceId;
        this.name = name;
        this.raceLane = raceLane;
    }
}
export var RaceStatus;
(function (RaceStatus) {
    RaceStatus[RaceStatus["Pending"] = 0] = "Pending";
    RaceStatus[RaceStatus["Ready"] = 1] = "Ready";
    RaceStatus[RaceStatus["Finished"] = 2] = "Finished";
})(RaceStatus || (RaceStatus = {}));
export class Race {
    constructor(id, name, min, max, status, racers, results) {
        this.id = id;
        this.name = name;
        this.min = min;
        this.max = max;
        this.status = status;
        this.racers = racers;
        this.results = results;
    }
}
