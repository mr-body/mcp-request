import { BaseMcpService } from "../core/BaseMcpService";
import type {
  McpClientConfig,
  McpToolCallResponse,
  McpToolsResponse,
} from "../types/interface";

export class ToolsService extends BaseMcpService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async list(): Promise<McpToolsResponse> {
    return this.request("tools/list") as Promise<McpToolsResponse>;
  }

  async call(name: string, params: Record<string, any> = {}): Promise<McpToolCallResponse> {
    return this.request("tools/call", {
      name,
      arguments: params,
    }) as Promise<McpToolCallResponse>;
  }
}
