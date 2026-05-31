/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQ {
  id: string;
  category: string;
  questionEn: string;
  questionTe: string;
  answerEn: string;
  answerTe: string;
  keywords: string[];
  count: number;
}

export type SenderType = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  sender: SenderType;
  text: string;
  timestamp: string;
  isTel?: boolean;
  confidence?: number;
  wasUnderstood?: boolean;
  isFallback?: boolean;
  suggestions?: { id: string; question: string; category: string }[];
  matchedFaqId?: string | null;
  feedback?: 'positive' | 'negative' | null;
}

export interface FAQRequest {
  id?: string;
  category: string;
  questionEn: string;
  questionTe: string;
  answerEn: string;
  answerTe: string;
  keywords: string | string[];
}

export interface AnalyticsDashboardData {
  totalQueries: number;
  accuracyRate: number;
  englishCount: number;
  teluguCount: number;
  positiveFeedback: number;
  negativeFeedback: number;
  topAsked: { id: string; question: string; category: string; count: number }[];
  categoryBreakdown: { name: string; value: number }[];
  dailyTrend: { date: string; queries: number }[];
  recentQueries: any[];
}
