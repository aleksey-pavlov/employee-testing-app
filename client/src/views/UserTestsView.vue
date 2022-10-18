<template>
    <div class="container-fluid">
        <div class="row">
            <h5>Tests</h5>
        </div>
        <div class="row">
            <table class="table table-bordered">
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>StartDate</th>
                    <th>FinishDate</th>
                    <th>Correctly</th>
                    <th></th>
                </tr>
                <tr v-for="(test, index) of userTests" :key="test.id" 
                    :style="`background: linear-gradient(to right, #cccc, ${(test.testProgress.completedQuestions/test.testProgress.totalQuestions)*100}%, #fff 50%)`">
                    <td>{{ test.id }}</td>
                    <td>{{ test.testTitle }}</td>
                    <td>{{ $unixtimeToDate(test.startedAt) }}</td>
                    <td>{{ $unixtimeToDate(test.finisherAt) }}</td>
                    <td>{{ (test.testProgress.correctAnswers/test.testProgress.totalQuestions)*100 }}%</td>
                    <td>
                        <a href="#" @click="removeUserTest(test.id, index)"><i class="bi bi-trash"></i></a>
                    </td>
                    <td v-if="!test.finisherAt">
                        <a :href="`/user/testing?userTestId=${test.id}`">
                            <i v-if="!test.finisherAt">Continue</i>
                            <i v-else>ViewResult</i>
                        </a>
                    </td>
                    <td v-else>
                        <a :href="`/user/testing?userTestId=${test.id}`">ViewResult</a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import ServerComponent from '../components/ServerComponent.vue'
import ModalComponent from '../components/ModalComponent.vue';
import type { UserTestDto } from "@/server";
import AuthComponentVue from '@/components/AuthComponent.vue';

export default {

    components: { ModalComponent },
    data() {

        return {
            userTests: [] as UserTestDto[],
            saveTest: () => { }
        };
    },

    mounted() {
        this.loadTests();
    },

    methods: {

        loadTests() {
            let userId = AuthComponentVue.getLoggedUserId();
            ServerComponent
                .get(`/user/${userId}/tests`)
                .then((response) => (this.userTests = response.data));
        },
        async removeUserTest(userTestId: number, index: number) {
            try {
                let userId = AuthComponentVue.getLoggedUserId();
                await ServerComponent
                    .delete(`/user/${userId}/test/${userTestId}`);

                this.userTests.splice(index, 1);
            } catch (e: any) {
                alert(e.message);
            }

        }
    }
};
</script>