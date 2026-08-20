# orchestrator.py

from agents import (
    demand_agent,
    inventory_agent,
    mobility_agent,
    risk_agent,
    fleet_agent
)

from optimizer import optimize_delivery

from models import DeliveryPlan


def run_resqflow(db, save_to_db: bool = False):

    # =====================================================
    # 1. DEMAND AGENT
    # =====================================================

    demand = demand_agent(db)

    # =====================================================
    # 2. INVENTORY AGENT
    # =====================================================

    inventory = inventory_agent(
        db,
        "medicine"
    )

    # =====================================================
    # 3. MOBILITY AGENT
    # =====================================================

    mobility = mobility_agent(db)

    # =====================================================
    # 4. RISK AGENT
    # =====================================================

    risk = risk_agent(db)

    # =====================================================
    # 5. FLEET AGENT
    # =====================================================

    fleet = fleet_agent(
        db,
        80
    )

    # =====================================================
    # 6. OPTIMIZATION
    # =====================================================

    plan = optimize_delivery(
        demand,
        inventory,
        fleet,
        mobility
    )

    # =====================================================
    # 7. SAVE DELIVERY PLAN (ONLY IF REQUESTED)
    # =====================================================

    if save_to_db and plan.get("success"):

        delivery = DeliveryPlan(

            success=plan.get("success"),

            hospital=plan.get("hospital"),

            hospital_id=plan.get("hospital_id"),

            hours_to_shortage=plan.get(
                "hours_to_shortage"
            ),

            priority=plan.get("priority"),

            warehouse=plan.get("warehouse"),

            warehouse_id=plan.get("warehouse_id"),

            vehicle=plan.get("vehicle"),

            vehicle_type=plan.get(
                "vehicle_type"
            ),

            quantity=plan.get("quantity"),

            route=plan.get("route"),

            route_time=plan.get(
                "route_time"
            ),

            route_risk=plan.get(
                "route_risk"
            ),

            full_result={
                "agents": {
                    "demand": demand,
                    "inventory": inventory,
                    "mobility": mobility,
                    "risk": risk,
                    "fleet": fleet
                },

                "final_plan": plan
            }
        )

        db.add(delivery)

        db.commit()

        db.refresh(delivery)

    # =====================================================
    # 8. RETURN RESPONSE
    # =====================================================

    return {

        "agents": {

            "demand": demand,

            "inventory": inventory,

            "mobility": mobility,

            "risk": risk,

            "fleet": fleet
        },

        "final_plan": plan
    }
