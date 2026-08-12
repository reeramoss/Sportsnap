"""
Spend guardrails for paid image-generation calls.

Belt-and-braces against the classic failure mode: a bug or retry loop firing
hundreds of paid requests. Google Cloud budgets only *alert*, they don't stop
spending — so we enforce our own hard stop locally.

Usage from a script:
    from budget import Ledger
    led = Ledger()
    led.check()                 # raises if over cap — call BEFORE the request
    ...make the API call...
    led.record("gemini-3-pro-image")   # call AFTER a successful request

Reset/inspect:
    python3 scripts/budget.py status
    python3 scripts/budget.py reset
"""
from __future__ import annotations
import json, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LEDGER = ROOT / ".spend-ledger.json"

# ── Hard limits (deliberately conservative; raise consciously, not by accident)
MAX_CALLS_TOTAL = 60      # across the whole project lifetime
MAX_CALLS_PER_RUN = 6     # per single script invocation
MAX_USD = 5.00            # our own ceiling, well under the $20 Cloud budget

# Rough per-image cost estimate for logging only. VERIFY against
# https://ai.google.dev/pricing — pricing changes and this is not authoritative.
EST_COST_USD = {
    "gemini-3-pro-image": 0.13,
    "gemini-3-pro-image-preview": 0.13,
    "nano-banana-pro-preview": 0.13,
    "gemini-2.5-flash-image": 0.04,
    "gemini-3.1-flash-image": 0.04,
    "gemini-3.1-flash-lite-image": 0.02,
}
DEFAULT_EST = 0.13


class BudgetExceeded(RuntimeError):
    pass


class Ledger:
    def __init__(self) -> None:
        self.run_calls = 0
        self.data = {"calls": [], "total_calls": 0, "est_usd": 0.0}
        if LEDGER.exists():
            try:
                self.data = json.loads(LEDGER.read_text())
            except Exception:
                pass

    # ── enforcement ──────────────────────────────────────────────────────
    def check(self) -> None:
        if self.run_calls >= MAX_CALLS_PER_RUN:
            raise BudgetExceeded(
                f"per-run cap hit ({MAX_CALLS_PER_RUN} calls). "
                "Re-run deliberately if you really want more.")
        if self.data["total_calls"] >= MAX_CALLS_TOTAL:
            raise BudgetExceeded(
                f"lifetime cap hit ({MAX_CALLS_TOTAL} calls, "
                f"~${self.data['est_usd']:.2f} est). "
                "Raise MAX_CALLS_TOTAL in scripts/budget.py to continue.")
        if self.data["est_usd"] >= MAX_USD:
            raise BudgetExceeded(
                f"local ${MAX_USD:.2f} ceiling reached "
                f"(~${self.data['est_usd']:.2f} spent est). "
                "Raise MAX_USD in scripts/budget.py to continue.")

    def record(self, model: str) -> None:
        est = EST_COST_USD.get(model, DEFAULT_EST)
        self.run_calls += 1
        self.data["total_calls"] += 1
        self.data["est_usd"] = round(self.data["est_usd"] + est, 4)
        self.data["calls"].append(
            {"model": model, "est_usd": est, "at": time.strftime("%Y-%m-%d %H:%M:%S")})
        LEDGER.write_text(json.dumps(self.data, indent=2))
        print(f"   [budget] call #{self.data['total_calls']}/{MAX_CALLS_TOTAL} "
              f"· ~${est:.3f} this call · ~${self.data['est_usd']:.2f} est total "
              f"(local cap ${MAX_USD:.2f})")

    def summary(self) -> str:
        return (f"{self.data['total_calls']}/{MAX_CALLS_TOTAL} calls, "
                f"~${self.data['est_usd']:.2f}/${MAX_USD:.2f} est")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "status"
    led = Ledger()
    if cmd == "reset":
        LEDGER.unlink(missing_ok=True)
        print("ledger reset")
    else:
        print(f"spend ledger: {led.summary()}")
        for c in led.data["calls"][-10:]:
            print(f"  {c['at']}  {c['model']:34s} ~${c['est_usd']:.3f}")
        print("\nNOTE: cost figures are rough estimates for guardrail purposes only.")
        print("Authoritative usage: https://ai.dev/rate-limit and your Cloud billing page.")
