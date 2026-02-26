import { ActionListDTO } from '../qnatk/src';

export const PropertyPlanActions: ActionListDTO = {
  create: {
    name: 'create',
    mode: 'NoRecord',
    label: 'Add New',
    icon: 'add',
    iconColor: 'red',
    description: 'add Property Plans, and create related Plans Infra',
    ui: {
      mode: 'form',
      title: 'Add New Property Plans',
      message: 'Please fill the details',
      okLabel: 'Add',
      cancelLabel: 'Cancel',
    },

    returnModel: false,
  },
  edit: {
    name: 'edit',
    label: 'Edit',
    icon: 'edit',
    description: 'Edit Property Plans',
    mode: 'SingleRecord',
    loadBy: 'id',
    ui: {
      mode: 'form',
      title: 'Edit Property Plans',
      message: 'Edit Property Plans?',
      cancelLabel: 'Cancel',
      okLabel: 'Save',
    },

    condition: {
      is_active: true,
    },
    returnModel: false,
  },
  planDraw: {
    name: 'planDraw',
    label: 'Edit Plan Draw',
    icon: 'edit',
    description: 'Edit Plan Draw DATA',
    mode: 'SingleRecord',
    loadBy: 'id',
    ui: {
      mode: 'form',
      title: 'Edit Plan Draw',
      message: 'Edit Plan Draw ?',
      cancelLabel: 'Cancel',
      okLabel: 'Save',
    },

    condition: {
      // is_active: false,
    },
    returnModel: false,
  },

  // deactivate: {
  //   name: 'deactivate',
  //   label: 'Deactivate',
  //   icon: 'unpublished',
  //   description:
  //     'Deactivate a staff, so he cannot open any new account, old accounts will keep working',
  //   mode: 'SingleRecord',
  //   loadBy: 'id',
  //   ui: {
  //     mode: 'confirmation',
  //     title: 'Deactivate Member?',
  //     message: 'Are you sure you want to deactivate this member?',
  //     okLabel: 'Deactivate',
  //     cancelLabel: 'Cancel',
  //   },

  //   condition: {
  //     is_active: true,
  //   },
  //   returnModel: false,
  // },
  // activate: {
  //   name: 'activate',
  //   label: 'Activate',
  //   icon: 'unpublished',
  //   description:
  //     'Activate a staff, so he cannot open any new account, old accounts will keep working',
  //   mode: 'SingleRecord',
  //   loadBy: 'id',
  //   ui: {
  //     mode: 'confirmation',
  //     title: 'Deactivate Staff?',
  //     message: 'Are you sure you want to deactivate this member?',
  //     okLabel: 'Deactivate',
  //     cancelLabel: 'Cancel',
  //   },

  //   condition: {
  //     is_active: false,
  //   },
  //   returnModel: false,
  // },
};
