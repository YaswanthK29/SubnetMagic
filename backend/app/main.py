from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.subnet import router as subnet_router
from app.routers.wildcard import router as wildcard_router
from app.routers.vlsm import router as vlsm_router
from app.routers.quiz import router as quiz_router

app = FastAPI(
    title="SubnetMagic API",
    description="CCNA subnetting learning platform backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subnet_router, prefix="/api", tags=["subnet"])
app.include_router(wildcard_router, prefix="/api", tags=["wildcard"])
app.include_router(vlsm_router, prefix="/api", tags=["vlsm"])
app.include_router(quiz_router, prefix="/api", tags=["quiz"])


@app.get("/")
def root():
    return {"message": "SubnetMagic API is running"}
