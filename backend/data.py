# data.py

warehouses = [
    {
        "id": "W1",
        "name": "Dibrugarh Central Warehouse",
        "lat": 27.4728,
        "lng": 94.9120,
        "inventory": {
            "medicine": 120,
            "water": 300,
            "food": 250
        }
    },
    {
        "id": "W2",
        "name": "Tinsukia Relief Warehouse",
        "lat": 27.4926,
        "lng": 95.3468,
        "inventory": {
            "medicine": 80,
            "water": 250,
            "food": 200
        }
    },
    {
        "id": "W3",
        "name": "Sivasagar Warehouse",
        "lat": 26.9826,
        "lng": 94.6425,
        "inventory": {
            "medicine": 100,
            "water": 200,
            "food": 300
        }
    }
]


hospitals = [
    {
        "id": "H1",
        "name": "Assam Medical College & Hospital (AMCH)",
        "lat": 27.4729,
        "lng": 94.8900,
        "demand": {
            "medicine": 120,
            "water": 200,
            "food": 100
        },
        "stock": {
            "medicine": 35,
            "water": 120,
            "food": 80
        }
    },
    {
        "id": "H2",
        "name": "Dibrugarh Civil Hospital",
        "lat": 27.4727,
        "lng": 94.9033,
        "demand": {
            "medicine": 80,
            "water": 150,
            "food": 100
        },
        "stock": {
            "medicine": 100,
            "water": 100,
            "food": 100
        }
    },
    {
        "id": "H3",
        "name": "Tinsukia Relief Camp A",
        "lat": 27.4900,
        "lng": 94.9200,
        "demand": {
            "medicine": 60,
            "water": 200,
            "food": 150
        },
        "stock": {
            "medicine": 30,
            "water": 80,
            "food": 70
        }
    },
    {
        "id": "H4",
        "name": "Moranhat Relief Camp B",
        "lat": 27.4600,
        "lng": 94.9300,
        "demand": {
            "medicine": 50,
            "water": 150,
            "food": 120
        },
        "stock": {
            "medicine": 70,
            "water": 120,
            "food": 100
        }
    },
    {
        "id": "H5",
        "name": "Naharkatia Rural Health Center",
        "lat": 27.4500,
        "lng": 94.9000,
        "demand": {
            "medicine": 90,
            "water": 150,
            "food": 100
        },
        "stock": {
            "medicine": 40,
            "water": 90,
            "food": 60
        }
    }
]


vehicles = [
    {
        "id": "V1",
        "type": "Truck",
        "capacity": 150,
        "available": True
    },
    {
        "id": "V2",
        "type": "Van",
        "capacity": 70,
        "available": True
    },
    {
        "id": "V3",
        "type": "Truck",
        "capacity": 120,
        "available": True
    },
    {
        "id": "V4",
        "type": "Van",
        "capacity": 50,
        "available": True
    }
]


roads = [
    {
        "id": "R1",
        "name": "NH-37 (Dibrugarh Central Bypass)",
        "from": "W1",
        "to": "H1",
        "distance": 8,
        "time": 15,
        "risk": "LOW",
        "blocked": False
    },
    {
        "id": "R2",
        "name": "Db-M-1 (Convoy Road / Jalan Bus Terminus)",
        "from": "W1",
        "to": "H1",
        "distance": 6,
        "time": 12,
        "risk": "HIGH",
        "blocked": False
    },
    {
        "id": "R3",
        "name": "Db-M-2 (Mancotta–Saraighat Road)",
        "from": "W1",
        "to": "H1",
        "distance": 10,
        "time": 20,
        "risk": "MEDIUM",
        "blocked": False
    },
    {
        "id": "R4",
        "name": "NH-37A (Tinsukia–Camp Connector)",
        "from": "W1",
        "to": "H3",
        "distance": 7,
        "time": 14,
        "risk": "LOW",
        "blocked": False
    },
    {
        "id": "R5",
        "name": "NH-38 (Tinsukia–AMCH Emergency Relief Highway)",
        "from": "W2",
        "to": "H1",
        "distance": 15,
        "time": 30,
        "risk": "MEDIUM",
        "blocked": False
    },
    {
        "id": "R6",
        "name": "SH-1 (Sivasagar–Naharkatia Link)",
        "from": "W3",
        "to": "H5",
        "distance": 12,
        "time": 25,
        "risk": "LOW",
        "blocked": False
    }
]


disaster_state = {
    "active": False,
    "type": None
}
