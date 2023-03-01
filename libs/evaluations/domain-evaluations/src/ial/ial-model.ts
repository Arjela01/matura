export interface IalModel {
  id:string;
  name: string;
  averageGrade:any;
}
export interface IalTableView{
  data: IalModel[];
  total: number;
}
