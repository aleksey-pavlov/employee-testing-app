
<template>
    <div class="modal fade" :id="id" tabindex="-1" :aria-labelledby="`${id}_Label`" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{ title }}</h5>
                    <button :id="`${id}_close`" type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closed">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

export default {
    props: {
        title: String,
        id: String,
        onClose: Function
    },
    data() {
        return {
            errorMsg: '',
            modalVisible: true,
        }
    },
    setup() {    },
    methods: {
        async closed() {
            if (this.$props.onClose)
                await this.$props.onClose();
        },
        close() {
            document.getElementById(`${this.id}_close`).click();
        }
    }
}
</script>
