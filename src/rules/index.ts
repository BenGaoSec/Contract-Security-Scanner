// src/rules/index.ts
import type { Rule } from '../types';
import NoLowLevelCallRule from './noLowLevelCall';

export const allRules: Rule[] = [
  NoLowLevelCallRule,
  // Add more rules here in the future.
];
