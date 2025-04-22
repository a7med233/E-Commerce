import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Price Comparison API",
      version: "1.0.0",
      description: "Documentation for your backend API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            price: {
              type: "number",
            },
            category: {
              type: "string",
            },
            image: {
              type: "string",
            },
            stock: {
              type: "number",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
