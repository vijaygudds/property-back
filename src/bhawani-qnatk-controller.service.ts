import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BhawaniQnatkService } from './bhawani-qnatk.service';
import {
  ActionListDTO,
  HooksService,
  QnatkControllerService,
} from './qnatk/src';
import { Transaction } from 'sequelize';
import { UserDTO as OriginalUserDTO } from './dto/user-token.dto';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class BhawaniQnatkControllerService extends QnatkControllerService {
  constructor(
    protected readonly qnatkService: BhawaniQnatkService,
    protected readonly hooksService: HooksService,
    @InjectConnection('default') protected sequelize: Sequelize,
    @Inject('MODEL_ACTIONS') protected modelActions: ActionListDTO,
    private readonly cls: ClsService,
  ) {
    super(qnatkService, hooksService, sequelize, modelActions);
  }

  // ✅ Har method call se pehle correct sequelize set karo
  private setActiveSequelize() {
    // BhawaniQnatkService ka method use karo
    this.sequelize = this.qnatkService.getActiveSequelize();
    // QnatkControllerService bhi sequelize use karta hai transactions ke liye
    // isliye parent ki sequelize bhi update karo
    (this as any).sequelize = this.sequelize;
  }

  async addNew<UserDTO = any>(
    baseModel: string,
    data: any,
    user: UserDTO,
    transaction?: Transaction,
  ) {
    this.setActiveSequelize();
    data.createdAt = (user as OriginalUserDTO).workingDate.toString(false);
    data.created_at = (user as OriginalUserDTO).workingDate.toString(false);
    return super.addNew<UserDTO>(baseModel, data, user, transaction);
  }

  async addNewWithFile<UserDTO = any>(
    baseModel: string,
    data: any,
    files: Array<Express.Multer.File>,
    user: UserDTO,
    transaction?: Transaction,
  ) {
    this.setActiveSequelize();
    data.createdAt = (user as OriginalUserDTO).workingDate.toString(false);
    data.created_at = (user as OriginalUserDTO).workingDate.toString(false);
    return super.addNewWithFile<UserDTO>(
      baseModel,
      data,
      files,
      user,
      transaction,
    );
  }

  async list<UserDTO = any>(
    baseModel: string,
    body: any,
    user: UserDTO,
    hookName?: string,
  ) {
    this.setActiveSequelize();
    return super.list(baseModel, body, user, hookName);
  }

  async listAndCount<UserDTO = any>(
    baseModel: string,
    body: any,
    user: UserDTO,
    hookName?: string,
  ) {
    this.setActiveSequelize();
    return super.listAndCount(baseModel, body, user, hookName);
  }

  async updateByPk<UserDTO = any>(
    baseModel: string,
    primaryKey: string | number,
    primaryField: string,
    data: any,
    user: UserDTO,
    transaction?: Transaction,
  ) {
    this.setActiveSequelize();
    return super.updateByPk(
      baseModel,
      primaryKey,
      primaryField,
      data,
      user,
      transaction,
    );
  }

  async deleteByPk<UserDTO = any>(
    baseModel: string,
    primaryKey: string | number,
    primaryField: string,
    user: UserDTO,
    transaction?: Transaction,
  ) {
    this.setActiveSequelize();
    return super.deleteByPk(
      baseModel,
      primaryKey,
      primaryField,
      user,
      transaction,
    );
  }

  async executeAction<UserDTO>(
    baseModel: string,
    action: string,
    data: any,
    user: UserDTO,
    skipModelLoad?: boolean,
    transaction?: Transaction,
  ) {
    this.setActiveSequelize();
    return super.executeAction(
      baseModel,
      action,
      data,
      user,
      skipModelLoad,
      transaction,
    );
  }
}
