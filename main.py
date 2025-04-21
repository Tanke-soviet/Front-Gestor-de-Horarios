from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

from routes import usuario_routes, materia_routes, usuario_materias_routes, sesiones_routes, periodo_routes, auth_routes, nota_routes
from database import engine 
from database import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Gestión Académica",
    description="API para gestionar usuarios y materias",
    version="1.0.0",
    debug=True  # Habilitar modo debug
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para manejar errores y CORS
@app.middleware("http")
async def add_cors_and_error_handling(request: Request, call_next):
    try:
        response = await call_next(request)
        
        # Agregar headers CORS a todas las respuestas
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        
        return response
    except Exception as e:
        # Log del error
        print(f"Error en la petición: {str(e)}")
        print("Traceback completo:")
        print(traceback.format_exc())
        
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)},
            headers={
                "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
            }
        )

# Incluir routers
app.include_router(usuario_routes)
app.include_router(materia_routes)
app.include_router(usuario_materias_routes)
app.include_router(sesiones_routes)
app.include_router(periodo_routes)
app.include_router(nota_routes)  
app.include_router(auth_routes)  

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Gestión Académica, en efecto, esta viva"}

@app.options("/{full_path:path}")
async def options_handler(request: Request):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
    ) 