import { BaseMcpService } from "../core/BaseMcpService";
import type {
  McpClientConfig,
  McpExecPromptResponse,
  McpOptionalResult,
  McpPromptsResponse,
  McpSseMessage,
} from "../types/interface";

export class PromptsService extends BaseMcpService {
  constructor(config: McpClientConfig) {
    super(config);
  }

  async list(): Promise<McpPromptsResponse> {
    return this.request("prompts/list") as Promise<McpPromptsResponse>;
  }

  async listOptional(): Promise<McpOptionalResult<McpPromptsResponse>> {
    return this.optionalRequest("prompts/list", { prompts: [] });
  }

  async get(
    name: string,
    params: Record<string, any> = {}
  ): Promise<McpExecPromptResponse> {
    return this.request("prompts/get", {
      name,
      arguments: params,
    }) as Promise<McpExecPromptResponse>;
  }

  stream(
    name: string,
    params: Record<string, any>,
    onMessage: (event: McpSseMessage<unknown>) => void
  ): EventSource {
    return this.request(
      "prompts/get",
      {
        name,
        arguments: params,
      },
      onMessage
    ) as EventSource;
  }
}
