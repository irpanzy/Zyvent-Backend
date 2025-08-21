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
      User: {
        id: "string",
        fullName: "string",
        username: "string",
        phoneNumber: "string",
        email: "string",
        role: "string",
      },
      RegisterInput: {
        fullName: "string",
        username: "string",
        phoneNumber: "string",
        email: "string",
        password: "string",
        confirmPassword: "string",
      },
      LoginInput: {
        identifier: "string",
        password: "string",
      },
      RegisterResponse: {
        message: "Registration successful",
        user: { $ref: "#/components/schemas/User" },
      },
      LoginResponse: {
        message: "Login successful",
        token: "string.jwt.token",
      },
      ProfileResponse: {
        message: "Profile retrieved successfully",
        user: { $ref: "#/components/schemas/User" },
      },
      ActivationResponse: {
        message: "Account activated successfully! You can now login.",
        user: { $ref: "#/components/schemas/User" },
      },
    },
  },
};

swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFiles, doc);
