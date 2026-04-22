import type { McpClientConfig, McpSseMessage } from "../types/interface";
import { BaseTransportService } from "./interface";

export class SseService extends BaseTransportService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async request<T>(
    method: string,
    params: object = {},
    onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<EventSource> {
    if (!onMessage) {
      throw new Error("SSE requires onMessage callback.");
    }

    const query = encodeURIComponent(
      JSON.stringify(this.buildBody(method, params))
    );
    const source = new EventSource(`${this.url}?rpc=${query}`);

    source.onmessage = (event) => {
      onMessage({
        event: "message",
        data: JSON.parse(event.data),
      });
    };

    return source;
  }
}
