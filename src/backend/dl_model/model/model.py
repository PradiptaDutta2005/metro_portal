import os

import numpy as np
import tensorflow as tf
from dl_model.utils.mappings import comp_map, dve_map, lps_map, ps_map, tower_map

# Build file path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

# Load once
model = tf.keras.models.load_model(MODEL_PATH)


def predict_from_model(data):
    features = [
        data.H1,
        data.DV_pressure,
        data.Reservoirs,
        data.Oil_temperature,
        data.Motor_current,
        comp_map.get(data.COMP.upper(), 0),
        dve_map.get(data.DV_electric.upper(), 0),
        tower_map.get(data.Towers.upper(), 0),
        data.MPG,
        lps_map.get(data.LPS.capitalize(), 1),
        ps_map.get(data.Pressure_switch.upper(), 0),
        data.Oil_level,
        data.Caudal_impulses,
    ]

    arr = np.array([features])
    return model.predict(arr)
