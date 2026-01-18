#!/bin/bash

cleanup() {
    echo -e "\n Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup INT

echo "Iniciando Configuración Automática - Ensolvers Challenge"

echo " Configurando Backend..."
cd backend

# Crear entorno virtual si no existe
if [ ! -d "venvApp" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venvApp
fi

source venvApp/bin/activate

echo "Instalando dependencias de Python..."
pip install --upgrade pip

pip install -r app/requirements.txt

echo " Iniciando backend en segundo plano..."

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
sleep 2

echo "Configurando Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo " Instalando dependencias de Node..."
    npm install
fi

echo "✨ Iniciando frontend..."
npm run dev &
FRONTEND_PID=$!

echo -e "\n ¡SISTEMA LISTO!"
echo " URL Frontend: http://localhost:5173"
echo "URL Backend:  http://localhost:8000"
echo " Swagger Docs: http://localhost:8000/docs"
echo "Presiona Ctrl+C para detener ambos servidores."

wait
