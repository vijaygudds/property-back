import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ActionListDTO, QnatkService } from './qnatk/src';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class BhawaniQnatkService extends QnatkService {
  constructor(
    @InjectConnection('default') protected sequelize: Sequelize,
    @Inject('MODEL_ACTIONS')
    protected modelActions: Record<string, ActionListDTO>[],
    private readonly cls: ClsService,
  ) {
    super(sequelize, modelActions);
  }

  // ✅ Bas ek helper method - baaki sab QnatkService se inherit hoga
  getActiveSequelize(): Sequelize {
    const clientConnection = this.cls.get('clientConnection');
    const user = this.cls.get('user');

    if (user?.userType === 'client_user' && clientConnection) {
      console.log(`🔄 Using CLIENT DB: ${user.envVariables?.DB_NAME}`);
      return clientConnection;
    }

    console.log(`🔄 Using MASTER DB`);
    return this.sequelize;
  }
}
