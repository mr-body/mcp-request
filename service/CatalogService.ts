import { BaseMcpService } from "../core/BaseMcpService";
import { PromptsService } from "./PromptsService";
import { ResourcesService } from "./ResourcesService";
import { ToolsService } from "./ToolsService";
import type { McpClientConfig, McpServerCatalog } from "../types/interface";

export class CatalogService extends BaseMcpService {
  private readonly toolsService: ToolsService;
  private readonly resourcesService: ResourcesService;
  private readonly promptsService: PromptsService;

  constructor(config: McpClientConfig) {
    super(config);
    this.toolsService = new ToolsService(config);
    this.resourcesService = new ResourcesService(config);
    this.promptsService = new PromptsService(config);
  }

  async getCatalog(): Promise<McpServerCatalog> {
    const [toolsResponse, resourcesResult, promptsResult] = await Promise.all([
      this.toolsService.list(),
      this.resourcesService.listOptional(),
      this.promptsService.listOptional(),
    ]);

    return {
      tools: toolsResponse.tools,
      resources: resourcesResult.data.resources,
      prompts: promptsResult.data.prompts,
      supportsResources: resourcesResult.supported,
      supportsPrompts: promptsResult.supported,
    };
  }
}
