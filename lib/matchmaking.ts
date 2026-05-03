import { EventEmitter } from 'events';

interface QueuedUser {
  userId: string;
  socketId: string;
  username: string;
  mood: string;
  joinedAt: number;
}

class MatchmakingQueue extends EventEmitter {
  private queues: Map<string, QueuedUser[]> = new Map();

  constructor() {
    super();
  }

  public addToQueue(user: QueuedUser) {
    const mood = user.mood;
    if (!this.queues.has(mood)) {
      this.queues.set(mood, []);
    }

    const queue = this.queues.get(mood)!;

    // Check if user is already in queue
    const existingIndex = queue.findIndex(u => u.userId === user.userId);
    if (existingIndex !== -1) {
      queue[existingIndex] = user; // Update socket ID if re-joined
    } else {
      queue.push(user);
    }

    this.tryMatch(mood);
  }

  public removeFromQueue(socketId: string) {
    const entries = Array.from(this.queues.entries());
    for (const [, queue] of entries) {
      const index = queue.findIndex((u: QueuedUser) => u.socketId === socketId);
      if (index !== -1) {
        queue.splice(index, 1);
        break;
      }
    }
  }

  private tryMatch(mood: string) {
    const queue = this.queues.get(mood);
    if (!queue || queue.length < 2) return;

    // Simple FIFO matching
    const user1 = queue.shift()!;
    const user2 = queue.shift()!;

    this.emit('match', { user1, user2, mood });
  }

  public getQueueLength(mood: string): number {
    return this.queues.get(mood)?.length || 0;
  }
}

const matchmakingQueue = new MatchmakingQueue();
export default matchmakingQueue;
