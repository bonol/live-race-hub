import Component from "./base-component";
import { RaceStatus } from "../models/race";
import RacerItem from "./racer-item";
export default class RaceItem extends Component {
    constructor(hostId, race) {
        super('single-race', hostId, true, race.id);
        this.race = race;
        this.configure();
        this.renderContent();
    }
    configure() {
        this.element.addEventListener('dblclick', this.loadRaceForEditing.bind(this));
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.race.name;
        const ulElem = this.element.querySelector('ul');
        ulElem.id = ulElem.id + '-' + this.race.id;
        for (const racer of this.race.racers) {
            new RacerItem(ulElem.id, racer);
        }
    }
    loadRaceForEditing() {
        const raceInputElement = document.getElementById('user-input');
        const raceIdElement = raceInputElement.querySelector('#race-id');
        const nameInputElement = raceInputElement.querySelector('#name');
        const minParticipantElement = raceInputElement.querySelector('#min-racer');
        const maxParticipantElement = raceInputElement.querySelector('#max-racer');
        const racersListElement = raceInputElement.querySelector('#racers-list');
        const raceCompletedElement = raceInputElement.querySelector('#race-completed');
        const raceCompleted = this.race.status === RaceStatus.Finished;
        raceIdElement.value = this.race.id;
        nameInputElement.value = this.race.name;
        minParticipantElement.value = this.race.min.toString();
        maxParticipantElement.value = this.race.max.toString();
        racersListElement.innerHTML = '';
        raceCompletedElement.value = raceCompleted ? 'true' : 'false';
        raceCompletedElement.checked = raceCompleted;
        this.race.racers.forEach((racer, index) => {
            const racerEntryTemplate = document.getElementById('racer-entry');
            const racerEntry = document.importNode(racerEntryTemplate.content, true);
            const racerDiv = racerEntry.firstElementChild;
            racerDiv.id = `racer-entry-${index + 1}`;
            const racerName = racerEntry.querySelector('#racer-name-1');
            racerName.id = `racer-name-${index + 1}`;
            racerName.value = racer.name;
            const racerLane = racerEntry.querySelector('#racer-lane-1');
            racerLane.id = `racer-lane-${index + 1}`;
            racerLane.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(lane => `<option value="${lane}" ${lane === +racer.raceLane ? 'selected' : ''}>${lane}</option>`).join('');
            const racerPlace = racerEntry.querySelector('#racer-place-1');
            racerPlace.id = `racer-place-${index + 1}`;
            racerPlace.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(place => `<option value="${place}" ${racer.racePosition !== null && racer.racePosition !== undefined && place === +racer.racePosition ? 'selected' : ''}>${place}</option>`).join('');
            const racerPlaceDiv = racerEntry.querySelector('.racer-place-div');
            racerPlaceDiv.hidden = !raceCompleted;
            racersListElement.appendChild(racerEntry);
        });
    }
}
