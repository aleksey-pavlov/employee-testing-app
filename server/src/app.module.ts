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
import { UserTestAnswerEntity, UserTestEntity } from './user-tests/user-tests.entity';
import { AuthModule } from './auth/auth.module';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.pass,
      serviceName: config.database.name,
      entities: [
        RoleEntity,
        UserEntity,
        PositionEntity, 
        TestEntity, 
        TestQuestionEntity, 
        TestQuestionAnswerEntity,
        UserTestEntity,
        UserTestAnswerEntity,
      ]
    }),
    RolesModule,
    PositionsModule,
    UsersModule,
    TestsModule,
    UserTestsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { 

}
