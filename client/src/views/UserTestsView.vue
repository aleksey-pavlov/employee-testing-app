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
                    <td>{{ Math.round((test.testProgress.correctAnswers/test.testProgress.totalQuestions)*100) }}%</td>
                    <td v-if="$server.loggedUserHasAccess($server.Components.USERTESTS, $server.Actions.EDIT)">
                        <a href="#" @click="removeUserTest(test.id, index)"><i class="bi bi-trash"></i></a>
                    </td>
                    <td v-if="!test.finisherAt">
                        <a :href="`/user/testing?userTestId=${test.id}`">
                            <i v-if="!test.finisherAt">Continue</i>
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
import ModalComponent from '../components/ModalComponent.vue';
import type { UserTestDto } from "@/server";

export default {

    components: { ModalComponent },
    data() {

        return {
            userTests: [] as UserTestDto[],
            saveTest: () => { },
            userId: Number(this.$route.query.userId) || this.$server.getLoggedUserId()
        };
    },

    mounted() {
        this.loadTests();
    },

    methods: {
        getUserId() {

        },
        loadTests() {
            this.$server.http
                .get(`/user/${this.userId}/tests`)
                .then((response) => (this.userTests = response.data));
        },
        async removeUserTest(userTestId: number, index: number) {
            try {
                let userId = this.$server.getLoggedUserId();
                await this.$server.http
                    .delete(`/user/${userId}/test/${userTestId}`);

                this.userTests.splice(index, 1);
            } catch (e: any) {
                alert(e.message);
            }

        }
    }
};
</script>