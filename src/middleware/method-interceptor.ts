// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({});

// async function main() {
//   /***********************************/
//   /* SOFT DELETE MIDDLEWARE */
//   /***********************************/

//   prisma.$use(async (params, next) => {
//     // Check incoming query type
//     if (params.model == 'Todo') {
//       if (params.action == 'delete') {
//         // Change action to an update
//         params.action = 'update';
//         params.args['data'] = { deleted: true, deletedAt: new Date() };
//       }
//     }
//     return next(params);
//   });
// }

import { PrismaClient } from '@prisma/client';

export const applyMiddleware = (prisma: PrismaClient) => {
  prisma.$use(async (params, next) => {
    if (params.action == 'findUnique') {
      params.action = 'findFirst';
      const where = params.args.where;
      params.args.where = {};
      for (const arg of Object.entries(where)) {
        if (typeof arg[1] !== 'object') {
          params.args.where[arg[0]] = arg[1];
        } else {
          for (const subarg of Object.entries(
            arg[1] as Record<string, unknown>,
          )) {
            params.args.where[subarg[0]] = subarg[1];
          }
        }
      }
      params.args.where['deletedAt'] = null;
    }
    if (params.action == 'findMany') {
      if (!params.args) {
        params.args = {};
      }
      if (params.args?.where != undefined) {
        if (params.args.where.deletedAt == undefined) {
          params.args.where['deletedAt'] = null;
        }
      } else {
        params.args['where'] = { deletedAt: null };
      }
    }
    return next(params);
  });
  prisma.$use(async (params, next) => {
    if (params.action == 'updateMany' || params.action == 'update') {
      if (!params.args) {
        params.args = {};
      }
      if (!params.args.data) {
        params.args.data = {};
      }
      params.args.data['updatedAt'] = new Date();
    }
    return next(params);
  });
  prisma.$use(async (params, next) => {
    if (params.action == 'delete') {
      params.action = 'update';
      params.args['data'] = { deleted: true, deletedAt: new Date() };
    }
    if (params.action == 'deleteMany') {
      if (!params.args) {
        params.args = {};
      }
      params.action = 'updateMany';
      if (params.args?.data != undefined) {
        params.args.data['deletedAt'] = new Date();
      } else {
        params.args['data'] = { deleted: true, deletedAt: new Date() };
      }
    }
    return next(params);
  });
};
