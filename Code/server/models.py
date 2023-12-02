from pydantic import BaseModel

class PredictResponse(BaseModel):
    filename: str
    content_type: str
    prediction: list[float] = []
    pred_class: int
    pred_classname: str