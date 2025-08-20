import swaggerAutogen from "swagger-autogen";

const outputFile = "./src/docs/swagger-output.json";
const endpointsFiles = ["./src/routes/api.ts"];
const doc = {
  info: {
    title: "Zyvent API",
    description: "API documentation for Zyvent",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8000/api",
      description: "Development server",
    },
    {
      url: "https://zyvent-backend.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      Login: {
        identifier: "string",
        password: "string",
      },
    },
  },
};

swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFiles, doc);
