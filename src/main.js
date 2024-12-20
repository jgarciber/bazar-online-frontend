// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
import WelcomePage from './pages/WelcomePage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import CategoriesPage from './pages/CategoriesPage.vue' 
import SalesPage from './pages/SalesPage.vue'
import UsersPage from './pages/UsersPage.vue'
import OrdersPage from './pages/OrdersPage.vue'
import Login from './pages/Login.vue'
import Logout from './pages/Logout.vue'
import SignUp from './pages/SignUp.vue'

const routes = [
    {
        path: '/',
        redirect: '/welcome'
    },
    {
        path: '/welcome',
        component : WelcomePage
    },
    {
        path: '/products',
        component : ProductsPage
    },
    {
        path: '/categories',
        component : CategoriesPage
    },
    {
        path: '/sales',
        component: SalesPage
    },
    {
        path: '/users',
        component : UsersPage
    },
    {
        path: '/orders',
        component : OrdersPage
    },
    {
        path: '/login',
        component : Login
    },
    {
        path: '/signup',
        component : SignUp
    },
    {
        path: '/logout',
        component : Logout
    }
]

createApp(App)
.use(createRouter({
    history: createWebHistory(),
    routes
}))
.mount('#app');