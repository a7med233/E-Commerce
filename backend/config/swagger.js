import swaggerJSDoc from "swagger-jsdoc";

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
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // adjust based on where your routes or docs are
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
