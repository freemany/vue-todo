<template>
  <div class="container">
    <h5>Here are some microsites listening to the top route</h5>
    <router-link :to="{ path: '/microsite' }">Microsite default</router-link>
    <router-link :to="{ path: '/microsite/a1' }">Microsite A1</router-link>
    <router-link :to="{ path: '/microsite/a2' }">Microsite A2</router-link>
    <router-link :to="{ path: '/microsite/a3' }">Microsite A3</router-link>
    <router-link :to="{ path: '/microsite/b1' }">Microsite B1</router-link>
    <router-link :to="{ path: '/microsite/b2' }">Microsite B2</router-link>
    <router-link :to="{ path: '/microsite/b3' }">Microsite B3</router-link>
    <router-link :to="{ path: '/microsite/c1' }">Microsite C1</router-link>
    <router-link :to="{ path: '/microsite/c2' }">Microsite C2</router-link>
    <router-link :to="{ path: '/microsite/c3' }">Microsite C3</router-link>
    <router-link :to="{ path: '/other_links' }">Other links</router-link>
    <div id="micro1" class="row">
        <MicroA1 v-if="id.a1 === true"/>
        <MicroA2 v-if="id.a2 === true"/>
        <MicroA3 v-if="id.a3 === true"/>
    </div>
    <div id="micro2" class="row">
        <MicroB1 v-if="id.b1 === true"/>
        <MicroB2 v-if="id.b2 === true"/>
        <MicroB3 v-if="id.b3 === true"/>
    </div>
    <div id="micro3" class="row">
        <MicroC1 v-if="id.c1 === true"/>
        <MicroC2 v-if="id.c2 === true"/>
        <MicroC3 v-if="id.c3 === true"/>
    </div>
    {{$data}}
  </div>
</template>

<script>
const MicroA1 = () => import('@/components/microsites/a/MicroA1')
const MicroA2 = () => import('@/components/microsites/a/MicroA2')
const MicroA3 = () => import('@/components/microsites/a/MicroA3')

const MicroB1 = () => import('@/components/microsites/b/MicroB1')
const MicroB2 = () => import('@/components/microsites/b/MicroB2')
const MicroB3 = () => import('@/components/microsites/b/MicroB3')

const MicroC1 = () => import('@/components/microsites/c/MicroC1')
const MicroC2 = () => import('@/components/microsites/c/MicroC2')
const MicroC3 = () => import('@/components/microsites/c/MicroC3')

export default {
  name: 'Wrapper',
  components: {
    MicroA1, MicroA2, MicroA3,
    MicroB1, MicroB2, MicroB3,
    MicroC1, MicroC2, MicroC3,
  },
  data: function() {
      return {
          id :{
          a1: true,
          a2: false,
          a3: false,
          b1: true,
          b2: false,
          b3: false,
          c1: true,
          c2: false,
          c3: false,
      }}
  },
  watch: {
    '$route' (to, from) {
      const id = this.$route.params.id;
        if (undefined !== id) {
            switch(id.substring(0,1)) {
                case 'a':
                this.id.a1 = false;
                this.id.a2 = false;
                this.id.a3 = false;
                break;
                case 'b':
                this.id.b1 = false;
                this.id.b2 = false;
                this.id.b3 = false;
                break;
                case 'c':
                this.id.c1 = false;
                this.id.c2 = false;
                this.id.c3 = false;
                break;
            }
           this.id[id] = true;
        }
    }
  },
}
</script>
<style>
@import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css';
 a {
   margin: 10px
 }
</style>
