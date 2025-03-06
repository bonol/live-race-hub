import { Race, Racer } from "../models/race";
import { RaceStatus } from "../models/race";

export function validateRaceInput(race: Race, races: Race[], isNewRace: boolean){
    if (race.name == ''){
        throw new Error ('Race name can not be empty');
    }

    if (isNewRace && isRaceNameTaken(race.name, races)) {
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

    // only validate position when race is status is finished
    if(race.status === RaceStatus.Finished && !validateRacePositions(race)){
        throw new Error ('Incorrect race position. Please review');
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

export function validateRacePositions(race: Race): boolean{
    const positions = race.racers.map(racer => racer.racePosition!);

    // get unique position counts and sort in ascending order
    const positionCounts = new Map<number, number>();
    for (const pos of positions){
        positionCounts.set(pos, ((positionCounts.get(pos) || 0) + 1))
    }
    const sortedPositions = Array.from(positionCounts.keys()).sort();

    // first position must exist
    if(sortedPositions[0] !== 1){
        return false;
    }

    // use the second position number to compare with last position number
    // only valid when last position number + last position number appearance = second position number
    for(let i=1; i<sortedPositions.length; i++){
        const currentPosition = sortedPositions[i];
        const previousPosition = sortedPositions[i-1];
        const previousCount = positionCounts.get(previousPosition)!;

        const expectedPosition = previousPosition + previousCount;
        if(currentPosition !== expectedPosition) return false;
    }

    return true;
}