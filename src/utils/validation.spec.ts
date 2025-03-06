import { validateRaceInput } from './validation';
import { Race, RaceStatus, Racer } from '../models/race';

describe('validateRaceInput', () => {
    const races: Race[] = [
        new Race('1', 'Race 1', 2, 8, RaceStatus.Ready, [], []),
        new Race('2', 'Race 2', 2, 8, RaceStatus.Ready, [], [])
    ];

    it('should throw an error if race name is empty', () => {
        const race = new Race('3', '', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races)).toThrow('Race name can not be empty');
    });

    it('should throw an error if race name is already taken', () => {
        const race = new Race('3', 'Race 1', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races)).toThrow('Race name Race 1 already taken');
    });

    it('should throw an error if not enough racers', () => {
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races)).toThrow('Race require at lease 2 racers');
    });

    it('should throw an error if any racer name is empty', () => {
        const racers: Racer[] = [
            { id: '1', name: '', raceLane: 1, racePlace: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePlace: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races)).toThrow('Racer name can not be empty');
    });

    it('should throw an error if there are duplicate racer names', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePlace: 1 },
            { id: '2', name: 'Racer 1', raceLane: 2, racePlace: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races)).toThrow('Duplicate racer names');
    });

    it('should not throw an error for a valid race', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePlace: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePlace: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races)).not.toThrow();
    });
});