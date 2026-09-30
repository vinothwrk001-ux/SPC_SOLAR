export const calculateQuotation = (monthlyBill, connectionType, state) => {

  // Step 1: Estimate monthly consumption (kWh)
  const avgRatePerUnit = 6.5; // ₹ per kWh (India average)
  const monthlyUnits = monthlyBill / avgRatePerUnit;

  // Step 2: Recommended system size
  const peakSunHours = 5; // India average
  const systemEfficiency = 0.8;
  const recommendedKW = Math.ceil(monthlyUnits / (peakSunHours * 30 * systemEfficiency));

  // Step 3: Cost calculation
  const costPerKW = connectionType === 'Residential' ? 65000
                  : connectionType === 'Commercial'  ? 58000
                  : 55000; // Industrial
  const estimatedCost = recommendedKW * costPerKW;

  // Step 4: PM Surya Ghar Subsidy (Central Govt)
  let centralSubsidy = 0;
  if (connectionType === 'Residential') {
    if (recommendedKW <= 2)      centralSubsidy = recommendedKW * 30000;
    else if (recommendedKW <= 3) centralSubsidy = (2 * 30000) + ((recommendedKW - 2) * 18000);
    else                         centralSubsidy = 78000; // max cap
  }

  const netCost = estimatedCost - centralSubsidy;

  // Step 5: Savings & ROI
  const annualGeneration = recommendedKW * peakSunHours * 365 * systemEfficiency;
  const monthlySavings = Math.round((annualGeneration / 12) * avgRatePerUnit);
  const roiYears = parseFloat((netCost / (monthlySavings * 12)).toFixed(1));

  return {
    recommendedKW,
    estimatedCost,
    centralSubsidy,
    netCost,
    monthlySavings,
    annualGeneration: Math.round(annualGeneration),
    roiYears,
  };
};
