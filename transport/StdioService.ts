import { spawn } from "node:child_process";
import type {
  JsonRpcResponse,
  McpClientConfig,
  McpSseMessage,
} from "../types/interface";
import { BaseTransportService } from "./interface";

const MCP_PROTOCOL_VERSION = "2025-11-25";

type JsonRpcMessage = {
  jsonrpc: "2.0";
  id?: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

export class StdioService extends BaseTransportService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async request<T>(
    method: string,
    params: object = {},
    onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<T | EventSource> {
    if (onMessage) {
      throw new Error("STDIO transport does not support SSE callbacks.");
    }

    const initializeMessage = this.buildBody("initialize", {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: {
        name: "mcp-cli",
        version: "1.0.0",
      },
    });

    const requestMessage = this.buildBody(method, params);
    const output = await this.executeCommand([
      initializeMessage,
      {
        jsonrpc: "2.0",
        method: "notifications/initialized",
        params: {},
      },
      requestMessage,
    ]);

    return this.extractResponse<T>(output, String(requestMessage.id));
  }

  private async executeCommand(messages: Array<Record<string, unknown>>) {
    const payload = messages
      .map((message) => `'${this.escapeShell(JSON.stringify(message))}'`)
      .join(" ");

    const shellCommand = `printf '%s\\n' ${payload} | ${this.url}`;

    const child = spawn("bash", ["-lc", shellCommand], {
      stdio: ["ignore", "pipe", "pipe"],
      cwd: process.cwd(),
      env: process.env as NodeJS.ProcessEnv,
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

    const exitCode = await new Promise<number>((resolve, reject) => {
      child.on("error", reject);
      child.on("close", (code) => resolve(code ?? 1));
    });

    const stdout = Buffer.concat(stdoutChunks).toString("utf8");
    const stderr = Buffer.concat(stderrChunks).toString("utf8");

    if (stderr.trim()) {
      // process.stderr.write(stderr);
    }

    if (exitCode !== 0 && !stdout.trim()) {
      throw new Error(stderr.trim() || `STDIO command failed with code ${exitCode}`);
    }

    return stdout;
  }

  private extractResponse<T>(output: string, requestId: string): T {
    const lines = output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      let parsed: JsonRpcMessage;

      try {
        parsed = JSON.parse(line) as JsonRpcMessage;
      } catch {
        continue;
      }

      if (String(parsed.id) !== requestId) {
        continue;
      }

      if (parsed.error) {
        throw new Error(parsed.error.message);
      }

      const response = parsed as JsonRpcResponse<T>;
      if ("result" in response) {
        return response.result;
      }
    }

    throw new Error("No JSON-RPC response found for STDIO request.");
  }

  private escapeShell(value: string) {
    return value.replace(/'/g, `'\\''`);
  }
}
