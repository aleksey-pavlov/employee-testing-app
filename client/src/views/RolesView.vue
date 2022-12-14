<template>
  <div class="container-fluid">
      <div class="row">
        <h5>Roles</h5>
      </div>
      <div class="row mb-2" v-if="$server.loggedUserHasAccess($server.Components.ROLES, $server.Actions.EDIT)">
        <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editRoleModal" @click="onCreate()">+ New</button>
      </div>
      <div class="row">
      <table class="table table-bordered">
          <tr v-for="(role, index) of roles">
              <td>{{ role.id }}</td>
              <td>{{ role.name }}</td>
              <td v-if="$server.loggedUserHasAccess($server.Components.ROLES, $server.Actions.EDIT)">
                <a href="#" @click="remove(role.id, index)"><i class="bi bi-trash"></i></a>
                <a class="ml-2" data-toggle="modal" data-target="#editRoleModal" href="#" @click="onEdit(role)"><i class="bi bi-pencil"></i></a>
              </td>
          </tr>
      </table>
      </div>

        <modal-component ref="roleForm" :title="`Edit role #${roleModel.id??''}`" :id="'editRoleModal'">
          <form @submit.prevent="saveRole">
                <input type="hidden" class="form-control" v-model="roleModel.id">
                <div class="form-group">
                    <label>Name</label>
                    <select class="form-control" v-model="roleModel.name">
                        <option v-for="role of rolesEnum" :value="role">{{ role }}</option>
                    </select>
                </div>
                <button class="btn btn-sm btn-primary">Save</button>
                <span class="text-danger ml-2">
                    {{ roleFormErrors }}
                </span>
          </form>
        </modal-component>
  </div>
  
</template>

<script lang="ts">
import ModalComponent from '../components/ModalComponent.vue';
import type { RoleDto } from '@/server';
import { RolesEnum } from '@/plugins/acl';

export default {
    components: { ModalComponent },
    data() {
        return {
            roles: [] as RoleDto[],
            roleModel: {} as RoleDto ,
            roleFormErrors: '',
            saveRole: () => { },
            rolesEnum: RolesEnum
        };
    },

    mounted() {
       this.loadRoles();
    },

    methods: {

        loadRoles() {
             this.$server.http
                .get("/roles")
                .then((response) => (this.roles = response.data));
        },

        remove(id: number, index: number) {
            this.$server.http
                .delete(`/role/${id}`)
                .then((response) => {
                    if (response.status == 200)
                        this.roles.splice(index, 1);
                })
        },

        async createRole() {
            try {
                let response = await this.$server.http.post('/role', this.roleModel);
                this.roleModel.id = response.data.id;
                this.roles.unshift(this.roleModel);
                this.onSave();
            } catch(e: any) {
                this.roleFormErrors = e.response.data.message;
            }
        },

        async updateRole() {
            try {
                let id = this.roleModel.id;
                await this.$server.http.put(`/role/${id}`, this.roleModel);
                this.onSave();
            } catch(e: any) {
                this.roleFormErrors = e.response.data.message;
            }
        },

        onEdit(role: RoleDto) {
            this.roleModel = role;
            this.saveRole = this.updateRole;
        },

        onCreate() {
            this.roleModel = { id: 0, name: '' }
            this.saveRole = this.createRole;
        },

        onSave() {
            (this.$refs.roleForm as any).close()
        }
    }
};
</script>