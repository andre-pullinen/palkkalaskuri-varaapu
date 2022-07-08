<template>
  <div class="settings">
    <h3 class="settings__title">Pika-asetukset</h3>
    <div class="settings__content">
      <div class="settings__form">
        <div class="settings__form-control">
          <datepicker
            v-model="startedAtDate"
            :disabled-week-days="[6, 0, 2, 3, 4, 5]"
            :enable-time-picker="false"
            :format="format"
          />
        </div>
        <div class="settings__form-control">
          <label for="tax">Ennakonpidätysprosentti</label>
          <percent-number id="tax" v-model="tax" :max="100" :min="0" has-control-inputs />
        </div>
        <div class="settings__form-control">
          <label for="evak">TVR prosentti</label>
          <percent-number id="evak" v-model="evak" :max="100" :min="0" has-control-inputs />
        </div>
        <div class="settings__form-control">
          <label for="tvak">TVAK prosentti</label>
          <percent-number id="tvak" v-model="tvak" :max="100" :min="0" has-control-inputs />
        </div>
        <div class="settings__form-control">
          <checkbox v-model="isHolidayPay">Onko lomakorvusta</checkbox>
        </div>
        <div class="settings__form-control" v-if="isHolidayPay ">
          <label for="holidaypay">Lomakorvaus prosentti</label>
          <percent-number id="holidaypay" v-model="holidayPay" :max="100" :min="0" has-control-inputs />
        </div>
        <div class="settings__form-control">
          <label for="salary">Palkka</label>
          <input type="number" v-model="salary">
        </div>
      </div>
      <div class="settings__info">
        <div class="evak">
          <h4 class="evak__title">Työeläkevakuutusmaksut 2022 (TVAK)</h4>
          <table class="evak__table">
            <tr>
              <th>Työntekijän ikä</th>
              <th>Eläkemaksun suuruus</th>
            </tr>
            <tr>
              <td>17–52</td>
              <td>7,15 %</td>
            </tr>
            <tr>
              <td>53–62</td>
              <td>8,65 %</td>
            </tr>
            <tr>
              <td>täyttänyt 63</td>
              <td>7,15 %</td>
            </tr>
            <tr>
              <td>68+</td>
              <td>0,00 %</td>
            </tr>
          </table>
        </div>
        <div class="tvr">
          <h4>Työttömyysvakuutusmaksua 2022 (TVR) - 1,50 %</h4>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import Datepicker from '@vuepic/vue-datepicker'
import PercentNumber from '@/components/PercentNumber'
import Checkbox from '@/components/Base/Checkbox'
import { mapMutations, mapState } from '@/map'
import { computed } from 'vue'

const {
  setEvak,
  setTvak,
  setTax,
  setIsholidaypay,
  setHolidaypay,
  setStartedat,
  setSalary
} = mapMutations('user')
const { salaryT, startedAt } = mapState('user')
const salaryInfo = salaryT.value

const evak = computed({
  get: () => salaryInfo.evak,
  set: val => setEvak(val)
})
const tvak = computed({
  get: () => salaryInfo.tvak,
  set: val => setTvak(val)
})
const tax = computed({
  get: () => salaryInfo.tax,
  set: val => setTax(val)
})
const isHolidayPay = computed({
  get: () => salaryInfo.isHolidayPay,
  set: val => setIsholidaypay(val)
})
const holidayPay = computed({
  get: () => salaryInfo.holidayPay,
  set: val => setHolidaypay(val)
})
const startedAtDate = computed({
  get: () => startedAt.value,
  set: setStartedat
})
const salary = computed({
  get: () => salaryInfo.amount,
  set: val => setSalary(val)
})
const format = (date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}
</script>

<style lang="scss">
.evak {
  &__title {
    margin: 0;
    &:not(&:last-child) {
      margin-bottom: .8rem;
    }
  }
  &__table {
    border-collapse: collapse;
    width: 100%;
    & tr, & td, & th {
      margin: 0;
    }
    & td, & th {
      border: 1px solid #ddd;
      padding: 0.4rem 1rem;
    }
    & td {
      text-align: left;
    }
    & th {
      text-align: center;
      background-color: #eaeaea;
    }
  }
}
.settings {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  &__title {
    flex: 1 1 100%;
  }
  &__info {
    text-align: left;
    flex: 5 1;
    &:last-child {
      margin-left: 0.7rem;
    }
  }
  &__content {
    display: flex;
    align-items: flex-start;
    flex: 1 1 auto;
    max-width: 80%;
  }
  &__form {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
    align-items: flex-start;
    flex: 6 1;
    margin-right: 0.7rem;
  }
  &__form-control {
    flex: 1 1 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    & > * {
      flex: 1 1 100%;
    }
    &:not(&:last-child) {
      margin-bottom: 1rem;
    }
    & label {
      font-size: 1rem;
      &:not(&:last-child) {
        margin-bottom: .3rem;
      }
    }
  }
}
</style>
