# models.py

from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Boolean,
    DateTime,
    JSON
)

from datetime import datetime

from database import Base


# ==============================
# WAREHOUSE
# ==============================

class Warehouse(Base):

    __tablename__ = "warehouses"

    id = Column(Integer, primary_key=True, index=True)

    warehouse_id = Column(String, unique=True, index=True)

    name = Column(String)

    lat = Column(Float)

    lng = Column(Float)

    inventory_medicine = Column(Integer, default=0)

    inventory_water = Column(Integer, default=0)

    inventory_food = Column(Integer, default=0)


# ==============================
# HOSPITAL
# ==============================

class Hospital(Base):

    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)

    hospital_id = Column(String, unique=True, index=True)

    name = Column(String)

    lat = Column(Float)

    lng = Column(Float)

    demand_medicine = Column(Integer, default=0)

    demand_water = Column(Integer, default=0)

    demand_food = Column(Integer, default=0)

    stock_medicine = Column(Integer, default=0)

    stock_water = Column(Integer, default=0)

    stock_food = Column(Integer, default=0)


# ==============================
# VEHICLE
# ==============================

class Vehicle(Base):

    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(String, unique=True, index=True)

    type = Column(String)

    capacity = Column(Integer)

    available = Column(Boolean, default=True)


# ==============================
# ROAD
# ==============================

class Road(Base):

    __tablename__ = "roads"

    id = Column(Integer, primary_key=True, index=True)

    road_id = Column(String, unique=True, index=True)

    from_location = Column(String)

    to_location = Column(String)

    distance = Column(Integer)

    time = Column(Integer)

    risk = Column(String)

    blocked = Column(Boolean, default=False)


# ==============================
# DISASTER STATE
# ==============================

class DisasterState(Base):

    __tablename__ = "disaster_states"

    id = Column(Integer, primary_key=True, index=True)

    active = Column(Boolean, default=False)

    type = Column(String, nullable=True)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )


# ==============================
# DELIVERY PLAN (LOG)
# ==============================

class DeliveryPlan(Base):

    __tablename__ = "delivery_plans"

    id = Column(Integer, primary_key=True, index=True)

    success = Column(Boolean)

    hospital = Column(String)

    hospital_id = Column(String)

    hours_to_shortage = Column(Float)

    priority = Column(String)

    warehouse = Column(String)

    warehouse_id = Column(String)

    vehicle = Column(String)

    vehicle_type = Column(String)

    quantity = Column(Integer)

    route = Column(String)

    route_time = Column(Integer)

    route_risk = Column(String)

    full_result = Column(JSON, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
