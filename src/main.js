// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from 'vue-router'
import { createWebHistory } from 'vue-router'
import ProductsPage from './pages/ProductsPage.vue'
import SalesPage from './pages/SalesPage.vue'

const routes = [
    {
        path: '/products',
        component : ProductsPage
    },
    {
        path: '/sales',
        component: SalesPage
    }
]

createApp(App)
.use(createRouter({
    history: createWebHistory(),
    routes
}))
.mount('#app');

// createApp(App).mount('#app');
