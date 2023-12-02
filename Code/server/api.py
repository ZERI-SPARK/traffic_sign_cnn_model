import json
import sys
import traceback
from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models import PredictResponse
from tensorflow import keras

MODEL_PATH = Path(r'tsr_model')
IMG_HEIGHT = 30
IMG_WIDTH = 30

model = keras.models.load_model(MODEL_PATH, compile=True)
with open(r'classes.json') as jf:
    classes = json.load(jf)


app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/prediction/', response_model=PredictResponse)
async def prediction_route(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400, detail=f"File {file.filename} is not an image.")

    try:
        contents = await file.read()
        image = cv2.imdecode(np.frombuffer(
            contents, np.uint8), cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        resize_image = cv2.resize(image, (IMG_HEIGHT, IMG_WIDTH))
        image_data = np.array(resize_image)
        image_data = image_data / 255

        prediction_array = np.array([image_data])
        predictions = model.predict(prediction_array)
        prediction = predictions[0]
        pred_class = np.argmax(prediction)

        result = {
            'filename': file.filename,
            'content_type': file.content_type,
            'prediction': prediction.tolist(),
            'pred_class': pred_class,
            'pred_classname': classes[str(pred_class)],
        }

        return PredictResponse(**result)

    except:
        raise HTTPException(
            status_code=500, detail=traceback.format_exception(*sys.exc_info()))
