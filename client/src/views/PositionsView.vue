<template>
  <div class="container-fluid">
      <div class="row">
        <h5>Positions</h5>
      </div>
      <div class="row mb-2">
        <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editPositionModal" @click="onCreate()">+ New</button>
      </div>
      <div class="row">
      <table class="table table-bordered">
          <tr v-for="(position, index) of positions">
              <td>{{ position.id }}</td>
              <td>{{ position.title }}</td>
              <td>
                <a href="#" @click="removePosition(position.id, index)"><i class="bi bi-trash"></i></a>
                <a data-toggle="modal" data-target="#editPositionModal" href="#" @click="onEdit(position)"><i class="bi bi-pencil"></i></a>
              </td>
          </tr>
      </table>
      </div>

        <modal-component ref="positionForm" :title="`Edit position #${positionModel.id??''}`" :id="'editPositionModal'">
          <form @submit.prevent="savePosition">
              <input type="hidden" class="form-control" v-model="positionModel.id">
              <div class="form-group">
                <label>Title</label>
                <input required type="text" class="form-control" v-model="positionModel.title" placeholder="Title">
              </div>
              <button class="btn btn-sm btn-primary">Save</button>
              <span class="text-danger ml-2">{{ positionSaveErrors }}</span>
          </form>
        </modal-component>
  </div>
</template>

<script lang="ts">
import ServerComponent from '../components/ServerComponent.vue'
import ModalComponent from '../components/ModalComponent.vue';
import type { PositionDto }  from "@/server";

export default {
    components: { ModalComponent },
    data() {
        return {
            positions: [] as PositionDto[],
            positionModel: {} as PositionDto,
            positionSaveErrors: '' as string,
            savePosition: () => { }
        };
    },

    mounted() {
       this.loadPositions();
    },

    methods: {

        loadPositions() {
             ServerComponent
                .get("/positions")
                .then((response) => (this.positions = response.data));
        },

        removePosition(id: number | undefined, index: number) {
            ServerComponent
                .delete(`/position/${id}`)
                .then((response) => {
                    if (response.status == 200)
                        this.positions.splice(index, 1);
                })
        },

        async createPosition() {
            try {
                let response = await ServerComponent.post('/position', this.positionModel);
                this.positionModel.id = response.data.id;
                this.positions.unshift(this.positionModel);
                this.onSave();
            } catch(err: any) {
                this.positionSaveErrors = err.response?.data.message;
            }
        },

        async updatePosition() {
            try {
                let id = this.positionModel.id;
                await ServerComponent.put(`/position/${id}`, this.positionModel);
                this.onSave();
            } catch(err: any) {
                this.positionSaveErrors = err.response.data.message;
            }
            
        },

        onEdit(position: PositionDto) {
            this.positionModel = position;
            this.savePosition = this.updatePosition;
        },

        onCreate() {
            this.positionModel = { title: '' }
            this.savePosition = this.createPosition;
        },
        onSave() { 
            (this.$refs.positionForm as any).close()
        }
    }
};
</script>