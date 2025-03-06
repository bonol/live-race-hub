export class Racer {
    constructor(
        public id: string,
        public name: string,
        public raceLane: number,
        public racePosition?: number,
    ){}
}

export enum RaceStatus {
    Pending,
    Ready,
    Finished
}

type RaceResult = {
    place: number,
    racer: Racer
}

export class Race {
    constructor(
        public id: string,
        public name: string,
        public min: number,
        public max: number,
        public status: RaceStatus,
        public racers: Racer[],
        public results?: RaceResult[]
    ){}
}