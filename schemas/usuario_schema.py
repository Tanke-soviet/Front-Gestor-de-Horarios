from typing import Optional
from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    codigo: str
    activo: bool = True
    token_notificacion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    clave: str

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    codigo: Optional[str] = None
    clave: Optional[str] = None
    token_notificacion: Optional[str] = None
    activo: Optional[bool] = None

class UsuarioResponse(BaseModel):
    id_usuario: int
    nombre: str
    correo: EmailStr
    codigo: str
    activo: bool
    token_notificacion: Optional[str] = None
    
    class Config:
        from_attributes = True 