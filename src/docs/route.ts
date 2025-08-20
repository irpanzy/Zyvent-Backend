import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";

export default (app: Express) => {
  // Setup Swagger dengan dokumentasi Zyvent API
  const options = {
    explorer: true,
    customSiteTitle: "Zyvent API Documentation",
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .scheme-container { background: #fff; box-shadow: none; }
    `,
    swaggerOptions: {
      // Gunakan data langsung dari swaggerOutput, bukan URL eksternal
      spec: swaggerOutput,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
    }
  };

  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerOutput, options));
  
  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(swaggerOutput);
  });
};
