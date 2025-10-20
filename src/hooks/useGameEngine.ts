'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameState, CardData, Player, Enemy, StatusEffect } from '@/lib/types';
import { INITIAL_PLAYER, INITIAL_ENEMY, INITIAL_DECK } from '@/lib/game-data';
import { useToast } from "@/hooks/use-toast";

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useGameEngine = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialDeck = shuffle(INITIAL_DECK);
    const initialHand = initialDeck.slice(0, 5);
    const remainingDeck = initialDeck.slice(5);

    return {
      player: { ...INITIAL_PLAYER, deck: remainingDeck, hand: initialHand },
      enemy: INITIAL_ENEMY,
      turn: 1,
      isPlayerTurn: true,
      actionLog: ['旅行开始了！'],
      isGameOver: false,
    };
  });

  const drawCards = useCallback((playerState: Player, count: number) => {
    let newDeck = [...playerState.deck];
    let newDiscard = [...playerState.discard];
    let drawnCards: CardData[] = [];

    for (let i = 0; i < count; i++) {
      if (newDeck.length === 0) {
        if (newDiscard.length === 0) break;
        newDeck = shuffle(newDiscard);
        newDiscard = [];
      }
      const cardToDraw = newDeck.pop();
      if (cardToDraw) drawnCards.push(cardToDraw);
    }

    return { ...playerState, deck: newDeck, discard: newDiscard, hand: [...playerState.hand, ...drawnCards] };
  }, []);

  const playCard = useCallback((card: CardData) => {
    setGameState(prev => {
      if (!prev.isPlayerTurn || prev.isGameOver) return prev;
      let { player, enemy } = { ...prev };

      if (player.mana < card.cost) {
        toast({ title: "魔力不足", description: `你需要 ${card.cost} 点魔力来使用【${card.name}】。`, variant: 'destructive' });
        return prev;
      }

      if (player.steps < card.steps) {
        toast({ title: "步数不足", description: `你需要 ${card.steps} 点步数来使用【${card.name}】。`, variant: 'destructive' });
        return prev;
      }
      
      let newPlayerState: Player = { ...player, mana: player.mana - card.cost, steps: player.steps - card.steps };
      let newEnemyState: Enemy = { ...enemy };
      let logMessage = `伊蕾娜使用了【${card.name}】。`;
      
      const cardInHandIndex = newPlayerState.hand.findIndex(c => c.id === card.id && c.name === card.name);
      if (cardInHandIndex === -1) return prev;
      newPlayerState.hand.splice(cardInHandIndex, 1);
      newPlayerState.discard.push(card);

      switch (card.id) {
        case 'c1': // 魔法导弹
          newEnemyState.hp = Math.max(0, newEnemyState.hp - 5);
          logMessage += ` 对【${newEnemyState.name}】造成 5 点伤害。`;
          break;
        case 'c2': // 扫帚飞行
          newPlayerState.steps += 1; // Technically should be "next card costs -1 step", this is a simpler implementation
          logMessage += ' 获得了额外的移动力。';
          break;
        case 'c3': // 治愈喷雾
          newPlayerState.hp = Math.min(newPlayerState.maxHp, newPlayerState.hp + 4);
          logMessage += ' 恢复了 4 点体力。';
          break;
        case 'c4': // 变身(鸽子)
          newPlayerState.statusEffects.push({ type: 'vulnerable', duration: 1, value: 1 }); // Representing immunity as a status effect
          logMessage += ' 准备好躲避下一次攻击。';
          break;
        case 'c5': // 火焰风暴
            let damage = 12;
            if(newEnemyState.attackWeakness?.includes('fire')) {
                damage = Math.floor(damage * 1.5);
                logMessage += ` 火焰对【${newEnemyState.name}】效果拔群！`;
            }
            newEnemyState.hp = Math.max(0, newEnemyState.hp - damage);
            newEnemyState.statusEffects.push({ type: 'burn', duration: 2, value: 3 });
            logMessage += ` 造成 ${damage} 点伤害并使其灼烧。`;
            break;
        case 'c6': // 冰结屏障
            newPlayerState.block += 5;
            newEnemyState.statusEffects.push({ type: 'freeze', duration: 1 });
            logMessage += ' 获得了 5 点护盾并冻结了敌人。';
            break;
      }

      return {
          ...prev,
          player: newPlayerState,
          enemy: newEnemyState,
          actionLog: [...prev.actionLog, logMessage],
          isGameOver: newEnemyState.hp <= 0 ? 'win' : false,
      };
    });
  }, [drawCards, toast]);

  const endTurn = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlayerTurn || prev.isGameOver) return prev;
      
      const playerEndOfTurnState = { 
        ...prev.player, 
        discard: [...prev.player.discard, ...prev.player.hand], 
        hand: [], 
        block: 0,
        mana: Math.min(prev.player.maxMana, prev.player.mana + 1)
      };
      
      return { ...prev, player: playerEndOfTurnState, isPlayerTurn: false, actionLog: [...prev.actionLog, '伊蕾娜结束了她的回合。'] };
    });
  }, []);

  const applyStatusEffects = (actor: Player | Enemy) => {
      let newActor = { ...actor };
      let newEffects: StatusEffect[] = [];
      let burnDamage = 0;

      actor.statusEffects.forEach(effect => {
        if(effect.type === 'burn' && effect.value) {
            newActor.hp = Math.max(0, newActor.hp - effect.value);
            burnDamage += effect.value;
        }
        if (effect.duration > 1) {
            newEffects.push({ ...effect, duration: effect.duration - 1 });
        }
      });
      newActor.statusEffects = newEffects;
      return { actor: newActor, burnDamage };
  }


  useEffect(() => {
    if (gameState.isPlayerTurn || gameState.isGameOver) return;

    const enemyTurnTimeout = setTimeout(() => {
      setGameState(prev => {
        let { enemy, player, actionLog } = { ...prev };
        
        // Enemy status effects tick at start of their turn
        const { actor: newEnemy, burnDamage: enemyBurnDamage } = applyStatusEffects(enemy);
        enemy = newEnemy;
        if(enemyBurnDamage > 0) {
            actionLog = [...actionLog, `【${enemy.name}】受到 ${enemyBurnDamage} 点灼烧伤害。`];
        }

        const isFrozen = enemy.statusEffects.some(e => e.type === 'freeze');
        
        let logMessage = '';

        if(isFrozen) {
            logMessage = `【${enemy.name}】被冻结了，无法行动！`;
        } else {
            const { intent } = enemy;
            let damageToPlayer = 0;

            if (intent.type === 'attack') {
                const immunity = player.statusEffects.some(e => e.type === 'vulnerable'); // Using vulnerable to represent immunity
                if(immunity) {
                    logMessage = `【${enemy.name}】的攻击被伊蕾娜巧妙地躲开了！`;
                    player.statusEffects = player.statusEffects.filter(e => e.type !== 'vulnerable');
                } else {
                    damageToPlayer = Math.max(0, intent.value - player.block);
                    player.hp = Math.max(0, player.hp - damageToPlayer);
                    logMessage = `【${enemy.name}】攻击，对伊蕾娜造成 ${damageToPlayer} 点伤害。`;
                }
            } else if (intent.type === 'special' && enemy.id === 'e1') { // 沉默森林的邪灵 special move
                const handNotEmpty = player.hand.length > 0;
                if(handNotEmpty) {
                    const cardToSealIndex = Math.floor(Math.random() * player.hand.length);
                    // This is a complex mechanic, we will just log it for now
                    logMessage = `【${enemy.name}】夺走了声音，试图封印伊蕾娜的卡牌！`;
                } else {
                    logMessage = `【${enemy.name}】试图夺走声音，但伊蕾娜无牌可封。`;
                }
            }
        }
        
        const nextIntentValue = Math.floor(Math.random() * 3) + 4;
        const nextMoveRng = Math.random();
        
        let nextIntent: Enemy['intent'];
        if(enemy.id === 'e1' && nextMoveRng < 0.3) {
             nextIntent = { type: 'special', value: 0, description: "夺走声音" };
        } else {
             nextIntent = { type: 'attack', value: nextIntentValue, description: `攻击 ${nextIntentValue}` };
        }
        
        return {
          ...prev,
          player,
          enemy: { ...enemy, intent: nextIntent },
          actionLog: [...actionLog, logMessage, `【${enemy.name}】的回合结束。`],
          isGameOver: player.hp <= 0 ? 'lose' : (enemy.hp <= 0 ? 'win' : prev.isGameOver),
        };
      });
    }, 1000);

    const playerTurnTimeout = setTimeout(() => {
      setGameState(prev => {
        if(prev.isGameOver) return prev;
        
        // Player status effects tick at start of their turn
        let { actor: newPlayer, burnDamage } = applyStatusEffects(prev.player);
        let newActionLog = [...prev.actionLog];
        if(burnDamage > 0) {
            newActionLog = [...newActionLog, `伊蕾娜受到 ${burnDamage} 点灼烧伤害。`];
        }

        const newPlayerStateAfterDraw = drawCards(newPlayer, 5);
        
        return {
          ...prev,
          player: { ...newPlayerStateAfterDraw, steps: newPlayerStateAfterDraw.maxSteps },
          isPlayerTurn: true,
          turn: prev.turn + 1,
          actionLog: [...newActionLog, `第 ${prev.turn + 1} 回合开始。`],
          isGameOver: newPlayer.hp <= 0 ? 'lose' : prev.isGameOver,
        };
      });
    }, 2000);

    return () => {
      clearTimeout(enemyTurnTimeout);
      clearTimeout(playerTurnTimeout);
    };
  }, [gameState.isPlayerTurn, gameState.isGameOver, drawCards, toast]);

  const restartGame = useCallback(() => {
    const initialDeck = shuffle(INITIAL_DECK);
    const initialHand = initialDeck.slice(0, 5);
    const remainingDeck = initialDeck.slice(5);
    setGameState({
      player: { ...INITIAL_PLAYER, deck: remainingDeck, hand: initialHand },
      enemy: INITIAL_ENEMY,
      turn: 1,
      isPlayerTurn: true,
      actionLog: ['旅行开始了！'],
      isGameOver: false,
    });
  }, []);

  return { gameState, playCard, endTurn, restartGame };
};
