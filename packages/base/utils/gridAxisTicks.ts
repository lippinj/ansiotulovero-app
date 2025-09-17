interface Range {
  min: number;
  max: number;
}

export function calculateRange(values: number[]): Range {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }
  
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

export function calculateTickSpacing(range: Range, targetTicks: number = 5): number {
  const rangeSize = range.max - range.min;
  const rawSpacing = rangeSize / targetTicks;
  
  // Find the nearest neat round number that's at least 100
  const magnitudes = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000];
  
  for (const magnitude of magnitudes) {
    if (magnitude >= rawSpacing && magnitude >= 100) {
      return magnitude;
    }
  }
  
  // For very large ranges, use powers of 10
  let power = 100000;
  while (power < rawSpacing) {
    power *= 10;
  }
  return power;
}

export function generateTicks(range: Range, spacing: number): number[] {
  const ticks = [];
  
  // Find the first tick at or below the minimum
  const firstTick = Math.floor(range.min / spacing) * spacing;
  
  // Generate ticks from first tick to beyond the maximum
  for (let tick = firstTick; tick <= range.max + spacing; tick += spacing) {
    ticks.push(tick);
  }
  
  return ticks;
}

export function calculateAxisTicks(values: number[], targetTicks: number = 5): number[] {
  const range = calculateRange(values);
  const spacing = calculateTickSpacing(range, targetTicks);
  return generateTicks(range, spacing);
}