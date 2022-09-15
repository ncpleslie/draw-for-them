import { z } from "zod";
import { createProtectedRouter } from "./context";

export const userRouter = createProtectedRouter()
  .query("getUserByName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.user.findFirst({
          where: { email: input.name },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("addUserAsFriendById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const currentUserId = ctx.session.user.id;
        await ctx.prisma.user.update({
          where: { id: currentUserId },
          data: { friendId: input.id },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
