"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const study_plan_entity_1 = require("./entities/study-plan.entity");
const studyschedule_entity_1 = require("../studyschedule/entities/studyschedule.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
const subject_service_1 = require("../subject/subject.service");
const openai_1 = require("openai");
const dotenv = require("dotenv");
const chatGptPrompt_entity_1 = require("./entities/chatGptPrompt.entity");
const handlebars_1 = require("handlebars");
dotenv.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
let StudyPlansService = class StudyPlansService {
    constructor(studyPlanRepository, studyScheduleRepository, subjectRepository, subjectService, chatGptPrompt) {
        this.studyPlanRepository = studyPlanRepository;
        this.studyScheduleRepository = studyScheduleRepository;
        this.subjectRepository = subjectRepository;
        this.subjectService = subjectService;
        this.chatGptPrompt = chatGptPrompt;
    }
    async createStudyPlan({ userId, createStudyPlanInput }) {
        const promptName = '계획생성';
        try {
            const { title, availableStudyScheduleInput, studyPeriod, learningStyle, reviewDays, missedPlanDays, subjects } = createStudyPlanInput;
            const availableTimes = availableStudyScheduleInput
                .map((schedule) => `${schedule.day}: ${schedule.timeRanges.map((time) => `${time.startTime} - ${time.endTime}`).join(', ')}`)
                .join('\n');
            const reviewDay = reviewDays.join(',');
            const missedPlanDay = missedPlanDays.join(',');
            const subjectsPrompt = subjects.map(this.formatSubject).join('\n\n');
            console.log('title:', title);
            const promptData = {
                studyPeriod,
                availableTimes,
                learningStyle,
                reviewDay,
                missedPlanDay,
                subjectsPrompt,
            };
            const findPrompt = await this.findChatGptPrompt({ promptName });
            const compilePrompt = handlebars_1.default.compile(findPrompt);
            const prompt = compilePrompt(promptData);
            console.log(prompt);
            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 사용자의 학습 정보를 바탕으로 하루 단위의 학습 계획을 JSON 형식으로 작성하는 AI입니다. 다음 구조에서 절대 벗어나지 마라: 응답은 반드시 JSON 배열 형식으로만 작성하세요. 각 객체는 다음 필드를 포함해야 합니다: - startTime: ISO 8601 UTC 형식의 문자열 (예: "2025-05-30T05:00:00.000Z"), null 값 불가 - endTime: ISO 8601 UTC 형식의 문자열 (예: "2025-05-30T07:00:00.000Z"), null 값 불가 - subject: 문자열, null 값 불가 - content: 문자열, null 값 불가'
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const studyPlanText = response.choices[0].message.content;
            console.log('OpenAI 응답 원문:', studyPlanText);
            let scheduleData;
            try {
                scheduleData = JSON.parse(studyPlanText);
            }
            catch (error) {
                console.error('JSON 파싱 오류:', error);
                throw new Error('OpenAI 응답 형식에 오류가 있습니다.');
            }
            if (!scheduleData || scheduleData.length === 0) {
                throw new Error('OpenAI 응답에 학습 계획 정보가 없습니다.');
            }
            const studyPlan = this.studyPlanRepository.create({
                title,
                studyPeriod,
                user: { id: userId },
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const saveStudyPlan = await this.studyPlanRepository.save(studyPlan);
            const subjectTitles = [...new Set(scheduleData.map((s) => s.subject))];
            const subjectName = await this.subjectService.find({ subjectTitles });
            const subjectEntities = new Map(subjectName.map((s) => [s.subjectName, s]));
            const scheduleEntities = scheduleData.map((s) => ({
                startTime: new Date(s.startTime),
                endTime: new Date(s.endTime),
                content: s.content,
                user: { id: userId },
                studyPlan: studyPlan,
                subject: subjectEntities.get(s.subject),
            }));
            const savedSchedules = await this.studyScheduleRepository.save(scheduleEntities);
            saveStudyPlan.schedules = savedSchedules;
            return saveStudyPlan;
        }
        catch (error) {
            console.error('학습 계획 생성 중 오류 발생:', error);
            throw new Error('학습 계획 생성에 실패했습니다.');
        }
    }
    async findChatGptPrompt({ promptName }) {
        const chatGptPrompt = await this.chatGptPrompt.findOne({ where: { promptName } });
        if (!chatGptPrompt || !chatGptPrompt.promptText)
            throw new Error('없는 프롬프트입니다.');
        console.log(chatGptPrompt.promptText);
        return chatGptPrompt.promptText;
    }
    formatSubject(subjects) {
        const books = subjects.studyBookInput.map((book) => `교재명:${book.bookName}, 목차:${book.bookIndex}, 목표회독수:${book.bookReview}`).join('\n');
        const exams = subjects.examContentInput
            .map((exam) => `시험범위:${exam.examcontent}, 직전시험성적:${exam.examLastScore}, 목표점수:${exam.examGoalScore}, 시험일정:${exam.examStartDay}
      `)
            .join('\n');
        return ` 
      과목: ${subjects.subject}
      학업수준: ${subjects.studyLevel}
      교재:
      ${books}
      시험정보:
      ${exams}
      `.trim();
    }
    async findAll({ user }) {
        return await this.studyPlanRepository.find({ where: { user: { id: user.id }, } });
    }
    async findOne({ studyPlanId, user }) {
        return await this.studyPlanRepository.findOne({ where: { user: { id: user.id }, id: studyPlanId },
            relations: ['schedules', 'schedules.subject']
        });
    }
};
exports.StudyPlansService = StudyPlansService;
exports.StudyPlansService = StudyPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(study_plan_entity_1.StudyPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(studyschedule_entity_1.StudySchedule)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __param(4, (0, typeorm_1.InjectRepository)(chatGptPrompt_entity_1.ChatGptPrompt)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        subject_service_1.SubjectService,
        typeorm_2.Repository])
], StudyPlansService);
//# sourceMappingURL=study-plans.service.js.map