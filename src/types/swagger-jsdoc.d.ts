declare module 'swagger-jsdoc' {
  interface SwaggerDefinition {
    openapi?: string;
    info?: {
      title?: string;
      version?: string;
      description?: string;
      contact?: {
        name?: string;
        email?: string;
        url?: string;
      };
    };
    servers?: Array<{
      url: string;
      description?: string;
    }>;
    paths?: Record<string, unknown>;
    components?: {
      schemas?: Record<string, unknown>;
      securitySchemes?: Record<string, unknown>;
    };
    tags?: Array<{
      name: string;
      description?: string;
    }>;
  }

  interface Options {
    definition: SwaggerDefinition;
    apis: string[];
  }

  function swaggerJsdoc(options: Options): Record<string, unknown>;

  export = swaggerJsdoc;
}
