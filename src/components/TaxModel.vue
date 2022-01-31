<template>
  <div class="tw-container tw-mx-auto">
    <h1 class="tw-text-2xl tw-font-bold">Tax Model</h1>
    <h6>Tax Year</h6>
    <div class="tw-flex tw-flex-row tw-space-x-2">
      <button
        v-for="year in years"
        @click="() => selectYear(year)"
        :key="year"
        :class="inputYear === year ? 'tw-bg-blue-200' : ''"
        class="tw-p-2 tw-border tw-border-black"
      >{{ year }}</button>
    </div>
    <div class="tw-flex tw-flex-row">
      <h4 class="tw-w-64">Pay Period</h4>
      <select v-model="inputPayPeriod">
        <option value="24">Semi-Monthly</option>
        <option value="26">Bi-Weekly</option>
      </select>
    </div>
    <div class="tw-flex tw-flex-row">
      <h4 class="tw-w-64">Filling Status</h4>
      <select v-model="inputFilingStatus">
        <option value="sf">Single</option>
        <option value="mjf">Married Filing Jointly</option>
        <option value="msf">Married Filing Separately</option>
        <option value="hf">Head of Household</option>
        <option value="qf">Qualifying Widow(er) with Dependent Child</option>
      </select>
    </div>
    <div class="tw-flex tw-flex-col tw-space-y-4">
      <div class="tw-flex tw-flex-col tw-space-y-2">
        <h2 class="tw-text-lg tw-font-medium">Earnings</h2>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Group Term Life</h4>
          <input v-model="inputEarningGTL" class="tw-border tw-border-black" type="number" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Salary</h4>
          <input v-model="inputEarningSalary" class="tw-border tw-border-black" type="number" />
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-space-y-2">
        <h2 class="tw-text-lg tw-font-medium">Deductions</h2>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">401k EE %</h4>
          <input v-model="input401k" class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Group Term Life</h4>
          <input v-model="inputEarningGTL" class="tw-border tw-border-black" type="text" />
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-space-y-2">
        <h2 class="tw-text-lg tw-font-medium">Taxes</h2>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Federal Income Tax</h4>
          <input :value="calculateFederalTax" class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-ml-8">
          <div class="tw-flex tw-flex-row tw-space-x-2">
            <p class="tw-w-32">FIT Taxable Wage</p>
            <p class="tw-w-20">{{ fitTaxableWages }}</p>
          </div>
          <div class="tw-flex tw-flex-row tw-space-x-2">
            <p class="tw-w-32">Taxable Income</p>
            <p class="tw-w-20">{{ taxableIncome }}</p>
          </div>
          <div class="tw-flex tw-flex-row tw-space-x-2">
            <p class="tw-w-32">Deduction</p>
            <p class="tw-w-20">{{ deduction }}</p>
          </div>
          <div class="tw-flex tw-flex-row tw-space-x-2">
            <p class="tw-w-32">Annual Adjusted Income</p>
            <p class="tw-w-20">{{ annualAdjustedIncome }}</p>
          </div>
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Employee Medicare</h4>
          <input :value="calculateMedicare" class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">Social Security Employee Tax</h4>
          <input :value="calculateSocialSecurity" class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">NY State Income Tax</h4>
          <input class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">New York R</h4>
          <input class="tw-border tw-border-black" type="text" />
        </div>
        <div class="tw-flex tw-flex-row">
          <h4 class="tw-w-64">NY Paid Family Leave Employee</h4>
          <input :value="calculateNYPaidFamilyLeave" class="tw-border tw-border-black" type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { calculateUSFederalTax, calculateUSEmployeeMedicare, calculateUSSocialSecurity, calculateNYPFL } from '../utils'

export default defineComponent({
  name: 'TaxModel',
  setup() {
    const inputYear = ref("2022")
    const selectYear = (year: string) => {
      inputYear.value = year
    }
    const years = ["2021", "2022"]

    // this needs to be refactored
    const inputEarningSalary = ref(0)
    const inputEarningGTL = ref(0)
    const inputPayPeriod = ref('24')
    const inputFilingStatus = ref('sf')
    const input401k = ref(0)

    const fitTaxableWages = computed(() => {
      return inputEarningSalary.value + inputEarningGTL.value - input401k.value
    })

    const taxableIncome = computed(() => {
      return parseInt(inputPayPeriod.value) * fitTaxableWages.value
    })

    const deduction = computed(() => {
      if (inputFilingStatus.value === 'mjf') {
        return 12900
      } else {
        return 8600
      }
    })

    const annualAdjustedIncome = computed(() => {
      return taxableIncome.value - deduction.value
    })

    const calculateFederalTax = computed(() => {
      return calculateUSFederalTax(annualAdjustedIncome.value, inputFilingStatus.value, inputPayPeriod.value, inputYear.value)
    })

    const calculateMedicare = computed(() => {
      return calculateUSEmployeeMedicare(inputEarningSalary.value + inputEarningGTL.value)
    })

    const calculateSocialSecurity = computed(() => {
      return calculateUSSocialSecurity(inputEarningSalary.value + inputEarningGTL.value)
    })

    const calculateNYPaidFamilyLeave = computed(() => {
      return calculateNYPFL(inputEarningSalary.value)
    })
    return {
      inputYear,
      selectYear,
      years,
      input401k,
      inputEarningSalary,
      inputEarningGTL,
      inputPayPeriod,
      inputFilingStatus,
      taxableIncome,
      deduction,
      annualAdjustedIncome,
      fitTaxableWages,
      calculateFederalTax,
      calculateMedicare,
      calculateSocialSecurity,
      calculateNYPaidFamilyLeave
    }
  }
})
</script>