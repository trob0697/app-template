import { eq } from "drizzle-orm";

import { db } from "./common";
import * as SeedData from "./seed.data";
import { usersTable } from "./tables/users";

async function main(): Promise<void> {
  console.log("Seed start");

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, SeedData.testUser.id));
  if (!user) {
    await db.insert(usersTable).values(SeedData.testUser);
  }

  console.log("Seed complete");
}

main();
