<template>
    <div class="container-fluid">
        <div class="row">
            <h5>Users</h5>
        </div>
        <div class="row mb-2" v-if="$server.loggedUserHasAccess($server.Components.USERS, $server.Actions.EDIT)">
            <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editUserModal"
                @click="onCreate()">+ New</button>
        </div>
        <div class="row">
            <table class="table table-bordered">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Login</th>
                    <th>Role</th>
                    <th>Position</th>
                    <th>CreatedAt</th>
                    <th>UpdatedAt</th>
                    <th>LastLogindAt</th>
                    <th></th>
                </tr>
                <tr v-for="(user, index) of users">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.login }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.position }}</td>
                    <td>{{ $unixtimeToDate(user.createdAt) }}</td>
                    <td>{{ $unixtimeToDate(user.updatedAt) }}</td>
                    <td>{{ $unixtimeToDate(user.lastLoginAt) }}</td>
                    <td v-if="$server.loggedUserHasAccess($server.Components.USERS, $server.Actions.EDIT)">
                        <a href="#" @click="removeUser(user.id, index)"><i class="bi bi-trash"></i></a>
                        <a class="ml-2" data-toggle="modal" data-target="#editUserModal" href="#" @click="onEdit(user)"><i
                                class="bi bi-pencil"></i></a>
                        <a class="ml-2" :href="`/user/tests?userId=${user.id}`">Tests</a>
                    </td>
                </tr>
            </table>
        </div>

        <modal-component ref="userForm" :title="`Edit user #${userModel.id??''}`" :id="'editUserModal'">
            <form class="form-group" @submit.prevent="saveUser()">
                <input type="hidden" class="form-control" v-model="userModel.id">
                <div class="form-group">
                    <label>Name</label>
                    <input required type="text" class="form-control" v-model="userModel.name" placeholder="Name">
                </div>
                <div class="form-group">
                    <label>Login</label>
                    <input type="text" class="form-control" v-model="userModel.login" placeholder="Login">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" v-model="userModel.password" placeholder="Password">
                </div>
                <div class="form-group">
                    <label>RePassword</label>
                    <input type="password" class="form-control" v-model="userModel.repassword" placeholder="RePassword">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select v-model="userModel.roleId" class="form-control">
                        <option v-for="role of roles" :value="role.id" :active="role.id==userModel.roleId">{{role.name}}
                        </option>
                    </select>
                    <label>Position</label>
                    <select v-model="userModel.positionId" class="form-control">
                        <option v-for="position of positions" :value="position.id"
                            :active="position.id==userModel.positionId">{{position.title}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <span class="text-danger">{{ userModelErrors }}</span>
                </div>
                <button class="btn btn-sm btn-primary">Save</button>
            </form>
        </modal-component>
    </div>
</template>

<script lang="ts">
import ModalComponent from '../components/ModalComponent.vue';
import type { UserDto, RoleDto, PositionDto, UserUpdateDto } from '@/server'

export default {
    components: { ModalComponent },
    data() {
        return {
            users: [] as UserDto[],
            roles: [] as RoleDto[],
            positions: [] as PositionDto[],
            userModel: {} as UserUpdateDto & { id?: number },
            userModelErrors: '',
            saveUser: () => { }
        };
    },

    mounted() {
        this.loadUsers();
    },

    methods: {

        loadRoles() {
            
            this.$server.http
                .get("/roles")
                .then((response) => (this.roles = response.data));
        },

        loadPositions() {
            this.$server.http
                .get("/positions")
                .then((response) => (this.positions = response.data));
        },

        loadUsers() {
            
            this.$server.http
                .get("/users")
                .then((response) => (this.users = response.data));
        },

        removeUser(id: number, index: number) {
            this.$server.http
                .delete(`/user/${id}`)
                .then((response) => {
                    if (response.status == 200)
                        this.users.splice(index, 1);
                })
        },

        async createUser() {
            try {
                let response = await this.$server.http.post('/user', this.userModel);
                this.userModel.id = response.data.id;
                this.loadUsers();
                this.onSave();
            } catch (e: any) {
                this.userModelErrors = e.response.data.message;
            }
        },

        async updateUser() {
            try {
                let id = this.userModel.id;
                await this.$server.http.put(`/user/${id}`, this.userModel);
                this.loadUsers();
                this.onSave();
            } catch (e: any) {
                this.userModelErrors = e.response.data.message;
            }
        },

        onEdit(user: UserDto) {
            this.loadRoles();
            this.loadPositions();
            this.userModel = {
                id: user.id,
                name: user.name,
                login: user.login,
                password: '',
                repassword: '',
                roleId: user.roleId,
                positionId: user.positionId,
            };
            this.saveUser = this.updateUser;
        },

        onCreate() {
            this.loadRoles();
            this.loadPositions();
            this.userModel = {
                login: '',
                name: '',
                password: '',
                positionId: 0,
                repassword: '',
                roleId: 0
            }
            this.saveUser = this.createUser;
        },

        onSave() {
            (this.$refs.userForm as any).close();
        }
    }
};
</script>