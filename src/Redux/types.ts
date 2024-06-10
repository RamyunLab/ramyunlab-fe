export interface GameDTO {
    r_name: string;
    r_img: string;
    idx: number;
}
export interface TournamentState {
    round: number | null;
    currentMatchups: GameDTO[];
    winners: GameDTO[];
    champion: GameDTO | null;
    currentMatchIndex: number;
}
