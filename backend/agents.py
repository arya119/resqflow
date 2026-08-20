# agents.py

from models import Warehouse, Hospital, Vehicle, Road


# =========================================================
# DEMAND AGENT
# =========================================================

def demand_agent(db):

    hospitals = db.query(Hospital).all()

    results = []

    for hospital in hospitals:

        stock = getattr(hospital, "stock_medicine", 0)
        demand = getattr(hospital, "demand_medicine", 0)

        if demand <= 0:
            hours_to_shortage = 999
        else:
            hourly_consumption = demand / 24
            hours_to_shortage = stock / hourly_consumption

        if hours_to_shortage <= 8:
            priority = "CRITICAL"

        elif hours_to_shortage <= 16:
            priority = "HIGH"

        elif hours_to_shortage <= 24:
            priority = "MEDIUM"

        else:
            priority = "LOW"

        results.append({
            "hospital_id": getattr(hospital, "hospital_id", hospital.id),
            "hospital_name": hospital.name,
            "hours_to_shortage": round(hours_to_shortage, 2),
            "priority": priority
        })

    return results


# =========================================================
# INVENTORY AGENT
# =========================================================

def inventory_agent(db, resource="medicine"):

    warehouses = db.query(Warehouse).all()

    results = []

    for warehouse in warehouses:

        if resource == "medicine":
            available = getattr(
                warehouse,
                "inventory_medicine",
                0
            )

        elif resource == "water":
            available = getattr(
                warehouse,
                "inventory_water",
                0
            )

        elif resource == "food":
            available = getattr(
                warehouse,
                "inventory_food",
                0
            )

        else:
            available = 0

        results.append({
            "warehouse_id": getattr(warehouse, "warehouse_id", warehouse.id),
            "warehouse_name": warehouse.name,
            "available": available
        })

    results.sort(
        key=lambda x: x["available"],
        reverse=True
    )

    return results


# =========================================================
# MOBILITY AGENT
# =========================================================

def mobility_agent(db):

    roads = db.query(Road).all()

    available_roads = []

    for road in roads:

        if not road.blocked:

            available_roads.append({

                "id": getattr(road, "road_id", road.id),

                "from": road.from_location,

                "to": road.to_location,

                "distance": road.distance,

                "time": road.time,

                "risk": road.risk,

                "blocked": road.blocked
            })

    return available_roads


# =========================================================
# RISK AGENT
# =========================================================

def risk_agent(db):

    roads = db.query(Road).all()

    results = []

    for road in roads:

        if road.blocked:

            risk = "BLOCKED"

        else:

            risk = road.risk

        results.append({

            "road_id": getattr(road, "road_id", road.id),

            "risk": risk
        })

    return results


# =========================================================
# FLEET AGENT
# =========================================================

def fleet_agent(db, required_capacity=80):

    vehicles = db.query(Vehicle).all()

    available = []

    for vehicle in vehicles:

        if (
            vehicle.available
            and vehicle.capacity >= required_capacity
        ):

            available.append({

                "id": getattr(vehicle, "vehicle_id", vehicle.id),

                "type": vehicle.type,

                "capacity": vehicle.capacity,

                "available": vehicle.available
            })

    available.sort(
        key=lambda x: x["capacity"]
    )

    return available
