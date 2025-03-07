import '@testing-library/jest-dom';
import { screen, within } from '@testing-library/dom';
import { Race, Racer, RaceStatus } from '../../models/race';
import RaceItem from '../race-item';
import RaceList from '../race-list';
import { v4 as uuid } from 'uuid';
import { raceState } from '../../state/race-state';

describe('RaceItem', () => {
    const racer1: Racer = {
        id: uuid().toString(),
        name: 'Tim',
        raceLane: 2,
        racePosition: 1
    };
    const racer2: Racer = {
        id: uuid().toString(),
        name: 'Dreck',
        raceLane: 3,
        racePosition: 2
    };
    const race: Race = new Race(uuid().toString(), 'Race 1', 2, 8, RaceStatus.Ready, [racer1, racer2], []);

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

    it('should render the race item', () => {
        new RaceItem('app', race);

        const raceElements = screen.getAllByRole('listitem');
        const raceElement = raceElements.find(el => within(el).queryByText('Race 1'));

        expect(raceElement).toBeInTheDocument();

        const nameElement = within(raceElement!).getByText('Race 1');
        expect(nameElement).toBeInTheDocument();

        const racerElements = within(raceElement!).getAllByRole('listitem');
        expect(racerElements.length).toBe(2);

        const racer1Element = within(racerElements[0]).getByText('Racer: Tim');
        expect(racer1Element).toBeInTheDocument();

        const racer2Element = within(racerElements[1]).getByText('Racer: Dreck');
        expect(racer2Element).toBeInTheDocument();
    });

    it('should render race items in race list', () => {
        const raceList = new RaceList('ready');
        raceList.renderContent();

        raceState.addRace(race);

        const listElement = document.getElementById(`${raceList.type}-races-list`)! as HTMLUListElement;
        expect(listElement.children.length).toBe(1);

        const raceElements = within(listElement).getAllByRole('listitem');
        const raceElement = raceElements.find(el => within(el).queryAllByAltText('Race 1'));

        expect(raceElement).toBeInTheDocument();

        const nameElement = within(raceElement!).getByText('Race 1');
        expect(nameElement).toBeInTheDocument();

        const racerElements = within(raceElement!).getAllByRole('listitem');
        expect(racerElements.length).toBe(2);

        const racer1Element = within(racerElements[0]).getByText('Racer: Tim');
        expect(racer1Element).toBeInTheDocument();

        const racer2Element = within(racerElements[1]).getByText('Racer: Dreck');
        expect(racer2Element).toBeInTheDocument();
    });
});
