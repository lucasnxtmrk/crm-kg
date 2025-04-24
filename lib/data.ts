// user data 
const users = [
  {
    name: "Lucas Oliveira ",
    email: "dashcode@codeshaper.net",
    password: "password",
    image: '/images/users/user-1.jpg',
  },
  
]

export type User = (typeof users)[number]

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email)
}



// 🗂️ Plataformas disponíveis no sistema
export const plataformas = [
  {
    id: "genio777",
    nome: "Gênio777",
    imagem: "/images/plataformas/genio777.png", // opcional
  },
  {
    id: "pgcoelho",
    nome: "PG-COELHO",
    imagem: "/images/plataformas/pgcoelho.png",
  },
  {
    id: "piupiu",
    nome: "Piu-piu PQ",
    imagem: "/images/plataformas/piupiu.png",
  },
  {
    id: "sergipeboi",
    nome: "Sergipe Boi",
    imagem: "/images/plataformas/sergipeboi.png",
  },
];

export type Plataforma = (typeof plataformas)[number];
