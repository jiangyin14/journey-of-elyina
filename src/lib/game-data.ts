import type { CardData, Player, Enemy } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
    const img = PlaceHolderImages.find(i => i.id === id);
    return {
        imageUrl: img?.imageUrl || `https://picsum.photos/seed/${id}/250/350`,
        imageHint: img?.imageHint || 'fantasy art'
    };
};

export const ALL_CARDS: CardData[] = [
  {
    id: 'c1',
    name: '绯红打击',
    cost: 1,
    type: 'attack',
    description: '造成 6 点伤害。',
    ...findImage('card-crimson-strike'),
  },
  {
    id: 'c2',
    name: '奥术护盾',
    cost: 1,
    type: 'skill',
    description: '获得 5 点格挡。',
    ...findImage('card-arcane-shield'),
  },
  {
    id: 'c3',
    name: '法力涌动',
    cost: 0,
    type: 'skill',
    description: '获得 1 点法力。抽 1 张牌。',
    ...findImage('card-mana-surge'),
  },
];

export const INITIAL_DECK: CardData[] = [
  ...Array(5).fill(ALL_CARDS.find(c => c.id === 'c1')),
  ...Array(5).fill(ALL_CARDS.find(c => c.id === 'c2')),
  ...Array(2).fill(ALL_CARDS.find(c => c.id === 'c3')),
].filter((c): c is CardData => c !== undefined);

export const INITIAL_PLAYER: Player = {
  hp: 80,
  maxHp: 80,
  mana: 3,
  maxMana: 3,
  actions: 1,
  maxActions: 1,
  deck: [],
  hand: [],
  discard: [],
  exhaust: [],
  statusEffects: [],
  experience: 0,
  level: 1,
  block: 0,
};

export const INITIAL_ENEMY: Enemy = {
  id: 'e1',
  name: '哥布林',
  hp: 50,
  maxHp: 50,
  intent: { type: 'attack', value: 7 },
  statusEffects: [],
};
