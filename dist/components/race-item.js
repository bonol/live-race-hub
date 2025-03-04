import Component from "./base-component";
export default class RaceItem extends Component {
    constructor(hostId, race) {
        super('single-race', hostId, false, race.id);
        this.race = race;
        this.configure();
        this.renderContent();
    }
    configure() {
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.race.name;
    }
}
