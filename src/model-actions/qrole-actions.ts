import { ActionListDTO } from '../qnatk/src';

export const QRoleActions: ActionListDTO = {
    updatePermissions: {
        name: 'updatePermissions',
        mode: 'NoRecord',
        label: 'Add New',
        icon: 'add',
        iconColor: 'red',
        description: 'add staff, and create related accounts',
        ui: {
            mode: 'form',
            title: 'Add New Staff',
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
        description: 'Edit ACL Role',
        mode: 'SingleRecord',
        loadBy: 'id',
        ui: {
            mode: 'form',
            title: 'Edit ACL Role',
            message: 'Edit ACL Role and ?',
            cancelLabel: 'Cancel',
            okLabel: 'Edit',
        },

        condition: {},
        returnModel: false,
    },

    delete: {
        name: 'delete',
        label: 'Delete',
        icon: 'unpublished',
        description: 'Delete ACL Role',
        mode: 'SingleRecord',
        loadBy: 'id',
        ui: {
            mode: 'confirmation',
            title: 'Delete Role?',
            message:
                'Are you sure you want to delete this Role with delete All related Permissions?',
            okLabel: 'Delete',
            cancelLabel: 'Cancel',
        },

        condition: {},
        returnModel: false,
    },
    duplicate: {
        name: 'duplicate',
        label: 'Duplicate',
        icon: 'content_copy',
        description: 'Duplicate Role, with related permissions also duplicate',
        mode: 'SingleRecord',
        loadBy: 'id',
        ui: {
            mode: 'form',
            title: 'Duplicate this Role?',
            message: 'Are you sure you want to Duplicate this Role?',
            okLabel: 'Duplicate',
            cancelLabel: 'Cancel',
        },

        condition: {},
        returnModel: false,
    },
};
