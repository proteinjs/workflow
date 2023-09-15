export interface Service {
  path: string;
  call: (args: any) => Promise<any>;
}