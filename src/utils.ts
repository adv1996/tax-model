import USFederalTaxes from './data/USFederalTaxes.json'
import { ITaxTable } from './models/ITaxTable'
import { keyBy, round } from 'lodash'

export const calculateUSFederalTax = (annualAdjustedWage: number, filingStatus: string, payPeriod: string, year: string) => {
  if (annualAdjustedWage < 0) return 0
  const taxTable = USFederalTaxes as ITaxTable[]

  const tableMap = keyBy(taxTable.filter(table => table.year && table.year.toString() === year), 'filingStatus')
  const { buckets } = tableMap[filingStatus]

  for (let b = 0; b < buckets.length; b++) {
    if (buckets[b].upper === false || (buckets[b].upper > annualAdjustedWage && buckets[b].lower < annualAdjustedWage)) {
      return round(((annualAdjustedWage - buckets[b].lower) * (buckets[b].pct/100) + buckets[b].withholdAmount) / parseInt(payPeriod), 2)
    }
  }
}

export const calculateUSEmployeeMedicare = (grossWages: number) => {
  return round(grossWages * 0.0145, 2)
}

export const calculateUSSocialSecurity = (grossWages: number) => {
  return round(grossWages * 0.062, 2) // there is a cap here
}

export const calculateNYPFL = (grossWages: number) => {
  return round(grossWages * 0.00511, 2) // there is a cap here
}