import { users } from "./schemas/users";

export const schemas = {
  users,
};

export { users } from "./schemas/users";
export type SchemaType = typeof schemas;
