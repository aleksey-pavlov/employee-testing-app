<template>

    <div class="container">
        <div class="row">
            <h4>{{ userTest.testTitle }}</h4>
        </div>
        <div class="row">
            <h5>{{ currentQuestion.body }}</h5>
        </div>
        <div class="row" v-if="userTest.finisherAt">
            <div class="col">
                <div class="row mb-2">
                    <h5> Test correctly
                        {{Math.round((userTest.testProgress.correctAnswers/userTest.testProgress.totalQuestions)*100)}}% </h5>
                </div>
                <div class="row">
                    <h5>Answers:</h5>
                </div>
                <div class="row mb-2 border-bottom" v-for="question of userTest.questions">
                    <div class="col"><b>{{question.body}}</b></div>
                    <div class="col">
                        <div class="row" v-for="answer of question.answers">
                            <div class="col-md-1">
                                <i class="bi bi-check2-circle" v-if="answer.isSelected"></i>
                            </div>
                            <div class="col" :class="{ 'bg-success': answer.isCorrect, 
                            'bg-warning': !answer.isCorrect && answer.isSelected }">{{answer.body}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="row">
            <form @submit.prevent="null" v-if="currentQuestion.questionId">
                <div class="form-row mb-1 border-bottom" :class="{ 'bg-success': answer.isCorrect, 
                'bg-warning': !answer.isCorrect && answer.isSelected }"
                    v-for="(answer, index) of currentQuestion.answers" :key="answer.answerId">
                    <div class="col-md-2">
                        <div class="form-check">
                            <input :disabled="currentQuestion.isAnswered" type="radio" name="answer"
                                :value="answer.answerId" class="form-check-input" v-model="selectedAnswerId">
                            <label>{{ answer.body }}</label>
                        </div>
                    </div>
                </div>
                <button v-if="selectedAnswerId" class="btn btn-sm btn-success mr-2" @click="postAnswer">Answer</button>
                <button
                    v-if="currentQuestion.isAnswered && currentQuestion.questionId != userTest.questions[userTest.questions.length-1].questionId"
                    class="btn btn-sm btn-primary" @click="onNext">Next</button>
                <button v-else-if="currentQuestion.isAnswered" class="btn btn-sm btn-primary"
                    @click="onFinish">Finish</button>
            </form>
        </div>

    </div>
    <notifications />

</template>

<script lang="ts">
import ModalComponent from '../components/ModalComponent.vue';
import type { UserTestDto, UsertTestQuestionDto } from "@/server";
import type { UserTestPostAnswerResponseDto } from '../../../server/src/user-tests/user-tests.dto';

export default {

    components: { ModalComponent },
    data() {

        return {
            userTest: {} as UserTestDto,
            currentQuestion: {} as UsertTestQuestionDto,
            selectedAnswerId: 0,
            userId: Number(this.$route.query.userId) || this.$server.getLoggedUserId(),
            userTestId: Number(this.$route.query.userTestId)
        };
    },

    mounted() {
        this.loadTest();
    },

    methods: {
        async loadTest() {
            let resp = await this.$server.http
                .get(`/user/${this.userId}/test/${this.userTestId}`);

            this.userTest = resp.data

            await this.setCurrentQuestion();
        },

        async setCurrentQuestion() {

            for (let i in this.userTest.questions) {

                let question = this.userTest.questions[i];

                if (!question.answers.find(a => a.answeredAt)) {
                    this.currentQuestion = question;
                    return;
                }
            }
        },

        async postAnswer() {
            try {
                let userId = this.$server.getLoggedUserId();
                let userTestId = Number(this.$route.query.userTestId)
                let questionId = this.currentQuestion.questionId;
                let resp = await this.$server.http.
                    post<UserTestPostAnswerResponseDto>(
                        `/user/${userId}/test/${userTestId}/question/${questionId}`,
                        { answerId: this.selectedAnswerId });


                this.currentQuestion.answers = resp.data.answers;
                this.currentQuestion.isAnswered = true;

                this.userTest.testProgress = resp.data.testProgress;
            } catch (e: any) {
                this.$notify({ title: e.message, type: 'warn' });
            }
        },

        async onNext() {
            await this.setCurrentQuestion();
        },

        async onFinish() {
            let userId = this.$server.getLoggedUserId();
            let userTestId = Number(this.$route.query.userTestId)
            await this.$server.http.
                post(`/user/${userId}/test/${userTestId}/finish`);

            await this.loadTest();
        }
    }
};
</script>