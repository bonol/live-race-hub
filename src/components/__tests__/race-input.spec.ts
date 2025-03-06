import RaceInput from "../race-input";
import { raceState } from "../../state/race-state";

describe('RaceInput', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <template id="race-input">
                <form>
                    <input type="hidden" id="race-id">
                    <div class="form-control">
                        <label for="name">Name</label>
                        <input type="text" id="name" />
                    </div>
                    <div class="form-control">
                        <label for="min-racer">Min</label>
                        <input type="number" id="min-racer" value="2" />
                    </div>
                    <div class="form-control">
                        <label for="max-racer">Max</label>
                        <input type="number" id="max-racer" value="8" />
                    </div>
                    <div class="form-control race-radio">
                        <label for="race-completed">Race Completed?</label>
                        <input type="checkbox" id="race-completed" name="race-completed">
                    </div>
                    <section>
                        <div id="racers-list"></div>
                        <button type="button" id="add-racer">Add Racer</button>
                    </section>

                    <button type="button" id="add-racer">Add Racer</button>
                    <button type="submit">Save Race</button>
                    <button type="button" id="cancel">Cancel</button>
                </form>
            </template>
            <template id="racer-entry">
                <div class="racer-entry">
                    <div class="form-control">
                        <label for="racer-name-1">Racer Name</label>
                        <input type="text" id="racer-name-1" name="racer-name[]" placeholder="Enter racer name">
                    </div>
                    <div class="form-control">
                        <label for="racer-lane-1">Racer Lane</label>
                        <input type="number" id="racer-lane-1" name="racer-lane[]" placeholder="Enter racer lane">
                    </div>
                    <div class="form-control" hidden="true">
                        <label for="racer-place-1">Finish Position</label>
                        <input type="number" id="racer-place-1" name="racer-place[]" placeholder="Enter racer place">
                    </div>
                </div>
            </template>
            <div id="app"></div>
        `;
    });

    it('should initialize race input form and configure event listeners', () => {
        const raceInput = new RaceInput;

        expect(raceInput.nameInputElement).not.toBeNull();
        expect(raceInput.minParticipantElement).not.toBeNull();
        expect(raceInput.maxParticipantElement).not.toBeNull();
        expect(raceInput.racersListElement).not.toBeNull();

        const addRacerBtn = raceInput.element.querySelector('#add-racer');
        expect(addRacerBtn).not.toBeNull();
    });

    it('should add a new racer entry when Add Racer button clicked', () => {
        const raceInput = new RaceInput;
        const addRacerBtn = raceInput.element.querySelector('#add-racer') as HTMLButtonElement;
        
        addRacerBtn.click();

        const racersList = raceInput.racersListElement;
        expect(racersList.children.length).toBe(1);
    });

    it('should invoke submitHandler when form is submitted', () => {
        const raceInput = new RaceInput();
        const formElem = raceInput.element;

        const addRaceSpy = jest.spyOn(raceState, 'addRace');
        formElem.dispatchEvent(new Event('submit'));

        expect(addRaceSpy).toHaveBeenCalled;
    })
});