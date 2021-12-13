<template>
  <q-page class="row justify-evenly">
    <div class="column" style="height: сфдс(100vh - 50px)">
      <q-card class="q-pa-md q-mt-md">
        <filter-components
          :has-items="hasItems"
          :list="showingList"
          @add="addItem"
          @update-dates="updateDates"
        />
      </q-card>
      <q-card class="q-pa-md q-mt-md">
        <q-table
          class="my-table"
          style="max-width: 90vw"
          title="USD exchange rate: "
          :rows="items"
          row-key="name"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div>
                <q-badge color="green-5" :label="props.value" />
                <q-btn class="q-ml-sm" size="sm" round color="red-5" icon="delete" @click="deleteIcon(props.value)" />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getData, getCurremcyList } from '../services/сurrencyService';
import FilterComponents from 'components/FilterComponent.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { FilterComponents },
  data(): {
    items: Array<{ name: string }>;
    list: Array<string>;
  } {
    return {
      items: [],
      list: []
    };
  },
  async created() {
    this.list = await getCurremcyList();
  },
  computed: {
    hasItems(): boolean {
      return !!this.items.length;
    },
    showingList():Array<string> {
      return this.list.filter((name) => (this.items.findIndex((item) => item.name === name) === -1))
    }
  },
  methods: {
    async addItem(payload: { base_currency: string }) {
      const item = await getData(payload);
      this.items.push(item);
    },
    updateDates(dates: { date_from: string | null; date_to: string | null }) {
      const itemNames = this.items.map((item) => item.name);
      this.items = [];
      itemNames.forEach((base_currency) => {
        void this.addItem({ ...dates, base_currency });
      });
    },
    deleteIcon(name:string) {
      this.items = this.items.filter((item) => item.name !== name)
    }
  },
});
</script>

<style lang="scss">
.my-table {
  max-width: 600px;
  td:first-child {
    background-color: #fff;
  }
  tr th {
    position: sticky;
    z-index: 2;
    background: #fff;
  }
  thead tr:last-child th {
    top: 48px;
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child {
    z-index: 3;
  }
  td:first-child {
    z-index: 1;
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
}
</style>
