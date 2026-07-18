import { usePlans } from "@clerk/nextjs/experimental";

export type Plan = NonNullable<ReturnType<typeof usePlans>['data']>[number];