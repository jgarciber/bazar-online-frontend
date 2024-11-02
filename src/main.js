// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
import ProductsPage from './pages/ProductsPage.vue'
import CategoriesPage from './pages/CategoriesPage.vue' 
import SalesPage from './pages/SalesPage.vue'
import Login from './pages/Login.vue'
import Logout from './pages/Logout.vue'

const routes = [
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
        path: '/login',
        component : Login
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

// createApp(App).mount('#app');
