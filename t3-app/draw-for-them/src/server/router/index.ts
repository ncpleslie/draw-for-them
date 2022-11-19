// src/server/router/index.ts
import { router } from "./context";

import { userRouter } from "./user";

export const appRouter = router({ user: userRouter });

// export type definition of API
export type AppRouter = typeof appRouter;
