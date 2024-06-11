declare module "bcrypt" {
  function compareSync(s: string, hash: string): boolean;
  function hashSync(s: string, salt?: number): string;
  function genSaltSync(rounds?: number): string;
  export { compareSync, hashSync, genSaltSync };
}
