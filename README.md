## Workspace

Este é um módulo utilitário. Nele é possível montar o ambiente de desenvolvimento completo utilizando o docker-compose.

O processo pode ser iniciado pela execução do seguinte comando:

```bash
docker-compose up -d
```

Isto irá levantar os containeres necessários para execução dos testes de aceitação, que por sua vez, agora, pode ser feita pelo comando:

```bash
docker-compose exec acceptance /bin/sh -c 'npm test'
```
