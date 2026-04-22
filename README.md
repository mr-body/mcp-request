# MCP Request

CLI em Bun para consultar servidores MCP, listar recursos e executar tools/prompts.

## Instalação

```bash
bun install
```

## Uso básico

Listar informações de um ou mais servidores:

```bash
bun run index.ts https://shop.maiomb.com/mcp http
```


Também aceita lista separada por vírgula:

```bash
bun run index.ts https://shop.maiomb.com/mcp,https://umooja.vercel.app/mcp htt
```

## Comandos

Listar prompts:

```bash
bun run index.ts list-prompts https://example.com/mcp
```

Executar uma tool:

```bash
bun run index.ts call-tool get_organizations '{}' https://shop.maiomb.com/mcp
```

Executar um prompt:

```bash
bun run index.ts exec-prompt my_prompt '{"city":"Luanda"}' https://example.com/mcp
```

## CLI global

Para expor o binário:

```bash
bun link
mcp-req
```

Exemplos:

```bash
mcp-req https://shop.maiomb.com/mcp https://umooja.vercel.app/mcp
mcp-req call-tool get_organizations '{}' https://shop.maiomb.com/mcp
```

## Observações

- O binário exposto no `package.json` é `mcp-req`.
- O projeto usa Bun como runtime principal.
