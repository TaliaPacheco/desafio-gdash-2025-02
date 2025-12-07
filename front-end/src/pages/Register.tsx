import { useState } from "react"; 
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "react-toastify";

export function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e:any) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email e senha são obrigatórios.");
      return;
    }

    try {
      await register(email, password);
      navigate("/") ;
      
    } catch (err) {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
    }

  function handleCancel(){
        navigate("/");
    }

  return (
    <form onSubmit={handleSubmit} className="w-full min-h-screen flex items-center justify-center bg-[#0D1117] px-4">
      <Card className="w-full max-w-md bg-[#161B22] border-none">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-[#1F6FEB]/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#1F6FEB]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 5c2.485 0 4.5 2.015 4.5 4.5S14.485 14 12 14s-4.5-2.015-4.5-4.5S9.515 5 12 5z" />
                <path d="M19 20v-1c0-2.761-2.686-5-6-5s-6 2.239-6 5v1" />
              </svg>
            </div>
          </div>

          <CardTitle className="text-2xl font-semibold text-white">
           Criar uma conta
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Insira seus dados.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-gray-300">Email </Label>
            <Input
              placeholder="Digite seu email"
              className="bg-[#0D1117] border-[#30363D] text-gray-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-gray-300">Senha</Label>
            <div className="relative">
              <Input
                type={showPassword? "text" : "password"}
                placeholder="Crie uma senha"
                className="bg-[#0D1117] border-[#30363D] text-gray-200 pr-10 mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-3 top-2 text-gray-500 cursor-pointer " 
                onClick={() => setShowPassword(!showPassword)}>

                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>

              </span>
            </div>

          </div>

          <Button 
            type="submit"
            className="w-full bg-[#1F6FEB] hover:bg-[#1A5FD6] text-white"
            >
            criar
          </Button>

            <Button  
            type="button" 
            className="w-full bg-none hover:bg-[#1A5FD6] text-white border border-[#1A5FD6]"
            onClick={handleCancel}
            >
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}