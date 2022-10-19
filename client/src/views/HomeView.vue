<script lang="ts">

import type { LoggedUserDto } from '@/server';

export default {
    data() {
        return {
            username: '',
            password: '',
            errors: '',
            loggedUser: {} as LoggedUserDto
        }
    },
    mounted() {
        this.setLoggedUser();
    },
    
    methods: {
        async login() {
            try {
                await this.$server.login(this.username, this.password);
                this.$router.go(0);
            } catch (e: any) {
                this.$notify({ title: e.message, type: 'warn' })
                this.errors = "Invalid login or password";
            }
        },
        logout() {
            this.$server.logout();
            this.$router.go(0)
        },
        setLoggedUser() {
            this.loggedUser = this.$server.getLoggedUser();
        }
    }

}

</script>

<template>
    <notifications />
    <div class="container">
        <div v-if="loggedUser.userId">
            <div class="row">
                <h3>Hi! {{ loggedUser.name }} ({{ loggedUser.login }} #{{ loggedUser.userId }})</h3>
            </div>
            <div class="row">
                <button class="btn btn-sm btn-warning" @click="logout">Logout</button>
            </div>
           
        </div>
        <form v-else @submit.prevent="login">
            <div class="form-rom">
                <div class="col-md-3">
                    <div clsss="form-group">
                        <label>Login:</label>
                        <input required v-model="username" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label>Password:</label>
                        <input required type="password" v-model="password" class="form-control" />
                    </div>
                    <button class="btn btn-sm btn-primary">Login</button>
                    <span class="text-danger ml-2">{{ errors }}</span>

                </div>
            </div>
        </form>

    </div>
</template>
