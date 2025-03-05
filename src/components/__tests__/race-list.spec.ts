import RaceList from "../race-list";
import { raceState } from "../../state/race-state";
import { Race, RaceStatus } from "../../models/race";
import {v4 as uuid} from 'uuid';

describe('RaceList', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <template id="race-list">
        <section class="races">
          <header>
            <h2></h2>
          </header>
          <ul></ul>
        </section>
      </template>
      <div id="app"></div>
    `;
  });

  it('should initialize and render content', () => {
    const raceList = new RaceList('ready');

    const listId = `${raceList.type}-races-list`;
    const listElement = document.getElementById(listId);
    const headerElement = raceList.element.querySelector('h2');

    expect(listElement).not.toBeNull();
    expect(headerElement).not.toBeNull();
    expect(headerElement!.textContent).toBe('READY Race');
  });

  it('should filter and render Ready races', () => {
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
    raceState.addRace('Race 1', 2, 8, [racer1, racer2]);
    raceState.addRace('Race 2',  2, 8, [racer1, racer2]);
    raceState.addRace('Race 3',  2, 8, [racer1, racer2]);

    const raceList = new RaceList('ready');

    const listElement = document.getElementById(`${raceList.type}-races-list`)! as HTMLUListElement;
    expect(listElement.children.length).toBe(2);
  });
});