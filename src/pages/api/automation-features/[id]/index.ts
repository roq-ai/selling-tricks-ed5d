import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { automationFeatureValidationSchema } from 'validationSchema/automation-features';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.automation_feature
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAutomationFeatureById();
    case 'PUT':
      return updateAutomationFeatureById();
    case 'DELETE':
      return deleteAutomationFeatureById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAutomationFeatureById() {
    const data = await prisma.automation_feature.findFirst(convertQueryToPrismaUtil(req.query, 'automation_feature'));
    return res.status(200).json(data);
  }

  async function updateAutomationFeatureById() {
    await automationFeatureValidationSchema.validate(req.body);
    const data = await prisma.automation_feature.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteAutomationFeatureById() {
    const data = await prisma.automation_feature.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
