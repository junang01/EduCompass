import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { StudySchedule } from "./entities/studySchedule.entity";
import { Between, Repository } from "typeorm";
import { IStudyScheduleServiceCreate, IStudyScheduleServiceFindByDateRange, IStudyScheduleServiceFindOne, IStudyScheduleServiceUpdate } from "./interfaces/studySchedule.interface";
import { IStudyPlanServiceFindSchedules } from "../study-plan/interfaces/study-plan.interface";
import { ConflictError } from "openai";

@Injectable()
export class StudyScheduleService{
    constructor(
        @InjectRepository(StudySchedule)
        private readonly studyScheduleRepository:Repository<StudySchedule>
    ){}

    async create({createStudyScheduleInput, user}:IStudyScheduleServiceCreate):Promise<StudySchedule>{
    const {startTime, endTime, content} = createStudyScheduleInput
        
    const result =  await this.studyScheduleRepository.save({
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        content,
        user
    })
    return result
    }

    async delay({updateScheduleInput, user}:IStudyScheduleServiceUpdate):Promise<StudySchedule>{
    const {id} = updateScheduleInput
    const schedule = await this.findOne({id, user})
    return await this.studyScheduleRepository.save({
        ...schedule,
        ...updateScheduleInput,
        delay:true
    })
    }
    
    async update({updateScheduleInput, user}:IStudyScheduleServiceUpdate):Promise<StudySchedule>{
    const {id} = updateScheduleInput
    const schedule = await this.findOne({id, user})
    return await this.studyScheduleRepository.save({
    ...schedule,
    ...updateScheduleInput
  });
    }

    async completeUpdate({id,user}:IStudyScheduleServiceFindOne):Promise<StudySchedule>{
        const schedule = await this.findOne({id,user})
        if(schedule.completed){
           const result =  await this.studyScheduleRepository.save({
                ...schedule,
                completed: false
            })
            return result
        }
        const result = await this.studyScheduleRepository.save({
            ...schedule,
            completed: true
        })
        return result
    }

    async findOne({id, user}:IStudyScheduleServiceFindOne){
    const schedule = await this.studyScheduleRepository.findOne({
        where: { id, user: { id: user.id} },
        });
    if (!schedule) throw new Error('스케줄을 찾을 수 없습니다.');
    return schedule
    }

    // async findByUpdateSchedule({userId, studyPlanId}:IStudyPlanServiceFindSchedules):Promise<StudySchedule[]>{
    //     const schedules = await this.studyScheduleRepository.find({
    //         where: {
    //           studyPlan: { id: studyPlanId, user: { id: userId } },
    //         },
    //         relations: ['subject'],
    //       });
    //     if(!schedules){
    //         throw new Error("없는 학습 계획입니다.")
    //     }
    //     return schedules;
    // }
    
    
    async findByDateRange({startTime, endTime, user}:IStudyScheduleServiceFindByDateRange):Promise<StudySchedule[]>{
        const result = await this.studyScheduleRepository.find({
            where:{
                user:{id:user.id},
                startTime:Between(new Date(startTime),new Date(endTime)),
            },
            relations:['subject'],
            order:{startTime:'ASC'}
        })
        return result
    }

    async delete({id,user}:IStudyScheduleServiceFindOne):Promise<boolean>{
        const result = await this.studyScheduleRepository.delete({
            id,
            user:{id:user.id}
        })
        if(!result.affected) throw new Error("삭제할 스케줄이 없습니다!")
        return true
    }

}

