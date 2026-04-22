import type { JsonRpcResponse, McpClientConfig } from "../types/interface";
import { BaseTransportService } from "./interface";

export class HttpService extends BaseTransportService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  private parseSsePayload<T>(body: string): JsonRpcResponse<T> {
    const lines = body.split(/\r?\n/);
    const dataLines = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .filter(Boolean);

    if (dataLines.length === 0) {
      throw new Error(`Resposta SSE sem payload JSON: ${body.slice(0, 200)}`);
    }

    return JSON.parse(dataLines.join("\n")) as JsonRpcResponse<T>;
  }

  async request<T>(method: string, params: object = {}): Promise<T> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(this.buildBody(method, params)),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const rawBody = await response.text();

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${rawBody.slice(0, 300) || response.statusText}`
      );
    }

    let data: JsonRpcResponse<T>;

    if (contentType.includes("text/event-stream")) {
      data = this.parseSsePayload<T>(rawBody);
    } else {
      try {
        data = JSON.parse(rawBody) as JsonRpcResponse<T>;
      } catch {
        throw new Error(
          `Falha ao interpretar resposta JSON: ${rawBody.slice(0, 300)}`
        );
      }
    }

    if ("error" in data) {
      throw new Error(data.error.message);
    }

    return data.result;
  }
}
