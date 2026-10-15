# Todo API

Backend REST em Node.js e TypeScript para gerenciamento de tarefas, organizado
com Clean Architecture.

## Requisitos

- Node.js 22 ou superior
- npm

## Executar localmente

```bash
npm install
npm run dev
```

A API fica disponível em `http://localhost:3000`. A documentacao interativa
Swagger UI fica em `http://localhost:3000/api-docs`, e o documento OpenAPI em
`http://localhost:3000/api-docs.json`.

## Endpoints

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/api/todos` | Cria uma tarefa |
| `GET` | `/api/todos` | Lista as tarefas |
| `GET` | `/api/todos/:id` | Busca uma tarefa |
| `PATCH` | `/api/todos/:id` | Atualiza uma tarefa |
| `DELETE` | `/api/todos/:id` | Remove uma tarefa |

Exemplo de criacao:

```json
{
  "title": "Estudar Clean Architecture",
  "description": "Organizar as dependencias do projeto"
}
```

## Arquitetura

- `src/domain`: entidade e regras de dominio, sem dependencias externas.
- `src/application`: casos de uso e porta do repositorio.
- `src/infrastructure`: adaptador de persistencia em memoria.
- `src/presentation`: API HTTP, tratamento de erros e OpenAPI.
- `src/main.ts`: composition root que conecta as camadas.

O repositorio atual e em memoria: os dados sao perdidos quando o processo
reinicia. Substitua o adaptador de persistencia para manter dados entre
execucoes.

## Testes e build

```bash
npm test
npm run build
```

A suite inclui testes de integracao dos endpoints e testes de regras
arquiteturais no estilo ArchUnit, que verificam as dependencias permitidas entre
as camadas.

## Docker

```bash
docker build -t todo-api .
docker run --rm -p 3000:3000 todo-api
```

Para publicar no Docker Hub como `manoelvsneto/pucprbesarchcloud2026`, faca
login e execute o script na raiz do projeto:

```bat
docker login
publicar-dockerhub.bat
```

O script constroi e publica a tag `latest`.

## OpenShift / ROSA

Depois de publicar a imagem no Docker Hub e autenticar no cluster ROSA com
`oc login`, aplique os manifests. Eles criam o namespace `manoelneto-dev`, um
Deployment, um Service e uma Route HTTPS do OpenShift:

```bash
oc apply -f kubernetes/
```

Consulte o hostname atribuido pelo router do OpenShift:

```bash
oc get route pucprbesarchcloud2026 -n manoelneto-dev
```

A Route usa terminacao TLS `edge` e redireciona HTTP para HTTPS. Para testar
diretamente o Service, sem passar pelo router:

```bash
oc port-forward -n manoelneto-dev service/pucprbesarchcloud2026 3000:3000
```

A API fica acessivel pelo hostname da Route ou, via port-forward, em
`http://localhost:3000`. O Deployment usa uma replica,
pois a persistencia atual e em memoria; os dados nao sao compartilhados entre
replicas e se perdem quando o pod reinicia.
