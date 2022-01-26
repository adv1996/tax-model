import { IBucket } from "./IBucket";

export interface ITaxTable {
  year: number
  filingStatus: string
  buckets: IBucket[]
}
