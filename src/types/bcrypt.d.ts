declare module "bcrypt" {
  export function compareSync(s: string, hash: string): boolean;
  export function hashSync(s: string, salt?: number): string;
  export function genSaltSync(rounds?: number): string;
  export function compare(s: string, hash: string): Promise<boolean>;
  export function hash(s: string, salt: number): Promise<string>;
  export function genSalt(rounds?: number): Promise<string>;
}
