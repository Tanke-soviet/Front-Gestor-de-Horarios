from sqlalchemy.orm import Session
from models.usuario import Usuario
from dependencies.security import get_password_hash

class UsuarioService:
    @staticmethod
    def crear_usuario(db: Session, usuario_data: dict):
        try:
            # Hash de la contraseña
            hashed_password = get_password_hash(usuario_data["clave"])
            
            # Crear instancia de usuario
            db_usuario = Usuario(
                nombre=usuario_data["nombre"],
                correo=usuario_data["correo"],
                codigo=usuario_data["codigo"],
                clave=hashed_password,
                activo=usuario_data.get("activo", True)
            )
            
            # Agregar a la sesión y hacer commit
            db.add(db_usuario)
            db.commit()
            
            # Refrescar para obtener el ID
            db.refresh(db_usuario)
            
            # Verificar que el ID existe
            if not hasattr(db_usuario, 'id_usuario') or db_usuario.id_usuario is None:
                db.rollback()
                raise ValueError("No se pudo generar el ID del usuario")
            
            return db_usuario
            
        except Exception as e:
            db.rollback()
            raise Exception(f"Error al crear usuario: {str(e)}")

    @staticmethod
    def obtener_usuario_por_id(db: Session, usuario_id: int):
        return db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()

    @staticmethod
    def obtener_usuario_por_correo(db: Session, correo: str):
        return db.query(Usuario).filter(Usuario.correo == correo).first()

    @staticmethod
    def obtener_usuarios(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Usuario).offset(skip).limit(limit).all()

    @staticmethod
    def actualizar_usuario(db: Session, usuario_id: int, usuario_data: dict):
        db_usuario = UsuarioService.obtener_usuario_por_id(db, usuario_id)
        if db_usuario:
            for key, value in usuario_data.items():
                if hasattr(db_usuario, key):
                    if key == "clave" and value:
                        value = get_password_hash(value)
                    setattr(db_usuario, key, value)
            db.commit()
            db.refresh(db_usuario)
        return db_usuario

    @staticmethod
    def eliminar_usuario(db: Session, usuario_id: int):
        db_usuario = UsuarioService.obtener_usuario_por_id(db, usuario_id)
        if db_usuario:
            db.delete(db_usuario)
            db.commit()
        return db_usuario 