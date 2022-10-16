import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity, TestQuestionAnswerEntity, TestQuestionEntity } from './test.entity';

@Module({
  providers: [TestsService],
  controllers: [TestsController],
  imports: [TypeOrmModule.forFeature([TestEntity])]
})
export class TestsModule {}
