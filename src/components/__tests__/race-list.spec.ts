import RaceList from "../race-list";
import { raceState } from "../../state/race-state";
import { Race, Racer, RaceStatus } from "../../models/race";
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
      <template id="single-race">
        <li>
          <h2></h2>
          <ul id="racers-list"></ul>
        </li>
      </template>
      <template id="single-racer">
          <li>
              <h3></h3>
              <p id="racer-lane-display"></p>
              <p id="racer-place-display"></p>
          </li>
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
    const racer1: Racer = {
        id: uuid().toString(),
        name: 'Tommy',
        raceLane: 2
    };
    const racer2: Racer = {
        id: uuid().toString(),
        name: 'Ron',
        raceLane: 3
    };
    const newRace1 = new Race(uuid().toString(), 'Race 1', 2, 8, RaceStatus.Ready, [racer1, racer2], []);
    const newRace2 = new Race(uuid().toString(), 'Race 2', 2, 8, RaceStatus.Pending, [racer1, racer2], []);
    const newRace3 = new Race(uuid().toString(), 'Race 3', 2, 8, RaceStatus.Ready, [racer1, racer2], []);


    const raceList = new RaceList('ready');

    raceState.addRace(newRace1);
    raceState.addRace(newRace2);
    raceState.addRace(newRace3);


    const listElement = document.getElementById(`${raceList.type}-races-list`)! as HTMLUListElement;
    expect(listElement.children.length).toBe(2);
  });
});