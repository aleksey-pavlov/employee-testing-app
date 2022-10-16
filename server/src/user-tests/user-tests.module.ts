import { Module } from '@nestjs/common';
import { UserTestsService } from './user-tests.service';
import { UserTestsController } from './user-tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTestAnswerEntity, UserTestEntity } from './user-tests.entity';
import { TestEntity, TestQuestionAnswerEntity } from 'src/tests/test.entity';

@Module({
  providers: [UserTestsService],
  controllers: [UserTestsController],
  imports: [TypeOrmModule.forFeature([
    UserTestEntity,
    UserTestAnswerEntity,
    TestEntity,
    TestQuestionAnswerEntity])]
})
export class UserTestsModule { }
