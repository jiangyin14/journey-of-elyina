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
  // 基础魔法卡
  {
    id: 'c1',
    name: '魔法导弹',
    steps: 1,
    cost: 0,
    type: 'attack',
    description: '造成 5 点伤害。最基础的魔女攻击魔法。',
    ...findImage('card-magic-missile'),
  },
  {
    id: 'c2',
    name: '扫帚飞行',
    steps: 1,
    cost: 0,
    type: 'skill',
    description: '本回合后续卡牌步数消耗-1。',
    ...findImage('card-broom-flight'),
  },
  {
    id: 'c3',
    name: '治愈喷雾',
    steps: 2,
    cost: 1,
    type: 'skill',
    description: '恢复 4 点体力。旅行中必备的小技巧。',
    special: 'heal',
    ...findImage('card-healing-spray'),
  },
  {
    id: 'c4',
    name: '变身(鸽子)',
    steps: 1,
    cost: 1,
    type: 'defense',
    description: '本回合免疫1次敌人攻击。虽然有点丢人，但很实用。',
    special: 'morph',
    ...findImage('card-pigeon-morph'),
  },
  // 进阶魔法卡
  {
    id: 'c5',
    name: '火焰风暴',
    steps: 2,
    cost: 3,
    type: 'attack',
    description: '造成 12 点伤害，并附加 2 回合的灼烧（每回合3点伤害）。',
    special: 'fire',
    ...findImage('card-fire-storm'),
  },
  {
    id: 'c6',
    name: '冰结屏障',
    steps: 2,
    cost: 2,
    type: 'defense',
    description: '获得 5 点护盾，并冻结敌人 1 回合。',
    ...findImage('card-ice-barrier'),
  },
  {
    id: 'c7',
    name: '时间回溯',
    steps: 3,
    cost: 2,
    type: 'special',
    description: '回收本回合使用过的1张卡牌至手牌。',
    ...findImage('card-time-rewind'),
  },
  {
    id: 'c8',
    name: '共鸣魔法',
    steps: 1,
    cost: 1,
    type: 'attack',
    description: '造成等同于当前手牌数x2的伤害。',
    ...findImage('card-resonance-magic'),
  },
];

export const INITIAL_DECK: CardData[] = [
  ...Array(2).fill(ALL_CARDS.find(c => c.id === 'c1')), // 魔法导弹
  ...Array(1).fill(ALL_CARDS.find(c => c.id === 'c2')), // 扫帚飞行
  ...Array(2).fill(ALL_CARDS.find(c => c.id === 'c3')), // 治愈喷雾
  ...Array(1).fill(ALL_CARDS.find(c => c.id === 'c4')), // 变身（鸽子）
].filter((c): c is CardData => c !== undefined);

export const INITIAL_PLAYER: Player = {
  hp: 30,
  maxHp: 30,
  mana: 3,
  maxMana: 3,
  steps: 3,
  maxSteps: 3,
  deck: [],
  hand: [],
  discard: [],
  exhaust: [],
  statusEffects: [],
  block: 0,
};

export const INITIAL_ENEMY: Enemy = {
  id: 'e1',
  name: '沉默森林的邪灵',
  hp: 40,
  maxHp: 40,
  intent: { type: 'attack', value: 5, description: '攻击 5' },
  statusEffects: [],
  attackWeakness: ['fire'],
};

// 后续可以增加更多敌人
export const ALL_ENEMIES: Enemy[] = [
    INITIAL_ENEMY,
    {
        id: 'e2',
        name: '悲伤之国的诅咒源头',
        hp: 50,
        maxHp: 50,
        intent: { type: 'special', value: 1, description: '绝望蔓延' },
        statusEffects: [],
        onHealPenalty: true, // 使用治愈牌时，诅咒暂停
    }
]
