"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ColourfulText from "@/components/ui/colourful-text";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, Shield, Target, Users } from "lucide-react";
import { motion } from "motion/react";
import RegisterForm from "./components/RegisterForm";
import { InfiniteMovingCards } from "./components/ui/infinite-moving-cards";
import { getLatestNews } from "./services/newsService";

export default function HomePage() {
  const { data: newsData } = useQuery({
    queryKey: ["latestNews"],
    queryFn: getLatestNews,
  });
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
        <motion.img
          src="https://images.unsplash.com/photo-1672851612972-651dd2bb6363?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
  "
          className="h-full w-full object-cover absolute [mask-image:radial-gradient(circle,transparent,black_60%)] pointer-events-none opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-2xl md:text-3xl lg:text-5xl font-bold text-center text-white relative z-2 font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Las últimas <ColourfulText text="noticias" /> <br />
            de Colombia para ti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="
  relative z-10 mx-auto max-w-xl py-4 text-center text-xl font-normal text-neutral-300 dark:text-neutral-400
  "
          >
            Recibe noticias personalizadas según tu orientación política.
            Mantente informado con contenido relevante sobre Colombia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Modal>
              <ModalTrigger>
                <Button
                  size="lg"
                  className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Registrarme Gratis
                </Button>
              </ModalTrigger>
              <ModalBody>
                <ModalContent>
                  <RegisterForm />
                </ModalContent>
              </ModalBody>
            </Modal>
          </motion.div>
          {newsData?.news && newsData.news.length > 0 && (
            <div className=" rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
              <InfiniteMovingCards
                items={newsData?.news || []}
                direction="right"
                speed="normal"
              />
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir <ColourfulText text="Noticias Colombia" />?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Una plataforma diseñada para mantenerte informado de manera
              inteligente y personalizada
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Noticias Personalizadas",
                description:
                  "Contenido adaptado a tu orientación política y temas de interés",
              },
              {
                icon: Newspaper,
                title: "Fuentes Confiables",
                description:
                  "Solo noticias verificadas de medios reconocidos y periodistas acreditados",
              },
              {
                icon: Users,
                title: "Diversidad de Perspectivas",
                description:
                  "Accede a diferentes puntos de vista para formar tu propia opinión",
              },
              {
                icon: Shield,
                title: "Sin Sesgos Extremos",
                description:
                  "Algoritmo diseñado para evitar cámaras de eco y desinformación",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-muted-foreground">
              En solo 2 pasos estarás recibiendo noticias personalizadas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                step: "1",
                title: "Regístrate",
                description:
                  "Ingresa tu email válido y crea tu cuenta",
              },
              {
                step: "2",
                title: "Recibe noticias",
                description:
                  "¡Listo! Empezarás a recibir noticias personalizadas automáticamente",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mantente informado sobre Colombia
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a miles de colombianos que ya reciben noticias
              personalizadas. Es gratis y puedes cancelar cuando quieras.
            </p>

            <Modal>
              <ModalTrigger>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  Comenzar Ahora
                </Button>
              </ModalTrigger>
              <ModalBody>
                <ModalContent>
                  <RegisterForm />
                </ModalContent>
              </ModalBody>
            </Modal>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Noticias Colombia
              </h3>
              <p className="text-muted-foreground mb-4">
                Tu fuente confiable de noticias personalizadas sobre Colombia.
                Información verificada, diversa y sin sesgos extremos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Enlaces</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Soporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Reportar Problema
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Noticias Colombia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
