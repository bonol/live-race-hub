import { Race, Racer } from "../models/race";

export function validateRaceInput(race: Race, races: Race[]){
    if (race.name == ''){
        throw new Error ('Race name can not be empty');
    }

    if (isRaceNameTaken(race.name, races)) {
        throw new Error (`Race name ${race.name} already taken`);
    }

    if (notEnoughRacers(race)) {
        throw new Error (`Race require at lease ${race.min} racers`);
    }

    if (hasEmptyRacerNames(race)) {
        throw new Error ('Racer name can not be empty');
    }

    if (hasDuplicateRacerNames(race)){
        throw new Error ('Duplicate racer names');
    }
}

function isRaceNameTaken(name: string, races: Race[]): boolean {
    return races.some(race => race.name === name);
}

function notEnoughRacers(race: Race): boolean{
    return race.racers.length < race.min;
}

function hasDuplicateRacerNames(race: Race): boolean{
    const names = race.racers.map(racer => racer.name);
    const uniqueNames = new Set(names);
    return names.length !== uniqueNames.size;
}

function hasEmptyRacerNames(race: Race): boolean{
   return race.racers.some(racer => racer.name === "");
}