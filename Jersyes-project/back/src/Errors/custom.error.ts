export class customError extends Error {
  public statusCode: number;
  public name: string;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
