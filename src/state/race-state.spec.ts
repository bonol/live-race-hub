import {v4 as uuid} from 'uuid';
import { RaceState } from "./race-state";
import { RaceStatus } from "../models/race";

describe('RaceState', () => {
    beforeEach(() => {
        const state = RaceState.getInstance();
        state.races = [];
        localStorage.clear;
    });

    it('should add a new race and update localStorage', () => {
        const state = RaceState.getInstance();
        const racer1 = {
            id: uuid().toString(),
            name: 'Tommy',
            raceLane: 2,
        };
        const racer2 = {
            id: uuid().toString(),
            name: 'Ron',
            raceLane: 3,
        };
        state.addRace('new race', 2, 8, [racer1, racer2]);
        expect(state.races.length).toBe(1);
        const race = state.races[0];
        expect(race.name).toBe('new race');
        expect(race.status).toBe(RaceStatus.Ready);

        // test localStorage update
        const storedRaces = JSON.parse(localStorage.getItem('races')!);
        expect(storedRaces.length).toBe(1);
        expect(storedRaces[0].name).toBe('new race');
    });
});