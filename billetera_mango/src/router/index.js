import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/pages/Login.vue";
import RegisterView from "@/pages/Register.vue";
import HomeView from "@/pages/Home.vue";
import CobrosView from "@/pages/Cobros.vue";
import PagoServiciosView from "@/pages/PagoServicios.vue";
import TarjetasView from "@/pages/Tarjetas.vue";
import EnviarDineroView from "@/pages/EnviarDinero.vue";
import IngresarDineroView from "@/pages/IngresarDinero.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/home", // Agrega la ruta para Home
    name: "Home",
    component: HomeView,
  },
  { path: "/cobros", name: "Cobros", component: CobrosView },
  {
    path: "/pago-servicios",
    name: "PagoServicios",
    component: PagoServiciosView,
  },
  {
    path: "/Tarjetas",
    name: "Tarjetas",
    component: TarjetasView,
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/enviar-dinero",
    name: "EnviarDinero",
    component: EnviarDineroView,
  },
  {
    path: "/ingresar-dinero",
    name: "IngresarDinero",
    component: IngresarDineroView,
  },


];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
