"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "./ui/animated-modal";

const formSchema = z.object({
  email: z.email({ message: "El correo no es valido" }),
  name: z
    .string()
    .min(2, { message: "El nombre es muy corto" })
    .max(50, { message: "El nombre es muy largo" }),
  politicOrientation: z.enum(
    ["Izquierda", "Derecha", "Centro", "Centroderecha", "Centroizquierda"],
    {
      message: "Selecciona una opción válida",
    }
  ),
  nickname: z
    .string()
    .min(2, { message: "El nickname es muy corto" })
    .max(50, { message: "El nickname es muy largo" }),
  lastName: z
    .string()
    .min(2, { message: "El apellido es muy corto" })
    .max(50, { message: "El apellido es muy largo" }),
});

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      lastName: "",
      nickname: "",
      politicOrientation: "Izquierda",
    },
    mode: "onChange",
  });

  const modal = useModal();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      console.log(data);
      const response = await fetch("http://localhost:3000/api/agora/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error al registrar el usuario");
        toast.error("Error al registrar el usuario", {
          description: data.message || "Usuario ya existe o hubo un error",
        });
      } else {
        modal.setOpen(false);
        toast.success("Registro exitoso", {
          description: "Usuario registrado correctamente",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Regístrate aquí</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage className="place-self-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage className="place-self-start" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Nickname</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage className="place-self-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage className="place-self-start" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="politicOrientation"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Orientación Política</FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option className="bg-background" value="Izquierda">
                    Izquierda
                  </option>
                  <option className="bg-background" value="Derecha">
                    Derecha
                  </option>
                  <option className="bg-background" value="Centro">
                    Centro
                  </option>
                  <option className="bg-background" value="Centroizquierda">
                    Centroizquierda
                  </option>
                  <option className="bg-background" value="Centroderecha">
                    Centroderecha
                  </option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registrando...
            </>
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
