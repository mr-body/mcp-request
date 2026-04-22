import type {
  McpClientConfig,
  McpOptionalResult,
  McpSseMessage,
} from "../types/interface";
import { createTransport } from "../transport/createTransport";
import type { McpTransportService } from "../transport/interface";

export abstract class BaseMcpService {
  protected readonly transportService: McpTransportService;

  protected constructor(config: McpClientConfig) {
    this.transportService = createTransport(config);
  }

  protected getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  protected isMethodNotFoundError(error: unknown): boolean {
    return this.getErrorMessage(error).includes("Method not found");
  }

  protected async request<T>(
    method: string,
    params: object = {},
    onMessage?: (event: McpSseMessage<T>) => void
  ): Promise<T | EventSource> {
    return this.transportService.request(method, params, onMessage);
  }

  protected async optionalRequest<T>(
    method: string,
    emptyValue: T,
    params: object = {}
  ): Promise<McpOptionalResult<T>> {
    try {
      const data = (await this.request(method, params)) as T;
      return {
        supported: true,
        data,
      };
    } catch (error) {
      if (this.isMethodNotFoundError(error)) {
        return {
          supported: false,
          data: emptyValue,
        };
      }

      throw error;
    }
  }
}
