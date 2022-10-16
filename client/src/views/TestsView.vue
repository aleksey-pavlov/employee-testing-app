<template>
    <div class="container-fluid">
        <div class="row">
            <h5>Tests</h5>
        </div>
        <div class="row mb-2">
            <button class="btn btn-primary btn-sm" data-toggle="modal" data-target="#editTestModal"
                @click="onCreate()">+ New</button>
        </div>
        <div class="row">
            <table class="table table-bordered">
                <tr v-for="(test, index) of tests" :key="test.id">
                    <td>{{ test.id }}</td>
                    <td>{{ test.title }}</td>
                    <td>{{ $unixtimeToDate(test.createAt) }}</td>
                    <td>{{ $unixtimeToDate(test.updateAt) }}</td>
                    <td>
                        <a href="#" @click="removeTest(test.id, index)"><i class="bi bi-trash"></i></a>
                        <a data-toggle="modal" data-target="#editTestModal" href="#" @click="onEdit(test)"><i
                                class="bi bi-pencil"></i></a>
                    </td>
                </tr>
            </table>
        </div>

        <modal-component ref="testForm" :title="`Edit test #${testModel.id??''}`" :id="'editTestModal'">
            <form class="form-group" @submit.prevent="saveTest()">
                <input type="hidden" class="form-control" v-model="testModel.id">
                <div class="form-group">
                    <label><b>Title</b></label>
                    <input required type="text" class="form-control" v-model="testModel.title" placeholder="Name">
                </div>
                <label>
                    <h4>Questions</h4>
                </label>
                <div v-for="(question, qidx) of testModel.questions" :key="question.id" class="form-row mb-2">
                    <div class="col">
                        <div class="form-row mb-2">
                            <input type="hidden" v-model="question.id">
                            <div class="col-auto"><b>Body</b></div>
                            <div class="col">
                                <input required type="text" class="form-control" v-model="question.body"
                                    placeholder="Name">
                            </div>
                            <a href="#" class="col" @click="onRemoveQuestion(qidx)"><i class="bi bi-x-circle"></i></a>
                        </div>
                        <div class="form-row">
                            <div class="col-md-1"></div>
                            <div class="col">
                                <div class="form-row">
                                    <div class="col-md-2"><i class="bi bi-check2-circle"></i></div>
                                    <div class="col-md-5"><b>Answer</b></div>
                                </div>
                                <div class="form-row mb-1" v-for="(answer, aidx) of question.answers" :key="answer.id">
                                    <input type="hidden" v-model="answer.id">
                                    <div class="col-md-2">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input"
                                                v-model="answer.isCorrect" placeholder="Name">
                                        </div>
                                    </div>
                                    <div class="col-md-5">
                                        <input required type="text" class="form-control" v-model="answer.body"
                                            placeholder="Name">
                                    </div>
                                    <div class="col">
                                        <a href="#" @click="onRemoveAnswer(qidx, aidx)"><i
                                                class="bi bi-x-circle"></i></a>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="col">
                                        <a href="#" @click="onAddAnswer(qidx)"><i class="bi bi-plus-circle"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="col">
                        <a href="#" @click="onAddQuestion()"><i class="bi bi-plus-circle"></i></a>
                    </div>
                </div>
                <div class="form-group">
                    <span class="text-danger">{{ testModelErrors }}</span>
                </div>
                <button class="btn btn-sm btn-primary">Save</button>
            </form>
        </modal-component>
    </div>
</template>

<script lang="ts">
import ServerComponent from '../components/ServerComponent.vue'
import ModalComponent from '../components/ModalComponent.vue';
import type { TestDto, TestShortDto } from "@/server";

export default {

components: { ModalComponent },
    data() {

        return {
            tests: [] as TestShortDto[],
            testModel: {} as TestDto,
            testModelErrors: '',
            saveTest: () => { }
        };
    },

    mounted() {
        this.loadTests();
    },

    methods: {

        loadTests() {
            ServerComponent
                .get("/tests")
                .then((response) => (this.tests = response.data));
        },

        loadTest(id: number) {
            ServerComponent
                .get(`/test/${id}`)
                .then((response) => (this.tests = response.data));
        },

        removeTest(id: number, index: number) {
            ServerComponent
                .delete(`/test/${id}`)
                .then((response) => {
                    if (response.status == 200)
                        this.tests.splice(index, 1);
                })
        },

        async createTest() {
            try {
                let response = await ServerComponent.post('/test', this.testModel);
                this.testModel.id = response.data.id;
                this.loadTests();
                (this.$refs.testForm as any).close();
            } catch (e: any) {
                this.testModelErrors = e.response.data.message;
            }
        },

        async updateTest() {
            try {
                let id = this.testModel.id;
                await ServerComponent.put(`/test/${id}`, this.testModel);
                (this.$refs.testForm as any).close();
                this.loadTests();
            } catch (e: any) {
                this.testModelErrors = e.response.data.message;
            }
        },

        async onEdit(test: TestShortDto) {
            let resp = await ServerComponent.get(`/test/${test.id}`);
            this.testModel = resp.data;
            this.saveTest = this.updateTest;
        },

        onCreate() {
            this.testModel = {
                title: '',
                questions: [{
                    answers: [{
                        body: '',
                        isCorrect: false
                    }],
                    body: ''
                }]
            }
            this.saveTest = this.createTest;
        },
        onAddQuestion() {
            this.testModel.questions.push({
                answers: [{
                    body: '',
                    isCorrect: false
                }],
                body: ''
            });
        },
        onRemoveQuestion(idx: number) {
            this.testModel.questions.splice(idx, 1);
        },
        onAddAnswer(qidx: number) {
            this.testModel.questions[qidx].answers.push({
                body: '',
                isCorrect: false
            })
        },
        onRemoveAnswer(qidx: number, aidx: number) {
            this.testModel.questions[qidx].answers.splice(aidx, 1);
        }
    }
};
</script>