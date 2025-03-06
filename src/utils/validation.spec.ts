import { validateRaceInput, validateRacePositions } from './validation';
import { Race, RaceStatus, Racer } from '../models/race';

describe('validateRaceInput', () => {
    const races: Race[] = [
        new Race('1', 'Race 1', 2, 8, RaceStatus.Ready, [], []),
        new Race('2', 'Race 2', 2, 8, RaceStatus.Ready, [], [])
    ];

    it('should throw an error if race name is empty', () => {
        const race = new Race('3', '', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races, false)).toThrow('Race name can not be empty');
    });

    it('should throw an error on create new race if race name is already taken', () => {
        const race = new Race('2', 'Race 1', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races, true)).toThrow('Race name Race 1 already taken');
    });

    it('should throw an error if not enough racers', () => {
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, [], []);
        expect(() => validateRaceInput(race, races, true)).toThrow('Race require at lease 2 racers');
    });

    it('should throw an error if any racer name is empty', () => {
        const racers: Racer[] = [
            { id: '1', name: '', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races, true)).toThrow('Racer name can not be empty');
    });

    it('should throw an error if there are duplicate racer names', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 1', raceLane: 2, racePosition: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races, true)).toThrow('Duplicate racer names');
    });

    it('should not throw an error for a valid race', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 2 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Ready, racers, []);
        expect(() => validateRaceInput(race, races, true)).not.toThrow();
    });
});

describe('validateRacePositions', () => {
    it('should return false if positions are out of range', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 0 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 9 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Finished, racers, []);
        expect(validateRacePositions(race)).toBe(false);
    });

    it('should return false if positions are not unique and not valid ties', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 1 },
            { id: '3', name: 'Racer 3', raceLane: 3, racePosition: 2 },
            { id: '4', name: 'Racer 4', raceLane: 4, racePosition: 3 },
            { id: '5', name: 'Racer 5', raceLane: 5, racePosition: 4 },
            { id: '6', name: 'Racer 6', raceLane: 6, racePosition: 5 },
            { id: '7', name: 'Racer 7', raceLane: 7, racePosition: 6 },
            { id: '8', name: 'Racer 8', raceLane: 8, racePosition: 7 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Finished, racers, []);
        expect(validateRacePositions(race)).toBe(false);
    });

    it('should return true for valid positions with no ties', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 2 },
            { id: '3', name: 'Racer 3', raceLane: 3, racePosition: 3 },
            { id: '4', name: 'Racer 4', raceLane: 4, racePosition: 4 },
            { id: '5', name: 'Racer 5', raceLane: 5, racePosition: 5 },
            { id: '6', name: 'Racer 6', raceLane: 6, racePosition: 6 },
            { id: '7', name: 'Racer 7', raceLane: 7, racePosition: 7 },
            { id: '8', name: 'Racer 8', raceLane: 8, racePosition: 8 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Finished, racers, []);
        expect(validateRacePositions(race)).toBe(true);
    });

    it('should return true for valid positions with ties', () => {
        const racers: Racer[] = [
            { id: '1', name: 'Racer 1', raceLane: 1, racePosition: 1 },
            { id: '2', name: 'Racer 2', raceLane: 2, racePosition: 1 },
            { id: '3', name: 'Racer 3', raceLane: 3, racePosition: 3 },
            { id: '4', name: 'Racer 4', raceLane: 4, racePosition: 4 },
            { id: '5', name: 'Racer 5', raceLane: 5, racePosition: 5 },
            { id: '6', name: 'Racer 6', raceLane: 6, racePosition: 6 },
            { id: '7', name: 'Racer 7', raceLane: 7, racePosition: 7 },
            { id: '8', name: 'Racer 8', raceLane: 8, racePosition: 8 }
        ];
        const race = new Race('3', 'Race 3', 2, 8, RaceStatus.Finished, racers, []);
        expect(validateRacePositions(race)).toBe(true);
    });
});