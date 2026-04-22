import type { McpClientConfig, McpSseMessage } from "../types/interface";

export interface McpTransportService {
  request<T>(
    method: string,
    params?: object,
    onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<T | EventSource>;
}

export interface McpRequestPayload {
  jsonrpc: "2.0";
  id: string;
  method: string;
  params: object;
}

export abstract class BaseTransportService implements McpTransportService {
  protected readonly url: string;
  protected readonly apiKey?: string;

  protected constructor(config: McpClientConfig) {
    this.url = config.url;
    this.apiKey = config.apiKey;
  }

  protected headers(): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  protected buildBody(method: string, params: object = {}): McpRequestPayload {
    return {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params,
    };
  }

  abstract request<T>(
    method: string,
    params?: object,
    onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<T | EventSource>;
}
