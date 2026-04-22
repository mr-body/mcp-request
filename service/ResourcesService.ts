import { BaseMcpService } from "../core/BaseMcpService";
import type {
  McpClientConfig,
  McpOptionalResult,
  McpResourcesResponse,
} from "../types/interface";

export class ResourcesService extends BaseMcpService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async list(): Promise<McpResourcesResponse> {
    return this.request("resources/list") as Promise<McpResourcesResponse>;
  }

  async listOptional(): Promise<McpOptionalResult<McpResourcesResponse>> {
    return this.optionalRequest("resources/list", { resources: [] });
  }
}
