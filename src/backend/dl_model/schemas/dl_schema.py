from pydantic import BaseModel


class InputData(BaseModel):
    H1: float
    DV_pressure: float
    Reservoirs: float
    Oil_temperature: float
    Motor_current: float
    COMP: str
    DV_electric: str
    Towers: str
    MPG: float
    LPS: str
    Pressure_switch: str
    Oil_level: float
    Caudal_impulses: float
    engineer: str
