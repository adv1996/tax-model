<template>
  <div>
    <h1>Tax Model</h1>

    <h2>Earnings</h2>
    <div>
      <h4>Group Term Life</h4>
      <input type="text">
    </div>
    <h4>Salary</h4>
  
    <h2>Deductions</h2>
    <h4>401k</h4>

    <h2>Taxes</h2>
    <h4>Federal Taxes</h4>
    <h4>State Taxes</h4>
    <h4>Local Taxes</h4>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'TaxModel'
})
</script>