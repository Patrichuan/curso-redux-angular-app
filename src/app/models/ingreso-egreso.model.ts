export class IngresoEgreso {
    static ingresoEgresofromFirebase({descripcion, monto, tipo, uid}: any){
      return new IngresoEgreso(descripcion, monto, tipo, uid);
    }
    constructor (
      public descripcion: string,
      public monto: number,
      public tipo: string,
      public uid?: string
    ){}

}
