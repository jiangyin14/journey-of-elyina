export type StatusEffect = {
  type: 'burn' | 'freeze' | 'strength' | 'vulnerable' | 'sealed';
  duration: number;
  value?: number;
};

export type CardType = 'attack' | 'skill' | 'defense' | 'utility' | 'special';

export interface CardData {
  id: string;
  name: string;
  cost: number; // For mana
  steps: number; // For actions/步数
  type: CardType;
  description: string;
  imageUrl: string;
  imageHint: string;
  special?: 'fire' | 'heal' | 'morph';
}

export interface Player {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  steps: number;
  maxSteps: number;
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  exhaust: CardData[];
  statusEffects: StatusEffect[];
  block: number;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  intent: {
    type: 'attack' | 'defend' | 'debuff' | 'special';
    value: number;
    description?: string;
  };
  statusEffects: StatusEffect[];
  attackWeakness?: CardData['special'][];
  onHealPenalty?: boolean;
}

export interface GameState {
  player: Player;
  enemy: Enemy;
  turn: number;
  isPlayerTurn: boolean;
  actionLog: string[];
  isGameOver: 'win' | 'lose' | false;
}
