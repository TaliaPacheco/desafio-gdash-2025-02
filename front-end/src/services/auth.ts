import { toast } from "react-toastify"

export async function login(email: string, password: string) {
  toast.info("Efetuando login...")
  const response = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("falha ao logar")
  }

  const data = await response.json();

  return data.access_token;
}

export async function register(email: string, password: string) {
  toast.info("Criando conta...")
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar conta")
  }

  const data = await response.json();
  toast.success("Conta criada com sucesso!");
  
  return data;
}