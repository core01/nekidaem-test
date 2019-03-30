<template>
  <div id="app">
    <div class="container mx-auto my-2 text-grey-darker">
      <div class="flex flex-col sm:flex-row">
        <div
            class="flex xs:flex-row sm:flex-col flex-col h-full sm:h-screen p-4 sm:pr-8 border-r-0 sm:border-r sm:border-grey-light">
          <div class="w-full mb-8">
            <label
                class="block uppercase tracking-wide font-bold mb-2"
                for="country"
            >
              Countries
            </label>
            <div class="relative w-24">
              <select
                  @change="filterProxies"
                  class="appearance-none w-full bg-grey-lighter border border-grey-light text-grey-darker py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-grey"
                  id="country"
                  name="country"
                  v-model="filters.country"
              >
                <option
                    selected="selected"
                    value="all"
                >
                  All
                </option>
                <option
                    :key="country"
                    :value="country"
                    v-for="country in countries"
                >
                  {{ country}}
                </option>
              </select>
              <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                <svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="w-full mb-8 font-bold xs:mx-2 sm:mx-0">
            <label class="block uppercase tracking-wide mb-2">
              proxy_type
            </label>
            <label class="whitespace-no-wrap block mb-1">
              <input
                  class="mr-1 leading-tight"
                  type="checkbox"
                  v-model="filters.proxyType"
                  value="0"
                  @change="filterProxies"
              >
              <span class="text-sm">
                Transparent (0)
              </span>
            </label>
            <label class="whitespace-no-wrap block mb-1">
              <input
                  class="mr-1 leading-tight"
                  type="checkbox"
                  v-model="filters.proxyType"
                  value="1"
                  @change="filterProxies"
              >
              <span class="text-sm">
                Anonymous (1)
              </span>
            </label>
            <label class="whitespace-no-wrap block mb-1">
              <input
                  class="mr-1 leading-tight"
                  type="checkbox"
                  v-model="filters.proxyType"
                  value="2"
                  @change="filterProxies"
              >
              <span class="text-sm">
                Elite (2)
              </span>
            </label>
          </div>
          <div class="w-full">
            <label class="block uppercase tracking-wide font-bold mb-2">
              Alive
            </label>
            <label class="md:w-2/3 block font-bold">
              <input
                  class="mr-1 leading-tight"
                  type="checkbox"
                  v-model="filters.alive"
                  @change="filterProxies"
              >
              <span class="text-sm">
                True
              </span>
            </label>
          </div>
        </div>
        <div class="p-4 sm:pl-8">
          <h4 class="uppercase tracking-wide font-bold mb-2">Proxies list</h4>
          <p v-if="filteredProxies.length === 0">Proxy list is empty, please try another search with different
            parameters</p>
          <ul v-else class="list-reset">
            <li
                v-for="proxy in filteredProxies"
                class="border border-grey-light p-2 mb-2 hover:bg-grey-lighter cursor-pointer break-normal"
                :key="proxy.id"
            >
              <b>id: {{ proxy.id }}</b>, h: {{ proxy.host }}, country: {{ proxy.country }}, alive: {{ proxy.alive }},
              proxy_type: {{ proxy.proxy_type }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Spinner :show="preLoader"></Spinner>
  </div>
</template>

<script>
  import axios from 'axios';
  import Spinner from './components/Spinner';

  export default {
    name: 'app',
    components: {
      Spinner,
    },
    data () {
      return {
        proxies: [],
        filteredProxies: [],
        filters: {
          alive: false,
          proxyType: [],
          country: 'all',
        },
        countries: [],
        preLoader: false,
      };
    },
    methods: {
      filterProxies () {
        this.filteredProxies = this.proxies.filter(proxy => {
          const condition = {
            country: false,
            alive: false,
            proxyType: false,
          };

          if (this.filters.country !== 'all') {
            condition.country = this.filters.country === proxy.country;
          } else if (this.filters.country === 'all') {
            condition.country = true;
          } else {
            delete condition.country;
          }

          if (this.filters.alive) {
            condition.alive = this.filters.alive === proxy.alive;
          } else {
            delete condition.alive;
          }

          if (this.filters.proxyType.length > 0) {
            for (let type of this.filters.proxyType) {
              if (+type === proxy.proxy_type) {
                condition.proxyType = true;
                break;
              }
            }
          } else {
            delete condition.proxyType;
          }

          for (let property in condition) {
            if (!condition[property]) return false;
          }

          return true;
        });
      },
    },
    async mounted () {
      try {
        this.preLoader = true;
        const response = await axios.get('/proxies');
        this.proxies = response.data;
        const countries = [];
        for (let proxy of this.proxies) {
          countries.push(proxy.country);
        }
        this.countries = [...new Set(countries)];
        this.filteredProxies = this.proxies;

      } catch (error) {
        console.error(error);
      }
      this.preLoader = false;

    },
  };
</script>
