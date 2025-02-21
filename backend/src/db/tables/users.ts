import { eq } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import * as SessionModel from "../../models/session";
import { base, db } from "../common";

export const usersTable = pgTable("Users", {
  ...base,
  email: text().unique().notNull(),
  name: text().notNull(),
  givenName: text().notNull(),
  familyName: text().notNull(),
  picture: text().notNull(),
});
export type User = typeof usersTable.$inferSelect;

export async function getUserById(args: { id: string }): Promise<User> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, args.id));
  if (!user) throw new Error("Entity Not found");
  return user;
}

export async function findAndUpdateOrInsertUser(args: {
  googleUser: SessionModel.GoogleUser;
}): Promise<User> {
  return await db.transaction(async (trx) => {
    const [user] = await trx
      .update(usersTable)
      .set({
        email: args.googleUser.email,
        name: args.googleUser.name,
        givenName: args.googleUser.given_name,
        familyName: args.googleUser.family_name,
        picture: args.googleUser.picture,
      })
      .where(eq(usersTable.email, args.googleUser.email))
      .returning();
    if (user) return user;
    const [newUser] = await trx
      .insert(usersTable)
      .values({
        email: args.googleUser.email,
        name: args.googleUser.name,
        givenName: args.googleUser.given_name,
        familyName: args.googleUser.family_name,
        picture: args.googleUser.picture,
      })
      .returning();
    return newUser;
  });
}
