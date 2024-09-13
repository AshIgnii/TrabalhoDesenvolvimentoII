const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
  info: {
    version: "1.0.0",
    title: "API de Gestão Escolar",
    description: "",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components: {
    schemas: {
      user: {
        id: 1,
        name: "Andre Faria Ruaro",
        $email: "andre.ruaro@unesc.net",
        user: "andre.ruaro",
        pwd: "7a6cc1282c5f6ec0235acd2bfa780145aaskem5n",
        level: "admin",
        status: "on",
      },
      appointment: {
        id: 1,
        specialty: "Fisioterapeuta",
        comments: "Realizar sessão",
        $date: "2023-08-15 16:00:00",
        student: "Bingo Heeler",
        professional: "Winton Blake",
      },
      teacher: {
        id: 1,
        name: "Judite Heeler",
        school_discipline: "Artes, Português",
        $contact: "j.heeler@gmail",
        phone_number: "48 9696 5858",
        status: "on",
      },
      student: {
        id: 1,
        name: "Bingo Heeler",
        age: 6,
        parents: "Bandit Heeler e Chilli Heeler",
        phone_number: "48 9696 5858",
        special_needs: "Síndrome de Down",
        status: "on",
      },
      professional: {
        id: 1,
        name: "Winton Blake",
        specialty: "Fisioterapeuta",
        $contact: "w.blake@gmail",
        phone_number: "48 9696 5858",
        status: "on",
      },
      event: {
        id: 1,
        description: "Palestra bem viver com saúde",
        comments: "Profissionais de saúde da Unesc",
        $date: "2023-08-15 16:00:00",
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index");
});
