from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import uuid

app = FastAPI()
templates = Jinja2Templates(directory="templates")


sessions = {}

class CaptchaData(BaseModel):
    sitekey: str
    rqdata: str

@app.post("/create")
async def create_session(data: CaptchaData):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "sitekey": data.sitekey,
        "rqdata": data.rqdata,
        "token": None
    }
    return {"id": session_id}

@app.get("/solve/{session_id}", response_class=HTMLResponse)
async def solve_page(request: Request, session_id: str):
    session = sessions.get(session_id)
    if not session:
        return "Session not found"
    return templates.TemplateResponse("index.html", {
        "request": request,
        "session_id": session_id,
        "sitekey": session["sitekey"],
        "rqdata": session["rqdata"]
    })

@app.post("/submit")
async def submit_token(data: dict):
    session_id = data.get("id")
    token = data.get("token")
    if session_id in sessions:
        sessions[session_id]["token"] = token
        return {"status": "ok"}
    return {"status": "error"}

@app.get("/check/{session_id}")
async def check_token(session_id: str):
    session = sessions.get(session_id)
    if session and session["token"]:
        return {"token": session["token"]}
    return {"token": None}
