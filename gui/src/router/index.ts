import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Main from "../views/Main.vue"
import Search from "../views/Search.vue"
import Edition from "../views/Edition.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },  
  {
    path: "/",
    name: "Main",
    component: Main
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/edit", 
    name: "Editition", 
    component: Edition
  }
  
]

const router = new VueRouter({
  routes
})

export default router
