/**
 * 4:6 pour structure calculation.
 *
 * The 4:6 method divides the total water into two phases:
 *  - First 40%: controls sweetness vs brightness (2 pours)
 *  - Last 60%: controls strength/body (3 pours by default)
 *
 * Flavor bias adjusts the first two pours:
 *  - 'sweetness': first pour is larger than second
 *  - 'clarity': second pour is larger than first
 *  - 'balanced': equal pours in the first phase
 */

/**
 * Generate 4:6 pour stages.
 *
 * @param {number} totalWater - Total water in grams
 * @param {'sweetness' | 'clarity' | 'balanced'} flavorBias
 * @param {number[]} [customPours] - Optional manually locked pour amounts
 * @returns {Array<{order: number, title: string, instruction: string, waterAddAmount: number, cumulativeWaterTarget: number, timerDurationSec: number, isBloomStep: boolean}>}
 */
export function generate46Pours(totalWater, flavorBias = 'balanced', customPours = null) {
  if (customPours && customPours.length === 5) {
    return buildSteps(customPours, totalWater);
  }

  const firstPhase = Math.round(totalWater * 0.4);
  const secondPhase = totalWater - firstPhase;

  let pour1, pour2;
  if (flavorBias === 'sweetness') {
    pour1 = Math.round(firstPhase * 0.6);
    pour2 = firstPhase - pour1;
  } else if (flavorBias === 'clarity') {
    pour1 = Math.round(firstPhase * 0.4);
    pour2 = firstPhase - pour1;
  } else {
    pour1 = Math.round(firstPhase / 2);
    pour2 = firstPhase - pour1;
  }

  // Second phase: 3 equal pours
  const secondPourBase = Math.floor(secondPhase / 3);
  const secondPourRemainder = secondPhase - secondPourBase * 3;
  const pour3 = secondPourBase;
  const pour4 = secondPourBase;
  const pour5 = secondPourBase + secondPourRemainder;

  return buildSteps([pour1, pour2, pour3, pour4, pour5], totalWater);
}

function buildSteps(pours, totalWater) {
  let cumulative = 0;
  const stepLabels = [
    {
      title: 'Bloom',
      getInstruction: (amt) =>
        `Pour ${amt}g of water in a slow, circular motion to saturate all the grounds. Let it bloom and degas.`,
      timer: 45,
      isBloom: true,
    },
    {
      title: 'Second Pour (Flavor)',
      getInstruction: (amt) =>
        `Pour ${amt}g of water slowly. This pour shapes the flavor balance alongside the bloom.`,
      timer: 45,
      isBloom: false,
    },
    {
      title: 'Third Pour (Body)',
      getInstruction: (amt) =>
        `Pour ${amt}g of water in a steady stream. This begins building body and strength.`,
      timer: 45,
      isBloom: false,
    },
    {
      title: 'Fourth Pour (Body)',
      getInstruction: (amt) =>
        `Pour ${amt}g of water. Continue building the body of the cup.`,
      timer: 45,
      isBloom: false,
    },
    {
      title: 'Final Pour',
      getInstruction: (amt) =>
        `Pour the remaining ${amt}g of water. Let it draw down completely.`,
      timer: 60,
      isBloom: false,
    },
  ];

  return pours.map((pourAmount, i) => {
    cumulative += pourAmount;
    const step = stepLabels[i];
    return {
      order: i + 1,
      title: step.title,
      instruction: step.getInstruction(pourAmount),
      waterAddAmount: pourAmount,
      cumulativeWaterTarget: cumulative,
      timerDurationSec: step.timer,
      isBloomStep: step.isBloom,
    };
  });
}

/**
 * Rebalance pours when total water changes.
 * Preserves the flavor bias ratios.
 */
export function rebalancePours(newTotalWater, flavorBias) {
  return generate46Pours(newTotalWater, flavorBias);
}
