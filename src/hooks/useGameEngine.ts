'use client';

import { useState, useCallback, useEffect } from 'react';
import type { GameState, CardData, Player, Enemy } from '@/lib/types';
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
      actionLog: ['战斗开始！'],
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
      const { player, enemy } = prev;

      if (player.mana < card.cost) {
        toast({ title: "法力不足", description: "你没有足够的法力值来打出这张牌。", variant: 'destructive' });
        return prev;
      }
      
      let newPlayerState: Player = { ...player, mana: player.mana - card.cost };
      let newEnemyState: Enemy = { ...enemy };
      let logMessage = '';
      
      const cardInHandIndex = newPlayerState.hand.findIndex(c => c === card);
      if (cardInHandIndex === -1) return prev;
      newPlayerState.hand.splice(cardInHandIndex, 1);
      newPlayerState.discard.push(card);

      switch (card.id) {
        case 'c1':
          newEnemyState.hp = Math.max(0, newEnemyState.hp - 6);
          logMessage = `玩家打出【${card.name}】，对【${newEnemyState.name}】造成 6 点伤害。`;
          toast({ title: '💥 -6 HP', description: `对 ${newEnemyState.name} 造成伤害` });
          break;
        case 'c2':
          newPlayerState.block += 5;
          logMessage = `玩家打出【${card.name}】，获得了 5 点格挡。`;
          break;
        case 'c3':
          newPlayerState = drawCards(newPlayerState, 1);
          newPlayerState.mana = Math.min(newPlayerState.maxMana, newPlayerState.mana + 1);
          logMessage = `玩家打出【${card.name}】，回复 1 法力并抽 1 张牌。`;
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
      
      const playerEndOfTurnState = { ...prev.player, discard: [...prev.player.discard, ...prev.player.hand], hand: [], block: 0 };
      return { ...prev, player: playerEndOfTurnState, isPlayerTurn: false, actionLog: [...prev.actionLog, '玩家回合结束。'] };
    });
  }, []);

  useEffect(() => {
    if (gameState.isPlayerTurn || gameState.isGameOver) return;

    const enemyTurnTimeout = setTimeout(() => {
      setGameState(prev => {
        const { enemy, player } = prev;
        const { intent } = enemy;
        let damageToPlayer = 0;
        let newPlayerHp = player.hp;
        let logMessage = '';

        if (intent.type === 'attack') {
          damageToPlayer = Math.max(0, intent.value - player.block);
          newPlayerHp = Math.max(0, player.hp - damageToPlayer);
          logMessage = `【${enemy.name}】攻击，对玩家造成 ${damageToPlayer} 点伤害。`;
          toast({ title: `💔 -${damageToPlayer} HP`, description: `${enemy.name} 对你造成了伤害`, variant: 'destructive' });
        }
        
        const enemyTurnEndPlayerState = { ...player, hp: newPlayerHp, block: 0 };
        const nextIntent = { type: 'attack' as 'attack', value: Math.floor(Math.random() * 5) + 6 };
        
        return {
          ...prev,
          player: enemyTurnEndPlayerState,
          enemy: { ...enemy, intent: nextIntent },
          actionLog: [...prev.actionLog, logMessage, `敌人回合结束。`],
          isGameOver: newPlayerHp <= 0 ? 'lose' : prev.isGameOver,
        };
      });
    }, 1000);

    const playerTurnTimeout = setTimeout(() => {
      setGameState(prev => {
        if(prev.isGameOver) return prev;
        const newPlayerStateAfterDraw = drawCards(prev.player, 5);
        return {
          ...prev,
          player: { ...newPlayerStateAfterDraw, mana: newPlayerStateAfterDraw.maxMana },
          isPlayerTurn: true,
          turn: prev.turn + 1,
          actionLog: [...prev.actionLog, `第 ${prev.turn + 1} 回合开始。`],
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
      actionLog: ['战斗开始！'],
      isGameOver: false,
    });
  }, []);

  return { gameState, playCard, endTurn, restartGame };
};
