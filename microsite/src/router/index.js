import Router from 'vue-router'
const Wrapper = () => import('@/Wrapper')

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
      { path: '/microsite/:id', component: Wrapper }, 
      { path: '**', component: Wrapper }
    ]
//   routes: [
//     {   
//         path: '/', 
//         components: {
//            microa: MicroA1,
//         //    microb: MicroB2,
//         //    microc: MicroC3
//         },
//         children: [
//             {
//                 path: 'microsite', 
//                 components: {
//                     // microa: MicroA3,
//                     microb: MicroB3,
//                     // microc: MicroC3,
//                 },
//                 children: [
//                     {
//                         path: 'a2',
//                         components: {
//                             // microa: MicroA2,
//                             // microb: MicroB2,
//                             microc: MicroC2,
//                         },
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         path: '**', 
//         components: {
//            microa: MicroA1,
//            microb: MicroB1,
//            microc: MicroC1
//         },
//     }
// ]
});