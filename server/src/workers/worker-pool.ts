import { pool as createPool } from "workerpool";

export const pool = createPool(__dirname + '/room-stat-worker.mjs');
