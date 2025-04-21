from fastapi import APIRouter, Depends, status, Response, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import JSONResponse

from database import get_db
from schemas.usuario_schema import UsuarioCreate, UsuarioResponse, UsuarioUpdate
from services.usuario_service import UsuarioService, Usuario
from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"]
)

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        # Crear el usuario
        nuevo_usuario = UsuarioService.crear_usuario(db, usuario.model_dump())
        
        # Asegurarnos de que la sesión esté actualizada
        db.refresh(nuevo_usuario)
        
        # Convertir el usuario a un diccionario manualmente
        usuario_dict = {
            "id_usuario": nuevo_usuario.id_usuario,
            "nombre": nuevo_usuario.nombre,
            "correo": nuevo_usuario.correo,
            "codigo": nuevo_usuario.codigo,
            "activo": nuevo_usuario.activo,
            "token_notificacion": nuevo_usuario.token_notificacion
        }
        
        return usuario_dict
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[UsuarioResponse])
def listar_usuarios(
    current_user: Usuario = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    usuarios = UsuarioService.obtener_usuarios(db, skip, limit)
    return [
        {
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo": usuario.correo,
            "codigo": usuario.codigo,
            "activo": usuario.activo,
            "token_notificacion": usuario.token_notificacion
        }
        for usuario in usuarios
    ]

@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = UsuarioService.obtener_usuario_por_id(db, usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {
        "id_usuario": usuario.id_usuario,
        "nombre": usuario.nombre,
        "correo": usuario.correo,
        "codigo": usuario.codigo,
        "activo": usuario.activo,
        "token_notificacion": usuario.token_notificacion
    }

@router.put("/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(usuario_id: int, usuario: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario_actualizado = UsuarioService.actualizar_usuario(db, usuario_id, usuario.model_dump(exclude_unset=True))
    if usuario_actualizado is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {
        "id_usuario": usuario_actualizado.id_usuario,
        "nombre": usuario_actualizado.nombre,
        "correo": usuario_actualizado.correo,
        "codigo": usuario_actualizado.codigo,
        "activo": usuario_actualizado.activo,
        "token_notificacion": usuario_actualizado.token_notificacion
    }

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = UsuarioService.eliminar_usuario(db, usuario_id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return None 