import { CatalogService } from "../service/CatalogService";
import { PromptsService } from "../service/PromptsService";
import { ResourcesService } from "../service/ResourcesService";
import { ToolsService } from "../service/ToolsService";
import type {
  McpClientConfig,
  McpExecPromptResponse,
  McpPromptsResponse,
  McpResourcesResponse,
  McpServerCatalog,
  McpSseMessage,
  McpToolCallResponse,
  McpToolsResponse,
  McpTransport,
} from "../types/interface";

export class McpRequest {
  private readonly config: McpClientConfig;
  private readonly toolsService: ToolsService;
  private readonly resourcesService: ResourcesService;
  private readonly promptsService: PromptsService;
  private readonly catalogService: CatalogService;

  
  constructor(url: string, transport: McpTransport = "http", apiKey?: string) {
    this.config = { url, transport, apiKey };
    this.toolsService = new ToolsService(this.config);
    this.resourcesService = new ResourcesService(this.config);
    this.promptsService = new PromptsService(this.config);
    this.catalogService = new CatalogService(this.config);
  }

  getConfig(): McpClientConfig {
    return { ...this.config };
  }

  async listTools(): Promise<McpToolsResponse> {
    return this.toolsService.list();
  }

  async callTool(
    name: string,
    params: Record<string, any> = {}
  ): Promise<McpToolCallResponse> {
    return this.toolsService.call(name, params);
  }

  async listResources(): Promise<McpResourcesResponse> {
    return this.resourcesService.list();
  }

  async listResourcesSafe(): Promise<McpResourcesResponse> {
    const result = await this.resourcesService.listOptional();
    return result.data;
  }

  async listPrompts(): Promise<McpPromptsResponse> {
    return this.promptsService.list();
  }

  async listPromptsSafe(): Promise<McpPromptsResponse> {
    const result = await this.promptsService.listOptional();
    return result.data;
  }

  async getPrompt(
    name: string,
    params: Record<string, any> = {}
  ): Promise<McpExecPromptResponse> {
    return this.promptsService.get(name, params);
  }

  streamPrompt(
    name: string,
    params: Record<string, any>,
    onMessage: (event: McpSseMessage<unknown>) => void
  ): EventSource {
    return this.promptsService.stream(name, params, onMessage);
  }

  async getCatalog(): Promise<McpServerCatalog> {
    return this.catalogService.getCatalog();
  }
}
