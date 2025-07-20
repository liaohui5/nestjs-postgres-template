import * as bcrypt from "bcrypt";

export async function encrypt(str: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(str, salt);
}

export async function compare(str: string, hash: string): Promise<boolean> {
  return bcrypt.compare(str, hash);
}
