@echo off
setlocal

set "IMAGE=manoelvsneto/pucprbesarchcloud2026:latest"

where docker >nul 2>nul
if errorlevel 1 (
    echo Erro: Docker CLI nao encontrado. Instale o Docker Desktop e tente novamente.
    exit /b 1
)

echo Construindo a imagem %IMAGE%...
pushd "%~dp0"
if errorlevel 1 (
    echo Erro ao acessar a pasta do projeto.
    exit /b 1
)

docker build -t "%IMAGE%" .
set "BUILD_RESULT=%ERRORLEVEL%"
popd
if not "%BUILD_RESULT%"=="0" (
    echo Erro ao construir a imagem Docker.
    exit /b %BUILD_RESULT%
)

echo Publicando %IMAGE% no Docker Hub...
echo Verifique se voce esta autenticado com "docker login".
docker push "%IMAGE%"
if errorlevel 1 (
    echo Erro ao publicar a imagem. Verifique sua autenticacao e permissao no repositorio.
    exit /b 1
)

echo Imagem publicada com sucesso: %IMAGE%
exit /b 0
