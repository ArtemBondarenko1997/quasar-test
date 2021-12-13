<template>
  <q-form
    class="q-gutter-md row items-center"
    @submit.prevent="updateDates"
    @reset="onReset"
  >
    <q-card-section>
      <h4>Currencies</h4>
      <q-select
        v-model="base_currency"
        style="min-width: 240px"
        filled
        :options="list"
        label="Filled"
      />
      <q-btn
        label="Add"
        :disable="!canAdd"
        color="green-5"
        class="q-mt-md"
        @click="onAdd(base_currency)"
      />
    </q-card-section>
    <q-card-section>
      <h4>Date filters</h4>
      <div class="row">
        <q-input
          v-if="oneDate"
          filled
          hide-bottom-space
          label="Date"
          v-model="date_from"
          mask="date"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="date_from">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <template v-else>
          <q-input
            hide-bottom-space
            filled
            label="Date from"
            v-model="date_from"
            mask="date"
            class="q-mr-md q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date_from">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            hide-bottom-space
            label="Date to"
            v-model="date_to"
            mask="date"
            class="q-mb-sm"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date_to">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </template>
      </div>
      <q-checkbox v-model="oneDate" label="Set on date" />
      <div>
        <q-btn v-if="hasItems" :disable="!canUpdate" label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-card-section>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Request } from '../models/Request'

export default defineComponent({
  name: 'FilterComponents',
  props: {
    hasItems: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data(): {
    date_from: string;
    date_to: string;
    base_currency: string;
    oneDate: boolean;
    currentDates: {
      date_from?: string | null;
      date_to?: string | null;
    }
  } {
    return {
      date_from: '',
      date_to: '',
      base_currency: 'JPY',
      oneDate: false,
      currentDates: {}
    };
  },
  computed: {
    payload(): {
      date_from: string | null;
      date_to: string | null;
    } {
      return {
        date_from: this.date_from?.replace(/\//g, '-'),
        date_to:
          !this.oneDate ? this.date_to?.replace(/\//g, '-') : this.date_from?.replace(/\//g, '-')
      };
    },
    canUpdate() {
      if (this.oneDate) {
        return !!this.payload.date_from
      }
      return !!(this.payload.date_from && this.payload.date_to)
    },
    canAdd() {
      if(this.hasItems) {
         const datesWasChanged = this.currentDates.date_from !== this.payload.date_from || this.currentDates.date_to !== this.payload.date_to
        return !!this.base_currency  && !datesWasChanged
      }
      return this.canUpdate && !!this.base_currency
    }
  },
  methods: {
    onAdd(base_currency: string) {
      const payload:Request = { ...this.payload, base_currency }
      this.currentDates = { ...this.payload }
      this.$emit('add', payload);
      this.base_currency = '';
    },
    updateDates() {
      this.currentDates = { ...this.payload }
      this.$emit('updateDates', this.payload);
    },
    onReset() {
      this.base_currency = '';
      this.date_from = '';
      this.date_to = '';
    },
  },
});
</script>
