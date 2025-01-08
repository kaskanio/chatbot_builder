from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import logging
import subprocess
import shutil

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SaveDiagramRequest(BaseModel):
    filename: str
    directory: str
    data: str

@app.post("/save-diagram")
def save_diagram(request: SaveDiagramRequest):
    try:
        file_path = os.path.join(request.directory, request.filename)
        with open(file_path, 'w') as file:
            file.write(request.data)
        return {"message": "Diagram saved successfully"}
    except Exception as e:
        logging.error(f"Error saving diagram: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export-dflow")
def export_dflow():
    try:
        result = subprocess.run(["python", "transformation.py"], capture_output=True, text=True)
        if result.returncode == 0:
            return {"message": "Transformation successful", "output": result.stdout}
        else:
            return {"message": "Transformation failed", "error": result.stderr}
    except Exception as e:
        return {"message": "An error occurred", "error": str(e)}

@app.put("/upload-db")
async def upload_db(file: UploadFile = File(...)):
    try:
        upload_path = os.path.join(os.getcwd(), 'db.json')
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"message": "Database successfully loaded from file."}
    except Exception as e:
        logging.error(f"Error uploading database: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/load-diagram")
def load_diagram():
    try:
        file_path = os.path.join('', 'diagram.json')  # Adjust the directory if needed
        with open(file_path, 'r') as file:
            data = file.read()
        return data
    except Exception as e:
        logging.error(f"Error loading diagram: {e}")
        raise HTTPException(status_code=500, detail=str(e))