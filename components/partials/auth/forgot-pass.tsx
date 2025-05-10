"use client";

import React, { useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Inputs = {
  email: string;
};

const ForgotPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    startTransition(async () => {
      const res = await fetch("/api/usuarios/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) {
        toast.success("Se o e-mail existir, enviamos as instruções.");
      } else {
        toast.error("Erro ao solicitar redefinição de senha.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          placeholder="seu@email.com"
          {...register("email", { required: "E-mail é obrigatório" })}
          className="h-[48px] text-sm text-default-900"
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar instruções"}
      </Button>
    </form>
  );
};

export default ForgotPass;
