# init_db.py

from database import engine, SessionLocal, Base
from models import Warehouse, Hospital, Vehicle, Road, DisasterState
from data import warehouses, hospitals, vehicles, roads, disaster_state


def init_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Seed Warehouses if empty
        if db.query(Warehouse).count() == 0:
            print("Seeding warehouses...")
            for w in warehouses:
                warehouse = Warehouse(
                    warehouse_id=w["id"],
                    name=w["name"],
                    lat=w["lat"],
                    lng=w["lng"],
                    inventory_medicine=w["inventory"].get("medicine", 0),
                    inventory_water=w["inventory"].get("water", 0),
                    inventory_food=w["inventory"].get("food", 0)
                )
                db.add(warehouse)

        # Seed Hospitals if empty
        if db.query(Hospital).count() == 0:
            print("Seeding hospitals...")
            for h in hospitals:
                hospital = Hospital(
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
                )
                db.add(hospital)

        # Seed Vehicles if empty
        if db.query(Vehicle).count() == 0:
            print("Seeding vehicles...")
            for v in vehicles:
                vehicle = Vehicle(
                    vehicle_id=v["id"],
                    type=v["type"],
                    capacity=v["capacity"],
                    available=v["available"]
                )
                db.add(vehicle)

        # Seed Roads if empty
        if db.query(Road).count() == 0:
            print("Seeding roads...")
            for r in roads:
                road = Road(
                    road_id=r["id"],
                    from_location=r["from"],
                    to_location=r["to"],
                    distance=r["distance"],
                    time=r["time"],
                    risk=r["risk"],
                    blocked=r["blocked"]
                )
                db.add(road)

        # Seed Disaster State if empty
        if db.query(DisasterState).count() == 0:
            print("Seeding initial disaster state...")
            state = DisasterState(
                active=disaster_state.get("active", False),
                type=disaster_state.get("type", None)
            )
            db.add(state)

        db.commit()
        print("Database initialized and seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e

    finally:
        db.close()


if __name__ == "__main__":
    init_database()
