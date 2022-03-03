export const BACKEND_API = '/sharks_ice/api';

export interface TeamState {
    divId?: string,
    conferenceId?: string,
    teamId?: string,
    gameId?: string
}

export interface Team {
    name: string,
    id: string,
    GP: string,
    W: string,
    T: string,
    L: string,
    OTL: string,
    PTS: string,
}

export interface Division {
    conference_id: string,
    id: string,
    name: string,
    season_id: string,
    teams: [Team],
}

export interface Penalty {
    period: number,
    number: string,
    infraction: string,
    minutes: string,
    start: string,
    end: string,
    on_ice: string,
    off_ice: string,
}

export interface Shootout {
    number: string,
    player: string,
    result: string,
}

export interface Goal {
    period: number,
    time: string,
    extra: string,
    goal: string,
    assist1: string,
    assist2: string
}

export interface GameEvent {
    type: string,
    period: number,
    time: string,
    team: string,
    number: string,
    description: string
}

export interface GameStats {
    date: string,
    time: string,
    league: string,
    rink: string,
    level: string,
    periodLength: string,
    referee1: string,
    referee2: string,
    scorekeeper: string,
    home: string,
    visitor: string,
    homeGoals: string,
    visitorGoals: string,
    homeScoring: [Goal],
    homePenalties: [Penalty],
    homeShootout: [Shootout],
    homePlayers: [Player],
    visitorScoring: [Goal],
    visitorPenalties: [Penalty],
    visitorShootout: [Shootout],
    visitorPlayers: [Player],
}

export interface Game {
    id: string,
    date: string,
    time: string,
    rink: string,
    level: string,
    type: string,
    home: string,
    away: string,
    home_goals?: number,
    away_goals?: number,
}

export interface TeamInfo {
    calendar?: string,
    games: [Game],
}

export interface Player {
    team: string,
    number: string,
    position: string,
    name: string,
}

export interface Goalie {
    team: string,
    number: string,
    position: string,
    name: string,
}
