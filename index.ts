#!/usr/bin/env bun
import { McpRequest } from "./core/RequestMCP";
import type { McpTransport } from "./types/interface";

const VALID_TRANSPORTS: McpTransport[] = ["http", "sse", "websocket", "stdio"];

function isValidTransport(value: string): value is McpTransport {
  return VALID_TRANSPORTS.includes(value as McpTransport);
}

function printUsage() {
  console.log("Uso: bun run index.ts <url or command> <transport>");
  console.log("Transportes aceitos: http, sse, websocket, stdio");
}

async function main() {
  const [, , url, transportArg] = process.argv;

  if (!url || !transportArg) {
    printUsage();
    process.exit(1);
  }

  if (!isValidTransport(transportArg)) {
    console.error(`Transport invalido: ${transportArg}`);
    printUsage();
    process.exit(1);
  }

  const conn = new McpRequest(url, transportArg);
  const catalog = await conn.getCatalog();

  console.log("Tools:");
  catalog.tools.forEach((tool) => {
    console.log(`${tool.name} - ${tool.description ?? "sem descricao"}`);
  });

  console.log("\nResources:");
  if (!catalog.supportsResources || catalog.resources.length === 0) {
    console.log("sem resources");
  } else {
    catalog.resources.forEach((resource) => {
      console.log(`- ${resource.uri}`);
    });
  }

  console.log("\nPrompts:");
  if (!catalog.supportsPrompts || catalog.prompts.length === 0) {
    console.log("sem prompts");
  } else {
    catalog.prompts.forEach((prompt) => {
      console.log(`- ${prompt.name}`);
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
