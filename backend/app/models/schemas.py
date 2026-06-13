from pydantic import BaseModel, Field


class SubnetRequest(BaseModel):
    ip: str
    cidr: int = Field(ge=0, le=32)


class WildcardRequest(BaseModel):
    mask: str


class VLSMRequest(BaseModel):
    network: str
    hosts: list[int]
