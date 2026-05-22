/**
 * Simple Linear Congruential Generator (LCG) to provide seedable
 * pseudo-random number generation. This satisfies the React hook purity
 * rules by keeping components pure and deterministic.
 */
export function createPRNG(seed: number) {
  let state = seed;
  return function next() {
    // LCG parameters from Numerical Recipes
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}
