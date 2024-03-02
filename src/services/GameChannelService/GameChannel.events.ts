import { GameResult } from '../../types/GameResult';

// Incoming events
export const GAME_NOT_FOUND = 'game_not_found';
export const GAME_ROUND_RESULT = 'game_round_result';
export const GAME_MATCH_RESULT = 'game_match_result';
export const OPPONENT_MADE_MOVE = 'opponent_made_move';
export const OPPONENT_LEFT = 'opponent_left';
export const MOVE_TIMEOUT = 'move_timeout';
export const OPPONENT_JOIN_TIMEOUT = 'opponent_join_timeout';
export const GAME_CHANNEL_EVENTS = [
  GAME_NOT_FOUND,
  GAME_ROUND_RESULT,
  GAME_MATCH_RESULT,
  OPPONENT_MADE_MOVE,
  OPPONENT_LEFT,
  MOVE_TIMEOUT,
  OPPONENT_JOIN_TIMEOUT,
];

// Payload types
export type GAME_ROUND_RESULT_PAYLOAD = {
  result: GameResult;
};

export type GAME_MATCH_RESULT_PAYLOAD = {
  result: GameResult;
};

// Outgoing events
export const MOVE = 'move';

export type OUTGOING_EVENTS = typeof MOVE;
