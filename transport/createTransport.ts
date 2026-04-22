import type { McpClientConfig } from "../types/interface";
import { HttpService } from "./HttpService";
import { SseService } from "./SseService";
import { StdioService } from "./StdioService";
import type { McpTransportService } from "./interface";
import { WebsocketService } from "./WebsocketService";

export function createTransport(config: McpClientConfig): McpTransportService {
  switch (config.transport ?? "http") {
    case "http":
      return new HttpService(config);
    case "sse":
      return new SseService(config);
    case "websocket":
      return new WebsocketService(config);
    case "stdio":
      return new StdioService(config);
    default:
      throw new Error("Unsupported transport.");
  }
}
