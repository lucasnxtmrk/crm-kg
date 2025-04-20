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
    id: "blaze",
    nome: "Blaze",
    imagem: "/images/plataformas/blaze.png", // opcional
  },
  {
    id: "betano",
    nome: "Betano",
    imagem: "/images/plataformas/betano.png",
  },
  {
    id: "stake",
    nome: "Stake",
    imagem: "/images/plataformas/stake.png",
  },
  {
    id: "sportingbet",
    nome: "Sportingbet",
    imagem: "/images/plataformas/sportingbet.png",
  },
];

export type Plataforma = (typeof plataformas)[number];
