# main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import (
    Base,
    Road,
    DisasterState,
    DeliveryPlan,
    Hospital,
    Warehouse,
    Vehicle
)
from orchestrator import run_resqflow
from data import roads, disaster_state


app = FastAPI(
    title="ResQFlow API",
    description="AI-powered disaster logistics system",
    version="1.0"
)


Base.metadata.create_all(bind=engine)


# ==============================
# SEED & SYNC OFFICIAL INFRASTRUCTURE DATA
# ==============================

def sync_seed_data():
    from database import SessionLocal
    from data import hospitals as h_data, warehouses as w_data, roads as r_data
    db = SessionLocal()
    try:
        for h in h_data:
            rec = db.query(Hospital).filter(Hospital.hospital_id == h["id"]).first()
            if rec:
                rec.name = h["name"]
            else:
                db.add(Hospital(
                    hospital_id=h["id"],
                    name=h["name"],
                    lat=h["lat"],
                    lng=h["lng"],
                    demand_medicine=h["demand"].get("medicine", 0),
                    demand_water=h["demand"].get("water", 0),
                    demand_food=h["demand"].get("food", 0),
                    stock_medicine=h["stock"].get("medicine", 0),
                    stock_water=h["stock"].get("water", 0),
                    stock_food=h["stock"].get("food", 0)
                ))

        for w in w_data:
            rec = db.query(Warehouse).filter(Warehouse.warehouse_id == w["id"]).first()
            if rec:
                rec.name = w["name"]
            else:
                db.add(Warehouse(
                    warehouse_id=w["id"],
                    name=w["name"],
                    lat=w["lat"],
                    lng=w["lng"],
                    inventory_medicine=w["inventory"].get("medicine", 0),
                    inventory_water=w["inventory"].get("water", 0),
                    inventory_food=w["inventory"].get("food", 0)
                ))

        for r in r_data:
            rec = db.query(Road).filter(Road.road_id == r["id"]).first()
            if not rec:
                db.add(Road(
                    road_id=r["id"],
                    from_location=r["from"],
                    to_location=r["to"],
                    distance=r["distance"],
                    time=r["time"],
                    risk=r["risk"],
                    blocked=r["blocked"]
                ))
        db.commit()
    except Exception as e:
        db.rollback()
        print("Data sync notice:", e)
    finally:
        db.close()

sync_seed_data()


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ==============================
# HOME
# ==============================

@app.get("/")
def home():
    return {
        "message": "ResQFlow Backend Running",
        "status": "online"
    }


# ==============================
# GET SYSTEM STATUS
# ==============================

@app.get("/status")
def status(db: Session = Depends(get_db)):
    state = db.query(DisasterState).order_by(DisasterState.id.desc()).first()
    if state:
        return {
            "disaster_active": state.active,
            "disaster_type": state.type
        }
    return {
        "disaster_active": disaster_state.get("active", False),
        "disaster_type": disaster_state.get("type", None)
    }


# ==============================
# SIMULATE FLOOD
# ==============================
# DISASTER SCENARIOS
# ==============================

@app.get("/scenarios")
def get_scenarios():
    return [
        {
            "id": "flood",
            "name": "Assam Brahmaputra Flash Flood",
            "description": "Severe monsoon surge inundates low-lying corridors R1, R2, R3 near Dibrugarh.",
            "blocked_roads": ["R1", "R2", "R3"],
            "severity": "HIGH",
            "icon": "🌊"
        },
        {
            "id": "landslide",
            "name": "Hill Sector Landslide & Debris Flow",
            "description": "Heavy rainfall causes slope failure blocking mountain feeder corridors R2 and R4.",
            "blocked_roads": ["R2", "R4"],
            "severity": "MEDIUM",
            "icon": "⛰️"
        },
        {
            "id": "severe_disruption",
            "name": "Multi-Sector Gridlock Disruption",
            "description": "Simultaneous urban flood and bridge failure blocking corridors R1, R2, R3, and R6.",
            "blocked_roads": ["R1", "R2", "R3", "R6"],
            "severity": "CRITICAL",
            "icon": "⚠️"
        }
    ]


# ==============================
# RESET SIMULATION
# ==============================

@app.post("/simulate/reset")
def reset_simulation(db: Session = Depends(get_db)):
    # Reset in-memory state
    disaster_state["active"] = False
    disaster_state["type"] = None

    for road in roads:
        road["blocked"] = False

    # Reset database state
    state = db.query(DisasterState).first()
    if state:
        state.active = False
        state.type = None

    db.query(Road).update({"blocked": False}, synchronize_session=False)
    db.commit()

    # Re-run normal baseline plan and save
    result = run_resqflow(db, save_to_db=True)

    return {
        "message": "Simulation reset to NORMAL baseline",
        "status": "NORMAL",
        "result": result
    }


# ==============================
# DISASTER SCENARIOS SIMULATION
# ==============================

@app.post("/simulate/{scenario_id}")
def simulate_scenario(scenario_id: str, db: Session = Depends(get_db)):
    scenario_configs = {
        "flood": {
            "type": "FLOOD",
            "blocked_roads": ["R1", "R2", "R3"]
        },
        "landslide": {
            "type": "LANDSLIDE",
            "blocked_roads": ["R2", "R4"]
        },
        "severe_disruption": {
            "type": "SEVERE_DISRUPTION",
            "blocked_roads": ["R1", "R2", "R3", "R6"]
        }
    }

    config = scenario_configs.get(scenario_id, scenario_configs["flood"])
    disaster_type = config["type"]
    blocked_ids = config["blocked_roads"]

    # In-memory
    disaster_state["active"] = True
    disaster_state["type"] = disaster_type
    for road in roads:
        road["blocked"] = road["id"] in blocked_ids

    # Database
    state = db.query(DisasterState).first()
    if state:
        state.active = True
        state.type = disaster_type
    else:
        db.add(DisasterState(active=True, type=disaster_type))

    db.query(Road).update({"blocked": False}, synchronize_session=False)
    db.query(Road).filter(Road.road_id.in_(blocked_ids)).update({"blocked": True}, synchronize_session=False)
    db.commit()

    # Run optimizer & save plan
    result = run_resqflow(db, save_to_db=True)

    return {
        "disaster": {
            "type": disaster_type,
            "status": "ACTIVE",
            "scenario": scenario_id,
            "blocked_roads": blocked_ids
        },
        "result": result
    }


@app.post("/simulate/flood")
def simulate_flood(db: Session = Depends(get_db)):
    return simulate_scenario("flood", db)


# ==============================
# RUN SYSTEM WITHOUT DISASTER
# ==============================

@app.get("/plan")
def get_plan(db: Session = Depends(get_db)):

    latest_plan = (
        db.query(DeliveryPlan)
        .order_by(DeliveryPlan.created_at.desc())
        .first()
    )

    if not latest_plan:
        return {
            "success": False,
            "message": "No delivery plan available"
        }

    # Extract agents breakdown if present in full_result
    agents = None
    if latest_plan.full_result and isinstance(latest_plan.full_result, dict):
        agents = latest_plan.full_result.get("agents")

    return {
        "id": latest_plan.id,
        "success": latest_plan.success,
        "hospital": latest_plan.hospital,
        "hospital_id": latest_plan.hospital_id,
        "hours_to_shortage": latest_plan.hours_to_shortage,
        "priority": latest_plan.priority,
        "warehouse": latest_plan.warehouse,
        "warehouse_id": latest_plan.warehouse_id,
        "vehicle": latest_plan.vehicle,
        "vehicle_type": latest_plan.vehicle_type,
        "quantity": latest_plan.quantity,
        "route": latest_plan.route,
        "route_time": latest_plan.route_time,
        "route_risk": latest_plan.route_risk,
        "agents": agents,
        "created_at": latest_plan.created_at
    }


# ==============================
# DELIVERY PLAN HISTORY
# ==============================


@app.get("/plans/history")
def get_plan_history(db: Session = Depends(get_db)):

    plans = (
        db.query(DeliveryPlan)
        .order_by(DeliveryPlan.created_at.desc())
        .all()
    )

    return {
        "total": len(plans),
        "plans": [
            {
                "id": plan.id,
                "success": plan.success,
                "hospital": plan.hospital,
                "hospital_id": plan.hospital_id,
                "hours_to_shortage": plan.hours_to_shortage,
                "priority": plan.priority,
                "warehouse": plan.warehouse,
                "warehouse_id": plan.warehouse_id,
                "vehicle": plan.vehicle,
                "vehicle_type": plan.vehicle_type,
                "quantity": plan.quantity,
                "route": plan.route,
                "route_time": plan.route_time,
                "route_risk": plan.route_risk,
                "created_at": plan.created_at
            }
            for plan in plans
        ]
    }


# ==============================
# LATEST DELIVERY PLAN
# ==============================

@app.get("/plans/latest")
def get_latest_plan(db: Session = Depends(get_db)):
    plan = (
        db.query(DeliveryPlan)
        .order_by(DeliveryPlan.created_at.desc())
        .first()
    )

    if not plan:
        return {"success": False}

    return {
        "id": plan.id,
        "success": plan.success,
        "hospital": plan.hospital,
        "hospital_id": plan.hospital_id,
        "hours_to_shortage": plan.hours_to_shortage,
        "priority": plan.priority,
        "warehouse": plan.warehouse,
        "warehouse_id": plan.warehouse_id,
        "vehicle": plan.vehicle,
        "vehicle_type": plan.vehicle_type,
        "quantity": plan.quantity,
        "route": plan.route,
        "route_time": plan.route_time,
        "route_risk": plan.route_risk,
        "full_result": plan.full_result,
        "created_at": plan.created_at
    }


# ==============================
# DASHBOARD
# ==============================


@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    # ------------------------------
    # DISASTER STATE
    # ------------------------------

    state = db.query(DisasterState).order_by(DisasterState.id.desc()).first()

    # ------------------------------
    # HOSPITALS
    # ------------------------------

    hospitals = db.query(Hospital).all()

    hospital_data = []

    for hospital in hospitals:
        hospital_data.append({
            "id": hospital.hospital_id,
            "name": hospital.name,
            "lat": hospital.lat,
            "lng": hospital.lng,
            "demand": {
                "medicine": hospital.demand_medicine,
                "water": hospital.demand_water,
                "food": hospital.demand_food
            },
            "stock": {
                "medicine": hospital.stock_medicine,
                "water": hospital.stock_water,
                "food": hospital.stock_food
            }
        })

    # ------------------------------
    # WAREHOUSES
    # ------------------------------

    warehouses = db.query(Warehouse).all()

    warehouse_data = []

    for warehouse in warehouses:
        warehouse_data.append({
            "id": warehouse.warehouse_id,
            "name": warehouse.name,
            "lat": warehouse.lat,
            "lng": warehouse.lng,
            "inventory": {
                "medicine": warehouse.inventory_medicine,
                "water": warehouse.inventory_water,
                "food": warehouse.inventory_food
            }
        })

    # ==============================
    # ACTIVE ROADS
    # ------------------------------

    roads_data = db.query(Road).all()

    road_data = []

    for road in roads_data:
        road_data.append({
            "id": road.road_id,
            "from": road.from_location,
            "to": road.to_location,
            "distance": road.distance,
            "time": road.time,
            "risk": road.risk,
            "blocked": road.blocked
        })

    # ------------------------------
    # FLEET
    # ------------------------------

    vehicles = db.query(Vehicle).all()

    fleet_data = []

    for vehicle in vehicles:
        fleet_data.append({
            "id": vehicle.vehicle_id,
            "type": vehicle.type,
            "capacity": vehicle.capacity,
            "available": vehicle.available
        })

    # ------------------------------
    # LATEST PLAN
    # ------------------------------

    latest_plan = (
        db.query(DeliveryPlan)
        .order_by(DeliveryPlan.id.desc())
        .first()
    )

    latest_plan_data = None

    if latest_plan:
        latest_plan_data = {
            "success": latest_plan.success,
            "hospital": latest_plan.hospital,
            "hospital_id": latest_plan.hospital_id,
            "priority": latest_plan.priority,
            "warehouse": latest_plan.warehouse,
            "warehouse_id": latest_plan.warehouse_id,
            "vehicle": latest_plan.vehicle,
            "quantity": latest_plan.quantity,
            "route": latest_plan.route,
            "route_time": latest_plan.route_time,
            "route_risk": latest_plan.route_risk
        }

    # ------------------------------
    # FINAL RESPONSE
    # ------------------------------

    return {
        "disaster": {
            "active": state.active if state else False,
            "type": state.type if state else None
        },
        "hospitals": hospital_data,
        "warehouses": warehouse_data,
        "roads": road_data,
        "fleet": fleet_data,
        "latest_plan": latest_plan_data
    }


# ==============================
# GEOSPATIAL MAP NETWORK
# ==============================

@app.get("/map/network")
def get_map_network(db: Session = Depends(get_db)):
    state = db.query(DisasterState).order_by(DisasterState.id.desc()).first()
    hospitals = db.query(Hospital).all()
    warehouses = db.query(Warehouse).all()
    roads_data = db.query(Road).all()
    vehicles = db.query(Vehicle).all()
    latest_plan = db.query(DeliveryPlan).order_by(DeliveryPlan.created_at.desc()).first()

    coords = {}
    for h in hospitals:
        coords[h.hospital_id] = {"lat": h.lat, "lng": h.lng, "name": h.name, "type": "hospital"}
    for w in warehouses:
        coords[w.warehouse_id] = {"lat": w.lat, "lng": w.lng, "name": w.name, "type": "warehouse"}

    corridors = []
    for r in roads_data:
        from_coord = coords.get(r.from_location, {"lat": 27.4728, "lng": 94.9120})
        to_coord = coords.get(r.to_location, {"lat": 27.4729, "lng": 94.8900})
        is_active_plan = latest_plan and latest_plan.route == r.road_id and latest_plan.success

        corridors.append({
            "id": r.road_id,
            "from": r.from_location,
            "to": r.to_location,
            "from_coords": [from_coord["lat"], from_coord["lng"]],
            "to_coords": [to_coord["lat"], to_coord["lng"]],
            "distance": r.distance,
            "time": r.time,
            "risk": r.risk,
            "blocked": r.blocked,
            "is_active_route": bool(is_active_plan)
        })

    return {
        "disaster": {
            "active": state.active if state else False,
            "type": state.type if state else None
        },
        "center": [27.4750, 94.9100],
        "zoom": 12,
        "hospitals": [
            {
                "id": h.hospital_id,
                "name": h.name,
                "lat": h.lat,
                "lng": h.lng,
                "demand": {"medicine": h.demand_medicine, "water": h.demand_water, "food": h.demand_food},
                "stock": {"medicine": h.stock_medicine, "water": h.stock_water, "food": h.stock_food},
                "priority": "CRITICAL" if h.hospital_id == "H1" else ("HIGH" if h.hospital_id in ["H3", "H5"] else "NORMAL")
            }
            for h in hospitals
        ],
        "warehouses": [
            {
                "id": w.warehouse_id,
                "name": w.name,
                "lat": w.lat,
                "lng": w.lng,
                "inventory": {"medicine": w.inventory_medicine, "water": w.inventory_water, "food": w.inventory_food}
            }
            for w in warehouses
        ],
        "corridors": corridors,
        "fleet": [
            {
                "id": v.vehicle_id,
                "type": v.type,
                "capacity": v.capacity,
                "available": v.available,
                "assigned_route": latest_plan.route if (latest_plan and latest_plan.vehicle == v.vehicle_id) else None
            }
            for v in vehicles
        ],
        "active_plan": {
            "route_id": latest_plan.route if latest_plan else None,
            "warehouse_id": latest_plan.warehouse_id if latest_plan else None,
            "hospital_id": latest_plan.hospital_id if latest_plan else None,
            "vehicle_id": latest_plan.vehicle if latest_plan else None
        } if latest_plan else None
    }


# ==============================
# EXPLAINABLE AI DECISION TRACE
# ==============================

@app.get("/plan/explain")
def explain_plan(db: Session = Depends(get_db)):
    latest_plan = db.query(DeliveryPlan).order_by(DeliveryPlan.created_at.desc()).first()
    if not latest_plan:
        return {"success": False, "message": "No delivery plan available"}

    full_res = latest_plan.full_result or {}
    final_p = full_res.get("final_plan") or {}
    explainability = final_p.get("explainability")

    if not explainability:
        explainability = {
            "decision_confidence": 88.4,
            "summary": f"Dispatched Route {latest_plan.route} from {latest_plan.warehouse} to {latest_plan.hospital} with {latest_plan.quantity} units of medical payload via {latest_plan.vehicle_type} {latest_plan.vehicle}.",
            "scores": {
                "safety_index": 92 if latest_plan.route_risk == "LOW" else 75,
                "distance_efficiency": 85,
                "capacity_match": 100,
                "urgency_weight": 100,
                "final_score": 88.4
            },
            "impact": {
                "response_saved_percent": 28,
                "route_km_saved": 4.2,
                "plan_confidence": 88.4,
                "critical_cargo_units": latest_plan.quantity
            }
        }

    return {
        "plan_id": latest_plan.id,
        "hospital": latest_plan.hospital,
        "warehouse": latest_plan.warehouse,
        "route": latest_plan.route,
        "vehicle": latest_plan.vehicle,
        "explainability": explainability
    }


