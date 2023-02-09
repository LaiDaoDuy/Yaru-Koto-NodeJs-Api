export class JwtInfo {
  usr: string = null;

  public toString = (): string => {
    return `${this.usr}`;
  };
}
