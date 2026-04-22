import type { McpClientConfig, McpSseMessage } from "../types/interface";
import { BaseTransportService } from "./interface";

export class WebsocketService extends BaseTransportService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async request<T>(
    _method: string,
    _params: object = {},
    _onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<T | EventSource> {
    throw new Error("WebSocket transport not implemented yet.");
  }
}
