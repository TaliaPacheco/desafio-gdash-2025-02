#!/bin/bash
set -e

echo "=== Iniciando container ==="
echo "Python: $(python --version)"
echo "pip: $(pip --version)"
echo ""

echo "=== Verificando se módulos estão instalados ==="
python -c "import requests; print('✓ requests OK')" || echo "✗ requests FALTA"
python -c "import pika; print('✓ pika OK')" || echo "✗ pika FALTA"
python -c "import json; print('✓ json OK')" || echo "✗ json FALTA"
python -c "import time; print('✓ time OK')" || echo "✗ time FALTA"
echo ""

echo "=== Iniciando aplicação ==="
echo "Testando sintaxe do Python..."
python -m py_compile weather.py && echo "✓ Sintaxe OK" || echo "✗ Erro de sintaxe"
echo ""

echo "Executando weather.py com output unbuffered..."
python -u weather.py
