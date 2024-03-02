export const NO_PLAYERS = 'no_players';
export const GOT_OPPONENT = 'got_opponent';

// Payload types
export type GOT_OPPONENT_PAYLOAD = {
  game_channel_id: string;
};

export const LOBBY_CHANNEL_EVENTS = [NO_PLAYERS, GOT_OPPONENT];
