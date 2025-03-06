import Component from "./base-component";
export default class RacerItem extends Component {
    get racerPlace() {
        var _a;
        return this.racer.racePosition === undefined || ((_a = this.racer.racePosition) === null || _a === void 0 ? void 0 : _a.toString()) === "" ? "" : `Place: ${this.racer.racePosition}`;
    }
    constructor(hostId, racer) {
        super('single-racer', hostId, false, racer.id);
        this.racer = racer;
        this.configure();
        this.renderContent();
    }
    configure() { }
    renderContent() {
        this.element.querySelector('h3').textContent = `Racer: ${this.racer.name}`;
        this.element.querySelector('#racer-lane-display').textContent = `Lane: ${this.racer.raceLane}`;
        this.element.querySelector('#racer-place-display').textContent = this.racerPlace;
    }
}
