"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MatchmakingQueue extends events_1.EventEmitter {
    constructor() {
        super();
        this.queues = new Map();
    }
    addToQueue(user) {
        const mood = user.mood;
        if (!this.queues.has(mood)) {
            this.queues.set(mood, []);
        }
        const queue = this.queues.get(mood);
        // Check if user is already in queue
        const existingIndex = queue.findIndex(u => u.userId === user.userId);
        if (existingIndex !== -1) {
            queue[existingIndex] = user; // Update socket ID if re-joined
        }
        else {
            queue.push(user);
        }
        this.tryMatch(mood);
    }
    removeFromQueue(socketId) {
        const entries = Array.from(this.queues.entries());
        for (const [, queue] of entries) {
            const index = queue.findIndex((u) => u.socketId === socketId);
            if (index !== -1) {
                queue.splice(index, 1);
                break;
            }
        }
    }
    tryMatch(mood) {
        const queue = this.queues.get(mood);
        if (!queue || queue.length < 2)
            return;
        // Simple FIFO matching
        const user1 = queue.shift();
        const user2 = queue.shift();
        this.emit('match', { user1, user2, mood });
    }
    getQueueLength(mood) {
        var _a;
        return ((_a = this.queues.get(mood)) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
}
const matchmakingQueue = new MatchmakingQueue();
exports.default = matchmakingQueue;
