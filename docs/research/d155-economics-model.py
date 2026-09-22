"""D155 proposal arithmetic; illustrative costs, not a billing implementation.

Run: python3 docs/research/d155-economics-model.py
Decimal values are USD unless a rate or count is identified. N=V/A is an
expected planning count; actual invoices require transaction-level rounding.
No application, database, network or payment-provider access.
"""

from decimal import Decimal as D
import json


PLANS = {
    "current": (D("0.029"), D("0.30"), D("0")),
    "two_step_proposed": (D("0.033"), D("0.30"), D("0")),
    "growth_future_candidate": (D("0.029"), D("0.30"), D("49")),
}
SUPPLIERS = {
    "A_assumed": (D("0.022"), D("0.15")),
    "B_assumed": (D("0.026"), D("0.20")),
    "C_assumed": (D("0.029"), D("0.30")),
}
SUPPORT = D("15")
OPERATIONS_PER_PAYMENT = D("0.05")
UNRECOVERED_LOSS_RATE = D("0.0005")


def economics(volume, average, plan, supplier, loss_rate=UNRECOVERED_LOSS_RATE):
    volume, average = D(str(volume)), D(str(average))
    if volume < 0 or average <= 0:
        raise ValueError("Volume must be nonnegative and average payment positive")
    count = volume / average
    rate, fixed, monthly = PLANS[plan]
    cost_rate, cost_fixed = SUPPLIERS[supplier]
    billed = rate * volume + fixed * count + monthly
    supplier_cost = cost_rate * volume + cost_fixed * count
    operations = OPERATIONS_PER_PAYMENT * count
    losses = loss_rate * volume
    contribution = billed - supplier_cost - SUPPORT - operations - losses
    return {
        "monthly_volume": volume,
        "average_payment": average,
        "expected_payment_count": count,
        "plan": plan,
        "supplier_scenario": supplier,
        "merchant_fees": billed,
        "supplier_cost": supplier_cost,
        "support": SUPPORT,
        "variable_operations": operations,
        "unrecovered_losses": losses,
        "contribution_before_cac_fixed_and_exceptions": contribution,
    }


def two_step_minimum_volume(average, supplier):
    """Minimum volume covering direct costs for the zero-monthly Two Step plan.

    Support is incurred for an active merchant even at zero collected volume.
    None means no nonnegative contribution is reachable with these assumptions.
    This helper does not apply to subscription plans with downward crossings.
    """
    average = D(str(average))
    if average <= 0:
        raise ValueError("Average payment must be positive")
    rate, fixed, monthly = PLANS["two_step_proposed"]
    cost_rate, cost_fixed = SUPPLIERS[supplier]
    slope = rate - cost_rate - UNRECOVERED_LOSS_RATE
    slope += (fixed - cost_fixed - OPERATIONS_PER_PAYMENT) / average
    if slope <= 0:
        return None
    return max(D("0"), (SUPPORT - monthly) / slope)


def main():
    cases = [
        economics(volume, average, plan, supplier)
        for volume in (2000, 10000, 50000)
        for average in (25, 100, 500)
        for plan in PLANS
        for supplier in SUPPLIERS
    ]
    outputs = {
        "status": "proposal_only_not_supplier_quotes_or_a_forecast",
        "currency": "USD",
        "date": "2026-09-22",
        "scope": "successful_domestic_online_card_payments",
        "excludes": [
            "Clarity fees and costs",
            "customer acquisition and initial onboarding",
            "company fixed costs and unallocated supplier minimums",
            "international and currency-conversion fees",
            "unmodeled authorizations, failures, refunds, reversals and dispute fees",
            "automated messaging, custom integrations and taxes",
        ],
        "plans_rate_fixed_monthly": PLANS,
        "hypothetical_supplier_rate_fixed": SUPPLIERS,
        "loss_rate_is_optional_contract_dependent": UNRECOVERED_LOSS_RATE,
        "own_plan_fee_break_even_volume": D("49") / D("0.004"),
        "two_step_volume_break_even_at_100_ticket": {
            supplier: two_step_minimum_volume(100, supplier)
            for supplier in SUPPLIERS
        },
        "cases": cases,
    }
    print(json.dumps(outputs, default=str, indent=2))


if __name__ == "__main__":
    main()
