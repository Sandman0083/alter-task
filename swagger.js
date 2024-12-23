const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Custom URL Shortener API",
      version: "1.0.0",
      description: "API documentation for the Custom URL Shortener project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./router/*.js"], // Specify the path to your route files
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpecs };
