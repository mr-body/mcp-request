export type McpTransport =
    | "http"
    | "sse"
    | "websocket"
    | "stdio";

export interface JsonRpcSuccess<T> {
    jsonrpc: "2.0";
    id: string | number;
    result: T;
}


export interface JsonRpcError {
    jsonrpc: "2.0";
    id: string | number | null;
    error: {
        code: number;
        message: string;
        data?: unknown;
    };
}

export type JsonRpcResponse<T> = JsonRpcSuccess<T> | JsonRpcError;

export interface McpClientConfig {
    url: string;
    transport?: McpTransport;
    apiKey?: string;
}

export interface McpOptionalResult<T> {
    supported: boolean;
    data: T;
}

export interface McpTool {
    name: string;
    description?: string;
    inputSchema?: Record<string, any>;
}

export interface McpToolsResponse {
    tools: McpTool[];
}

export interface McpToolCallResponse {
    content?: Array<{
        type: string;
        text?: string;
        [key: string]: unknown;
    }>;
    structuredContent?: Record<string, unknown>;
    isError?: boolean;
    [key: string]: unknown;
}

export interface McpResource {
    uri: string;
    name?: string;
    description?: string;
    mimeType?: string;
}

export interface McpResourcesResponse {
    resources: McpResource[];
}

export interface McpPromptArgument {
    name: string;
    description?: string;
    required?: boolean;
}

export interface McpPrompt {
    name: string;
    description?: string;
    arguments?: McpPromptArgument[];
}

export interface McpPromptsResponse {
    prompts: McpPrompt[];
}

export interface McpServerCatalog {
    tools: McpTool[];
    resources: McpResource[];
    prompts: McpPrompt[];
    supportsResources: boolean;
    supportsPrompts: boolean;
}

export interface McpPromptMessage {
    role: "user" | "assistant" | "system";
    content: {
        type: string;
        text?: string;
    };
}

export interface McpExecPromptResponse {
    description?: string;
    messages: McpPromptMessage[];
}

export interface McpSseMessage<T> {
    event: string;
    data: T;
}
