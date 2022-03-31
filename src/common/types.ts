export const BACKEND_API = 'http://bsettle.com/sharks_ice/api';
export const LIKED_TEAMS_KEY = "liked_teams";

export interface TeamState {
    divId?: string,
    conferenceId?: string,
    teamId?: string,
    gameId?: string
}

export interface Team {
    name: string,
    id: string,
    gamesPlayed: string,
    wins: string,
    ties: string,
    losses: string,
    overtimeLosses: string,
    points: string,
    tieBreaker: string,
}

export interface Division {
    conferenceId: string,
    id: string,
    name: string,
    seasonId: string,
    teams: Team[],
}

export interface Penalty {
    period: number,
    number: string,
    infraction: string,
    minutes: string,
    start: string,
    end: string,
    onIce: string,
    offIce: string,
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
    away: string,
    homeGoals: string,
    awayGoals: string,
    homeScoring: Goal[],
    homePenalties: Penalty[],
    homeShootout: Shootout[],
    homePlayers: Player[],
    awayScoring: Goal[],
    awayPenalties: Penalty[],
    awayShootout: Shootout[],
    awayPlayers: Player[],
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
    homeGoals?: number,
    awayGoals?: number,
}

export interface TeamInfo {
    calendar?: string,
    games: Game[],
}

export interface Player {
    team: string,
    number: string,
    name: string,
    goals: number,
    assists: number,
    gamesPlayed: number,
    hatTricks: number,
    penaltyMinutes: number,
    points: number,
    pointsPerGame: number,
}

export interface Goalie {
    team: string,
    number: string,
    name: string,
    gamesPlayed: number,
    goalsAgainst: number,
    goalsAgainstAverage: number,
    savePercentage: number,
    shots: number,
    shutouts: number,
}
