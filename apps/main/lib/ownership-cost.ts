export type OwnershipInputs = {
  purchase: number; accessories: number; firstYearPlan: number; renewalPlan: number;
  annualConsumables: number; watts: number; hoursPerDay: number; pricePerKwh: number;
};

export function ownershipCost(input: OwnershipInputs, years: number) {
  if (!Number.isInteger(years) || years < 1 || years > 10 || Object.values(input).some((value) => !Number.isFinite(value) || value < 0) || input.hoursPerDay > 24) return null;
  const equipment = input.purchase + input.accessories;
  const subscriptions = input.firstYearPlan + (years - 1) * input.renewalPlan;
  const consumables = years * input.annualConsumables;
  const electricity = years * 365 * input.watts * input.hoursPerDay / 1000 * input.pricePerKwh;
  const total = equipment + subscriptions + consumables + electricity;
  return Number.isFinite(total) ? { equipment, subscriptions, consumables, electricity, total } : null;
}
