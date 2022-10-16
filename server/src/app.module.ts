import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleEntity } from './roles/role.entity';
import { RolesModule } from './roles/roles.module';
import { PositionsModule } from './positions/positions.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity';
import { PositionEntity } from './positions/position.entity';
import { TestsModule } from './tests/tests.module';
import { TestEntity, TestQuestionAnswerEntity, TestQuestionEntity } from './tests/test.entity';
import { UserTestsModule } from './user-tests/user-tests.module';
import { UserTestAnswerEntity, UserTestEntity, UserTestUserEntity } from './user-tests/user-tests.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: '127.0.0.1',
      port: 1521,
      username: 'empapp',
      password: 'qwe123',
      serviceName: 'XEPDB1',
      cache: { 
        duration : 3000
      },
      entities: [
        RoleEntity,
        UserEntity,
        PositionEntity, 
        TestEntity, 
        TestQuestionEntity, 
        TestQuestionAnswerEntity,
        UserTestEntity,
        UserTestAnswerEntity,
        UserTestUserEntity
      ]
    }),
    RolesModule,
    PositionsModule,
    UsersModule,
    TestsModule,
    UserTestsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
