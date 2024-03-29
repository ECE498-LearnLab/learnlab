import { PubSub } from 'apollo-server';

export default new PubSub();

export const ENGAGEMENT_STAT_ADDED = 'ENGAGEMENT_STAT_ADDED';
export const ENGAGEMENT_AVERAGE_ADDED = 'ENGAGEMENT_AVERAGE_ADDED';
export const QUESTION_ADDED = 'QUESTION_ADDED';
export const QUESTION_UPVOTE_CHANGED = 'QUESTION_UPVOTE_CHANGED';
export const QUESTION_ANSWERED = 'QUESTION_ANSWERED';