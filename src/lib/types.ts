export type StatusEffect = {
  type: 'burn' | 'freeze' | 'strength' | 'vulnerable';
  duration: number;
  value?: number;
};

export interface CardData {
  id: string;
  name: string;
  cost: number;
  type: 'attack' | 'skill' | 'power';
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface Player {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  actions: number;
  maxActions: number;
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  exhaust: CardData[];
  statusEffects: StatusEffect[];
  experience: number;
  level: number;
  block: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  intent: {
    type: 'attack' | 'defend' | 'debuff';
    value: number;
  };
  statusEffects: StatusEffect[];
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  turn: number;
  isPlayerTurn: boolean;
  actionLog: string[];
  isGameOver: 'win' | 'lose' | false;
}
