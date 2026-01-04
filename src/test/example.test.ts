import { describe, it, expect } from 'vitest';

// Example tests to verify Vitest is working correctly
describe('Vitest Setup', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true);
  });

  it('should perform arithmetic correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should handle objects', () => {
    const obj = { name: 'John', age: 30 };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('John');
  });
});

// Example: Testing a simple function
describe('Score Calculation', () => {
  const calculateFinalScore = (goals: number, ownGoals: number) => {
    return goals - ownGoals;
  };

  it('should calculate score correctly', () => {
    expect(calculateFinalScore(3, 0)).toBe(3);
    expect(calculateFinalScore(5, 2)).toBe(3);
    expect(calculateFinalScore(0, 0)).toBe(0);
  });

  it('should handle negative scores', () => {
    expect(calculateFinalScore(1, 3)).toBe(-2);
  });
});
