import { RaceStatus } from "../models/race";
export function validateRaceInput(race, races, isNewRace) {
    if (race.name == '') {
        throw new Error('Race name can not be empty');
    }
    if (isNewRace && isRaceNameTaken(race.name, races)) {
        throw new Error(`Race name ${race.name} already taken`);
    }
    if (notEnoughRacers(race)) {
        throw new Error(`Race require at lease ${race.min} racers`);
    }
    if (hasEmptyRacerNames(race)) {
        throw new Error('Racer name can not be empty');
    }
    if (hasDuplicateRacerNames(race)) {
        throw new Error('Duplicate racer names');
    }
    if (race.status === RaceStatus.Finished && !validateRacePositions(race)) {
        throw new Error('Incorrect race position. Please review');
    }
}
function isRaceNameTaken(name, races) {
    return races.some(race => race.name === name);
}
function notEnoughRacers(race) {
    return race.racers.length < race.min;
}
function hasDuplicateRacerNames(race) {
    const names = race.racers.map(racer => racer.name);
    const uniqueNames = new Set(names);
    return names.length !== uniqueNames.size;
}
function hasEmptyRacerNames(race) {
    return race.racers.some(racer => racer.name === "");
}
function validateRacePositions(race) {
    const positions = race.racers.map(racer => racer.racePosition);
    const positionCounts = new Map();
    for (const pos of positions) {
        positionCounts.set(pos, ((positionCounts.get(pos) || 0) + 1));
    }
    const sortedPositions = Array.from(positionCounts.keys()).sort();
    if (sortedPositions[0] !== 1) {
        return false;
    }
    for (let i = 1; i < sortedPositions.length; i++) {
        const currentPosition = sortedPositions[i];
        const previousPosition = sortedPositions[i - 1];
        const previousCount = positionCounts.get(previousPosition);
        const expectedPosition = previousPosition + previousCount;
        if (currentPosition !== expectedPosition)
            return false;
    }
    return true;
}
